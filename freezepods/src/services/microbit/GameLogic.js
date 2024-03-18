import React from 'react';

const GameLogic = ({ MBList, patterns, showAlert }) => {
  const [endGameBoolean, setEndGameBoolean] = React.useState(false);
  const [gameScores, setGameScores] = React.useState([]);
  const [gameRunning, setGameRunning] = React.useState(false);

   const startGame = async () => {
    console.log("startGame");
    let thisGameScore = 0;
    setEndGameBoolean(false);

    const gameRounds = 8;
    if (!gameRunning && MBList.numberOfMicrobits > 0) {
      setGameRunning(true);


    //   setGameRunning(false);
    } else if (MBList.numberOfMicrobits === 0) {
      showAlert("No microbits connected!");
    }
    setEndGameBoolean(true);
  };

  const endGame = () => {
    setEndGameBoolean(true);
    console.log("Game ended");
  };

  return (
    <div>
        <button aria-label="Start Game" onClick={startGame}>start game</button>
        <button aria-label="End Game" onClick={startGame}>end game</button>
    </div>
  );
};

export default GameLogic;
