<?php

function mysqli_safe_query ($mysqli, $sql) {

    $microtime = microtime(true);
    $result = $mysqli->query($sql);

    if ($result === false) {
        include_once __DIR__.'/ErrorPage/internalServerError.php';
        ErrorPage\internalServerError("MySQL query error: $mysqli->error");
    }

    $elapsed = microtime(true) - $microtime;
    if ($elapsed > 2) {
        include_once __DIR__.'/Log/add.php';
        Log\add(['SLOW_QUERY', $sql, $elapsed]);
    }

    return $result;

}
