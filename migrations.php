<?php


$query = "create table books (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, author TEXT, library_id INTEGER)";
$query = "create table libraries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)";
$query = "create index library_index ON books (library_id)";
?>