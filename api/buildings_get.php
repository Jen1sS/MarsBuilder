<?php
// Ritorna l'elenco di tutti gli edifici che possono essere inseriti all'interno della citta

require_once(__DIR__ . "/model/utils.php");

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
header('Content-type: application/json; charset=utf-8');

if (!array_key_exists("player", $_SESSION)) {
    echo '{"code": 0, "desc": "Session expired."}';
    exit();
}

$conn = dbconnect();

$query = "SELECT * FROM Edifici";

$result = $conn->query($query);

$res = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $tmp = array();

        if ($row["tipo"]!="rock" && $row["tipo"]!="terrain") {
            $tmp[] = $row["tipo"];
            $tmp[] = $row["modello3d"];
            $tmp[] = $row["capacita"];
            $tmp[] = $row["id"];

            $res[] = $tmp;
        }
    }
}
echo json_encode($res);


