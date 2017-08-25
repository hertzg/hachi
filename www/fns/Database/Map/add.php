<?php

namespace Database\Map;

function add ($mysqli, $width, $height, $seed) {
    include_once __DIR__.'/../../mysqli_safe_query.php';
    mysqli_safe_query($mysqli, "insert into map (width, height, seed) values ($width, $height, $seed)");
    return $mysqli->insert_id;
}