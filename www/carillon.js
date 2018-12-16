var playing = null;
var metadata = null;
var title = null;
var composer = null;
var vol = null;
var volwrap = null;
var voldown = null;
var volup = null;
var play = null;
var stream = null;

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

	setTimeout(update, 1000);
};

var load = function() {
	playing = document.getElementById('playing');
	metadata = document.getElementById('metadata');
	title = document.getElementById('title');
	composer = document.getElementById('composer');
	vol = document.getElementById('vol');
	volwrap = document.getElementById('volwrap');
	voldown = document.getElementById('voldown');
	volup = document.getElementById('volup');
	play = document.getElementById('play');
	stream = document.getElementById('stream');

	var player = new MediaElementPlayer(document.getElementById('stream'), {
		features: [],
		success: function(media, node, player) {
			stream = media;

			var volume = 0.5;

			var volupdate = function() {
				stream.volume = volume;
				vol.innerText = stream.volume.toFixed(1);
			};

			voldown.addEventListener('click', function() {
				volume -= 0.1;
				if (volume <= 0)
					volume = 0;

				volupdate();
			}, false);

			volup.addEventListener('click', function() {
				volume += 0.1;
				if (volume >= 1)
					volume = 1;

				volupdate();
			}, false);

			var playupdate = function() {
				if (stream.paused)
					play.innerText = 'Play';
				else
					play.innerText = 'Pause';
			};

			stream.addEventListener('play', function() {
				playupdate();
			}, false);

			stream.addEventListener('pause', function() {
				playupdate();
			}, false);

			play.addEventListener('click', function() {
				if (stream.paused)
					stream.play();
				else
					stream.pause();
			}, false);

			volwrap.style.display = 'initial';
			play.style.display = 'initial';
			metadata.style.display = 'initial';

			volupdate();
			playupdate();
			update();
		}
	});
};

window.addEventListener('load', load, false);
