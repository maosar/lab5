<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

include_once("./ObservationModel.php");
include_once("./Controller.php");
include_once("./Connection.php");

date_default_timezone_set("America/New_York");
header("Cache-Control: no-cache");
header("Content-Type: text/event-stream\n\n");
$controller = new Controller();
$oldData = 0;
while (true) {
    $data = $controller -> get_latest_obs();
	if ($data[0]['obs_id'] != $oldData){
		echo('data: ' . json_encode($data) . "\n\n");
		$oldData = $data[0]['obs_id'];
	};
	
    ob_end_flush();
    flush();
	sleep(1);
}
