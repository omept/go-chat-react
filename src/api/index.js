// api/index.js
let websocket = (newMessage, jwt) => {
  consoleLogger("connecting")
  var socket = new WebSocket(`ws://localhost:9010/v1/ws?jwt=${jwt}`);

  socket.onopen = () => {
    consoleLogger("Successfully Connected");
  }

  socket.onmessage = (msg) => {
    consoleLogger("Message from WebSocket: ", msg);
    newMessage(msg);
  }

  socket.onclose = (event) => {
    consoleLogger("Socket Closed Connection: ", event)
  }

  socket.onerror = (error) => {
    consoleLogger("Socket Error: ", error)
  }
  return socket
};

const baseUrl = "http://localhost:9010"

let consoleLogger = function (...args) {
  console.log(...args)
}

export { websocket, baseUrl, consoleLogger };
