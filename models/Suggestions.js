var mongoose = require('mongoose');

var SuggestionSchema = new mongoose.Schema({
  description: String,
  link:        String,
  upvotes:     { type: Number, default: 0 },
  comments:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

SuggestionSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Suggestion', SuggestionSchema);
