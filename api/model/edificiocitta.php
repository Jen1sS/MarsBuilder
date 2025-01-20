<?php
require_once(__DIR__ . "/utils.php");

class EdificioCitta
{
    // Derivano da Edifici Citta
    var $id;
    var $citta;
    var $edificio;
    var $livello;
    var $quantita;
    var $posizione;
    var $rotazione;

    // Derivano da Edifici -- Possono non essere valorizzati
    var $tipo;
    var $modello3D;
    var $capacita;


    public static function loadEdifici($citta)
    {
        $conn = dbconnect();

        $query = 'SELECT ec.*, e.tipo, e.modello3d, e.capacita FROM edificicitta ec JOIN edifici e ON ec.edificio=e.id WHERE citta=' . $citta . ';';

        $result = $conn->query($query);



        $res = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $tmp = new EdificioCitta();
                $tmp->id = $row["id"];
                $tmp->citta = $row["citta"];
                $tmp->edificio = $row["edificio"];
                $tmp->livello = $row["livello"];
                $tmp->quantita = $row["quantita_prodotta"];
                $tmp->posizione = $row["posizione"];

                $tmp->tipo = $row["tipo"];
                $tmp->modello3D = $row["modello3d"];
                $tmp->capacita = $row["capacita"];
                $tmp->rotazione = $row["rotazione"];

                $res[] = $tmp;

            }
        }
        return $res;
    }

    public static function clearCity($citta)
    {
        $conn = dbconnect();

        $query = 'DELETE FROM EdificiCItta WHERE Citta=' . $citta . ';';

        $result = $conn->query($query);

        return '{"code": 1, "desc": "Restarted city."}';
    }
}