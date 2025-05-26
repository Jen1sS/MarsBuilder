<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
header('Content-type: application/json; charset=utf-8');

require_once(__DIR__ . "/model/edificiocitta.php");
require_once(__DIR__ . "/model/city.php");

if (!array_key_exists("player", $_SESSION)){
    echo '{"code": 0, "desc": "Session expired."}';
    exit();
}

if (array_key_exists("data", $_POST)) {
    $data = json_decode($_POST["data"]);

    $city = unserialize($_SESSION['city']);

    $conn = dbconnect();

    $query = "UPDATE RisorseCitta SET quantita=" . $data->aluminum . " WHERE risorsa=1 AND citta=" . $data->citta;
    $conn->query($query);

    $query = "UPDATE RisorseCitta SET quantita=" . $data->energy . " WHERE risorsa=2 AND citta=" . $data->citta;
    $conn->query($query);

    $query = "UPDATE RisorseCitta SET quantita=" . $data->people . " WHERE risorsa=3 AND citta=" . $data->citta;
    $conn->query($query);
}