<?php

function mysqli_query_assoc ($mysqli, $sql) {
    include_once __DIR__.'/mysqli_safe_query.php';
    $result = mysqli_safe_query($mysqli, $sql);
    $objects = [];
    while (true) {
        $object = $result->fetch_assoc();
        if ($object === null) break;
        $objects[] = $object;
    }
    $result->close();
    return $objects;
}
