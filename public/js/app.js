var App = {
	onRouteChange: function() {
		App.hashparts = location.hash.substr(1).split('/');
		var page = App.hashparts[0];
		if (page == '') page = 'books';
		var $page = (page == '') ? $('.page.default') : $('.page.page_' + page);
		if ($page.length == 0) {
			console.log('there are no page "' + page + '" exists');
			page = '404';
		}
		// run controller
		var ctrl = page + 'Ctrl';
		if (window[ctrl] != undefined) {
			window[ctrl].apply($page);
		}
		App.showPage($page);
	},
	showPage: function($page) {
		$('.page').hide();
		$page.addClass('animated zoomIn').show();
	}
};
/**
 * BOOKS CONTROLLER, keeps data in the .data property
 */
var booksCtrl = function() {
	$.ajax({
		url: 'api/books',
		method: 'get',
		dataType: 'json',
		success: function(result) {
			booksCtrl.data = result;
			booksCtrl.render();
		}
	});
};

booksCtrl.render = function() {
	var tbody = $('#bookstable');
	tbody.html('');
	var data = booksCtrl.data;
	if (data.length == 0) {
		tbody.append($('<tr>').append($('<td colspan="3">there are no entries</td>')));
	} else 
	for (var i in data) {
		var row = data[i];
		var tr = $('<tr>');
		tr.append($('<td>').html(row.id));
		tr.append($('<td>').html(row.name));
		tr.append($('<td>').html(row.author));
		tr.append($('<td>').html(row.library));
		tr.append($('<td>').html('<a href="#book/' + row.id + '">view/edit</a>'));
		var id = row.id;
		var deleteControl = $('<a>delete</a>').click((function(id) {
			return function() {
				if (window.confirm("The book will be deleted")) {
					booksCtrl.delete(id);
				}
			}
		})(row.id));
		tr.append($('<td>').append(deleteControl));
		tbody.append(tr);
	}
};

booksCtrl.delete = function(id) {
	$.ajax({
		url: 'api/books/' + id,
		method: 'delete',
		dataType: 'json',
		success: function(result) {
			if (result == 'ok') {
				// remove from data and rerender
				for (var i in booksCtrl.data) {
					if (booksCtrl.data[i].id == id) {
						booksCtrl.data.splice(i, 1);
						break;
					}
				}
				booksCtrl.render();
			}
		}
	});
}

/*
 * BOOK Controller
 */
 var bookCtrl = function() {
 	if (App.hashparts[1] == undefined) {
 		bookCtrl.data = {
 			name: '',
 			library_id: '',
 			author: ''
 		}
 	} else {
		if (isNaN(App.hashparts[1])) console.log('Invalid request');
		 	$.ajax({
		 		url: 'api/books/' + App.hashparts[1],
		 		method: 'get',
		 		success: function(result)  {
		 			bookCtrl.data = result;
		 			bookCtrl.render();
		 		}
		 	});
 	}
 	// load the libraries
 	$.ajax({
 		url: 'api/libs',
 		method: 'get',
 		success: function(result) {
 			bookCtrl.libraries = result;
 			bookCtrl.render();
 		}
 	});
 }
bookCtrl.render = function() {
	var form = $('#bookform');
	form.find('#bookname').val(bookCtrl.data.name);
	form.find('#bookauthor').val(bookCtrl.data.author);
	var lib = form.find('#booklib');
	var libSelect = form.find('#booklibselect');
	lib.val(bookCtrl.data.library);
	// disable input if the library list is not loaded yet
	if (bookCtrl.libraries == undefined) {
		lib.show();
		libSelect.hide();
		lib.prop('disabled', bookCtrl.libraries == undefined);	
	} else {
		lib.hide();
		libSelect.html('');
		for (var i in bookCtrl.libraries) {
			libSelect.append($('<option>').prop('value', bookCtrl.libraries[i].id).html(bookCtrl.libraries[i].name));
		}
		libSelect.val(isNaN(parseInt(bookCtrl.data.library_id)) ? bookCtrl.libraries[0].id : bookCtrl.data.library_id);
		libSelect.show();
	}
	
};

bookCtrl.backBinding = function() {
	var form = $('#bookform');
	bookCtrl.data.name = form.find('#bookname').val();
	bookCtrl.data.author = form.find('#bookauthor').val();
	bookCtrl.data.library_id = form.find('#booklibselect').val();
};

