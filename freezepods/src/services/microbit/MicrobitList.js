import React, { useState, useEffect } from 'react';
import { patterns } from '../../utils/Constant';
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
    // Your other logic for adding a micro:bit...
  };

  const removeMicrobit = (microbitName) => {
    setMicrobitNames(prevNames => prevNames.filter(name => name !== microbitName));
    // Your other logic for removing a micro:bit...
  };

  useEffect(() => {
    // Your useEffect logic here...
    updateUIMicrobitList();
  }, [microbitNames]);

  const connectToDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        // To accept all devices, use acceptAllDevices: true and remove filters.
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

  const updateUIMicrobitList = () => {
    // No need to manipulate the DOM directly
    // Render the micro:bit names using JSX
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
