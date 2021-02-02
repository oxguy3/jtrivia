var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/game');
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'jTrivia' });
});

router.ws('/game/ws', function(ws, req) {
  ws.on('message', function(msg) {
    console.log('received: %s', msg);
  });

  const payload = {
    "type": "ping",
    "time": Date.now(),
    "data": null
  };
  ws.send(JSON.stringify(payload));
});

module.exports = router;
