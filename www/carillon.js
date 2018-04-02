var playing = null;
var metadata = null;
var title = null;
var composer = null;
var vol = null;
var voldown = null;
var volup = null;
var play = null;
var stream = null;

var volume = 0.5;

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

var update = function() {
	xhr('get', 'details.json', null, function(data) {
		document.title = 'Clemson University Carillon - ' + data.title;

		if (data.live)
			playing.innerText = 'Now Playing (Live):'
		else
			playing.innerText = 'Now Playing:'

		title.innerText = data.title;
		composer.innerText = data.composer;
	});

	setTimeout(update, 2000);
};

var volupdate = function() {
	stream.volume = volume;
	vol.innerText = stream.volume.toFixed(1);
};

var load = function() {
	playing = document.getElementById('playing');
	metadata = document.getElementById('metadata');
	title = document.getElementById('title');
	composer = document.getElementById('composer');
	vol = document.getElementById('vol');
	voldown = document.getElementById('voldown');
	volup = document.getElementById('volup');
	play = document.getElementById('play');
	stream = document.getElementById('stream');

	stream.volume = 0.5;

	voldown.onclick = function() {
		volume -= 0.1;
		if (volume <= 0)
			volume = 0;

		volupdate();
	};

	volup.onclick = function() {
		volume += 0.1;
		if (volume >= 1)
			volume = 1;

		volupdate();
	};

	play.onclick = function() {
		if (stream.paused) {
			stream.play();
			play.innerText = 'Pause';
		}
		else {
			stream.pause();
			play.innerText = 'Play';
		}
	};

	metadata.style.display = 'initial';

	volupdate();
	update();
};

window.addEventListener('load', load, false);
