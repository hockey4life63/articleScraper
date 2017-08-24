const request = require("request-promise");
const cheerio = require("cheerio");

let getArticles = (callback) => {
   return getBBCpage().then((articleLinks) => {
        return Promise.all(
            articleLinks.map(ele => {
                return getArticleText(ele)
            })
        )
    })
}

let getBBCpage = (callback) => {
    return request({
        uri: "http://www.bbc.com/news",
        transform: function(body) {
            const $ = cheerio.load(body);
            return getArticleLinks($);
        }
    });

}

let getArticleLinks = ($) => {
    //grab all links and titles from page
    let results = [];
    $("a.gs-c-promo-heading").each(function(i, element) {
        var link = $(element).attr("href");
        var title = $(element).children().text();

        results.push({
            title: title,
            link: link.startsWith("http") ? link : "http://www.bbc.com" + link
        });

    });
    return results;
}

let getArticleText = (articleObj) => {
    return request({
        uri: articleObj.link,
        transform: function(body) {
            const $ = cheerio.load(body);
            articleObj.text = $(".story-body__inner p").text();
            return articleObj;
        }
    })

}

module.exports = getArticles;