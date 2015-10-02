<?php
/**
 * nano-cms for KPI test task
 * (c) A.V. Nakhabov 2015
 */
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 'On');
spl_autoload_register(function ($class) {
	require_once '../../controllers/' . $class . '.php';
});
require_once '../../db/db.php';

$request = substr(str_replace(dirname($_SERVER['SCRIPT_NAME']), '', $_SERVER['REQUEST_URI']), 1);

switch($_SERVER['REQUEST_METHOD']) {
	case 'POST':   $request = 'post:'.$request; break;
	case 'PUT':    
		$request = 'put:'.$request; 
		parse_str(file_get_contents('php://input'), $_REQUEST);
		break;
	case 'DELETE': $request = 'delete:'.$request; break;
	default: $request = 'get:'.$request; break;
}
try {
	require '../../routes.php';
	$routes = Routes::getRoutes();
	foreach ($routes as $route) {
		if (preg_match('/^'.$route[0].'$/', $request, $matches)) {
			$result = call_user_func($route[1], $matches);
			break;
		}
	}
	header('Content-Type: application/json');
	echo json_encode($result);
} catch (Exception $e) {
	header('HTTP/1.1 403 Forbidden');
	header('Content-Type: application/json');
	echo json_encode(['message' => $e->getMessage()]);
}
?>