bookCtrl.send = function() {
	bookCtrl.backBinding();
	var creatingMode = isNaN(bookCtrl.data.id);
	$.ajax({
 		url: creatingMode ? 'api/books' : 'api/books/' + bookCtrl.data.id,
 		method: creatingMode ? 'post' : 'put',
 		data: bookCtrl.data,
 		success: function(result)  {
 			bookCtrl.data = result;
 			Notifications.show('Updated successfully');
 		}
 	});
};


var libraryCtrl = function() {
	if (App.hashparts[1] == undefined) {
 		libraryCtrl.data = {
 			name: ''
 		}
 	} else {
		if (isNaN(App.hashparts[1])) console.log('Invalid request');
		 	$.ajax({
		 		url: 'api/libs/' + App.hashparts[1],
		 		method: 'get',
		 		success: function(result)  {
		 			libraryCtrl.data = result;
		 			libraryCtrl.render();
		 		}
		 	});
 	}
};
libraryCtrl.render = function() {
	var form = $('#libform');
	form.find('#libname').val(libraryCtrl.data.name);
};

libraryCtrl.backBinding = function() {
	var form = $('#libform');
	libraryCtrl.data.name = form.find('#libname').val();
};

libraryCtrl.send = function() {
	libraryCtrl.backBinding();
	var creatingMode = isNaN(libraryCtrl.data.id);
	$.ajax({
 		url: creatingMode ? 'api/libs' : 'api/libs/' + libraryCtrl.data.id,
 		method: creatingMode ? 'post' : 'put',
 		data: libraryCtrl.data,
 		success: function(result)  {
 			libraryCtrl.data = result;
 			Notifications.show('Updated successfully');
 		}
 	});
};
/**
 * Libraries controller
 */
var librariesCtrl = function() {
	$.ajax({
		url: 'api/libs',
		method: 'get',
		dataType: 'json',
		success: function(result) {
			librariesCtrl.data = result;
			librariesCtrl.render();
		}
	});
};

librariesCtrl.render = function() {
	var tbody = $('#libstable');
	tbody.html('');
	var data = librariesCtrl.data;
	if (data.length == 0) {
		tbody.append($('<tr>').append($('<td colspan="2">there are no entries</td>')));
	} else 
	for (var i in data) {
		var row = data[i];
		var tr = $('<tr>');
		tr.append($('<td>').html(row.id));
		tr.append($('<td>').html(row.name));
		tr.append($('<td>').html('<a href="#library/' + row.id + '">view/edit</a>'));
		var id = row.id;
		var deleteControl = $('<a>delete</a>').click((function(id) {
			return function() {
				if (window.confirm("The library will be deleted")) {
					librariesCtrl.delete(id);
				}
			}
		})(row.id));
		tr.append($('<td>').append(deleteControl));
		tbody.append(tr);
	}
};

librariesCtrl.delete = function(id) {
	$.ajax({
		url: 'api/libs/' + id,
		method: 'delete',
		dataType: 'json',
		success: function(result) {
			if (result == 'ok') {
				// remove from data and rerender
				for (var i in librariesCtrl.data) {
					if (librariesCtrl.data[i].id == id) {
						librariesCtrl.data.splice(i, 1);
						break;
					}
				}
				librariesCtrl.render();
			}
		}
	});
}

$(function() {
	$(window).on('hashchange', App.onRouteChange);
	App.onRouteChange();
	$(document).ajaxError(function(e, response) {
		Errors.show(response.responseJSON.message);
	});
});

var Notifications = {
	timerID: null,
	show: function(message) {
		if (Notifications.timerID) {
			clearTimeout(Notifications.timerID);
		}
		$('#notifications p').html(message);
		$('#notifications').fadeIn();
		Notifications.timerID = setTimeout(function() {
			$('#notifications').fadeOut();
		}, 2000);

	}
};

var Errors = {
	timerID: null,
	log: [],
	show: function(message) {
		if (Errors.timerID) {
			clearTimeout(Errors.timerID);
		}
		Errors.log.push(message);
		$('#errors p').html(message);
		$('#errors').fadeIn();
		Errors.timerID = setTimeout(function() {
			$('#errors').fadeOut();
		}, 2000);

	}
};

