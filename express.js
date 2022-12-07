const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", (ws) => {
  onConnection(ws);
  ws.on("message", (message) => {
    // wss.clients();
    onMessage(message, ws);
  });
  ws.on("error", (error) => {
    OnError(error);
  });
  ws.on("close", (ws) => {
    onClose();
  });
});

const onConnection = function (ws) {
  console.log("=============onConnection==>");
};

const onMessage = function (message, ws) {
  wss.clients.forEach((client) => {
    console.log("=============onMessage  clients  ==>", client);
    if (client != ws) {
      client.send(createMessage(message.content, true, message.sender));
    }
  });
  console.log("=============onMessage==>", message);
};

const OnError = function (ws) {
  console.log("=============OnError==>", ws);
};

const onClose = function () {
  console.log("=============onClose==>");
};
