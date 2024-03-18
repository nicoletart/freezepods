import React from 'react';

const GameBlock = ({ gameState }) => {
  const classUpdates = {
    gameBlock: {
      running: "text-bg-success",
      inactive: "text-bg-secondary",
    },
  };

  const textUpdates = {
    gameBlockHeader: {
      running: "Game Running!",
      inactive: "Press Start Game to Start!",
    },
    gameCountdown: {
      running: "0",
      inactive: "Score Here",
    },
    scoreText: {
      running: "0",
      inactive: "Updates Here",
    },
  };

  return (
    <div className={`${classUpdates.gameBlock[gameState]}`}>
      <div id="gameBlockHeader">{textUpdates.gameBlockHeader[gameState]}</div>
      <div id="gameCountdown">{textUpdates.gameCountdown[gameState]}</div>
      <div id="scoreText">{textUpdates.scoreText[gameState]}</div>
    </div>
  );
};

export default GameBlock;
