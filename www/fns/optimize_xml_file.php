<?php

function optimize_xml_file ($filename) {

    $fixNode = function ($node, $fixNode) {
        $childNodes = $node->childNodes;
        for ($i = 0; $i < $childNodes->length; $i++) {
            $childNode = $childNodes[$i];
            $nodeType = $childNode->nodeType;
            if ($nodeType === XML_ELEMENT_NODE) {
                $fixNode($childNode, $fixNode);
            } elseif ($nodeType === XML_COMMENT_NODE) {
                $node->removeChild($childNode);
                $i--;
            } elseif ($nodeType === XML_TEXT_NODE) {
                if (!preg_match('/\S/', $childNode->nodeValue)) {
                    $node->removeChild($childNode);
                    $i--;
                }
            }
        }
    };

    $document = new DOMDocument;
    $document->load($filename);
    $fixNode($document, $fixNode);
    $document->save($filename);

}
