<?php
class DB {
	static $instance = null;
	static function get() {
		if (self::$instance == null) {
			self::$instance = new DB();
		}
		return self::$instance;
	}
	private $db;
	function __construct() {
		$this->db = new SQLite3(dirname(__FILE__).'/sqlite/database.sqlite');
	}
	function __destruct() {
		$this->db->close();
	}
	function query($query) {
		return $this->db->query($query);
	}
	function fetchAll($query) {
		$results = $this->db->query($query);
		$return = [];
		while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
			$return[] = $row;
		}
		return $return;
	}
	function singleRow($query) {
		return $this->db->querySingle($query, true);
	}
	function lastID() {
		return $this->db->querySingle("select last_insert_rowid()");
	}
}