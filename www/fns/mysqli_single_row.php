<?php

function mysqli_single_row ($mysqli, $sql) {
    include_once __DIR__.'/mysqli_safe_query.php';
    $result = mysqli_safe_query($mysqli, $sql);
    $object = $result->fetch_row();
    $result->close();
    return $object;
}
