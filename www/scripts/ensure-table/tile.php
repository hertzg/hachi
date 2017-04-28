#!/usr/bin/php
<?php

chdir(__DIR__);
include_once '../../fns/Table/ensure.php';
include_once '../../lib/mysqli.php';
echo Table\ensure($mysqli, 'tile', [
    'building' => [
        'type' => 'varchar(30)',
        'characterSet' => 'ascii',
        'collation' => 'ascii_bin',
    ],
    'ground' => [
        'type' => 'varchar(30)',
        'characterSet' => 'ascii',
        'collation' => 'ascii_bin',
    ],
    'id' => [
        'type' => 'bigint(20) unsigned',
        'primary' => true,
    ],
    'map_id' => [
        'type' => 'bigint(20) unsigned',
    ],
    'obstacle' => [
        'type' => 'varchar(30)',
        'characterSet' => 'ascii',
        'collation' => 'ascii_bin',
        'nullable' => true,
    ],
    'x' => [
        'type' => 'bigint(20)',
    ],
    'y' => [
        'type' => 'bigint(20)',
    ],
]);
