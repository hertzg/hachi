<?php

namespace Log;

function add ($data) {

    $time = time();

    include_once __DIR__.'/../debug_mode.php';
    if (debug_mode()) {
        include_once __DIR__.'/ensureSubdir.php';
        ensureSubdir($time);
    }

    include_once __DIR__.'/subdir.php';
    $path = subdir($time).'/'.bin2hex(openssl_random_pseudo_bytes(1));

    file_put_contents($path, json_encode([
        'time' => $time,
        'server' => [
            'remote_addr' => array_key_exists('REMOTE_ADDR', $_SERVER) ? $_SERVER['REMOTE_ADDR'] : null,
            'request_uri' => array_key_exists('REQUEST_URI', $_SERVER) ? $_SERVER['REQUEST_URI'] : null,
        ],
        'data' => $data,
    ])."\n", FILE_APPEND);

}
