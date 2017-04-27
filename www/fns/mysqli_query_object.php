<?php

function mysqli_query_object ($mysqli, $sql) {
    include_once __DIR__.'/mysqli_safe_query.php';
    $result = mysqli_safe_query($mysqli, $sql);
    $objects = [];
    while (true) {
        $object = $result->fetch_object();
        if ($object === null) break;
        $objects[] = $object;
    }
    $result->close();
    return $objects;
}
