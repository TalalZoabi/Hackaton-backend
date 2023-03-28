const express = require("express");
const axios = require("axios");
const filterPosts = require("../middleware/openai");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const fetchPosts = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.reddit.com/r/" + url);

  let currentHeight = 0;
  while (true) {
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForTimeout(1000);
    const newHeight = await page.evaluate("document.body.scrollHeight");
    if (newHeight === currentHeight) {
      break;
    }
    currentHeight = newHeight;
  }

  const html = await page.content();
  const $ = cheerio.load(html);

  const data = $("div.Post")
    .map((i, el) => {
      const title = $(el).find("h3").text().trim();
      const link = $(el).find("a[data-click-id=body]").attr("href");
      const image = $(el).find("img[class*='ImageBox-image']").attr("src");

      return { title, link, image };
    })
    .get();

  console.log(data);

  await browser.close();
};

router.post("/search", async (req, res, next) => {
  const url = "https://www.reddit.com/r/" + req.body.search;
  const data = await fetchPosts(url);
  req.posts = data;
  next();
});

// router.post("/search", async (req, res, next) => {
//   const url = "https://www.reddit.com/r/" + req.body.search;
//   console.log("url", url);
//   axios
//     .get(url, {
//       timeout: 30000, // Timeout value in milliseconds
//     })
//     .then((response) => {
//       const $ = cheerio.load(response.data);
//       console.log("first");
//       // Extract the data for each post

//       const data = $("div.Post")
//         .map((i, el) => {
//           const title = $(el).find("h3").text().trim();
//           const link = $(el).find("a[data-click-id=body]").attr("href");
//           const image = $(el).find("img[class*='ImageBox-image']").attr("src");

//           return { title, link, image };
//         })
//         .get();

//       // Do something with the data array here
//       req.posts = data;
//       next();
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });

router.use(filterPosts);

module.exports = router;
