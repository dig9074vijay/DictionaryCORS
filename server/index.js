import express from 'express';
import axios from 'axios';
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/:word', async (req, res) => {
  const data = await axios.get(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${req.params.word}`
  );
  console.log('word fetched', req.params.word);
  res
    .setHeader('Access-Control-Allow-Origin', '*')
    .json({ message: data.data[0] });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
