<?php

namespace Log;

function iterate ($start_time, $callback) {

    include_once __DIR__.'/dir.php';
    $dir = dir();

    include_once __DIR__.'/subdir.php';
    foreach (scandir($dir) as $dirname) {

        if ($dirname === '.' || $dirname === '..' ||
            $dirname === '.gitignore' || $dirname <= $start_time) continue;

        foreach (scandir("$dir/$dirname") as $filename) {

            if ($filename === '.' || $filename === '..') continue;

            $lines = explode("\n", file_get_contents("$dir/$dirname/$filename"));
            foreach ($lines as $line) {
                if ($line === '') continue;
                $object = json_decode($line);
                if ($object->time >= $start_time) $callback($object);
            }

        }

    }

}
