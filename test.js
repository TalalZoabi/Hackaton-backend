// const axios = require("axios");
// const cheerio = require("cheerio");

// const subredditName = "minecraft";

// axios
//   .get(`https://www.reddit.com/r/${subredditName}/`, {
//     timeout: 10000, // Timeout value in milliseconds
//   })
//   .then((response) => {
//     const $ = cheerio.load(response.data);

//     // Extract the data for each post

//     const data = $("div.Post")
//       .map((i, el) => {
//         const title = $(el).find("h3").text().trim();
//         const link = $(el).find("a[data-click-id=body]").attr("href");
//         const image = $(el).find("img[class*='ImageBox-image']").attr("src");

//         return { title, link, image };
//       })
//       .get();

//     // Do something with the data array here
//     console.log(data);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const subredditName = "minecraft";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.reddit.com/r/${subredditName}/`);

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
})();
