const http = require("node:http");
const socket = require("socket.io");

const apiServer = require("./api");
const httpServer = http.createServer(apiServer);
const socketServer = socket(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const sockets = require("./sockets");

const PORT = 3000;
httpServer.listen(PORT);
console.log(`Server Listening in port ${PORT}`);

sockets.listen(socketServer);
