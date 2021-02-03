const express = require('express');
const createError = require('http-errors');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/game/create');
});

function makeId(length) {
   var result           = '';
   var characters       = 'abcdefghijklmnopqrstuvwxyz';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

router.get('/game/create', function(req, res, next) {
  // generate new IDs until we get one that isn't in use
  let newId = "";
  do {
    newId = makeId(4);
  } while (typeof req.app.activeGames[newId] !== 'undefined')

  req.app.activeGames[newId] = {};
  res.redirect('/game/'+newId);
});

router.get('/game/:gameId([a-z]{4})', function(req, res, next) {
  if (typeof req.app.activeGames[req.params['gameId']] == 'undefined') {
    next(createError(404));
    return;
  }
  res.render('game', {
    title: 'jTrivia',
    gameId: req.params['gameId'],
    game: req.app.activeGames[req.params['gameId']]
  });
});

module.exports = router;
