<?php


session_start();
header('Content-type: application/json; charset=utf-8');

require_once(__DIR__ . "/model/utils.php");

if (!array_key_exists("player", $_SESSION)){
    echo '{"code": 0, "desc": "Session expired."}';
    exit();
}

$conn = dbconnect();


/*+-------------------+---------+------+-----+---------+----------------+
| Field             | Type    | Null | Key | Default | Extra          |
+-------------------+---------+------+-----+---------+----------------+
| id                | int(11) | NO   | PRI | NULL    | auto_increment |
| citta             | int(11) | NO   | MUL | NULL    |                |
| edificio          | int(11) | NO   | MUL | NULL    |                |
| livello           | int(11) | YES  |     | 1       |                |
| posizione         | int(11) | NO   |     | NULL    |                |
| quantita_prodotta | int(11) | YES  |     | 0       |                |
+-------------------+---------+------+-----+---------+----------------+*/

if (array_key_exists("data", $_POST)) {
    $data = json_decode($_POST["data"]);

    $conn = dbconnect();

    $query = "INSERT INTO EdificiCitta VALUES (null," . $data->citta . "," . $data->edificio . "," . $data->livello . "," . $data->posizione . "," . $data->quantitaProdotta . "," . $data->rotazione .");";
    $res = $conn->query($query);

    echo '{"code": 1, "desc": "Building ok."}';
} else echo '{"code": 0, "desc": "Building insertion error"}';

