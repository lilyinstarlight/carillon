var metadata = null;
var title = null;
var composer = null;
var live = null;
var feedback = null;

var last = {'title': null, 'composer': null, 'live': null};
var timeout = null;

var xhr = (method, resource, data, callback) => {
	var req = new XMLHttpRequest();

	req.responseType = 'json';

	req.addEventListener('load', (ev) => {
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

var refresh = () => {
	xhr('get', 'metadata', null, (data) => {
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

var send = () => {
	xhr('post', 'metadata', {'title': title.value, 'composer': composer.value, 'live': live.checked}, (response) => {
		feedback.style.display = 'initial';
		if (timeout)
			clearTimeout(timeout);
		timeout = setTimeout(() => {
			feedback.style.display = 'none';
			timeout = null;
		}, 3000);
	});
};

var load = () => {
	metadata = document.getElementById('metadata');

	title = document.getElementById('title');
	composer = document.getElementById('composer');
	live = document.getElementById('live');

	feedback = document.getElementById('feedback');

	metadata.onsubmit = (ev) => {
		send();

		ev.preventDefault();
	};

	metadata.onreset = (ev) => {
		title.value = 'None';
		composer.value = 'None';
		live.checked = false;

		send();

		ev.preventDefault();
	};

	refresh();
};

window.addEventListener('load', load, false);
