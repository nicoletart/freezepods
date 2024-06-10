import React, { useState, useEffect } from 'react';
import { patterns } from '../../utils/Constant';


const GameLogic = ({ MBList, ledMatrixDisplay, clearDisplays }) => {
  const [endGameBoolean, setEndGameBoolean] = useState(false);
  const [gameScores, setGameScores] = useState([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [thisGameScore, setThisGameScore] = useState(0);

  const initializeGameScores = () => {
    const initialScores = Array(8).fill(0);
    setGameScores(initialScores);
  };
  
  useEffect(() => {
    initializeGameScores();
  }, []);
  
  

  async function startWait(timeoutDuration) {
    let timeoutId;

    const timeoutPromise = new Promise((resolve) => {
        timeoutId = setTimeout(() => {
            resolve({ key: "time end" });
        }, timeoutDuration);
    });

    const buttonPromise = new Promise((resolve) => {
        const buttonEventListener = (event) => {
            resolve({
                key: "button press",
                button: event.detail.button,
                deviceName: event.detail.deviceName,
            });
        };
        document.addEventListener("microbitButtonPress", buttonEventListener);

        // Clear the button event listener after the timeout duration
        setTimeout(() => {
            document.removeEventListener("microbitButtonPress", buttonEventListener);
        }, timeoutDuration);
    });

    try {
        const result = await Promise.race([timeoutPromise, buttonPromise]);
        clearTimeout(timeoutId);
        return result;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

  // async function startWait(timeoutDuration) {
  //   let buttonEventListener;
  //   let timeoutId;
  
  //   const timeoutPromise = new Promise((resolve) => {
  //     timeoutId = setTimeout(() => {
  //       resolve({ key: "time end" });
  //     }, timeoutDuration);
  //   });
  
  //   const buttonPromise = new Promise((resolve) => {
  //     buttonEventListener = (event) => {
  //       resolve({
  //         key: "button press",
  //         button: event.detail.button,
  //         deviceName: event.detail.deviceName,
  //       });
  //     };
  //     document.addEventListener("microbitButtonPress", buttonEventListener);
  //   });
  
  //   const clearListeners = () => {
  //     clearTimeout(timeoutId);
  //     document.removeEventListener("microbitButtonPress", buttonEventListener);
  //   };
  
  //   try {
  //     const result = await Promise.race([timeoutPromise, buttonPromise]);
  //     clearListeners();
  //     return result;
  //   } catch (error) {
  //     clearListeners();
  //     throw error;
  //   }
  // }

  const addRoundRow = () => {
    setGameScores(prevScores => [...prevScores]);
  };

  const updateRoundScore = (round, score) => {
    setGameScores(prevScores => {
      const updatedScores = [...prevScores];
      updatedScores[round - 1] = score;
      return updatedScores;
    });
  };

  const startGame = async () => {
    setThisGameScore(0);
    setEndGameBoolean(false);
    const gameRounds = 8;
    console.log('wooo')
    if (!gameRunning && MBList.length > 0) {
      setGameRunning(true);
    }
  };

  // Function to end the game
  const endGame = async () => {
    setEndGameBoolean(true);
    setGameRunning(false)
    console.log("Game ended");
    console.log("done: ", endGameBoolean)
  };

  useEffect(() => {
   
      
      const gameRounds = 8;

      const gameLoop = async () => {
        for (let i = 0; i < gameRounds; i++) {
          if (!endGameBoolean) {
            let randomIndex = Math.floor(Math.random() * MBList.length);
            let randomBit = MBList[randomIndex];
            ledMatrixDisplay(patterns["O"]);
            let startTime = Date.now();
            let output = await startWait(3000);
            let endTime = Date.now();
            let success = 0;
      
            if (output["key"] === "button press") {
              let dbName = "BBC micro:bit [" + output["deviceName"] + "]"
              if (dbName === randomBit.key) {
                let speed = endTime - startTime;
                let speedScore = 30 - Math.floor(speed / 100);
                success = 1 * speedScore;
              } else {
                success = -10;
              }
            }
      
            const newScore = gameScores[i] + success;
            updateRoundScore(i + 1, newScore);
      
            clearDisplays();
            let waitTime = Math.random() * 1500 + 500;
            await new Promise((r) => setTimeout(r, waitTime));
          } else {
            setGameRunning(false);
            break;
          }
        }
      };
      


    if (!endGameBoolean && gameRunning && MBList.length > 0) {
        gameLoop();
        addRoundRow();
      
    } else if (MBList.length === 0) {
      console.log("No microbits connected!");
    }
    // setEndGameBoolean(true);
  }, [gameRunning, MBList, endGameBoolean]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {gameScores.map((score, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td>{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />

      <div className="container px-4 py-3" id="hanging-icons">
        <h3 className="pb-2 border-bottom">New Game</h3>
      </div>
  
      <button aria-label="Start Game" onClick={startGame}>Start Game</button>
      <button aria-label="End Game" onClick={endGame}>End Game</button>
    </div>
  );
};

export default GameLogic;


// import React, { useState, useEffect } from 'react';
// import Alert from './Alert';
// import { patterns } from '../../utils/Constant';

// const GameLogic = ({ MBList, clearDisplays }) => {
//   const [endGameBoolean, setEndGameBoolean] = useState(false);
//   const [gameScores, setGameScores] = useState([]);
//   const [gameRunning, setGameRunning] = useState(false);
//   const [thisGameScore, setThisGameScore] = useState(0);

//   async function startWait(timeoutDuration) {
//     let buttonEventListener;
//     let timeoutId;
  
//     const timeoutPromise = new Promise((resolve) => {
//       timeoutId = setTimeout(() => {
//         resolve({ key: "time end" });
//       }, timeoutDuration);
//     });
  
//     const buttonPromise = new Promise((resolve) => {
//       buttonEventListener = (event) => {
//         resolve({
//           key: "button press",
//           button: event.detail.button,
//           deviceName: event.detail.deviceName,
//         });
//       };
//       document.addEventListener("microbitButtonPress", buttonEventListener);
//     });
  
//     const clearListeners = () => {
//       clearTimeout(timeoutId);
//       document.removeEventListener("microbitButtonPress", buttonEventListener);
//     };
  
//     try {
//       const result = await Promise.race([timeoutPromise, buttonPromise]);
//       clearListeners();
//       return result;
//     } catch (error) {
//       clearListeners();
//       throw error;
//     }
//   }
  

//   const addRoundRow = () => {
//     const round = gameScores.length + 1;
//     setGameScores(prevScores => [...prevScores, 0]);
//   };

//   const updateRoundScore = (round, score) => {
//     setGameScores(prevScores => {
//       const updatedScores = [...prevScores];
//       updatedScores[round - 1] = score;
//       return updatedScores;
//     });
//   };

//   const startGame = async () => {
//     setThisGameScore(0);
//     setEndGameBoolean(false);

//     if (!gameRunning && MBList.length > 0) {
//       setGameRunning(true);
//     }
//   };

//   const endGame = () => {
//     setEndGameBoolean(true);
//     console.log("Game ended");
//   };

//   useEffect(() => {
//     console.log("mblist: ", MBList)
//     if (gameRunning && MBList.length > 0) {
//       addRoundRow();
//       const gameRounds = 8;

//       const gameLoop = async () => {
//         for (var i = 0; i < gameRounds; i++) {
//           if (!endGameBoolean) {
//             let randomIndex = Math.floor(Math.random() * MBList.length);
//             let randomBit = MBList[randomIndex];
//             console.log("randomBit: ", randomBit, typeof randomBit)

//             randomBit.ledMatrixDisplay(patterns["O"]);
//             console.log("STOP")
//             let startTime = Date.now();
//             let output = await startWait(3000);
//             let endTime = Date.now();
//             let success = 0;

//             if (output["key"] === "button press") {
//               if (output["deviceName"] === randomBit.getMicrobitName()) {
//                 let speed = endTime - startTime;
//                 let speedScore = 30 - Math.floor(speed / 100);
//                 success = 1 * speedScore;
//               } else {
//                 success = -10;
//               }
//             }

//             setThisGameScore(prevScore => prevScore + success);
//             gameScores[i] = thisGameScore;
//             updateRoundScore(i + 1, thisGameScore);
//             clearDisplays(); // Call clearDisplays directly here
//             let waitTime = Math.random() * 1500 + 500;
//             await new Promise((r) => setTimeout(r, waitTime));
//           } else {
//             break;
//           }
//         }
//         setGameRunning(false);
//       };

//       gameLoop();
//     } else if (MBList.length === 0) {
//       console.log("No microbits connected!");
//     }
//     setEndGameBoolean(true);
//   }, [gameRunning, MBList, endGameBoolean]);

//   return (
//     <div>
//       <table>
//         <thead>
//           <tr>
//             <th>Round</th>
//             <th>Score</th>
//           </tr>
//         </thead>
//         <tbody>
//           {gameScores.map((score, index) => (
//             <tr key={index + 1}>
//               <td>{index + 1}</td>
//               <td>{score}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
  
//       {MBList.numberOfMicrobits === 0 && <Alert text={"No microbits connected!"} />}
//       <button aria-label="Start Game" onClick={startGame}>Start Game</button>
//       <button aria-label="End Game" onClick={endGame}>End Game</button>
//     </div>
//   );
// };

// export default GameLogic;


// // import React, { useState, useEffect } from 'react';
// // import Alert from './Alert';
// // import { patterns } from '../../utils/Constant';

// // const GameLogic = ({ MBList }) => {
// //   const [endGameBoolean, setEndGameBoolean] = useState(false);
// //   const [gameScores, setGameScores] = useState([]);
// //   const [gameRunning, setGameRunning] = useState(false);
// //   const [thisGameScore, setThisGameScore] = useState(0);

// //   async function startWait(timeoutDuration) {
// //     let buttonEventListener;
// //     let timeoutId;
  
// //     const timeoutPromise = new Promise((resolve) => {
// //       timeoutId = setTimeout(() => {
// //         resolve({ key: "time end" });
// //       }, timeoutDuration);
// //     });
  
// //     const buttonPromise = new Promise((resolve) => {
// //       buttonEventListener = (event) => {
// //         resolve({
// //           key: "button press",
// //           button: event.detail.button,
// //           deviceName: event.detail.deviceName,
// //         });
// //       };
// //       document.addEventListener("microbitButtonPress", buttonEventListener);
// //     });
  
// //     const clearListeners = () => {
// //       clearTimeout(timeoutId);
// //       document.removeEventListener("microbitButtonPress", buttonEventListener);
// //     };
  
// //     try {
// //       const result = await Promise.race([timeoutPromise, buttonPromise]);
// //       clearListeners();
// //       return result;
// //     } catch (error) {
// //       clearListeners();
// //       throw error;
// //     }
// //   }
  

// //   const addRoundRow = () => {
// //     const round = gameScores.length + 1;
// //     setGameScores(prevScores => [...prevScores, 0]);
// //   };

// //   const updateRoundScore = (round, score) => {
// //     setGameScores(prevScores => {
// //       const updatedScores = [...prevScores];
// //       updatedScores[round - 1] = score;
// //       return updatedScores;
// //     });
// //   };

// //   const startGame = async () => {
// //     setThisGameScore(0);
// //     setEndGameBoolean(false);
// //     const gameRounds = 8;

// //     if (!gameRunning && MBList.length > 0) {
// //       setGameRunning(true);
// //     }
// //   };

// //   const endGame = () => {
// //     setEndGameBoolean(true);
// //     console.log("Game ended");
// //   };

// //   useEffect(() => {
// //     console.log("mblist: ", MBList)
// //     if (gameRunning && MBList.length > 0) {
// //       addRoundRow();
// //       const gameRounds = 8;

// //       const gameLoop = async () => {
// //         for (var i = 0; i < gameRounds; i++) {
// //           if (!endGameBoolean) {
// //             let randomIndex = Math.floor(Math.random() * MBList.length);
// //             let randomBit = MBList[randomIndex];
// //             console.log("randomBit: ", randomBit, typeof randomBit)

// //             randomBit.ledMatrixDisplay(patterns["O"]);
// //             let startTime = Date.now();
// //             let output = await startWait(3000);
// //             let endTime = Date.now();
// //             let success = 0;

// //             if (output["key"] === "button press") {
// //               if (output["deviceName"] === randomBit.getMicrobitName()) {
// //                 let speed = endTime - startTime;
// //                 let speedScore = 30 - Math.floor(speed / 100);
// //                 success = 1 * speedScore;
// //               } else {
// //                 success = -10;
// //               }
// //             }

// //             setThisGameScore(prevScore => prevScore + success);
// //             gameScores[i] = thisGameScore;
// //             updateRoundScore(i + 1, thisGameScore);
// //             MBList.clearDisplays();
// //             let waitTime = Math.random() * 1500 + 500;
// //             await new Promise((r) => setTimeout(r, waitTime));
// //           } else {
// //             break;
// //           }
// //         }
// //         setGameRunning(false);
// //       };

// //       gameLoop();
// //     } else if (MBList.length === 0) {
// //       console.log("No microbits connected!");
// //     }
// //     setEndGameBoolean(true);
// //   }, [gameRunning, MBList, endGameBoolean]);

// //   return (
// //     <div>
// //       <table>
// //         <thead>
// //           <tr>
// //             <th>Round</th>
// //             <th>Score</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {gameScores.map((score, index) => (
// //             <tr key={index + 1}>
// //               <td>{index + 1}</td>
// //               <td>{score}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
  
// //       {MBList.numberOfMicrobits === 0 && <Alert text={"No microbits connected!"} />}
// //       <button aria-label="Start Game" onClick={startGame}>Start Game</button>
// //       <button aria-label="End Game" onClick={endGame}>End Game</button>
// //     </div>
// //   );
// // };

// // export default GameLogic;

