<?php

namespace ErrorPage;

function notFound () {

    $description = 'The page '
        .'<em>'.htmlspecialchars($_SERVER['REQUEST_URI']).'</em>'
        .' was not found.';

    include_once __DIR__.'/create.php';
    create(404, 'Not Found', $description);

}
