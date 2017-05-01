<?php

chdir(__DIR__);
include_once '../fns/mysqli_safe_query.php';
include_once '../fns/mysqli_single_assoc.php';
include_once '../lib/mysqli.php';

include_once '../fns/Database/Map/last.php';
$map = Database\Map\last($mysqli);

$sql = "select * from tile where map_id = $map[id]"
    ." and obstacle is not null order by rand() limit 1";
$tile = mysqli_single_assoc($mysqli, $sql);

if ($tile !== null) {

    $sql = "update tile set obstacle = null where id = $tile[id]";
    mysqli_safe_query($mysqli, $sql);

    $data = $mysqli->real_escape_string(json_encode([
        'removeObstacle', [(int)$tile['x'], (int)$tile['y']],
    ]));

    $sql = 'insert into `change` (map_id, data)'
        ." values ($map[id], '$data')";
    mysqli_safe_query($mysqli, $sql);

}

echo "Done\n";
