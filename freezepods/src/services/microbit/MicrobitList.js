import React, { useState } from 'react';
import MicrobitComponent from './MicrobitComponent';
import { microbitUuid } from '../../utils/Constant';
import { patterns } from '../../utils/Constant';
import GameLogic from './GameLogic';

const MicrobitList = () => {
  const [microbitDevices, setMicrobitDevices] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [matrixChar, setMatrixChar] = useState(null);
  const [textChar, setTextChar] = useState(null);

  const addMicrobit = (device) => {
    try {
      
      if (!microbitDevices.find(dev => dev.key === device.name)) {
        const microbitComponent = <MicrobitComponent
                                      key={device.name}
                                      device={device}
                                      matrixChar={matrixChar}
                                      textChar={textChar}
                                  />
        setMicrobitDevices(prevDevices => [...prevDevices, microbitComponent]);
        console.log(microbitDevices)

        // setMicrobitDevices(prevDevices => [
        //   ...prevDevices,
        //   <MicrobitComponent key={device.name} device={device} />
        // ]);
        setErrorMessage('');
      } else {
        setErrorMessage(`Device with name "${device.name}" already exists.`);
      }
    } catch (error) {
      console.error('Error adding MicrobitComponent:', error);
    }
  };

  const removeMicrobit = (deviceName) => {
    setMicrobitDevices(prevDevices => prevDevices.filter(device => device.props.device.name !== deviceName));
  };

  const ledMatrixDisplay = async (pattern) => {
    if (!matrixChar) {
        console.log("wrong");
        setErrorMessage("No LED Matrix characteristic found. Maybe reconnect the microbit or refresh the whole page");
        return false;
    } else {
        let buffer = new ArrayBuffer(5);
        let ledMatrix = new DataView(buffer);
        for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
            ledMatrix.setUint8(rowIndex, 0);
            for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
                ledMatrix.setUint8(
                    rowIndex,
                    ledMatrix.getUint8(rowIndex) |
                        ((pattern[rowIndex][4 - columnIndex] === 1) << columnIndex)
                );
            }
        }
        try {
            await matrixChar.writeValue(ledMatrix);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};

  const connectToDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "BBC micro:bit" }],
        optionalServices: [
          microbitUuid.genericAccess[0],
          microbitUuid.genericAttribute[0],
          microbitUuid.deviceInformation[0],
          microbitUuid.accelerometerService[0],
          microbitUuid.magnetometerService[0],
          microbitUuid.buttonService[0],
          microbitUuid.ioPinService[0],
          microbitUuid.ledService[0],
          microbitUuid.eventService[0],
          microbitUuid.dfuControlService[0],
          microbitUuid.temperatureService[0],
          microbitUuid.uartService[0],
        ],
      });
      let server = await device.gatt.connect();

      const ledService = await server.getPrimaryService(microbitUuid.ledService[0]);
      const matrixChar = await ledService.getCharacteristic(microbitUuid.ledMatrixState[0]);
      const textChar = await ledService.getCharacteristic(microbitUuid.ledText[0]);

      setMatrixChar(matrixChar);
      setTextChar(textChar);
      addMicrobit(device);
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const displayAllMicrobits = (pattern) => {
    ledMatrixDisplay(pattern);
   
  };

  const clearDisplays = () => {
    displayAllMicrobits(patterns["clear"]);
  };

  return (
    <div>
      <button onClick={connectToDevice}>Connect to Device</button>
      {errorMessage && <div>{errorMessage}</div>}
      <div>
        <h2>Connected Microbits:</h2>
        <h4>{microbitDevices}</h4>
        <ul>
          {/* Render MicrobitComponent instances */}
          {microbitDevices.map((microbitComponent, index) => (
            <li key={index}>
              {microbitComponent.props.device.name}
            </li>
          ))}
        </ul>
      </div>
      <GameLogic MBList={microbitDevices} ledMatrixDisplay={ledMatrixDisplay} clearDisplays={clearDisplays}/>
    </div>
  );
};

export default MicrobitList;


// import React, { useState } from 'react';
// import MicrobitComponent from './MicrobitComponent';
// import { microbitUuid } from '../../utils/Constant';
// import { patterns } from '../../utils/Constant';
// import GameLogic from './GameLogic';

// const MicrobitList = ({ microbitDevices, setMicrobitDevices }) => {
//   const [errorMessage, setErrorMessage] = useState('');

//   const addMicrobit = async (device) => {
//     try {
//       // Create a new instance of MicrobitComponent with the device
//       console.log('Device:', device);
//       const microbitComponent = new MicrobitComponent({ device, removeMicrobit });
//       console.log("microbitComponent: ", microbitComponent)
      
