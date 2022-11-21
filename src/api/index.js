// api/index.js
let websocket = (newMessage, jwt) => {
  console.log("connecting")
  var socket = new WebSocket(`ws://localhost:9010/v1/ws?jwt=${jwt}`);

  socket.onopen = () => {
    console.log("Successfully Connected");
  }

  socket.onmessage = (msg) => {
    console.log("Message from WebSocket: ", msg);
    newMessage(msg);
  }

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event)
  }

  socket.onerror = (error) => {
    console.log("Socket Error: ", error)
  }
  return socket
};

const baseUrl = "http://localhost:9010"


export { websocket, baseUrl };
