/** @format */

const http = require("http");
const app = require("./app");
const { initWebSocket } = require("./websocket");

const server = http.createServer(app);

initWebSocket(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
