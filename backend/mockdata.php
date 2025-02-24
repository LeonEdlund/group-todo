<?php
header('Content-Type: application/json; charset=utf-8');

$data = [
  ["title" => "My First Group Project", "created_at" => "12/03-22", "owner" => "Alice Johnson", "members" => ["Bob Smith", "Charlie Brown", "Bob Smith", "Charlie Brown"], "progress" => "50%"],
  ["title" => "Team Collaboration App", "created_at" => "05/07-21", "owner" => "Bob Williams", "members" => ["Alice Johnson", "David Clark"], "progress" => "75%"],
  ["title" => "Group Study Scheduler", "created_at" => "23/11-20", "owner" => "Charlie Brown", "members" => ["Eve Davis", "Frank Miller"], "progress" => "30%"],
  ["title" => "Project Management Tool", "created_at" => "14/02-22", "owner" => "David Clark", "members" => ["Grace Lee", "Heidi Wilson"], "progress" => "60%"],
  ["title" => "Collaborative Whiteboard", "created_at" => "30/08-21", "owner" => "Eve Davis", "members" => ["Ivan Martinez", "Judy Taylor"], "progress" => "80%"],
  ["title" => "Shared Task List", "created_at" => "19/01-22", "owner" => "Frank Miller", "members" => ["Alice Johnson", "Bob Williams"], "progress" => "45%"],
  ["title" => "Group Chat Application", "created_at" => "07/06-21", "owner" => "Grace Lee", "members" => ["Charlie Brown", "David Clark"], "progress" => "90%"],
  ["title" => "Online Meeting Scheduler", "created_at" => "25/09-20", "owner" => "Heidi Wilson", "members" => ["Eve Davis", "Frank Miller"], "progress" => "70%"],
  ["title" => "Collaborative Code Editor", "created_at" => "11/12-21", "owner" => "Ivan Martinez", "members" => ["Grace Lee", "Heidi Wilson"], "progress" => "85%"],
  ["title" => "Group Expense Tracker", "created_at" => "03/04-22", "owner" => "Judy Taylor", "members" => ["Ivan Martinez", "Alice Johnson"], "progress" => "55%"]
];

echo json_encode($data);
