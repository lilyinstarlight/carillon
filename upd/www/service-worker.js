const staticFiles = [
	// page
	'/',
	'/index.html',

	// service worker and progressive web app
	'/service-worker.js',
	'/manifest.json',

	// assets
	'/assets/carillon.js',
	'/assets/carillon.css',

	// icons
	'/icon.png',
	'/icons/carillon-96-any.png',
	'/icons/carillon-192-any.png',
	'/icons/carillon-512-any.png',
	'/icons/carillon-32.png',
	'/icons/carillon-64.png',
	'/icons/carillon-96.png',
	'/icons/carillon-128.png',
	'/icons/carillon-192.png',
	'/icons/carillon-256.png',
	'/icons/carillon-512.png',

	// cacheable endpoints
	'/api/metadata',

	// vendored assets
	'/vendor/09f52831-e1cf-48be-9c1e-2d1577e420b7.svg',
	'/vendor/1454a71d-cdbb-429c-8092-122f4493e0c7.woff',
	'/vendor/1c164451-034c-41f5-9542-390709016510.woff',
	'/vendor/25f577c3-f32b-4fbf-b684-3e7c1a76d1ea.woff',
	'/vendor/2ed49e17-92ad-4026-9ae6-d20f88f21840.ttf',
	'/vendor/363fd092-cd55-4bd1-bdc5-cfc9a7057517.eot',
	'/vendor/413d9688-00d4-47c4-bb55-656a0cd396e9.eot',
	'/vendor/59fa12c0-25c9-4c0c-bd1e-32204311d86d.eot',
	'/vendor/7062b4ff-265a-4366-b34f-443ec5cc2dad.ttf',
	'/vendor/70ac6679-cf48-4a0e-a909-d1e3bb4a1aa9.svg',
	'/vendor/853e2a9b-4057-42a5-ad7e-0762cda0b13c.svg',
	'/vendor/969cd675-2b4c-4baa-ada6-62bb7ace778f.svg',
	'/vendor/bb3aa0a7-2585-4e89-ad82-658fd561751a.eot',
	'/vendor/c4aef0d4-bfcf-4790-acf5-909881f411e8.woff',
	'/vendor/d5ea405c-2180-4ff0-bd51-3e19fb280be4.ttf',
	'/vendor/e741f29c-bc18-4343-bff3-db2465a0be3e.ttf',
	'/vendor/white-purple.png',
].map((path) => self.location.pathname.replace(/\/service-worker.js$/, '') + path);

self.addEventListener('install', (ev) => {
	ev.waitUntil((async () => {
		const cache = await caches.open('carillon-updater-static');
		await cache.addAll(staticFiles);
	})());
});

self.addEventListener('fetch', (ev) => {
	const url = new URL(ev.request.url);
	if (staticFiles.includes(url.pathname)) {
		ev.respondWith((async () => {
			return fetch(ev.request)
				.then(async (response) => {
					const cache = await caches.open('carillon-updater-static');
					cache.put(ev.request, response.clone());
					return response;
				})
				.catch(async () => {
					const cached = await caches.match(ev.request);
					return cached;
				});
		})());
	}
});
