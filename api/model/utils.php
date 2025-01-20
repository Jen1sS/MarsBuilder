<?php

/**
 * @return mysqli|void
 * Ritorna l'oggetto connessione per l'accesso al db
 * usando mysqli
 */
function dbconnect()
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "CityBuilder";

    $conn = new mysqli($servername, $username, $password, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }


    return $conn;
}


