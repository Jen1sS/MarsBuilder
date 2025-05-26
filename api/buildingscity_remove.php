<?php


session_start();
header('Content-type: application/json; charset=utf-8');

require_once(__DIR__ . "/model/utils.php");

if (!array_key_exists("player", $_SESSION)){
    echo '{"code": 0, "desc": "Session expired."}';
    exit();
}

$conn = dbconnect();

if (array_key_exists("data", $_POST)) {
    $data = json_decode($_POST["data"]);

    $conn = dbconnect();

    $query = "DELETE FROM EdificiCitta WHERE citta=" . $data->citta . " AND posizione=" . $data->posizione . " AND livello>=" . $data->livello;
    $res = $conn->query($query);

    echo '{"code": 1, "desc": "Building ok."}';
} else echo '{"code": 0, "desc": "Building removal error"}';

