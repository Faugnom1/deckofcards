import React, { useState, useEffect } from 'react';

function App() {
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const [drawingInProgress, setDrawingInProgress] = useState(false);

  useEffect(() => {
    if (drawingInProgress) {
      const intervalId = setInterval(() => {
        drawCard();
      }, 1000);
      return () => clearInterval(intervalId);
    }
});

  const fetchNewDeck = () => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => response.json())
      .then(data => {
        setDeckId(data.deck_id);
        setCards([]);
        setError('');
      })
      .catch(error => setError('Error fetching new deck.'));
  };
  const drawCard = () => {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCards([...cards, data.cards[0]]);
          setError('');
        } else {
          setError('Error: no cards remaining!');
          setDrawingInProgress(false);
        }
      })
      .catch(error => setError('Error drawing card.'));
  };

  const toggleDrawing = () => {
    if (drawingInProgress) {
      setDrawingInProgress(false);
    } else {
      if (deckId !== '') {
        setDrawingInProgress(true);
      } else {
        setError('Error: No deck available. Please fetch a new deck.');
      }
    }
  };

  return (
    <div className="App">
      <h1>Deck of Cards</h1>
      <button onClick={fetchNewDeck}>New Deck</button>
      <button onClick={toggleDrawing}>{drawingInProgress ? 'Stop Drawing' : 'Start Drawing'}</button>
      {error && <div className="error">{error}</div>}
      <div className="card-container">
        {cards.map((card, index) => (
          <img key={index} src={card.image} alt={card.code} />
        ))}
      </div>
    </div>
  );
}

export default App;
