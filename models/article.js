// Require mongoose
const mongoose = require("mongoose");

// Create a Schema class with mongoose
const Schema = mongoose.Schema;

// Create a NoteSchema with the Schema class
const ArticleSchema = new Schema({
    // title: a string
    title: {
        type: String
    },
    // body: a string
    text: {
        type: String
    },
    link: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comment:[{
        type: Schema.Types.ObjectId,
        ref:"Comment"
    }]
});

// Make a Article model with the ArticleSchema
const Article = mongoose.model("Article", ArticleSchema);

// Export the Note model
module.exports = Article;