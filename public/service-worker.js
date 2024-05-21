const installEvent = () => {
	self.addEventListener("install", () => {
		console.warn("service worker installed");
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

const activateEvent = () => {
	self.addEventListener("activate", async (event) => {
		event.waitUntil(clients.claim());
		console.log("service worker activated");

		const subscription = await self.registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				"BFjRmLs2pxASc4SWPiDH7JUhd7VpkgLfdjSpUsRCxi9rOZ-C6BsdOEYC54F7AMlic5Pk9pqHWhV60mce_aCS9Z4"
			),
		});
		self.clients.matchAll().then((clients) => {
			for (const client of clients) {
				client.postMessage({
					subscription: JSON.stringify(subscription),
				});
			}
		});
	});
};
activateEvent();

const cacheName = "v1";

const cacheClone = async (e) => {
	const res = await fetch(e.request);
	const resClone = res.clone();

	const cache = await caches.open(cacheName);
	await cache.put(e.request, resClone);
	return res;
};

// For caching
const fetchEvent = () => {
	self.addEventListener("fetch", (e) => {
		if (e.request.method === "GET") {
			e.respondWith(
				cacheClone(e)
					.catch(() => caches.match(e.request))
					.then((res) => res)
			);
		} else {
			e.respondWith(fetch(e.request));
		}
	});
};

fetchEvent();

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
