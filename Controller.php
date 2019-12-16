<?php

class Controller
{
	private $observationModel;

    public function __construct(){
        $this->observationModel = new ObservationModel();
    }
	

    function add($queryString){
        $obsData = explode("&", $queryString);
        
		$sensor_id = $obsData[0];
		$timeStamp = $obsData[1] . " " . $obsData[2];

        $temp = $obsData[3];

        echo "id: " . $sensor_id . " time: " . $timeStamp . " temp: " . $temp;
        $this -> observationModel -> add($sensor_id, $timeStamp, $temp);
    }
    function get_obs_id($sensor_id){
        return $this -> observationModel -> get_obs_id($sensor_id);
    }

	    function get_obs(){
        return $this -> observationModel -> get_obs();
    }

    function get_latest_obs(){
        $data = $this -> observationModel -> get_latest_obs();
        return $data;
        
    }

	    function get_latest_obs_id($sensor_id){


        //$data = $this -> observationModel -> get_latest_obs_id($sensor_id);
        $sensor1 = $this -> observationModel -> get_latest_obs_id(1);
        $sensor2 = $this -> observationModel -> get_latest_obs_id(2);
		$data = array_merge($sensor1, $sensor2);
        return $data;
        
    }
}