//       // Check if the microbitDevices list already contains the device
//       if (!microbitDevices.find(dev => dev.name === device.name)) {
//         // If not, add the MicrobitComponent to the microbitDevices list
//         console.log('here')
//         setMicrobitDevices(prevDevices => [...prevDevices, microbitComponent]);
//         console.log('what')
//         setErrorMessage('');
//       } else {
//         // If the device already exists, set an error message
//         setErrorMessage(`Device with name "${device.name}" already exists.`);
//       }
//     } catch (error) {
//       console.error('Error adding MicrobitComponent:', error);
//     }
//   };

//   const removeMicrobit = (deviceName) => {
//     setMicrobitDevices(prevDevices => prevDevices.filter(device => device.device.name !== deviceName));
//   };

//   const connectToDevice = async () => {
//     try {
//       const device = await navigator.bluetooth.requestDevice({
//         filters: [{ namePrefix: "BBC micro:bit" }],
//         optionalServices: [
//           microbitUuid.genericAccess[0],
//           microbitUuid.genericAttribute[0],
//           microbitUuid.deviceInformation[0],
//           microbitUuid.accelerometerService[0],
//           microbitUuid.magnetometerService[0],
//           microbitUuid.buttonService[0],
//           microbitUuid.ioPinService[0],
//           microbitUuid.ledService[0],
//           microbitUuid.eventService[0],
//           microbitUuid.dfuControlService[0],
//           microbitUuid.temperatureService[0],
//           microbitUuid.uartService[0],
//         ],
//       });
//       await addMicrobit(device); // Wait for the MicrobitComponent to be added
//       console.log("yes")
//     } catch (error) {
//       console.error('Error connecting to device:', error);
//     }
//   };


//   const displayAllMicrobits = (pattern) => {
//     console.log(microbitDevices)
//     for (let m in microbitDevices) {
//       microbitDevices[m].ledMatrixDisplay(pattern);
//     }
//   }

//   const clearDisplays = () => {
//     displayAllMicrobits(patterns["clear"]);
//   }

//   return (
//     <div>
//       <button onClick={connectToDevice}>Connect to Device</button>
//       {errorMessage && <div>{errorMessage}</div>}
//       <div>
//         <h2>Connected Microbits:</h2>
//         <ul>
//           {/* Render MicrobitComponent instances */}
//           {microbitDevices.map((microbitComponent, index) => (
//             <li key={index}>
//               {microbitComponent.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <GameLogic MBList={microbitDevices} clearDisplays={clearDisplays} />
//     </div>
//   );
// };

// export default MicrobitList;


// import React, { useState } from 'react';
// import MicrobitComponent from './MicrobitComponent';
// import { microbitUuid } from '../../utils/Constant';

// const MicrobitList = ({ microbitDevices, setMicrobitDevices }) => { // Receive microbitDevices and setMicrobitDevices as props
//   const [errorMessage, setErrorMessage] = useState('');

//   const addMicrobit = (device) => {
//     if (!microbitDevices.find(dev => dev.name === device.name)) {
//       setMicrobitDevices(prevDevices => [...prevDevices, device]);
//       setErrorMessage('');
//     } else {
//       setErrorMessage(`Device with name "${device.name}" already exists.`);
//     }
//   };
  

//   const removeMicrobit = (deviceName) => {
//     setMicrobitDevices(prevDevices => prevDevices.filter(device => device.name !== deviceName));
//   };

//   const connectToDevice = async () => {
//     try {
//       const device = await navigator.bluetooth.requestDevice({
//         filters: [{ namePrefix: "BBC micro:bit" }],
//         optionalServices: [
//           microbitUuid.genericAccess[0],
//           microbitUuid.genericAttribute[0],
//           microbitUuid.deviceInformation[0],
//           microbitUuid.accelerometerService[0],
//           microbitUuid.magnetometerService[0],
//           microbitUuid.buttonService[0],
//           microbitUuid.ioPinService[0],
//           microbitUuid.ledService[0],
//           microbitUuid.eventService[0],
//           microbitUuid.dfuControlService[0],
//           microbitUuid.temperatureService[0],
//           microbitUuid.uartService[0],
//         ],
//       });
//       addMicrobit(device);
//     } catch (error) {
//       console.error('Error connecting to device:', error);
//     }
//   };

//   const randomMicrobit = () => {
//     if (microbitDevices.length > 0) {
//       const randomIndex = Math.floor(Math.random() * microbitDevices.length);
//       return microbitDevices[randomIndex];
//     } else {
//       return null;
//     }
//   };
  




//   return (
//     <div>
//       <button onClick={connectToDevice}>Connect to Device</button>
//       {errorMessage && <div>{errorMessage}</div>}
//       <div>
//         <h2>Connected Microbits:</h2>
//         <ul>
//           {microbitDevices.map(device => (
//             <MicrobitComponent key={device.name} device={device} removeMicrobit={removeMicrobit} />
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default MicrobitList;
