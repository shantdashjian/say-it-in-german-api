# Say It in German API!
This is the API of the translation app that takes in English text and translates it to German, with the option of speaking it as well. It is built with Node.js/Express and powered with OpenAPI and the Firebase Database for persistence.

## In This Document:
- [API Endpoint](#api-endpoint)
- [Technologies Used](#technologies-used)
- [Challenges and Learning Points:](#challenges-and-learning-points)

## API Endpoint
[https://sayitingerman.netlify.app/api/translation](https://sayitingermanapi.onrender.com/api/translation)

- Note that the API only accepts requests from the frontend at [https://sayitingerman.netlify.app/](https://sayitingerman.netlify.app/). This is done by using CORS options to protect the API key usage.


## Technologies Used
1. Node.js as the Runtime.
2. Express for the API.
3. Firebase Database for persisting the history of translations.
4. [OpenAI API](https://platform.openai.com/docs/introduction/overview) for generating the translation.
5. [Render](https://dashboard.render.com/) for hosting.
   

## Challenges and Learning Points:
1. Limiting the origin of the request using CORS options.
2. Initially I wanted to move both functionalities, the translate and the speak to the backend. The translate worked. Moving the speak didn't as the free tier of the hosting service apparently limits the size of the audio file sent back. It was fine to keep it in the frontend as I am using a free API key for the TTS.
3. I added the full CRUD for managing history of translations and hooked up the REST API with a Firebase Database.
   
<hr>

[Up](README.md)
