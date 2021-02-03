const express = require('express');
const router = express.Router();

function send(ws, action, data) {
  const payload = {
    "a": action,
    "t": Date.now(),
    "d": data
  };
  const json = JSON.stringify(payload);
  ws.send(json);
  console.log('WS --> %s', json);
}

function sendPing(ws) {
  send(ws, "ping", null);
}

function sendHeading(ws, title, body, icon) {
  send(ws, "heading", {
    "title": title,
    "body": body,
    "icon": icon
  });
}

function sendMultipleChoiceQuestion(ws, question, answers) {
  send(ws, "multipleChoiceQuestion", {
    "question": question,
    "answers": answers
  });
}

router.ws('/game', function(ws, req) {
  ws.on('message', function(msg) {
    console.log('WS <-- %s', msg);
  });
  sendPing(ws);
  // sendHeading(ws, "Welcome", "The game is loading, please wait...", "waiting")
  sendMultipleChoiceQuestion(ws, "What color is the sky?", [
    { id: 1, text: "Red" },
    { id: 2, text: "Green" },
    { id: 3, text: "Blue" },
    { id: 4, text: "Yellow" }
  ]);
});

module.exports = router;
