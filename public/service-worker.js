const installEvent = () => {
	self.addEventListener("install", () => {
		console.warn("service worker installed");
	});
};
installEvent();

const activateEvent = () => {
	self.addEventListener("activate", () => {
		console.warn("service worker activated");
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
	const body = data.message;
	const icon = "/brand/logo.svg";
	const notificationOptions = {
		body: body,
		tag: "simple-push-notification-example",
		icon: icon,
	};

	return self.Notification.requestPermission().then((permission) => {
		if (permission === "granted") {
			return new self.Notification(title, notificationOptions);
		}
	});
});

self.addEventListener("activate", async () => {
	try {
		const applicationServerKey = "789tb8t798yb97yb8";
		const options = { applicationServerKey, userVisibleOnly: true };
		const subscription = await self.registration.pushManager.subscribe(
			options
		);
		postMessageToClient(subscription);
	} catch (err) {
		console.log("Failed to subscribe the user: ", err);
	}
});

function postMessageToClient(data) {
	clients.matchAll().then((clients) => {
		if (clients?.length) {
			clients[0].postMessage(data);
		}
	});
}
