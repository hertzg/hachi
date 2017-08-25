#!/usr/bin/php
<?php

chdir(__DIR__);
include_once '../../fns/Table/ensure.php';
include_once '../../lib/mysqli.php';
echo Table\ensure($mysqli, 'map', [
  'id' => [
    'type' => 'bigint(20) unsigned',
    'primary' => true,
  ],
  'width' => [
    'type' => 'bigint(20) unsigned',
  ],
  'height' => [
    'type' => 'bigint(20) unsigned',
  ],
  'seed' => [
    'type' => 'bigint(20) unsigned',
  ]
]);
