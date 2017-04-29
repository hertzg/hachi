<?php

namespace Database\Map;

function last ($mysqli) {
    $sql = 'select * from map where id in (select max(id) from map)';
    include_once __DIR__.'/../../mysqli_single_assoc.php';
    return mysqli_single_assoc($mysqli, $sql);
}
