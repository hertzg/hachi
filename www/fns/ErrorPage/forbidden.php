<?php

namespace ErrorPage;

function forbidden () {

    $description = "Access to the page "
        .'<em>'.htmlspecialchars($_SERVER['REQUEST_URI']).'</em> denied.';

    include_once __DIR__.'/create.php';
    create(403, 'Forbidden', $description);

}
