<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

include_once("./ObservationModel.php");
include_once("./Controller.php");
include_once("./Connection.php");

header("Cache-Control: no-cache");
header("Content-Type: application/json");
header("Expires: -1");

$qsArray = explode("%", $_SERVER["QUERY_STRING"]);

if(file_exists("./".$qsArray[0].".php")){
    $controller = new $qsArray[0]();
    echo $controller -> {$qsArray[1]}($qsArray[2]);

}else{

    echo "Nope";

}