const express = require("express");
const axios = require("axios");
const filterPosts = require("../middleware/openai");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

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
router.post("/search", async (req, res, next) => {
  const baseUrl = "https://www.reddit.com/r/";
  const subreddit = req.body.search;
  const maxPosts = 100; // Maximum number of posts to retrieve

  console.log("req.body", req.body);

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
    req.posts = posts.filter((post, index) => index <= 30);
    console.log("posts", posts);
    next();
  } catch (error) {
    console.error(error);
  }
});

router.use(filterPosts);

module.exports = router;
