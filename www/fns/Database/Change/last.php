<?php

namespace Database\Change;

function last ($mysqli) {
    $sql = 'select * from `change` where id in (select max(id) from `change`)';
    include_once __DIR__.'/../../mysqli_single_assoc.php';
    return mysqli_single_assoc($mysqli, $sql);
}
