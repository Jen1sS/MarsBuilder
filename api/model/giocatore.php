<?php

require_once(__DIR__ . "/utils.php");

class Giocatore
{
    var $id;
    var $nickname;
    var $email;
    var $avatar;
    var $password;
    private $key = 'bqd56YHDX9Zzpw7hTLQ1TnAdkJSTOft/sDV7Ax0RoMMrsECaoTAs9YUqVvHWol2U';

    public function __construct()
    {
        $this->id = -1;
        $this->nickname;
        $this->email;
        $this->avatar;
        $this->password;
    }

    public function save()
    {
        $conn = dbconnect();


        if ($this->id == -1) {
            $query = 'INSERT INTO Giocatori VALUES(null,' .
                '"' . $this->nickname . '",' .
                'AES_ENCRYPT("' . $this->email . '","' . $this->key . '"),' .
                '"' . $this->avatar . '",' .
                'AES_ENCRYPT("' . $this->password . '","' . $this->key . '"))';
        } else {
            $query = 'UPDATE giocatori SET' .
                'avatar = "' . $this->avatar . '",' .
                'password = "' . $this->password . '",' .
                'WHERE id="' . $this->id . '",';
        }

        $res = $conn->query($query);

        if ($res){
            $this->id = mysqli_insert_id($conn);
        }

        return $res;

    }

    public function login($email, $password)
    {
        if ($email==$password && $email=="auto") {
            $email = $this->email;
            $password = $this->password;
        }

        $conn = dbconnect();

        $query = "SELECT id,nickname,AES_DECRYPT(email,'". $this->key ."') AS email FROM Giocatori WHERE email=AES_ENCRYPT('" . $email . "','". $this->key ."') AND password=AES_ENCRYPT('" . $password . "','". $this->key ."')";

        $result = $conn->query($query);

        $res = null;

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $res = new Giocatore();
            $res->id = $row["id"];
            $res->nickname = $row["nickname"];
            $res->email = $row["email"];
            $res->avatar = $row["avatar"];
        }

        return $res;
    }

    public static function setupFromJSON($json)
    {
        $g = new Giocatore();
        $data = json_decode($json);

        $g->id = $data->id;
        $g->nickname = $data->nickname;
        $g->email = $data->email;
        $g->password = $data->password;
        $g->avatar = $data->avatar;

        return $g;
    }
}