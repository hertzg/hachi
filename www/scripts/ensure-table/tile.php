#!/usr/bin/php
<?php

chdir(__DIR__);
include_once '../../fns/Table/ensure.php';
include_once '../../lib/mysqli.php';
echo Table\ensure($mysqli, 'tile', [
    'ground' => [
        'type' => 'varchar(30)',
        'characterSet' => 'ascii',
        'collation' => 'ascii_bin',
    ],
    'id' => [
        'type' => 'bigint(20) unsigned',
        'primary' => true,
    ],
    'x' => [
        'type' => 'bigint(20) unsigned',
    ],
    'y' => [
        'type' => 'bigint(20) unsigned',
    ],
]);
