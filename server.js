const server = require("node:http").createServer();
const io = require("socket.io")(server);

const PORT = 3000;

server.listen(PORT);
console.log(`Server Listening in port ${PORT}`);

io.on('connection', (socket)=>{
    console.log('user connected')
})
