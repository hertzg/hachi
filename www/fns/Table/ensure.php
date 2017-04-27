<?php

namespace Table;

function ensure ($mysqli, $tableName, $columns) {

    $fnsDir = __DIR__.'/..';

    include_once "$fnsDir/mysqli_single_object.php";
    $db = mysqli_single_object($mysqli, 'select database() db')->db;

    $escapedDb = $mysqli->real_escape_string($db);
    $escapedTableName = $mysqli->real_escape_string($tableName);

    include_once __DIR__.'/columnDefinition.php';

    $sql = 'select * from information_schema.tables'
        ." where table_schema = '$escapedDb'"
        ." and table_name = '$escapedTableName'";
    $table = mysqli_single_object($mysqli, $sql);

    $output = '';

    if ($table) {

        include_once "$fnsDir/mysqli_query_object.php";
        $sql = 'select * from information_schema.columns'
            ." where table_schema = '$escapedDb'"
            ." and table_name = '$escapedTableName'";
        $existingColumns = mysqli_query_object($mysqli, $sql);

        foreach ($existingColumns as $existingColumn) {

            $columnName = $existingColumn->COLUMN_NAME;
            if (!array_key_exists($columnName, $columns)) continue;

            $existingType = $existingColumn->COLUMN_TYPE;
            $existingNullable = $existingColumn->IS_NULLABLE === 'YES';
            $existingPrimary = $existingColumn->COLUMN_KEY == 'PRI';
            $existingIncrement = $existingColumn->EXTRA == 'auto_increment';
            $existingCharset = $existingColumn->CHARACTER_SET_NAME;
            $existingCollation = $existingColumn->COLLATION_NAME;

            $column = $columns[$columnName];
            $type = $column['type'];
            $primary = array_key_exists('primary', $column);
            unset($columns[$columnName]);

            if (array_key_exists('nullable', $column)) {
                $nullable = $column['nullable'];
            } else {
                $nullable = false;
            }

            if (array_key_exists('characterSet', $column)) {
                $charset = $column['characterSet'];
                $collation = $column['collation'];
            } else {
                $charset = $collation = null;
            }

            if ($primary) $primaryOk = $existingPrimary && $existingIncrement;
            else $primaryOk = !$existingPrimary && !$existingIncrement;

            if ($type === $existingType &&
                $nullable === $existingNullable &&
                $charset === $existingCharset &&
                $collation === $existingCollation && $primaryOk) continue;

            if ($existingPrimary) {
                $sql = "alter table `$escapedTableName` drop primary key";
                $output .= "SQL: $sql\n";
                $mysqli->query($sql) || trigger_error($mysqli->error);
            }

            $escapedColumnName = $mysqli->real_escape_string($columnName);
            $sql = "alter table `$escapedTableName` change `$escapedColumnName`"
                ." `$escapedColumnName` ".columnDefinition($column);

            $output .= "SQL: $sql\n";

            $mysqli->query($sql) || trigger_error($mysqli->error);

        }

        foreach ($columns as $name => $column) {
            $escapedName = $mysqli->real_escape_string($name);
            $definition = columnDefinition($column);
            $sql = "alter table `$escapedTableName`"
                ." add `$escapedName` $definition";
            $output .= "SQL: $sql\n";
            $mysqli->query($sql) || trigger_error($mysqli->error);
        }

    } else {
        $sql = "create table `$escapedTableName` (";
        $first = true;
        foreach ($columns as $name => $column) {
            if ($first) $first = false;
            else $sql .= ', ';
            $escapedName = $mysqli->real_escape_string($name);
            $definition = columnDefinition($column);
            $sql .= "`$escapedName` $definition";
        }
        $sql .= ')';
        $output .= "SQL: $sql\n";
        $mysqli->query($sql) || trigger_error($mysqli->error);
    }

    if ($output === '') {
        $output .= "Nothing to do for the table \"$tableName\".\n";
    }

    return $output;

}
