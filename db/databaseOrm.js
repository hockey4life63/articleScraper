const mongoose = require("mongoose");
const moment = require("moment");
const Article = require("../models/article")
const Comment = require("../models/comment")
const scrape = require("../logic/scraper")
mongoose.promise = Promise;
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

const saveArticle = (articleObj) => {
    let newArticle = new Article(articleObj);
    return newArticle.save();
}

const fetchNewArticles = () => {
    let articles = scrape();
    return articles.then(articleList => {
        return Promise.all(articleList.filter((element) => element.text !== "").map(saveArticle));
    });
}

const retrieveArticles = () => {
    return Article.find();
}

const checkArticleDate = () => {
    console.log("checking date")
    return Article.findOne().then((article) => {
        if (article === null) {
            fetchNewArticles().then(() => {
                console.log("Updated Articles")
                return getAllStoredArticles();
            })
        } else {
            let timeSinceUpdate = moment().diff(moment(article.createdAt), "h");
            if (timeSinceUpdate >= 24) {
                return Article.remove({}).then(() => {
                    fetchNewArticles().then(() => {
                        console.log("Updated Articles")
                        return getAllStoredArticles();
                    })
                })
            } else {
                console.log("Articles still up to date")
                return getAllStoredArticles();
            }
        }

    })
}
//scrape()
const getAllStoredArticles = () => {
    return Article.find();
}

const getSingleArticle = _id => {
    return Article.findOne({
        _id
    }).populate("comment")
}


const addComment = (commentObj, callback) => {
    let newComment = new Comment(commentObj)
    newComment.save().then(savedComment => {
        console.log(savedComment)
        Article.update({
            _id: commentObj.article
        }, {
            $push: {
                comment: savedComment._id
            }
        }).then(callback)
    })

}

const removeComment = (articleId, commentId) => {
    return Promise.all([deleteComment(commentId), deleteArticleComment(articleId, commentId)])
}

const deleteComment = _id => Comment.remove({ _id })

const deleteArticleComment = (_id, comment) => Article.update({ _id }, { $pull: { comment } })

module.exports = {
    checkArticleDate,
    getAllStoredArticles,
    getSingleArticle,
    addComment,
    removeComment
}