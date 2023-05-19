const chatController = require("../controllers/chat");

function setupSocket(server) {
    const io = require('socket.io')(server, {
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"]
        }
      });
    
    const onConnection = (socket) => {
      chatController(io, socket);
    }
    
    io.on("connection", onConnection);
}

module.exports = setupSocket;