<?php
return $queries = [
  "projects" => "SELECT 
    projects.project_id,
    projects.title,
    projects.cover_svg AS img,
    projects.created_at,
    CONCAT(owner.first_name, ' ', owner.last_name) AS owner,
    JSON_ARRAYAGG(
    JSON_OBJECT('name', CONCAT(members.first_name, ' ', members.last_name))) AS members,
    CASE 
      WHEN COUNT(tasks.task_id) = 0 THEN 0 
      ELSE (SUM(CASE WHEN tasks.completion_status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(tasks.task_id))
    END AS progress_percentage
    FROM projects
    INNER JOIN users AS owner ON projects.owner_id = owner.user_id
    LEFT JOIN project_members ON project_members.project_id = projects.project_id
    LEFT JOIN users AS members ON project_members.user_id = members.user_id
    LEFT JOIN tasks ON tasks.project_id = projects.project_id
    GROUP BY projects.project_id ORDER BY projects.project_id DESC;",

  "single_project" => "SELECT 
    projects.project_id,
    projects.title,
    projects.cover_svg AS img,
    projects.created_at,
    CONCAT(owner.first_name, ' ', owner.last_name) AS owner,
    JSON_ARRAYAGG(
    JSON_OBJECT('name', CONCAT(members.first_name, ' ', members.last_name))) AS members
    FROM projects
    INNER JOIN users AS owner ON projects.owner_id = owner.user_id
    LEFT JOIN project_members ON project_members.project_id = projects.project_id
    LEFT JOIN users AS members ON project_members.user_id = members.user_id
    WHERE projects.project_id = :id
    GROUP BY projects.project_id ORDER BY projects.project_id DESC;"
];
