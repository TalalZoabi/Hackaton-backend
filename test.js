// // const axios = require("axios");
// // const cheerio = require("cheerio");

// // const subredditName = "minecraft";

// // axios
// //   .get(`https://www.reddit.com/r/${subredditName}/`, {
// //     timeout: 10000, // Timeout value in milliseconds
// //   })
// //   .then((response) => {
// //     const $ = cheerio.load(response.data);

// //     // Extract the data for each post

// //     const data = $("div.Post")
// //       .map((i, el) => {
// //         const title = $(el).find("h3").text().trim();
// //         const link = $(el).find("a[data-click-id=body]").attr("href");
// //         const image = $(el).find("img[class*='ImageBox-image']").attr("src");

// //         return { title, link, image };
// //       })
// //       .get();

// //     // Do something with the data array here
// //     console.log(data);
// //   })
// //   .catch((err) => {
// //     console.error(err);
// //   });

// const puppeteer = require("puppeteer");
// const cheerio = require("cheerio");

// const subredditName = "minecraft";

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(`https://www.reddit.com/r/${subredditName}/`);

//   let currentHeight = 0;
//   while (true) {
//     await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
//     await page.waitForTimeout(1000);
//     const newHeight = await page.evaluate("document.body.scrollHeight");
//     if (newHeight === currentHeight) {
//       break;
//     }
//     currentHeight = newHeight;
//   }

//   const html = await page.content();
//   const $ = cheerio.load(html);

//   const data = $("div.Post")
//     .map((i, el) => {
//       const title = $(el).find("h3").text().trim();
//       const link = $(el).find("a[data-click-id=body]").attr("href");
//       const image = $(el).find("img[class*='ImageBox-image']").attr("src");

//       return { title, link, image };
//     })
//     .get();

//   console.log(data);

//   await browser.close();
// })();

const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");

// const test = async () => {
//   const baseUrl = "https://www.reddit.com/r/";
//   const subreddit = "minecraft";
//   const maxPosts = 100; // Maximum number of posts to retrieve

//   let posts = [];

//   const fetchPosts = async (after) => {
//     const url = `${baseUrl}${subreddit}.json?limit=100&after=${after}`;
//     console.log("Fetching posts from", url);

//     const response = await axios.get(url, { timeout: 30000 });
//     const { data } = response.data;

//     const newPosts = data.children
//       .map((child) => {
//         const { title, url, thumbnail } = child.data;
//         return { title, link: url, image: thumbnail };
//       })
//       .filter(({ image }) => image && image.startsWith("http"));

//     posts = [...posts, ...newPosts];

//     if (posts.length < maxPosts && data.after) {
//       await fetchPosts(data.after);
//     }
//   };

//   try {
//     await fetchPosts(null);
//     console.log("Fetched", posts.length, "posts");
//     console.log(posts);
//   } catch (error) {
//     console.error(error);
//   }
// };

// test();

router.post("/search", async (req, res, next) => {
  const baseUrl = "https://www.reddit.com/r/";
  const subreddit = req.body.search;
  const maxPosts = 100; // Maximum number of posts to retrieve

  let posts = [];

  const fetchPosts = async (after) => {
    const url = `${baseUrl}${subreddit}.json?limit=100&after=${after}`;
    console.log("Fetching posts from", url);

    const response = await axios.get(url, { timeout: 30000 });
    const { data } = response.data;

    const newPosts = data.children
      .map((child) => {
        const { title, permalink, thumbnail } = child.data;
        return {
          title,
          link: `https://www.reddit.com${permalink}`,
          image: thumbnail,
        };
      })
      .filter(({ image }) => image && image.startsWith("http"));

    posts = [...posts, ...newPosts];

    if (posts.length < maxPosts && data.after) {
      await fetchPosts(data.after);
    }
  };

  try {
    await fetchPosts(null);
    console.log("Fetched", posts.length, "posts");
    req.posts = posts;
    next();
  } catch (error) {
    console.error(error);
  }
});
