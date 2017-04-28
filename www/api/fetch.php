<?php

include_once '../lib/mysqli.php';

include_once '../fns/request_strings.php';
list($map_id) = request_strings('map_id');

$map_id = abs((int)$map_id);

$coords = json_decode(file_get_contents('php://input'));
if (!is_array($coords)) {
    include_once '../fns/ErrorPage/badRequest.php';
    ErrorPage\badRequest();
}

foreach ($coords as $coord) {
    if (!is_array($coord) || count($coord) !== 2) {
        include_once '../fns/ErrorPage/badRequest.php';
        ErrorPage\badRequest();
    }
}

$sql = "select * from tile where map_id = $map_id and (0";
foreach ($coords as $coord) {
    $sql .= " or (x = $coord[0] and y = $coord[1])";
}
$sql .= ')';

include_once '../fns/mysqli_query_assoc.php';
$tiles = mysqli_query_assoc($mysqli, $sql);

$tiles = array_map(function ($tile) {
    return [
        [(int)$tile['x'], (int)$tile['y']],
        $tile['ground'], $tile['obstacle'],
    ];
}, $tiles);

header('Content-Type: application/json');
echo json_encode($tiles);
