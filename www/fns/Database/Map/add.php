<?php

namespace Database\Map;

function add ($mysqli, $size) {
    include_once __DIR__.'/../../mysqli_safe_query.php';
    mysqli_safe_query($mysqli, "insert into map (size) values ($size)");
    return $mysqli->insert_id;
}
