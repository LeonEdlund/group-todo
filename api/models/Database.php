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
    try {
      $this->connection = new PDO(
        $_ENV["DB_DSN"],
        $_ENV["DB_USERNAME"],
        $_ENV["DB_PASSWORD"],
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

  public function upsert_user($idToken)
  {
    $query = 'INSERT INTO webb6_users (google_id, display_name, profile_url) VALUES (:google_id, :display_name, :profile_url) ON DUPLICATE KEY UPDATE display_name = :display_name, profile_url = :profile_url;';

    $this->query($query, [":google_id" => $idToken["sub"], ":display_name" => $idToken["name"], ":profile_url" => $idToken["picture"]]);

    return $this->query("SELECT * FROM webb6_users WHERE google_id = :google_id", [":google_id" => $idToken["sub"]])->fetch();
  }

  /** 
   * __________________
   * PROJECT
   * __________________
   */

  /** 
   * Returns all projects
   * 
   * @return Object
   */
  public function getAllProjects($id)
  {
    $query = "SELECT 
    webb6_projects.project_id,
    webb6_projects.title,
    webb6_projects.cover_svg AS img,
    webb6_projects.created_at,
    owner.display_name AS owner,
    JSON_ARRAYAGG(JSON_OBJECT('name', members.display_name)) AS members,
    CASE 
      WHEN COUNT(webb6_tasks.task_id) = 0 THEN 0 
      ELSE (SUM(CASE WHEN webb6_tasks.completed_by IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(webb6_tasks.task_id))
    END AS progress_percentage
    FROM webb6_projects
    INNER JOIN webb6_users AS owner ON webb6_projects.owner_id = owner.user_id
    LEFT JOIN webb6_project_members ON webb6_project_members.project_id = webb6_projects.project_id
    LEFT JOIN webb6_users AS members ON webb6_project_members.user_id = members.user_id
    LEFT JOIN webb6_tasks ON webb6_tasks.project_id = webb6_projects.project_id
    WHERE webb6_projects.owner_id = :id OR members.user_id = :id
    GROUP BY webb6_projects.project_id ORDER BY webb6_projects.project_id DESC;";

    return $this->query($query, ["id" => $id])->fetchAll();
  }

  /** 
   * Returns a single project
   * 
   * @param string - id of the project
   * @return Object
   */
  public function getProject($projectId, $userId)
  {
    $query = "SELECT 
    projects.project_id,
    projects.title,
    projects.cover_svg AS img,
    projects.created_at,
    owner.display_name AS owner,
    JSON_ARRAYAGG(JSON_OBJECT('name', members.display_name)) AS members,
    CASE 
      WHEN COUNT(tasks.task_id) = 0 THEN 0 
      ELSE (SUM(CASE WHEN tasks.completed_by IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(tasks.task_id))
    END AS progress_percentage
    FROM webb6_projects AS projects
    INNER JOIN webb6_users AS owner ON projects.owner_id = owner.user_id
    LEFT JOIN webb6_project_members AS project_members ON project_members.project_id = projects.project_id
    LEFT JOIN webb6_users AS members ON project_members.user_id = members.user_id
    LEFT JOIN webb6_tasks AS tasks ON tasks.project_id = projects.project_id
    WHERE projects.project_id = :project_id AND (projects.owner_id = :user_id OR members.user_id = :user_id)
    GROUP BY projects.project_id ORDER BY projects.project_id DESC;";

    return $this->query($query, [":project_id" => $projectId, ":user_id" => $userId])->fetch();
  }

  public function insertProject($title, $owner, $svg)
  {
    $query = "INSERT INTO `webb6_projects` (`owner_id`, `title`, `cover_svg`) VALUES (:owner_id, :title, :svg);";
    $this->query($query, [":owner_id" => $owner, ":title" => $title, ":svg" => $svg]);

    return ["id" => $this->lastInsertId()];
  }

  public function insertMember($userId, $projectId)
  {
    $query = "INSERT INTO `webb6_project_members` (`user_id`, `project_id`) VALUES (:user_id, :project_id) ON DUPLICATE KEY UPDATE user_id = user_id";

    return $this->query($query, [":user_id" => $userId, ":project_id" => $projectId]);
  }

  public function getTotalScore($projectId)
  {
    $query = "SELECT users.profile_url, users.display_name, IFNULL(SUM(tasks.score), 0) AS total_score FROM webb6_users AS users LEFT JOIN webb6_tasks AS tasks ON tasks.completed_by = users.user_id AND tasks.project_id = :project_id WHERE users.user_id IN (
    SELECT project_members.user_id FROM webb6_project_members AS project_members WHERE project_members.project_id = :project_id
    UNION 
    SELECT projects.owner_id FROM webb6_projects AS projects WHERE projects.project_id = :project_id) 
    GROUP BY users.user_id, users.display_name;";

    return $this->query($query, [":project_id" => $projectId])->fetchAll();
  }

  /** 
   * __________________
   * TASKS
   * __________________
   */

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
    tasks.score,
    users.display_name AS completed_by
    FROM webb6_tasks AS tasks
    LEFT JOIN webb6_users AS users ON tasks.completed_by = users.user_id
    WHERE tasks.project_id = :id
    ORDER BY tasks.created_at DESC;";

    return $this->query($query, [":id" => $id])->fetchAll();
  }

  public function insertTask($id, $args)
  {
    $query = "INSERT INTO `webb6_tasks` (`project_id`, `title`, `description_text`, `score`) VALUES (:project_id, :title, :description_text, :score)";

    $this->query($query, [":project_id" => $id, ":title" => $args["title"], ":description_text" => $args["description"],  ":score" => $args["score"]]);

    return ["id" => $this->lastInsertId()];
  }

  public function completeTask($projectId, $taskId, $user)
  {
    $query = "UPDATE webb6_tasks AS tasks SET tasks.completed_by = :user WHERE tasks.project_id = :project_id AND tasks.task_id = :task_id";

    $this->query($query, [":user" => $user, ":project_id" => $projectId, ":task_id" => $taskId]);

    $progress = $this->getProgress($projectId);

    return ["project" => $projectId, "completed" => "{$progress->progress_percentage}%"];
  }

  public function uncompleteTask($projectId, $taskId)
  {
    $query = "UPDATE webb6_tasks AS tasks SET tasks.completed_by = null WHERE tasks.project_id = :project_id AND tasks.task_id = :task_id";

    $this->query($query, [":project_id" => $projectId, ":task_id" => $taskId]);

    $progress = $this->getProgress($projectId);

    return ["project" => $projectId, "completed" => "{$progress->progress_percentage}%"];
  }

  /** 
   * __________________
   * UTILS
   * __________________
   */

  private function getProgress($projectId)
  {
    $query = "SELECT 
    CASE 
      WHEN COUNT(tasks.task_id) = 0 THEN 0 
      ELSE (SUM(CASE WHEN tasks.completed_by IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(tasks.task_id))
    END AS progress_percentage
    FROM webb6_projects AS projects
    LEFT JOIN webb6_tasks AS tasks ON tasks.project_id = projects.project_id
    WHERE projects.project_id = :project_id
    GROUP BY projects.project_id;";

    return $this->query($query, [":project_id" => $projectId])->fetch();
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
}
