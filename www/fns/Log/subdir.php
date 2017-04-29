<?php

namespace Log;

function subdir ($time) {

    include_once __DIR__.'/interval.php';
    $interval = interval();

    include_once __DIR__.'/dir.php';
    return dir().'/'.ceil($time / $interval) * $interval;

}
