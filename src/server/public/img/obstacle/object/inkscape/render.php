#!/usr/bin/php
<?php

chdir(__DIR__);
echo __DIR__."\n";
include_once '../../../../fns/optimize_xml_file.php';
foreach (glob('*.svg') as $file) {
    echo "    $file\n";
    system("inkscape --vacuum-defs $file");
    system("inkscape --export-plain-svg=../$file $file");
    optimize_xml_file("../$file");
}
