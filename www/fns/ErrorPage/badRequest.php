<?php

namespace ErrorPage;

function badRequest () {

    $description = 'The page '
        .'<em>'.htmlspecialchars($_SERVER['REQUEST_URI']).'</em>'
        .' cannot be accessed this way.';

    include_once __DIR__.'/create.php';
    create(400, 'Bad Request', $description);

}
