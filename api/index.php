<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
session_start();

require "vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use \Slim\Http\Request as Request;
use \Slim\Http\Response as Response;

require "models/Database.php";

$config = [
  'settings' => [
    'displayErrorDetails' => true
  ]
];

$app = new \Slim\App($config);

$client = new Google\Client();
$client->setAuthConfig('client_secret.json');
$client->setRedirectUri($_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/to-do/api/auth/callback');
$client->setScopes('openid email profile');

$db = new Database();

/** 
 * -----------------------------
 * AUTH MIDDLEWARE
 * ----------------------------
 */

$authenticate = function ($req, $res, $next) {
  if (!isset($_SESSION['user'])) {
    return $res->withStatus(401);
  }
  return $next($req, $res);
};

/** 
 * -----------------------------
 * LOGIN AND USER ROUTS
 * ----------------------------
 */

$app->get('/auth/callback', function (Request $req, Response $res, $args) {
  global $client;
  global $db;

  $params = $req->getQueryParams();

  if (isset($params['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token);
    $token_data = $client->verifyIdToken();
    $user = $db->upsert_user($token_data);
    $_SESSION['user'] = $user;

    if (isset($_SESSION["redirect_path_after_login"])) {
      $redirect = $_SESSION["redirect_path_after_login"];
      unset($_SESSION["redirect_path_after_login"]);
      return $res->withRedirect($redirect, 302);
    }

    return $res->withRedirect($_ENV["REROUTE_PATH"], 302);
  }
});

$app->get('/login', function (Request $req, Response $res, $args) {
  global $client;
  return $res->withRedirect($client->createAuthUrl(), 302);
});

$app->get('/logout', function (Request $req, Response $res, $args) {
  global $client;
  if (!isset($_SESSION["user"])) {
    return $res->withRedirect($_ENV["REROUTE_PATH"], 302);
  }

  session_destroy();
  return $res->withRedirect($_ENV["REROUTE_PATH"], 302);
});

$app->get('/userinfo', function (Request $req, Response $res, $args) {
  return $res->withJson($_SESSION['user']);
})->add($authenticate);

/** 
 * -----------------------------
 * GET PROJECT INFORMATION
 * ----------------------------
 */

// Projects - Returns all 
$app->get("/projects", function ($req, $res, $args) {
  global $db;

  $id = $_SESSION["user"]->user_id;

  $projects = $db->getAllProjects($id);

  return $res->withJson($projects, 200);
})->add($authenticate);

// Specific project - Returns a post based on id 
$app->get("/project/{id:\d+}", function ($req, $res, $args) {
  global $db;
  $userId = $_SESSION["user"]->user_id;

  $project = $db->getProject($args["id"], $userId);

  return $res->withJson($project, 200);
})->add($authenticate);

// Returns users scores
$app->get("/project/{id:\d+}/scores", function ($req, $res, $args) {
  global $db;

  $scores = $db->getTotalScore($args["id"]);

  return $res->withJson($scores, 200);
})->add($authenticate);

// Specific project - Returns a post based on id 
$app->get("/project/{id:\d+}/join", function ($req, $res, $args) {
  if (!isset($_SESSION['user'])) {
    $_SESSION["redirect_path_after_login"] = "{$_ENV['REROUTE_PATH']}/project/{$args['id']}";
    return $res->withRedirect("/login", 301);
  }

  global $db;

  $db->insertMember($_SESSION["user"]->user_id, $args["id"]);

  return $res->withRedirect("{$_ENV['REROUTE_PATH']}/project/{$args['id']}", 301);
});

/** 
 * -----------------------------
 * Tasks
 * ----------------------------
 */

$app->get("/project/{id:\d+}/tasks", function ($req, $res, $args) {
  global $db;

  $tasks = $db->getTasks($args["id"]);

  return $res->withJson($tasks, 200);
})->add($authenticate);

// Post - Returns a specific post 
$app->post("/project/{id:\d+}/tasks", function ($req, $res, $args) {
  global $db;

  $input = $req->getParsedBody();
  $db->insertTask($args["id"], $input);

  return $res->withJson(["input" => $input], 201);
})->add($authenticate);

// Patch - Updates the completion status of a task
$app->patch("/project/{project_id:\d+}/tasks/{task_id:\d+}/completed", function ($req, $res, $args) {
  global $db;

  $input = $req->getParsedBody();
  $response = $db->completeTask($args["project_id"], $args["task_id"], $_SESSION["user"]->user_id);

  return $res->withJson($response);
})->add($authenticate);

$app->patch("/project/{project_id:\d+}/tasks/{task_id:\d+}/uncompleted", function ($req, $res, $args) {
  global $db;

  $input = $req->getParsedBody();
  $response = $db->uncompleteTask($args["project_id"], $args["task_id"]);

  return $res->withJson($response);
})->add($authenticate);

// Post - Returns a specific post 
$app->post("/add-project", function ($req, $res, $args) {
  global $db;

  $input = $req->getParsedBody();
  $id = $db->insertProject($input["title"], $_SESSION["user"]->user_id, $input["svg"]);
  return $res->withJson($id);
})->add($authenticate);

$app->run();
