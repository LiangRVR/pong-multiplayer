const server = require("node:http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://127.0.0.1:3001",
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

server.listen(PORT);
console.log(`Server Listening in port ${PORT}`);

let readyPlayerCount = 0;

io.on("connection", (socket) => {
  socket.on("ready", () => {
    console.log("Player ready ", socket.id);
    readyPlayerCount++;
    if (readyPlayerCount === 2) {
      console.log(readyPlayerCount);
      io.emit("startGame", socket.id);
    }
  });
});
