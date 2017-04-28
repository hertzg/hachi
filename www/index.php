<?php

$size = 4;

include_once 'fns/generate_map.php';
$id = generate_map($size);

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
                    'id' => $id,
                    'size' => $size,
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
