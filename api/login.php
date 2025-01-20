<?php
session_start();
header('Content-type: application/json; charset=utf-8');

require_once(__DIR__ . "/model/giocatore.php");

if (array_key_exists("data", $_POST)) {
    $login = json_decode($_POST["data"]);

    $g = (new Giocatore)->login($login->email, $login->password);

    if ($g == null) echo '{"code": 0, "desc": "Wrong Player Data."}';
    else {
        $_SESSION['player'] = $g;

        require_once(__DIR__ . "/model/city.php");
        $c = City::loadFromPlayer($g->id);
        if ($c == null) echo '{"code": 0, "desc": "City error."}';
        else $_SESSION['city'] = serialize($c);

        echo '{"code": 1, "desc": "Logged In."}';
    }
} else echo '{"code": 0, "desc": "idk"}';

