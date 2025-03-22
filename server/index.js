const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");
const { log } = require("console");
const uuidv4 = require("uuid").v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const PORT = 8000;

const connections = {};
const users = {};
const broadcast = () => {
	Object.keys(connections).map((uuid) => {
		const connection = connections[uuid];
		const user = users[uuid];
		connection.send(JSON.stringify(user));
	});
};

const handleMessage = (bytes, uuid) => {
	const message = JSON.parse(bytes.toString());
	const user = users[uuid];
	user.state = message;
	console.log(message);
};

const handleClose = (uuid) => {};

wsServer.on("connection", (connection, request) => {
	//log("New connection established");

	// ws://localhost:8000?username=Alex
	const { username } = url.parse(request.url, true).query;
	const uuid = uuidv4();
	log(username);
	log(uuid);

	connections[uuid] = connection;
	users[uuid] = { username, state: {} };

	connection.on("message", (message) => handleMessage(message, uuid));
	connection.on("close", () => handleClose(uuid));
});
server.listen(PORT, () => {
	log(`Server is running on port ${PORT}`);
});
