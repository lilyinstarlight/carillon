var playing = null;
var metadata = null;
var title = null;
var composer = null;
var vol = null;
var volwrap = null;
var voldown = null;
var volup = null;
var play = null;
var playinfo = null;
var playarrow = null;
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

var notify = function(title) {
	if (document.hasFocus())
		return;

	document.title = title;

	if (Notification.permission === 'granted')
		var notification = new Notification(title);
};

if (Notification.permission !== 'granted' && Notification.permission !== 'denied')
	Notification.requestPermission();

var update = function() {
	xhr('get', 'stream/metadata.json', null, function(data) {
		var new_title;

		new_title = 'CU Carillon - ' + data.title + (data.live ? ' (Live)' : '');

		if (document.title !== new_title) {
			document.title = new_title;
			notify(new_title);
		}

		playing.innerText = data.live ? 'Now Playing (Live):' : 'Now Playing:';

		title.innerText = data.title;
		composer.innerText = data.composer;

		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: data.title,
				artist: data.composer,
				album: data.live ? 'CU Carillon (Live)' : 'CU Carillon',
				artwork: [
					{ src: 'icon.png', sizes: '1024x1024', type: 'image/png' },
				]
			});
		}
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
	playinfo = document.getElementById('playinfo');
	playarrow = document.getElementById('playarrow');
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

			voldown.addEventListener('click', function(ev) {
				volume -= 0.1;
				if (volume <= 0)
					volume = 0;

				volupdate();

				ev.preventDefault();
			}, false);

			volup.addEventListener('click', function(ev) {
				volume += 0.1;
				if (volume >= 1)
					volume = 1;

				volupdate();

				ev.preventDefault();
			}, false);

			var playupdate = function() {
				if (stream.paused) {
					play.innerText = 'Play';
				}
				else {
					if (playinfo.style.display !== 'none')
						playinfo.style.display = 'none';
					if (playarrow.style.display !== 'none')
						playarrow.style.display = 'none';

					play.innerText = 'Pause';
				}
			};

			stream.addEventListener('play', function() {
				playupdate();
			}, false);

			stream.addEventListener('pause', function() {
				playupdate();
			}, false);

			play.addEventListener('click', function(ev) {
				if (stream.paused)
					stream.play();
				else
					stream.pause();

				ev.preventDefault();
			}, false);

			volwrap.style.display = 'initial';
			play.style.display = 'initial';
			if (stream.paused) {
				playinfo.style.display = 'initial';
				playarrow.style.display = 'initial';
			}
			metadata.style.display = 'initial';

			volupdate();
			playupdate();
			update();
		}
	});
};

window.addEventListener('load', load, false);
