<?php


class ObservationModel
{
	private $connection;

    public function __construct()
    {
        $this->connection = new Connection();
    }
	
	function add($sensor_id, $timeStamp, $temp){
        try {
            $pdoConnection = $this->connection->getPDOConnection();
            $pdoStatement = $pdoConnection->prepare("CALL add_temp_obs('{$sensor_id}','{$timeStamp}','{$temp}')");
            $pdoStatement->execute();
            $pdoConnection = NULL;
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }

    function get_obs()
    {
        try {
            $pdoConnection = $this->connection->getPDOConnection();
            $pdoStatement = $pdoConnection->prepare("CALL get_temp()");
            $pdoStatement->execute();
            $obs = $pdoStatement->fetchAll(PDO::FETCH_OBJ);
            $pdoConnection = NULL;
            return json_encode($obs);
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }

	function get_obs_id($sensor_id)
    {
        try {
            $pdoConnection = $this->connection->getPDOConnection();
            $pdoStatement = $pdoConnection->prepare("CALL get_temp_id('{$sensor_id}')");
            $pdoStatement->execute();
            $obs = $pdoStatement->fetchAll(PDO::FETCH_OBJ);
            $pdoConnection = NULL;
            return json_encode($obs);
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }

    function get_latest_obs()
    {
        try {
            $pdoConnection = $this->connection->getPDOConnection();
            $pdoStatement = $pdoConnection->prepare("CALL get_latest_temp()");
            $pdoStatement->execute();
            $latest_obs = $pdoStatement->fetchAll(PDO::FETCH_ASSOC);
            $pdoConnection = NULL;
            return $latest_obs;
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }
	function get_latest_obs_id($sensor_id)
    {
        try {
            $pdoConnection = $this->connection->getPDOConnection();
            $pdoStatement = $pdoConnection->prepare("CALL get_latest_temp_id('{$sensor_id}')");
            $pdoStatement->execute();
            $latest_obs = $pdoStatement->fetchAll(PDO::FETCH_ASSOC);
            $pdoConnection = NULL;
            return json_encode ($latest_obs);
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }
}