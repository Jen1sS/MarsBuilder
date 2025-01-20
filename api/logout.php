<?php
session_start();

session_unset();

session_destroy();

echo json_encode(["code" => 1, "desc" => "Logged out successfully."]);
?>