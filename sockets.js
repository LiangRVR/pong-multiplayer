let readyPlayerCount = 0;

const listen = (io) => {
  io.on("connection", (socket) => {
    socket.on("ready", () => {
      console.log("Player ready ", socket.id);
      readyPlayerCount++;
      if (readyPlayerCount === 2) {
        io.emit("startGame", socket.id);
      }
    });

    socket.on("paddleMove", (paddleData) => {
      socket.broadcast.emit("paddleMove", paddleData);
    });

    socket.on("ballMove", (ballData) => {
      socket.broadcast.emit("ballMove", ballData);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} disconnected because ${reason}`);
      readyPlayerCount--;
    });
  });
};

module.exports = {
  listen,
};
