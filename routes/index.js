var mongoose = require('mongoose');

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGOLAB_URI);
} else {
  mongoose.connect('mongodb://localhost/anonymous_suggestions');
}

require('../models/Suggestions');
require('../models/Comments');

var express    = require('express');
var router     = express.Router();
var Suggestion = mongoose.model('Suggestion');
var Comment    = mongoose.model('Comment');
var bayeux     = require('../bayeux');

router.get('/', function(req, res) {
  res.render('index', { title: 'Anonymous Suggestions' });
});

router.get('/suggestions', function(req, res, next) {
  Suggestion.find(function(err, suggestions) {
    if (err) { return next(err); }

    res.json(suggestions);
  });
});

router.post('/suggestions', function(req, res, next) {
  var suggestion = new Suggestion(req.body);

  suggestion.save(function(err, suggestion) {
    if (err) { return next(err); }
    bayeux.getClient().publish('/testQueue', 'new suggestion');
    res.json(suggestion);
  });
});

router.param('suggestion', function(req, res, next, id) {
  var query = Suggestion.findById(id);

  query.exec(function (err, suggestion){
    if (err)         { return next(err); }
    if (!suggestion) { return next(new Error("Can't find suggestion")); }

    req.suggestion = suggestion;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err)      { return next(err); }
    if (!comment) { return next(new Error("Can't find comment")); }

    req.comment = comment;
    return next();
  });
});

router.get('/suggestions/:suggestion', function(req, res, next) {
  req.suggestion.populate('comments', function(err, suggestion) {
    res.json(suggestion);
  });
});

router.put('/suggestions/:suggestion/upvote', function(req, res, next) {
  req.suggestion.upvote(function(err, suggestion) {
    if (err) { return next(err); }

    res.json(suggestion);
  });
});

router.put('/suggestions/:suggestion/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, suggestion) {
    if (err) { return next(err); }

    res.json(req.comment);
  });
});

router.post('/suggestions/:suggestion/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.suggestion = req.suggestion;

  comment.save(function(err, comment) {
    if(err) { return next(err); }

    req.suggestion.comments.push(comment);

    req.suggestion.save(function(err, suggestion) {
      if(err) { return next(err); }

      res.json(comment);
    });
  });
});

module.exports = router;
