<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

    if ($data->edificio<=4){
        $query = "INSERT INTO EdificiCitta VALUES (null," . $data->citta . "," . $data->edificio . "," . $data->livello . "," . $data->posizione . "," . $data->quantitaProdotta . "," . $data->rotazione .");";
        $res = $conn->query($query);
    }
    else {
    $query = "SELECT * FROM EdificiCostruzione WHERE edificio=".$data->edificio." AND risorsa=1 AND quantitta<=".$data->alluminio;
    $res1 = $conn->query($query);

    $query = "SELECT * FROM EdificiCostruzione WHERE edificio=".$data->edificio." AND risorsa=2 AND quantitta<=".$data->energia;
    $res2 = $conn->query($query);

    if ($res1->num_rows>0&&$res2->num_rows>0) {
        $query = "INSERT INTO EdificiCitta VALUES (null," . $data->citta . "," . $data->edificio . "," . $data->livello . "," . $data->posizione . "," . $data->quantitaProdotta . "," . $data->rotazione .");";
        $res = $conn->query($query);
    } else {
        echo '{"code": 2, "desc": "Ur broke"}';
        exit();
    }

    $res1_assoc = $res1->fetch_assoc();
    $res2_assoc = $res2->fetch_assoc();

    $res1 = $data->alluminio - $res1_assoc['quantitta'];
    $res2 = $data->energia - $res2_assoc['quantitta'];

    $query = "UPDATE RisorseCitta SET quantita=" . $res1 . " WHERE risorsa=1 AND citta=" . $data->citta;
    $conn->query($query);

    $query = "UPDATE RisorseCitta SET quantita=" . $res2 . " WHERE risorsa=2 AND citta=" . $data->citta;
    $conn->query($query);

    echo '{"code": 1, "desc": "Building ok.","aluminum":'.$res1.',"energy":'.$res2.'}';
    }
} else echo '{"code": 0, "desc": "Building insertion error"}';

