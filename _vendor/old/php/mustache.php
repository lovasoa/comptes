<?php
require 'Mustache/Autoloader.php';
Mustache_Autoloader::register();

$mustache = new Mustache_Engine(array(
    'cache' => dirname(__FILE__).'/../templates/cache',
    'cache_lambda_templates' => true,
    'loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__).'/../templates'),
    'logger' => new Mustache_Logger_StreamLogger('php://stderr'),
    'strict_callables' => true
));

?>
