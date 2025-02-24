<?php
require "models/Database.php";

$db = new Database();
$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
  case "GET":
    $query = "SELECT 
      projects.title AS project_title,
      CONCAT(owner.first_name, ' ', owner.last_name) AS project_owner,
      CONCAT(member.first_name, ' ', member.last_name) AS project_member,
      projects.created_at,
      projects.cover_svg
    FROM 
      projects
    INNER JOIN users AS owner ON projects.owner_id = owner.user_id
    INNER JOIN project_members ON projects.project_id = project_members.project_id
    INNER JOIN users AS member ON project_members.user_id = member.user_id";
    $response = $db->query($query)->fetchAll();

    echo json_encode($response);
}
