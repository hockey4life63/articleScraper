const router = require("express").Router();
const exphbs = require("express-handlebars");
const db = require("../db/databaseOrm.js");

router.get("/", (req, res)=>{
    db.checkArticleDate().then(article=>{
        article = article.map(ele=>{
            ele.text = ele.text.split("").splice(0, 500).join("")
            return ele
        })
        res.render("articleList", {article})
    })
})

router.get("/id/:id", (req, res)=>{
    db.getSingleArticle(req.params.id).then(article=>{
        res.render("articlePage", article)
    })
})

router.post("/id/:id", (req, res)=>{
    let commentObj = req.body;
    commentObj.article = req.params.id
    db.addComment(commentObj,results=>{
        db.getSingleArticle(req.params.id).then(article=>{
            res.render("articlePage", article)
        })
    })
        
})
router.delete("/id/:id", (req, res)=>{
    console.log("testing")
    console.log("worked", req.body.commentId)
    db.removeComment(req.params.id, req.body.commentId).then(results => res.send({success:true}))
})



module.exports = router;