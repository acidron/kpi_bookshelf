<?php
class Libraries {
	static public function filterData($data) {
		return (object)[
			'name'   => htmlspecialchars($data['name']),
		];
	}
	public function index() {
		return DB::get()->fetchAll('select * from libraries');
	}
	public function show($id) {
		return DB::get()->singleRow(sprintf('select * from libraries where id = "%s"', $id));
	}
	public function destroy($id) {
		DB::get()->query(sprintf('delete from libraries where id = "%s"', $id));
		return "ok";
	}
	public function update($id, $data) {
		DB::get()->query(sprintf('update libraries set name = "%s" where id = "%s"', $data->name, $id));
		return $this->show($id);
	}
	public function store($data) {
		DB::get()->query(sprintf('insert into libraries (name) VALUES ("%s")', $data->name));
		return $this->show(DB::get()->lastID());
	}
}