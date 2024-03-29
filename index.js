import express from 'express';
import OpenAI from "openai";
import cors from 'cors';
import { initializeApp } from 'firebase/app'
import {getDatabase, ref, onValue, push, update, remove} from 'firebase/database'

const databaseAppSettings = {
	databaseURL: process.env.DATABASE_URL
}

const databaeApp = initializeApp(databaseAppSettings)
const database = getDatabase(databaeApp)
let translationsInDB = ref(database, 'translations')
let translations = []

onValue(translationsInDB, (snapshot) => {
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
  const translation = {
		english: englishText,
		german: germanText,
		highlighted: false
	}
  const ref = push(translationsInDB, translation)
  translation.id = ref.key
  res.status(200).json(translation);
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
  res.status(200).json({ translations: translationsData })
})

app.put('/api/translation/:id', async (req, res) => {
  const id = req.params.id
  const translationRef = ref(database,`translations/${id}`)
	update(translationRef, {highlighted: req.body.highlighted})
  res.status(200).json({ translation: req.body })
})

app.delete('/api/translation/:id', async (req, res) => {
  const id = req.params.id
  const translationRef = ref(database,`translations/${id}`)
	remove(translationRef)
  res.status(200).send()
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
