<?php
require_once(__DIR__ . "/utils.php");

class City
{
    var $id;
    var $name;
    var $mayor;

    static function createNewCity($g)
    {
        $mayor = $g->id;
        $name = "YLONG MA";

        $conn = dbconnect();

        $query = 'INSERT INTO citta (nome, proprietario) VALUES ("' . $name . '", ' . $mayor . ')';
        $res = $conn->query($query);

        if ($res === false) {
            error_log("SQL query error: " . $conn->error);
            return false; // Handle query error
        }

        return true;
    }

    static function loadFromPlayer($id)
    {
        $conn = dbconnect();

        $query = 'SELECT * FROM citta WHERE proprietario =' . $id;
        $res = $conn->query($query);


        if ($res->num_rows > 0){
            $row = $res->fetch_assoc();
            $res = new City();
            $res->id = $row["id"];
            $res->name = $row["nome"];
            $res->mayor = $row["proprietario"];
        }
        return $res;
    }
}