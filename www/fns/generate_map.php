<?php

function generate_map () {

    $num_regions = 10;
    $num_tiles = 10;

    include_once __DIR__.'/mysqli.php';
    $mysqli = mysqli();

    include_once __DIR__.'/Database/Map/add.php';
    $id = Database\Map\add($mysqli, $num_regions * $num_tiles);

    $render = function ($offset_x, $offset_y) use ($mysqli, $id, $num_tiles) {

        $tiles = [];
        for ($y = 0; $y < $num_tiles; $y++) {
            $tiles[$y] = [];
            for ($x = 0; $x < $num_tiles; $x++) {
                $tiles[$y][$x] = [
                    'ground' => null,
                    'building' => null,
                    'obstacle' => null,
                    'taken' => false,
                ];
            }
        }

        if (mt_rand(0, 100) < 30) {
            $x = mt_rand(0, $num_tiles - 1);
            $y = mt_rand(0, $num_tiles - 1);
            $queue = [[$x, $y]];
            $placed = 0;
            $num_waters = mt_rand(4, 6);
            while ($queue) {

                list($x, $y) = array_shift($queue);

                $tiles[$y][$x]['ground'] = 'water';
                $tiles[$y][$x]['taken'] = true;
                $placed++;
                if ($placed === $num_waters) break;

                $next_queue = [
                    [$x - 1, $y],
                    [$x + 1, $y],
                    [$x, $y - 1],
                    [$x, $y + 1],
                ];
                shuffle($next_queue);
                array_shift($next_queue);

                foreach ($next_queue as $coords) {
                    list($x, $y) = $coords;
                    if ($x === -1 || $x === $num_tiles) continue;
                    if ($y === -1 || $y === $num_tiles) continue;
                    if ($tiles[$y][$x]['ground'] === 'water') continue;
                    $queue[] = $coords;
                }

            }
        }

        for ($y = 0; $y < $num_tiles; $y++) {
            for ($x = 0; $x < $num_tiles; $x++) {
                if ($tiles[$y][$x]['taken']) continue;
                $tiles[$y][$x]['ground'] = mt_rand(0, 100) < 30 ? 'gravel' : 'grass';
            }
        }

        $put_building = function ($x, $y, $building) use (&$tiles) {
            $tiles[$y][$x]['building'] = $building;
            $tiles[$y][$x]['taken'] = true;
            $tiles[$y][$x + 1]['taken'] = true;
            $tiles[$y - 1][$x]['taken'] = true;
            $tiles[$y - 1][$x + 1]['taken'] = true;
        };

        $buildings = ['castle', 'farm', 'barn', 'camp', 'tower', 'gold', 'stone'];
        $padding = 2;
        $x = mt_rand($padding, $num_tiles - $padding - 2);
        $y = mt_rand($padding + 1, $num_tiles - $padding - 1);
        $put_building($x, $y, $buildings[array_rand($buildings)]);

        $obstacles = [
            'tree', 'trees-1', 'trees-2', 'bush', 'bushes-1', 'bushes-2',
            'apple-bush', 'orange-bush',
        ];
        for ($y = 0; $y < $num_tiles; $y++) {
            for ($x = 0; $x < $num_tiles; $x++) {
                if ($tiles[$y][$x]['taken']) continue;
                if ($tiles[$y][$x]['ground'] !== 'grass') continue;
                if (mt_rand(0, 100) > 30) continue;
                $tiles[$y][$x]['obstacle'] = $obstacles[array_rand($obstacles)];
            }
        }

        $values = [];
        foreach ($tiles as $local_y => $row) {
            foreach ($row as $local_x => $tile) {

                $x = $offset_x + $local_x;
                $y = $offset_y + $local_y;

                $building = $tile['building'];
                if ($building === null) $building = 'null';
                else $building = "'$building'";

                $obstacle = $tile['obstacle'];
                if ($obstacle === null) $obstacle = 'null';
                else $obstacle = "'$obstacle'";

                $values[] = "($id, $x, $y, '$tile[ground]', $building, $obstacle)";

            }
        }

        $sql = 'insert into tile (map_id, x, y, ground, building, obstacle)'
            .' values '.join(', ', $values);
        mysqli_safe_query($mysqli, $sql);

    };

    for ($y = 0; $y < $num_regions; $y++) {
        for ($x = 0; $x < $num_regions; $x++) {
            $render($x * $num_tiles, $y * $num_tiles);
        }
    }

}
