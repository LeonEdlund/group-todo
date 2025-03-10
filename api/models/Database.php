<?php

class Database
{
  protected $connection;

  /**
   * Imports configuration data for database and establishes a connection using PDO  
   * and sets the default fetch mode to Object.
   * If the connection fails abort is called and the database error page is shown.   
   * 
   * @return void
   */
  public function __construct()
  {
    $config = require 'config/config.php';

    try {
      $this->connection = new PDO(
        $config['dsn'],
        $config['username'],
        $config['pwd'],
        [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]
      );
    } catch (PDOException $e) {
      echo $e;
      echo "error connecting to database";
    }
  }

  /** 
   * Prepares and executes a query to the database.
   * 
   * @param string $query The SQL query string to be executed.
   * @param array $params (optional) An array of parameters to bind to the SQL query string.
   * @return PDOStatement Returns a PDOStatement object.
   */
  public function query($query, $params = [])
  {
    $stmt = $this->connection->prepare($query);
    $stmt->execute($params);

    return $stmt;
  }

  /** 
   * Returns a string of the last inserted id. 
   * 
   * @return String
   */
  public function lastInsertId()
  {
    return $this->connection->lastInsertId();
  }

  /** 
   * Returns all projects
   * 
   * @return Object
   */
  public function getAllProjects()
  {
    $query = "SELECT 
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
    GROUP BY projects.project_id ORDER BY projects.project_id DESC;";

    return $this->query($query)->fetchAll();
  }

  /** 
   * Returns a single project
   * 
   * @param string - id of the project
   * @return Object
   */
  public function getProject($id)
  {
    $query = "SELECT 
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
    WHERE projects.project_id = :id
    GROUP BY projects.project_id ORDER BY projects.project_id DESC;";

    return $this->query($query, [":id" => $id])->fetch();
  }

  /** 
   * Returns all tasks related to a project
   * 
   * @param string - id of the project
   * @return Object
   */
  public function getTasks($id)
  {
    $query = "SELECT 
    tasks.task_id,
    tasks.title,
    tasks.description_text,
    tasks.difficulty_level,
    completion_status,
    CONCAT(users.first_name, ' ', users.last_name) AS assigned_to
    FROM tasks
    INNER JOIN users ON tasks.assigned_to = users.user_id
    WHERE tasks.project_id = :id
    GROUP BY tasks.task_id ORDER BY tasks.created_at DESC;";

    return $this->query($query, [":id" => $id])->fetchAll();
  }

  public function insertProject($title, $owner, $svg)
  {
    $query = "INSERT INTO `projects` (`owner_id`, `title`, `cover_svg`) VALUES (:owner_id, :title, :svg);";
    $this->query($query, [":owner_id" => $owner, ":title" => $title, ":svg" => $svg]);

    return ["id" => $this->lastInsertId()];
  }


  public function insertTask($args)
  {
    $query = "INSERT INTO `tasks` (`project_id`, `assigned_to`, `title`, `description_text`, `difficulty_level`) VALUES (:project_id, :assigned_to, :title, :description_text, :difficulty_level)";

    $this->query($query, [":project_id" => $args["projectId"], ":assigned_to" => $args["assignedTo"], ":title" => $args["title"], ":description_text" => $args["description"],  ":difficulty_level" => $args["difficulty"]]);

    return ["id" => $this->lastInsertId()];
  }

  public function updateTaskCompletionStatus($id, $status)
  {
    $query = "UPDATE tasks SET tasks.completion_status = :completion_status WHERE tasks.task_id = :id";

    $this->query($query, [":completion_status" => $status, ":id" => $id]);

    return ["id" => $id, "status" => $status];
  }
}
