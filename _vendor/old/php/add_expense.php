<?php
var_dump($_POST);
function find_request_errors ($data) {
	if ( !is_object($data) ) {
		return "Invalid JSON object";
	}
	if ( !isset($data->description) or !is_string($data->description) ) {
		return "No description";
	}
	if ( !isset($data->debts) or !is_object($data->debts) ) {
		return "No debts";
	}
	foreach($data->debts as $debt) {
		if ( !isset($debt->from, $debt->to, $debt->amount) ) {
			return "Invalid expense";
		}
	}
	return false;
}

require_once("../db/connect.php");
$data = json_decode(file_get_contents("php://stdin"));

if ( $err = find_request_errors($data) ) {
	header("HTTP/1.0 400 Bad Request");
	header('Content-Type: application/json');
	die(json_encode(array(
		"error" => $err
	)));
}

$stmtExpenses = $db->prepare("INSERT INTO expenses(description) VALUES (:description)");
$stmtDebts    = $db->prepare("INSERT INTO debts(from, to, amount, expense_id) VALUES (:from, :to, :amount, :expense_id)");

$db->beginTransaction();
$stmtExpenses->execute(array(":description" => $data->description));
$expense_id = $db->lastInsertId("users_id_seq");

foreach($data->debts as $debt) {
	if ($debt->from > $debt->to) {
		list($debt->from, $debt->to) = array($debt->to, $debt->from);
		$debt->amount = -$debt->amount;
	}
	$stmtDebts->execute(array(
		":from" => $debt->from,
		":to" => $debt->to,
		":amount" => $debt->amount,
		":expense_id" => $expense_id
	));
}
$db->commit();
?>
