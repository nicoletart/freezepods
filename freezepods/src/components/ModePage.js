// ModePage.js
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModeTheme from '../shared/ModeTheme';
import { Link } from 'react-router-dom';
import styles from '../shared/modetheme.module.css';

import MicrobitComponent from '../services/microbit/MicrobitComponent';
import MicrobitList from '../services/microbit/MicrobitList';
import Alert from '../services/microbit/Alert';

const ModePage = () => {
  const { gameId, modeId } = useParams();
  const modeTheme = ModeTheme.getTheme(gameId, modeId);

  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const showAlertHandler = (text) => {
    setAlertText(text);
    setShowAlert(true);
  };

  return (
    <div>
      <h2>{`Game ${gameId} - ${modeId}`}</h2>
      <div style={{ background: modeTheme.backgroundColor, color: modeTheme.textColor }}>
        <p>This is the content for Game {gameId}, {modeId}.</p>
      </div>
      <div>
        <p>
          Load this MakeCode micro:bit project on to your micro:bits
          {/* <Link href="https://makecode.microbit.org/_37FHVCLC2CAL" />
          <Link href="https://makecode.microbit.org/_e78LcgTioFhe"  /> */}
        </p>
          <MicrobitList />
        <p>
          <div class="btn-group" id="microbitList" role="group" aria-label="Basic outlined example">
            Connected Microbits:
          </div>
        </p>
      </div>
      <div class="container px-4 py-3" id="hanging-icons">
        <h3 class="pb-2 border-bottom">New Game</h3>
        <br />
         {/*
        <button className="btn btn-primary" onClick={startGame}>Start Game</button>
        <button class="btn remix btn--remix" onClick={endGame}>End Game</button> {/* Call endGame when clicked */}
      </div>
      {/* Rest of your JSX */}
      <div class="container px-4 py-3">
        <div id="gameBlock" class="card text-bg-secondary mb-3">
          <div class="card-header" id="gameBlockHeader">Press Start Game to Start!</div>
          <div class="card-body">
            <h5 class="card-title" id="gameCountdown">Score Here</h5>
            <p class="card-text" id="scoreText">Updates Here</p>
          </div>
        </div>
      </div>
      <div class="table container">
        <table class="table" id="scoreTable">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Round</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            {/* Rows for score table */}
          </tbody>
        </table>
      </div>
      <div class="toast-container position-fixed bottom-0 end-0 p-1">
        <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <strong class="me-auto">Alert</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body" id="toastBody">
            Hello, world! This is a toast message.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModePage;
