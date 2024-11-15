// initialization and event listeners for service worker

const cacheAssets = ["/"];

const installEvent = () => {
	// self.addEventListener("install", (event) => {
	// 	event.waitUntil(
	// 		caches
	// 			.open(cacheName)
	// 			.then((cache) => {
	// 				cache.addAll(cacheAssets);
	// 			})
	// 			.then(() => self.skipWaiting()),
	// 	);
	// });
};
installEvent();

const urlBase64ToUint8Array = (base64String) => {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
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
	});
};

activateEvent();

// For notifications
self.addEventListener("push", (event) => {
	const { title, body, image, url } = event.data.json();
	const notificationOptions = {
		body,
		tag: "cluster",
		icon: "/brand/logo.svg",
		image,
		data: { url },
	};

	event.waitUntil(
		self.registration.showNotification(title, notificationOptions),
	);
});

// // Caching
// const cacheName = "image-cache-v1";
// const CACHE_EXPIRATION = 30 * 1000; // 30 seconds in milliseconds

// // Cleanup expired cache entries
// const cleanupCache = async () => {
// 	const cache = await caches.open(cacheName);
// 	const entries = await cache.keys();
// 	const now = Date.now();

// 	for (const request of entries) {
// 		const response = await cache.match(request);
// 		const metadata = await response.clone().headers.get("cache-timestamp");

// 		if (metadata && now - Number.parseInt(metadata) > CACHE_EXPIRATION) {
// 			await cache.delete(request);
// 		}
// 	}
// };

// self.addEventListener("fetch", (event) => {
// 	// Only handle image requests
// 	if (!event.request.destination.includes("image")) return;

// 	event.respondWith(
// 		(async () => {
// 			const cache = await caches.open(cacheName);

// 			// Try cache first
// 			const cachedResponse = await cache.match(event.request);
// 			if (cachedResponse) {
// 				const timestamp = cachedResponse.headers.get("cache-timestamp");
// 				if (
// 					timestamp &&
// 					Date.now() - Number.parseInt(timestamp) <= CACHE_EXPIRATION
// 				) {
// 					return cachedResponse;
// 				}
// 				// Remove expired entry
// 				await cache.delete(event.request);
// 			}

// 			// Fetch and cache
// 			try {
// 				const response = await fetch(event.request);
// 				const clonedResponse = response.clone();

// 				// Add timestamp header
// 				const headers = new Headers(clonedResponse.headers);
// 				headers.append("cache-timestamp", Date.now().toString());

// 				const cachedResponse = new Response(await clonedResponse.blob(), {
// 					headers: headers,
// 					status: clonedResponse.status,
// 					statusText: clonedResponse.statusText,
// 				});

// 				await cache.put(event.request, cachedResponse);
// 				await cleanupCache();

// 				return response;
// 			} catch (err) {
// 				return Promise.reject(err);
// 			}
// 		})(),
// 	);
// });

// unregister
