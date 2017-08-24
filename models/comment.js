// Require mongoose
const mongoose = require("mongoose");

// Create a Schema class with mongoose
const Schema = mongoose.Schema;

// Create a NoteSchema with the Schema class
const CommentSchema = new Schema({
  // title: a string
  name: {
    type: String
  },
  comment:{
    type:String
  },
  article:{
    type: Schema.Types.ObjectId,
    ref:"Article"
  }

});

// Make a Comment model with the CommentSchema
const Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;
