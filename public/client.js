const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

const username = prompt("Enter your username") || "Anonymous";

socket.on("connect", function () {
  socket.emit("set username", username);

  const item = document.createElement("li");
  item.textContent = `You connected!`;
  messages.appendChild(item);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", {
      username,
      message: input.value,
    });
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  const item = document.createElement("li");

  if (msg.username === "System") {
    item.classList.add("system-message");
    item.textContent = msg.message;
  } else {
    item.textContent = msg.username + ": " + msg.message;
  }

  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
