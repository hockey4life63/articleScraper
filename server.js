var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const testRequest = require("./logic/scraper.js")
const mainRoutes = require("./routes/mainRoutes")
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGOLAB_URI || require("./mongoDbUri"));
const app = express();

const port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", mainRoutes)

app.listen(port)