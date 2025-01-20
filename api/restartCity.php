<?php

session_start();
header('Content-type: application/json; charset=utf-8');

require_once(__DIR__ . "/model/edificiocitta.php");
require_once(__DIR__ . "/model/city.php");

if (!array_key_exists("player", $_SESSION)){
    echo '{"code": 0, "desc": "Session expired."}';
    exit();
}

$city = unserialize($_SESSION['city']);

$buildings = EdificioCitta::clearCity($city->id);

echo json_encode($buildings);