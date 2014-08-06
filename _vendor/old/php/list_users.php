<?php
require_once("../db/connect.php");

$sql = "SELECT user_id,name FROM users;";

$users = array();

foreach ($db->query($sql) as $row) {
	array_push($users, array("id" => $row["user_id"], "name" => $row["name"]));
}

$data  = array(
	"users" => $users
);

header('Content-Type: application/json');
echo json_encode($data);
?>
