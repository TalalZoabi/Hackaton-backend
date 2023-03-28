const express = require("express");
const filterPosts = require("./middleware/openai");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

router.get("/search", (req, res, next) => {
  const url = "https://www.reddit.com/r/minecraft"; // Replace with the URL of the page you want to scrape

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(body);
      const h3Texts = $("h3")
        .map((i, element) => $(element).text())
        .get();
      res.json(filterPosts(h3Texts));
    } else {
      console.log(error);
    }
  });
});

module.exports = router;
