import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to My React Game App</h1>
      <p>Choose a game to play:</p>
      <ul>
        <li><Link to="/game/1">Game 1</Link></li>
        <li><Link to="/game/2">Game 2</Link></li>
        <li><Link to="/game/3">Game 3</Link></li>
        <li><Link to="/game/4">Game 4</Link></li>
      </ul>
    </div>
  );
};

export default HomePage;
