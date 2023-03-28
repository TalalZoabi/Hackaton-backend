const express = require("express");
const filterPosts = require("./middleware/openai");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

router.get("/search", (req, res, next) => {
  const url = req.body.search; // Replace with the URL of the page you want to scrape

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(body);
      const h3Texts = $("h3")
        .map((i, element) => $(element).text())
        .get();
      console.log(h3Texts);
      req.posts = h3Texts;
      //res.status(200).json(h3Texts);
      next();
    } else {
      console.log(error);
    }
  });
});

router.use(filterPosts);

module.exports = router;
