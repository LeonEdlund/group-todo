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
  public function getAllProjects($userId)
  {
    $projectsById = [];

    // Get project info
    $query = "SELECT 
    p.project_id,
    p.title,
    p.cover_svg AS img,
    p.created_at
    FROM webb6_projects AS p
    INNER JOIN webb6_project_members AS m ON p.project_id = m.project_id
    WHERE m.user_id = :user_id
    ORDER BY p.created_at DESC;";

    $projects = $this->query($query, ["user_id" => $userId])->fetchAll();

    foreach ($projects as $project) {
      $projectsById[$project->project_id] = $project;
      $projectsById[$project->project_id]->progress = $this->getProgress($project->project_id)->progress_percentage;
      $projectsById[$project->project_id]->members = $this->getMembers($project->project_id);
    }

    return array_values($projectsById);
  }

  /** 
   * Returns a single project
   * 
   * @param string - id of the project
   * @return Object
   */
  public function getProject($projectId)
  {
    $query = "SELECT 
    p.project_id,
    p.title,
    p.cover_svg AS img,
    p.created_at
    FROM webb6_projects AS p
    WHERE p.project_id = :project_id
    ORDER BY p.created_at DESC;";

    $project = $this->query($query, [":project_id" => $projectId])->fetch();

    if ($project) {
      $project->progress = $this->getProgress($projectId)->progress_percentage;
      $project->members = $this->getMembers($projectId);
    }

    return $project;
  }

  public function insertProject($title, $user, $svg)
  {
    // INSERT PROJECT
    $query = "INSERT INTO webb6_projects (title, cover_svg) VALUES (:title, :svg);";
    $this->query($query, [":title" => $title, ":svg" => $svg]);

    // GET PROJECT ID
    $projectId = $this->lastInsertId();

    // INSERT OWNER IN MEMBERS TABLE
    $query = "INSERT INTO webb6_project_members (user_id, project_id) VALUES (:user, :project);";
    $this->query($query, [":user" => $user, ":project" => $projectId]);

    return ["id" => $projectId];
  }

  // DELETES A PROJECT IF USER IS PART OF THE PROJECT
  public function deleteProject($projectId)
  {
    $query = "DELETE FROM webb6_projects WHERE project_id = :id";
    $status = $this->query($query, [":id" => $projectId]);

    return $status->rowCount();
  }

  /** 
   * __________________
   * MEMBERS
   * __________________
   */

  private function getMembers($projectId)
  {
    $query = "SELECT users.display_name FROM webb6_project_members AS members INNER JOIN webb6_users AS users ON members.user_id = users.user_id WHERE members.project_id = :project_id";

    return $this->query($query, ["project_id" => $projectId])->fetchAll();
  }

  /**
   * INSERT MEMBER TO PROJECT
   */
  public function insertMember($userId, $projectId)
  {
    $query = "INSERT INTO webb6_project_members (user_id, project_id) 
    VALUES (:user_id, :project_id) ON DUPLICATE KEY UPDATE user_id = user_id";

    return $this->query($query, [":user_id" => $userId, ":project_id" => $projectId]);
  }

  public function getTotalScore($projectId)
  {
    $query = "SELECT 
    users.profile_url, 
    users.display_name, 
    IFNULL(SUM(tasks.score), 0) AS total_score 
    FROM webb6_users AS users 
    LEFT JOIN webb6_tasks AS tasks ON tasks.completed_by = users.user_id AND tasks.project_id = :project_id 
    WHERE users.user_id IN 
    (SELECT project_members.user_id 
    FROM webb6_project_members AS project_members 
    WHERE project_members.project_id = :project_id) 
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

  /**
   * Inserts a new task.
   * 
   */
  public function insertTask($projectId, $args)
  {
    $query = "INSERT INTO webb6_tasks (project_id, title, description_text, score) VALUES (:project_id, :title, :description_text, :score)";

    $this->query($query, [
      ":project_id" => $projectId,
      ":title" => $args["title"],
      ":description_text" => $args["description"],
      ":score" => $args["score"]
    ]);

    return ["id" => $this->lastInsertId()];
  }

  /**
   * Inserts a new task.
   * 
   */
  public function completeTask($projectId, $taskId, $user)
  {
    $query = "UPDATE webb6_tasks AS tasks SET tasks.completed_by = :user WHERE tasks.project_id = :project_id AND tasks.task_id = :task_id";

    $this->query($query, [":user" => $user, ":project_id" => $projectId, ":task_id" => $taskId]);

    $progress = $this->getProgress($projectId);
    $completedBy = $this->getTaskCompletedBy($taskId);

    $returArr = [
      "project" => $projectId,
      "completed" => "{$progress->progress_percentage}%",
      "completed_by" => $completedBy
    ];

    return  $returArr;
  }

  public function uncompleteTask($projectId, $taskId, $userId)
  {
    $query = "UPDATE webb6_tasks AS tasks SET tasks.completed_by = null WHERE tasks.project_id = :project_id AND tasks.task_id = :task_id AND tasks.completed_by = :user_id";

    $result = $this->query($query, [":project_id" => $projectId, ":task_id" => $taskId, ":user_id" => $userId]);

    $success = $result->rowCount() > 0;

    if ($success) {
      $progress = $this->getProgress($projectId);
      $completedBy = $this->getTaskCompletedBy($taskId);

      $returArr = [
        "project" => $projectId,
        "completed" => "{$progress->progress_percentage}%",
        "completed_by" => $completedBy
      ];

      return $returArr;
    } else {

      $completedBy = $this->getTaskCompletedBy($taskId);

      return [
        "message" => "can't complete somebody elses task",
        "completed_by" => $completedBy
      ];
    }
  }

  private function getTaskCompletedBy($id)
  {
    $query = "SELECT users.display_name FROM webb6_users AS users INNER JOIN webb6_tasks AS tasks ON users.user_id = tasks.completed_by WHERE tasks.task_id = :task_id";

    return $this->query($query, [":task_id" => $id])->fetch();
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

  public function isMember($projectId, $userId)
  {
    $query = "SELECT 1 FROM webb6_project_members WHERE project_id = :project_id AND user_id = :user_id";

    $result = $this->query($query, [":project_id" => $projectId, ":user_id" => $userId])->fetch();

    return $result ? true : false;
  }
}
