<?php

session_start();
header('Content-type: application/json; charset=utf-8');

require_once(__DIR__ . "/model/utils.php");
require_once(__DIR__ . "/model/City.php"); // Include the City class definition

if (!array_key_exists("player", $_SESSION)) {
    echo '{"code": 0, "desc": "Session expired."}';
    exit();
}

$conn = dbconnect();

if (array_key_exists("data", $_POST)) {
    $data = json_decode($_POST["data"]);

    $query = "UPDATE Citta SET nome = '" . $data->newName  . "' WHERE nome = '" . $data->oldName . "';";
    $res = $conn->query($query);

    if ($res) {
        $city = unserialize($_SESSION['city']);
        $city->name = $data->newName;
        $_SESSION['city'] = serialize($city);
        echo '{"code": 1, "desc": "Rename Completed."}';
        exit();
    }
}
echo '{"code": 0, "desc": "Rename Error."}';
?>