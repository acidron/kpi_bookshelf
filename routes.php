<?php
class Routes {
	static function getRoutes() {	
		$routes = [
			['get:books',function() {
				return (new Books)->index();
			}],
			['get:books\/(?<id>\d+)', function($params) {
				return (new Books)->show($params['id']);
			}],
			['post:books', function() {
				return (new Books)->store(Books::filterData($_REQUEST));
			}],
			['put:books\/(?<id>\d+)', function($params) {
				return (new Books)->update($params['id'], Books::filterData($_REQUEST));
			}],
			['delete:books\/(?<id>\d+)', function($params) {
				return (new Books)->destroy($params['id']);
			}],
			['get:libs', function() {
				return (new Libraries)->index();
			}],
			['get:libs\/(?<id>\d+)', function($params) {
				return (new Libraries)->show($params['id']);
			}],
			['post:libs', function() {
				return (new Libraries)->store(Libraries::filterData($_REQUEST));
			}],
			['put:libs\/(?<id>\d+)', function($params) {
				return (new Libraries)->update($params['id'], Libraries::filterData($_REQUEST));
			}],
			['delete:libs\/(?<id>\d+)', function($params) {
				return (new Libraries)->destroy($params['id']);
			}],
		];
		return $routes;
	}
}
?>