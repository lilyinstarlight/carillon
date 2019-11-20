var metadata = null;
var title = null;
var composer = null;
var live = null;
var feedback = null;

var last = {'title': null, 'composer': null, 'live': null};
var timeout = null;

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
	xhr('get', 'metadata', null, function(data) {
		if (data['title'] !== last['title']) {
			title.value = data['title'];
			last['title'] = data['title'];
		}

		if (data['composer'] !== last['composer']) {
			composer.value = data['composer'];
			last['composer'] = data['composer'];
		}

		if (data['live'] !== last['live']) {
			live.checked = data['live'];
			last['live'] = data['live'];
		}

		setTimeout(refresh, 1000);
	});
};

var send = function() {
	xhr('post', 'metadata', {'title': title.value, 'composer': composer.value, 'live': live.checked}, function(response) {
		feedback.style.display = 'initial';
		if (timeout)
			clearTimeout(timeout);
		timeout = setTimeout(function() {
			feedback.style.display = 'none';
			timeout = null;
		}, 3000);
	});
};

var load = function() {
	metadata = document.getElementById('metadata');

	title = document.getElementById('title');
	composer = document.getElementById('composer');
	live = document.getElementById('live');

	feedback = document.getElementById('feedback');

	metadata.onsubmit = function(ev) {
		send();

		ev.preventDefault();
	};

	metadata.onreset = function(ev) {
		title.value = 'None';
		composer.value = 'None';
		live.checked = false;

		send();

		ev.preventDefault();
	};

	refresh();
};

window.addEventListener('load', load, false);
