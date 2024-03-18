import React, { useState, useEffect } from 'react';
import MicrobitComponent from './MicrobitComponent';
import { microbitUuid } from '../../utils/Constant';

const MicrobitList = () => {
  const [microbitNames, setMicrobitNames] = useState([]);

  const addMicrobit = (mb) => {
    setMicrobitNames(prevNames => [...prevNames, mb.props.device.name]);
    mb.setDisconnectCallback(() => {
      console.log("Microbit disconnected:", mb.props.device.name);
      removeMicrobit(mb.props.device.name);
    });
    if (mb.type === MicrobitComponent) {
      mb.setDisconnectCallback(() => {
        console.log("Microbit disconnected:", mb.props.device.name);
        removeMicrobit(mb.props.device.name);
      });
    } else {
       console.error("Invalid component type: expected MicrobitComponent");
    }
  };

  const removeMicrobit = (microbitName) => {
    setMicrobitNames(prevNames => prevNames.filter(name => name !== microbitName));
  };

  useEffect(() => {
    updateUIMicrobitList();
  }, [microbitNames]);

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
      addMicrobit(<MicrobitComponent device={device} />);
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const createButton = (name) => {
    return (
      <li key={name} className="btn btn-outline-primary" disabled>
        {name}
      </li>
    );
  };

  const renderMicrobitButtons = () => {
    return microbitNames.map(name => createButton(name));
  };

  return (
    <div>
      <div id="microbitList">
        {renderMicrobitButtons()}
      </div>
      <button onClick={connectToDevice}>Connect to Device</button>
    </div>
  );
};

export default MicrobitList;
