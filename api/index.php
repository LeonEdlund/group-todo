<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

require "vendor/autoload.php";
require "models/Database.php";

$app = new \Slim\App();
$db = new Database();

// Projects - Returns all 
$app->get("/projects", function ($req, $res, $args) {
  global $db;

  $projects = $db->getAllProjects();

  return $res->withJson($projects);
});

// Specific project - Returns a post based on id 
$app->get("/project/{id:\d+}", function ($req, $res, $args) {
  global $db;

  $project = $db->getProject($args["id"]);

  return $res->withJson($project);
});

// Post - Returns a specific post 
$app->post("/add-project", function ($req, $res, $args) {
  global $db;

  $input = $req->getParsedBody();
  $id = $db->insertProject($input["title"], $input["owner"], $input["svg"]);

  return $res->withJson($id);
});

// Post - Returns a specific post 
$app->post("/add-task", function ($req, $res, $args) {
  global $db;

  $input = $req->getParsedBody();
  $db->insertTask($input);

  return $res->withJson(["input" => $input]);
});

$app->run();
