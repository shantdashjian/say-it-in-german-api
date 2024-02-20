const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/translate/', (req, res) => {
    const postData = req.body;
    console.log('Received POST request with data:', postData);
    res.status(200).json({ message: 'Data received successfully', data: postData });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
