self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log("SW installed");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  console.log("SW activated");
});

self.addEventListener("fetch", () => {
  // no caching (good for admin)
});