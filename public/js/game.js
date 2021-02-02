const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
const socketUrl = socketProtocol + '//' + window.location.hostname + ':' + window.location.port + '/game/ws'
const ws = new WebSocket(socketUrl);

function send(type, data) {
  let payload = {
    "type": type,
    "time": Date.now(),
    "data": data
  };
  ws.send(JSON.stringify(payload));
}

function pong() {
  send("pong", null);
}

ws.onopen = function (event) {
  console.log("Connected!");
  //ws.send("Here's some text that the server is urgently awaiting!");
};

ws.onmessage = function(event) {
  var text = "";
  var msg = JSON.parse(event.data);
  var time = new Date(msg.time);
  var timeStr = time.toLocaleTimeString();

  switch(msg.type) {
    case "ping":
      pong();
      break;
    default:
      console.error("Unknown message type: %s", msg.type);
      break;
  }
};
