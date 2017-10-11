var metadata = null;
var title = null;
var composer = null;
var live = null;

var last = {'title': null, 'composer': null, 'live': null};

var xhr = function(method, resource, data, callback) {
	var req = new XMLHttpRequest();

	req.responseType = 'json';

	req.addEventListener('load', function(ev) {
		callback === undefined || callback(req.response);
	});

	req.open(method, resource);
	if (data === undefined) {
		req.send();
	}
	else {
		req.setRequestHeader('Content-Type', 'application/json');
		req.send(JSON.stringify(data));
	}
};

var refresh = function() {
	xhr('get', '/metadata', null, function(data) {
		if (data['title'] !== last['title']) {
			title.value = data['title'];
			last = data;
		}

		if (data['composer'] !== last['composer']) {
			composer.value = data['composer'];
			last = data;
		}

		if (data['live'] !== last['live']) {
			live.checked = data['live'];
			last = data;
		}

		setTimeout(refresh, 2000);
	});
};

var send = function() {
	xhr('post', '/metadata', {'title': title.value, 'composer': composer.value, 'live': live.checked});
};

var load = function() {
	metadata = document.getElementById('metadata');

	title = document.getElementById('title');
	composer = document.getElementById('composer');
	live = document.getElementById('live');

	metadata.onsubmit = function(ev) {
		send();

		ev.preventDefault();
	};

	metadata.onreset = function(ev) {
		title.value = 'None';
		composer.value = 'None';
		live.checked = false;

		metadata.submit();

		ev.preventDefault();
	};

	refresh();
};

window.addEventListener('load', load, false);
