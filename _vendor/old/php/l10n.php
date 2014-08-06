<?php
$messages = array (
		'fr'=> array(
			'add expense' => 'ajouter une dépense'
    )
);

function __($s) {
	global $messages;
	$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
	if (isset($messages[$lang][$s])) {
		return $messages[$lang][$s];
	} else {
		error_log("Unable to find a translation for: ".$s);
		return $s;
	}
}
?>
