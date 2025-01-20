<?php
header('Content-type: application/json; charset=utf-8');

require_once(__DIR__ . "/model/giocatore.php");

$response = ["code" => 0, "desc" => "Malformed Request."];

if (array_key_exists("data", $_POST)){
    $giocatore = Giocatore::setupFromJSON($_POST["data"]);

    if ($giocatore->save()){
        require_once (__DIR__ . "/model/city.php");

        $giocatore->login("auto","auto");
        if (City::createNewCity($giocatore)) {
            $response = ["code" => 1, "desc" => "Player Created."];
        } else {
            $response = ["code" => 0, "desc" => "City creation error."];
        }
    } else {
        $response = ["code" => 0, "desc" => "Malformed Player Data."];
    }
}

echo json_encode($response);
?>