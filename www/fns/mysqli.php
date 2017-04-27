<?php

function mysqli () {

    include_once __DIR__.'/mysql_config.php';
    mysql_config($host, $username, $password, $database);

    $mysqli = @new mysqli($host, $username, $password, $database);
    if ($mysqli->connect_errno !== 0) {
        include_once __DIR__.'/ErrorPage/internalServerError.php';
        ErrorPage\internalServerError("MySQL connect error: $mysqli->connect_error");
    }

    $mysqli->set_charset('utf8');

    return $mysqli;

}
