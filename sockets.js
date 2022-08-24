let readyPlayerCount = 0;
let currentRooms = {}; //{'roomName': [socketId,socketId]}

const findAnAvailableRoom = () => {
  let roomName = "room";
  /* Return a name of an available room, if it does`nt exist it wil be created*/
  for (const room in currentRooms) {
    if (currentRooms[room].length < 2) {
      return room;
    }
  }

  roomName = roomName + Object.keys(currentRooms).length;
  currentRooms[roomName] = [];
  return roomName;
};

const getSocketIdRoomName = (socket) => {
  return [...socket.rooms][1];
};

const leaveSocketFromRoom = (socket) => {
  const socketRoom = getSocketIdRoomName(socket);
  socket.leave(socketRoom);
  currentRooms[socketRoom] = currentRooms[socketRoom].filter(
    (socketId) => socketId !== socket.id
  );
};



const listen = (io) => {
  const pongNamespace = io.of("/pong");
  pongNamespace.on("connection", (socket) => {
    socket.on("ready", async () => {
      console.log("Player ready ", socket.id);

      roomName = findAnAvailableRoom();
      socket.join(roomName);
      currentRooms[roomName].push(socket.id);

      console.log(`Player ${socket.id} added to ${roomName}`);

      const readyPlayersInRoom = currentRooms[roomName].length;
      console.log(
        `There are ready ${readyPlayersInRoom} players in ${roomName}`
      );

      if (readyPlayersInRoom === 2) {
        console.log(`${roomName} is ready`);
        pongNamespace.in(roomName).emit("startGame", socket.id);
      }
    });

    socket.on("paddleMove", (paddleData) => {
      const socketRoom = getSocketIdRoomName(socket);
      socket.to(socketRoom).emit("paddleMove", paddleData);
    });

    socket.on("ballMove", (ballData) => {
      const socketRoom = getSocketIdRoomName(socket);
      socket.to(socketRoom).emit("ballMove", ballData);
    });

    socket.on('disconnecting', (reason)=>{
      leaveSocketFromRoom(socket);
    })

    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} disconnected because ${reason}`);
    });
  });
};

module.exports = {
  listen,
};
