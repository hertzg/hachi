<?php

namespace Log;

function ensureSubdir ($time) {

    include_once __DIR__.'/subdir.php';
    $subdir = subdir($time);

    if (!is_dir($subdir)) mkdir($subdir);

}
