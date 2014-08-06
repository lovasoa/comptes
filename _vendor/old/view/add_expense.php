<?php
require_once ("../php/mustache.php");
require_once("../db/connect.php");
require_once ("../php/l10n.php");

// list users
$sql = "SELECT user_id,name FROM users;";
$users = array();
foreach ($db->query($sql) as $row) {
	array_push($users, array("id" => $row["user_id"], "name" => $row["name"]));
}

$data  = array(
	"title" => __("add expense"),
	"users" => $users
);


$tpl = $mustache->loadTemplate('add_expense.html');
echo $tpl->render($data);
?>
