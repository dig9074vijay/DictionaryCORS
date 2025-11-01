import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface Phonetic {
  text: string;
  audio?: string;
}

interface WordData {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
}

function App() {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [searchWord, setSearchWord] = useState('hello');
  const [loading, setLoading] = useState(false);

  const fetchWordData = async (word: string) => {
    setLoading(true);
    try {
      // Dynamic API URL based on current location
      const apiUrl =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
          ? 'http://localhost:8000'
          : `http://${window.location.hostname}:8000`;
      const response = await axios.get(`${apiUrl}/${word}`);
      setWordData(response.data.message);
    } catch (err) {
      console.error('Error fetching word data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWordData(searchWord);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchWord.trim()) {
      fetchWordData(searchWord.trim());
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(`https:${audioUrl}`);
    audio.play();
  };

  return (
    <div className='app-container'>
      <header className='header'>
        <h1>Dictionary App</h1>
        <form onSubmit={handleSearch} className='search-form'>
          <input
            type='text'
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder='Search for a word...'
            className='search-input'
          />
          <button type='submit' className='search-button' disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </header>

      {loading && <div className='loading'>Loading...</div>}

      {wordData && !loading && (
        <main className='word-details'>
          <div className='word-header'>
            <h2 className='word-title'>{wordData.word}</h2>
            {wordData.phonetic && (
              <span className='phonetic'>/{wordData.phonetic}/</span>
            )}
          </div>

          {wordData.phonetics.length > 0 && (
            <div className='phonetics-section'>
              <h3>Pronunciations</h3>
              <div className='phonetics-list'>
                {wordData.phonetics.map((phonetic, index) => (
                  <div key={index} className='phonetic-item'>
                    <span className='phonetic-text'>/{phonetic.text}/</span>
                    {phonetic.audio && (
                      <button
                        onClick={() => playAudio(phonetic.audio!)}
                        className='audio-button'
                        title='Play pronunciation'
                      >
                        🔊
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {wordData.origin && (
            <div className='origin-section'>
              <h3>Origin</h3>
              <p className='origin-text'>{wordData.origin}</p>
            </div>
          )}

          <div className='meanings-section'>
            <h3>Meanings</h3>
            {wordData.meanings.map((meaning, meaningIndex) => (
              <div key={meaningIndex} className='meaning-group'>
                <h4 className='part-of-speech'>{meaning.partOfSpeech}</h4>
                <ol className='definitions-list'>
                  {meaning.definitions.map((definition, defIndex) => (
                    <li key={defIndex} className='definition-item'>
                      <p className='definition-text'>{definition.definition}</p>
                      {definition.example && (
                        <p className='example-text'>
                          <em>Example: "{definition.example}"</em>
                        </p>
                      )}
                      {definition.synonyms.length > 0 && (
                        <p className='synonyms'>
                          <strong>Synonyms:</strong>{' '}
                          {definition.synonyms.join(', ')}
                        </p>
                      )}
                      {definition.antonyms.length > 0 && (
                        <p className='antonyms'>
                          <strong>Antonyms:</strong>{' '}
                          {definition.antonyms.join(', ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
