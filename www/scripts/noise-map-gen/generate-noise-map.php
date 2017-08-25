<?php
include_once __DIR__ . '/../../lib/mysqli.php';
$mysqli = mysqli();


@list(, $w, $h, $scale) = $argv;
chdir(__DIR__);
exec("node ./index.js $w $h $scale", $output, $exitCode);
if ($exitCode) die(join("\n",$output));
$tileMap = json_decode(join("\n",$output), true);

include_once __DIR__ . '/../../fns/Database/Map/add.php';
$id = Database\Map\add($mysqli, $w, $h, 0);

$values = [];
foreach($tileMap as $pos => $data) {
  list($x, $y) = explode(',', $pos);
  list($ground, $obstacle, $building) = $data;
  if($obstacle === null) $obstacle = 'null';
  else $obstacle = "'$obstacle'";
  if($building === null) $building = 'null';
  else $building = "'$building'";
  array_push($values, "($id, $x, $y, '$ground', $obstacle, $building)");
}

foreach (array_chunk($values, 100) as $values) {
  $sql = 'insert into tile (map_id, x, y, ground, obstacle, building)'
    . ' values '. join(', ', $values);
  mysqli_safe_query($mysqli, $sql);
}