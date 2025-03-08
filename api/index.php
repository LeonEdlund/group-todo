<?php
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

require "vendor/autoload.php";
require "models/Database.php";

$app = new \Slim\App();
$db = new Database();
$queries = require "sql-queries.php";

// Projects - Returns all 
$app->get("/projects", function ($req, $res, $args) {
  global $db;
  global $queries;

  $projects = $db->query($queries["projects"])->fetchAll();

  return $res->withJson($projects);
});

// Specific project - Returns a post based on id 
$app->get("/project/{id:\d+}", function ($req, $res, $args) {
  global $queries;
  $db = new Database();

  $project = $db->query($queries["single_project"], [":id" => $args["id"]])->fetch();

  return $res->withJson($project);
});

// Post - Returns a specific post 
$app->post("/add-project", function ($req, $res, $args) {
  global $db;
  $input = $req->getParsedBody();

  $db->query("INSERT INTO `projects` (`owner_id`, `title`, `cover_svg`) VALUES (:owner_id, :title, :svg);", [":owner_id" => $input["owner"], ":title" => $input["title"], ":svg" => $input["svg"]]);

  return $res->withJson(["id" => $db->lastInsertId()]);
});

// Post - Returns a specific post 
$app->post("/add-task", function ($req, $res, $args) {
  global $db;
  $input = $req->getParsedBody();

  $query = "INSERT INTO `tasks` (`project_id`, `assigned_to`, `title`, `description_text`, `difficulty_level`) VALUES (:project_id, :assigned_to, :title, :description_text, :difficulty_level)";
  $db->query(
    $query,
    [":project_id" => $input["projectId"], ":assigned_to" => $input["assignedTo"], ":title" => $input["title"], ":description_text" => $input["description"],  ":difficulty_level" => $input["difficulty"]]
  );

  // ;

  return $res->withJson(["status" => 200, "input" => $input]);
});

$app->run();
