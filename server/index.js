import express from 'express';
import axios from 'axios';
import pool from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/:word', async (req, res) => {
  const { word } = req.params;

  try {
    // 1️⃣ Try fetching from DB
    const result = await pool.query(
      'SELECT meaning FROM words WHERE word = $1',
      [word]
    );

    if (result.rows.length > 0) {
      console.log('Fetched from DB:', word);
      return res.json({ source: 'db', message: result.rows[0].meaning });
    }

    // 2️⃣ Fetch from API if not found
    const { data } = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    // 3️⃣ Insert into DB
    await pool.query('INSERT INTO words (word, meaning) VALUES ($1, $2)', [
      word,
      JSON.stringify(data[0]),
    ]);

    console.log('Fetched from API and saved:', word);
    res.json({ source: 'api', message: data[0] });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on PORT: ${PORT}`);
});
