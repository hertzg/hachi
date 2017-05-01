<?php

include_once '../lib/mysqli.php';

include_once '../fns/request_strings.php';
list($since) = request_strings('since');

$since = (int)$since;

include_once '../fns/Database/Change/indexSince.php';
$changes = Database\Change\indexSince($mysqli, $since);

$response = [
    'since' => $since,
    'changes' => [],
];
foreach ($changes as $change) {
    $response['since'] = (int)$change['id'];
    $response['changes'][] = json_decode($change['data']);
}

header('Content-Type: application/json');
echo json_encode($response);
