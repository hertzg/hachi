<?php

include_once 'lib/mysqli.php';

//include_once 'fns/generate_map.php';
//generate_map();

include_once 'fns/Database/Map/last.php';
$map = Database\Map\last($mysqli);

header('Content-Type: text/html; charset=UTF-8');

echo '<!DOCTYPE html>'
    .'<html>'
        .'<head>'
            .'<link rel="stylesheet" type="text/css" href="css/Main.css" />'
            .'<link rel="stylesheet" type="text/css" href="css/Building.css" />'
            .'<link rel="stylesheet" type="text/css" href="css/Obstacle.css" />'
            .'<link rel="stylesheet" type="text/css" href="css/Tile.css" />'
        .'</head>'
        .'<body>'
            .'<script type="text/javascript">'
                .'var map = '.json_encode([
                    'id' => (int)$map['id'],
                    'size' => (int)$map['size'],
                ])
            .'</script>'
            .'<script type="text/javascript" src="js/Init.js"></script>'
            .'<script type="text/javascript" src="js/AxoToRect.js"></script>'
            .'<script type="text/javascript" src="js/Building.js"></script>'
            .'<script type="text/javascript" src="js/Obstacle.js"></script>'
            .'<script type="text/javascript" src="js/RectToAxo.js"></script>'
            .'<script type="text/javascript" src="js/RectToScreen.js"></script>'
            .'<script type="text/javascript" src="js/Tile.js"></script>'
            .'<script type="text/javascript" src="js/Main.js"></script>'
        .'</body>'
    .'</html>';
