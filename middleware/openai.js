import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const searchTerm = req.body.search || "";
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid search term",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(searchTerm),
      temperature: 0.6,
    });
    const booleanResult =
      completion.data.choices[0].text === "True." ? true : false;
    res.status(200).json({ result: booleanResult });
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
}

function generatePrompt(postTitle) {
  return `Answer only true or false if the following question satisfies the following conditions: 
    1. does not contain hate speech
    2. does not contain speech against peaceful coexistence
    3, does not contains inappropriate language
    4. suitable for children:
     "${postTitle}"`;
}

// is this post acceptible

/* Answer only true or false if the following question satisfies the following conditions: 
    1. does not contain hate speech
    2. does not contain speech against peaceful coexistence
    3, does not contains inappropriate language
    4. suitable for children:
    "The terrorist will be accused of rape, the commander of Gilboa prison will also be prosecuted"*/
