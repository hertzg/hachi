<?php

function mysqli_value ($mysqli, $sql) {
    include_once __DIR__.'/mysqli_single_row.php';
    return mysqli_single_row($mysqli, $sql)[0];
}
