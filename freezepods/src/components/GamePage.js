// GamePage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const GamePage = () => {
  const { gameId } = useParams();

  return (
    <div>
      <h2>{`Selected Game: ${gameId}`}</h2>
      <p>Select a mode to play:</p>
      <ul>
        <li><Link to={`/game/${gameId}/mode/light`}>Mode Light</Link></li>
        <li><Link to={`/game/${gameId}/mode/button`}>Mode Button</Link></li>
        <li><Link to={`/game/${gameId}/mode/connect`}>Mode Connect</Link></li>
      </ul>
    </div>
  );
};

export default GamePage;
