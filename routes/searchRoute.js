const express = require("express");
const filterPosts = require("../middleware/openai");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

// const url = "https://www.reddit.com/r/Minecraft/";
// const selector = "div[data-scroller-first] + div";

// router.get("/search", (req, res, next) => {
//   //const url = req.body.search; // Replace with the URL of the page you want to scrape

//   request(url, (error, response, body) => {
//     if (!error && response.statusCode === 200) {
//       const $ = cheerio.load(body);
//       const aLinks = $("h3")
//         .map((i, element) => {
//           console.log($(element).parent().parent().attr("href"));
//           return (
//             "https://www.reddit.com" + $(element).parent().parent().attr("href")
//           );
//         })
//         .get();
//       const h3Texts = $("h3")
//         .map((i, element) => $(element).text())
//         .get();
//       const imageLinks = $("img")
//         .map((i, element) => $(element).attr("src"))
//         .get();
//       console.log(h3Texts);
//       console.log(aLinks);
//       req.posts = h3Texts;
//       //res.status(200).json(h3Texts);
//       //next();
//     } else {
//       console.log(error);
//     }
//   });
// });

// router.use(filterPosts);

const subredditName = "minecraft";

const fetchPosts = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

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

      return {
        title,
        postLink: "https://www.reddit.com" + link,
        imageLink: "https://www.reddit.com" + image,
      };
    })
    .get();

  console.log(data);

  await browser.close();
};

router.get("/search", async (req, res, next) => {
  const url = req.body.search; // Replace with the URL of the page you want to scrape

  try {
    const data = await fetchPosts(url);
    req.posts = data;
    next();
  } catch (error) {
    res.status(500).json([]);
  }
});

router.use(filterPosts);

module.exports = router;
