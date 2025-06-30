// File: server.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("set username", (username) => {
    socket.username = username;

    console.log(`${username} has joined the chat`);
    // Notify all clients about the new user
    socket.broadcast.emit("chat message", {
      username: "System",
      message: `${username} has joined the chat`,
    });

    // Also send a welcome message to the new user
    socket.emit("chat message", {
      username: "System",
      message: `Welcome to the chat ${username}!`,
    });
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("chat message", {
        username: "System",
        message: `${socket.username} left the chat`,
      });
    }
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
