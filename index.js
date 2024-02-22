import express from 'express';
import OpenAI from "openai";
import cors from 'cors';
import { initializeApp } from 'firebase/app'
import {getDatabase, ref, onValue} from 'firebase/database'

const databaseAppSettings = {
	databaseURL: process.env.DATABASE_URL
}

const databaeApp = initializeApp(databaseAppSettings)
const database = getDatabase(databaeApp)
let translations = ref(database, 'translations')

onValue(translations, (snapshot) => {
	if (snapshot.exists()) {
    translations = Object.entries(snapshot.val()).reverse();
  }
})
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

app.get('/api/translation/', async (req, res) => {
  const translationsData = translations.map(translation => {
    return {
      id: translation[0],
      english: translation[1].english,
      german: translation[1].german,
      highlighted: translation[1].highlighted,
    }
  })
  res.status(200).json({ translations: translationsData });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
