<?php

header('Content-type: application/json; charset=utf-8');


session_start();
header('Content-type: application/json; charset=utf-8');

require_once(__DIR__ . "/model/edificiocitta.php");
require_once(__DIR__ . "/model/city.php");

if (!array_key_exists("player", $_SESSION)){
    echo '{"code": 0, "desc": "Session expired."}';
    exit();
}

$city = unserialize($_SESSION['city']);

$conn = dbconnect();

$query = 'DELETE FROM RisorseCitta WHERE citta='.$city->id;
 $conn->query($query);

$query = 'INSERT INTO RisorseCitta VALUES ('.$city->id.',1,1000)';
$conn->query($query);

$query = 'INSERT INTO RisorseCitta VALUES ('.$city->id.',2,1000)';
$conn->query($query);

$query = 'INSERT INTO RisorseCitta VALUES ('.$city->id.',3,0)';
$conn->query($query);