<?php
session_start();
header('Content-type: application/json; charset=utf-8');

if (array_key_exists("player", $_SESSION) && array_key_exists("city", $_SESSION)) {
    $response = [
        "player" => $_SESSION["player"],
        "city" => unserialize($_SESSION["city"])
    ];
    serialize($_SESSION['city']);
    echo json_encode($response);
} else echo "{}";