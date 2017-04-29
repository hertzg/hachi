<?php

namespace Log;

function deleteOld () {

    include_once __DIR__.'/dir.php';
    $dir = dir();

    include_once __DIR__.'/interval.php';
    $old_time = time() - interval() * 10;
    foreach (scandir($dir) as $dirname) {

        if ($dirname === '.' || $dirname === '..' ||
            $dirname === '.gitignore' || $dirname > $old_time) continue;

        foreach (glob("$dir/$dirname/*") as $filename) unlink($filename);
        rmdir("$dir/$dirname");

    }

}
