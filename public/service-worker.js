// initialization and event listeners for service worker

const cacheAssets = ["/"];

const installEvent = () => {
	self.addEventListener("install", (event) => {
		event.waitUntil(
			caches
				.open(cacheName)
				.then((cache) => {
					cache.addAll(cacheAssets);
				})
				.then(() => self.skipWaiting())
		);
	});
};
installEvent();

const urlBase64ToUint8Array = (base64String) => {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, "+")
		.replace(/_/g, "/");
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};

const fetchVapid = async () => {
	const response = await fetch("/api/vapid");
	const vapidPublicKey = await response.json();
	return vapidPublicKey.publicVAPID;
};

const activateEvent = () => {
	self.addEventListener("activate", async (event) => {
		event.waitUntil(clients.claim());
		const vapid = await fetchVapid();

		const subscription = await self.registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(vapid),
		});

		self.clients.matchAll().then((clients) => {
			for (const client of clients) {
				client.postMessage({
					subscription: JSON.stringify(subscription),
				});
			}
		});

		event.waitUntil(
			caches.keys().then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cache) => {
						if (cache !== cacheName) {
							return caches.delete(cache);
						}
					})
				);
			})
		);
	});
};

activateEvent();

// For notifications
self.addEventListener("push", (event) => {
	const data = event.data.json();
	const title = data.title;
	const body = data.body;
	const icon = "/brand/logo.svg";
	const image = data.image;
	const notificationOptions = {
		body: body,
		tag: "simple-push-notification-example",
		icon: icon,
		image: image,
	};

	event.waitUntil(
		self.registration.showNotification(title, notificationOptions)
	);
});

// Caching

const cacheName = "v1";
const acceptedHostname = "firebasestorage.googleapis.com";

self.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);
	const hostname = url.hostname;

	// Check if the request is for an image and if the hostname is accepted
	if (
		event.request.destination !== "image" ||
		!acceptedHostname.includes(hostname)
	)
		return;

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				const resClone = response.clone();
				caches.open(cacheName).then((cache) => {
					cache.put(event.request, resClone);
				});
				return response;
			})
			.catch((err) => {
				return caches.match(event.request).then((response) => {
					return response || Promise.reject(err);
				});
			})
	);
});
