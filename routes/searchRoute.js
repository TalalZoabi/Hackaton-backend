const express = require("express");
const axios = require("axios");
const filterPosts = require("../middleware/openai");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

router.post("/search", async (req, res, next) => {
  const url = "https://www.reddit.com/r/" + req.body.search;
  console.log("url", url);
  axios
    .get(url, {
      timeout: 30000, // Timeout value in milliseconds
    })
    .then((response) => {
      const $ = cheerio.load(response.data);
      console.log("first");
      // Extract the data for each post

      const data = $("div.Post")
        .map((i, el) => {
          const title = $(el).find("h3").text().trim();
          const link = $(el).find("a[data-click-id=body]").attr("href");
          const image = $(el).find("img[class*='ImageBox-image']").attr("src");

          return { title, link, image };
        })
        .get();

      // Do something with the data array here
      req.posts = data;
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

router.use(filterPosts);

module.exports = router;
