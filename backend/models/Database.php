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
    $config = require '../config/config.php';

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
}
