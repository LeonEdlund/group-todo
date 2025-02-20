<?php
require "../models/Database.php";
$db = new Database();
$method = $_SERVER["REQUEST_METHOD"];
$params = $_GET;

echo $method;
switch ($method) {
  case 'GET':

    break;
  default:

    break;
}
