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

$city = unserialize($_SESSION['city']);

$conn = dbconnect();

$query = 'SELECT Risorse.nome,Risorse.icona,RisorseCitta.quantita FROM RisorseCitta INNER JOIN Risorse ON RisorseCitta.risorsa = Risorse.id WHERE citta = ' . $city->id;

$result = $conn->query($query);

$res = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["nome"] = $row["nome"];
        $tmp["quantita"] = $row["quantita"];
        $tmp["icona"] = $row["icona"];
        $res[] = $tmp;
    }
}

echo json_encode($res);