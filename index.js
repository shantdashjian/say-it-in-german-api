const express = require('express');
const OpenAI = require("openai");
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());

const corsOptionsProduction = {
  origin: 'https://sayitingerman.netlify.app',
  optionsSuccessStatus: 200
};

if (process.env.NODE_ENV === 'production') {
  app.use(cors(corsOptionsProduction));
} else {
  app.use(cors());
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/translation/', async (req, res) => {
  const englishText = req.body.englishText;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": "You are an English to German translator."
      },
      {
        "role": "user",
        "content": "Translate this: " + englishText 
      }
    ],
  });
  const germanText = response.choices[0].message.content
  res.status(200).json({ germanText: germanText });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
