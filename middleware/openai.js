const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const filterPosts = async function (req, res, next) {
  console.log("entered filter");

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  console.log(req.posts);

  if (!req.posts) {
    res.status(400).json([]);
    next();
    return null;
  }

  const posts = req.posts.map((post) => post.title);

  if (!posts || posts.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid search term",
      },
    });
    return;
  }

  let filteredPosts = [];

  try {
    for (let i = 0; i < posts.length; i++) {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(posts[i]),
        temperature: 0.6,
      });
      const booleanResult = completion.data.choices[0].text === "\n\nTrue";
      if (booleanResult) filteredPosts.push(req.posts[i]);
    }
    res.status(200).json(filteredPosts);
    next();
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
};

function generatePrompt(postTitle) {
  return `Answer only true or false if the following question satisfies the following conditions: 
    1. does not contain hate speech
    2. does not contain speech against peaceful coexistence
    3. does not contains inappropriate language
    4. suitable for children:
     "${postTitle}"`;
}

module.exports = filterPosts;
