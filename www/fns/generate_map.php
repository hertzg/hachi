<?php

function generate_map ($size) {

    include_once __DIR__.'/mysqli.php';
    $mysqli = mysqli();

    $sql = "insert into map (size) values ($size)";
    include_once __DIR__.'/mysqli_safe_query.php';
    mysqli_safe_query($mysqli, $sql);

    $obstacles = ['tree', 'trees-1', 'trees-2', 'bush', 'bushes-1', 'bushes-2'];

    $id = $mysqli->insert_id;

    $values = [];
    $flush = function () use ($mysqli, &$values) {
        $sql = 'insert into tile (map_id, x, y, building, ground, obstacle)'
            .' values '.join(', ', $values);
        mysqli_safe_query($mysqli, $sql);
        $values = [];
    };
    for ($y = -$size; $y <= $size; $y++) {
        for ($x = -$size; $x <= $size; $x++) {

            if ($x === -$size + 1 && $y === -$size + 2) {
                $building = "'castle'";
            } else {
                $building = 'null';
            }

            $ground = rand(0, 100) < 30 ? 'gravel' : 'grass';
            if ($ground === 'grass' && rand(0, 100) < 30) {
                $obstacle = "'".$obstacles[array_rand($obstacles)]."'";
            } else {
                $obstacle = 'null';
            }

            $values[] = "($id, $x, $y, $building, '$ground', $obstacle)";
            if (count($values) === 100) $flush();

        }
    }
    if ($values) $flush();

    return $id;

}
