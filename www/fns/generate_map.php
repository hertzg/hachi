<?php

function generate_map ($size) {

    include_once __DIR__.'/mysqli.php';
    $mysqli = mysqli();

    $sql = "insert into map (size) values ($size)";
    include_once __DIR__.'/mysqli_safe_query.php';
    mysqli_safe_query($mysqli, $sql);

    $id = $mysqli->insert_id;

    $values = [];
    $flush = function () use ($mysqli, &$values) {
        $sql = 'insert into tile (map_id, x, y, ground)'
            .' values '.join(', ', $values);
        mysqli_safe_query($mysqli, $sql);
        $values = [];
    };
    for ($y = -$size; $y <= $size; $y++) {
        for ($x = -$size; $x <= $size; $x++) {
            $ground = rand(0, 100) < 50 ? 'gravel' : 'grass';
            $values[] = "($id, $x, $y, '$ground')";
            if (count($values) === 100) $flush();
        }
    }
    if ($values) $flush();

    return $id;

}
