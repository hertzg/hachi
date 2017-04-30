<?php

function generate_map () {

    $num_regions = 10;
    $num_tiles = 8;

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
                    'ground' => rand(0, 100) < 30 ? 'gravel' : 'grass',
                    'building' => null,
                    'obstacle' => null,
                    'taken' => false,
                ];
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
        $x = rand($padding, $num_tiles - $padding - 2);
        $y = rand($padding + 1, $num_tiles - $padding - 1);
        $put_building($x, $y, $buildings[array_rand($buildings)]);

        $obstacles = [
            'tree', 'trees-1', 'trees-2', 'bush', 'bushes-1', 'bushes-2',
            'apple-bush', 'orange-bush',
        ];
        for ($y = 0; $y < $num_tiles; $y++) {
            for ($x = 0; $x < $num_tiles; $x++) {
                if ($tiles[$y][$x]['taken']) continue;
                if ($tiles[$y][$x]['ground'] !== 'grass') continue;
                if (rand(0, 100) > 30) continue;
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
