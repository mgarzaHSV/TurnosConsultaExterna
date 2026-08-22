const socket = io("http://172.18.1.12:3005", {
  transports: ["websocket", "polling"]
});
window.socket = socket;