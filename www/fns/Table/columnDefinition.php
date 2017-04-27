<?php

namespace Table;

function columnDefinition ($column) {

    $definition = $column['type'];

    if (array_key_exists('characterSet', $column)) {
        $definition .= " character set $column[characterSet]"
            ." collate $column[collation]";
    }

    if (array_key_exists('primary', $column)) {
        $definition .= ' auto_increment primary key';
    } else {
        if (!array_key_exists('nullable', $column) || !$column['nullable']) {
            $definition .= ' not null';
        }
    }

    return $definition;

}
