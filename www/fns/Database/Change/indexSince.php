<?php

namespace Database\Change;

function indexSince ($mysqli, $since) {
    $sql = "select * from `change` where id > $since order by id limit 100";
    include_once __DIR__.'/../../mysqli_query_assoc.php';
    return mysqli_query_assoc($mysqli, $sql);
}
