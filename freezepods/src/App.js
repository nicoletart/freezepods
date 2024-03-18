// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import ModePage from './components/ModePage';
import MyMicrobit from './services/microbit/oldmicrobit';
//import { MyProvider } from './components/microbit';

const App = () => {
  return (
    <MyMicrobit>

      <Router>
        <Routes>
    
          <Route path="/" element={<HomePage />} />


          <Route path="/game/:gameId" element={<GamePage />} />


          <Route path="/game/:gameId/mode/:modeId" element={<ModePage />} />



        </Routes>
      </Router>
      </MyMicrobit>
  );
};

export default App;



/*


/src
|-- components
|   |-- HomePage.js
|   |-- GamePage.js
|   |-- ModePage.js
|-- games
|   |-- Game1
|   |   |-- ModeLight.js
|   |   |-- ModeButton.js
|   |   |-- ModeConnect.js
|   |-- Game2
|   |   |-- ModeLight.js
|   |   |-- ModeButton.js
|   |   |-- ModeConnect.js
|   |-- Game3
|   |   |-- ModeLight.js
|   |   |-- ModeButton.js
|   |   |-- ModeConnect.js
|   |-- Game4
|       |-- ModeLight.js
|       |-- ModeButton.js
|       |-- ModeConnect.js
|-- shared
|   |-- ModeTheme.js
|-- App.js
|-- index.js



*/