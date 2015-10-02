<?php
// will use "fat" controllers w/o models to keep code compact
class Books {
	static public function filterData($data) {
		return (object)[
			'name'   => htmlspecialchars($data['name']),
			'author' => htmlspecialchars($data['author']),
			'library_id' => filter_var($data['library_id'], FILTER_SANITIZE_NUMBER_INT)
		];
	}
	public function index() {
		return DB::get()->fetchAll('select books.*, libraries.name as library from books join libraries ON (libraries.id = books.library_id)');
	}
	public function show($id) {
		return DB::get()->singleRow(sprintf('select books.*, libraries.name as library from books join libraries ON (libraries.id = books.library_id) where books.id = "%s"', $id));
	}
	public function destroy($id) {
		DB::get()->query(sprintf('delete from books where id = "%s"', $id));
		return "ok";
	}
	public function update($id, $data) {
		DB::get()->query(sprintf('update books set name = "%s", author="%s", library_id="%s" where id = "%s"', $data->name, $data->author, $data->library_id, $id));
		return $this->show($id);
	}
	public function store($data) {
		DB::get()->query(sprintf('insert into books (name, author, library_id) VALUES ("%s", "%s", "%s")', $data->name, $data->author, $data->library_id));
		return $this->show(DB::get()->lastID());
	}
}