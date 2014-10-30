var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body:       String,
  upvotes:    { type: Number, default: 0 },
  suggestion: { type: mongoose.Schema.Types.ObjectId, ref: 'Suggestion' }
});

mongoose.model('Comment', CommentSchema);
