<?php

namespace ErrorPage;

function create ($code, $text, $description) {

    http_response_code($code);
    header('Content-Type: text/html; charset=UTF-8');

    echo
        '<!DOCTYPE html>'
        .'<html style="height: 100%">'
            .'<head>'
                ."<title>$code $text</title>"
                .'<meta http-equiv="Content-Type"'
                .' content="text/html; charset=UTF-8" />'
                .'<meta name="viewport"'
                .' content="width=device-width, user-scalable=no" />'
                .'<style type="text/css">'
                    .'* {'
                        .'margin: 0;'
                        .'padding: 0;'
                        .'font: normal 16px/18px Arial, sans-serif;'
                        .'box-sizing: border-box;'
                        .'-moz-box-sizing: border-box;'
                    .'}'
                    .'html, body {'
                        .'height: 100%;'
                        .'white-space: nowrap;'
                        .'text-align: center;'
                        .'background: #fff;'
                        .'color: #000;'
                    .'}'
                    .'h1 {'
                        .'font-weight: bold;'
                        .'font-size: 22px;'
                    .'}'
                    .'.layout {'
                        .'display: inline-block;'
                        .'vertical-align: middle;'
                    .'}'
                    .'.layout.aligner {'
                        .'height: 100%;'
                    .'}'
                    .'.layout.content {'
                        .'padding: 8px;'
                        .'white-space: normal;'
                        .'max-width: 100%;'
                    .'}'
                    .'a {'
                        .'color: #f70;'
                    .'}'
                    .'em {'
                        .'border-bottom: 1px dotted;'
                        .'word-wrap: break-word;'
                    .'}'
                .'</style>'
            .'</head>'
            .'<body>'
                .'<div class="layout aligner"></div>'
                .'<div class="layout content">'
                    ."<h1>$code $text</h1>"
                    .'<br />'
                    ."<div>$description</div>"
                .'</div>'
            .'</body>'
        .'</html>';
    exit;

}
