import React, { useState, useEffect } from "react";
import { microbitUuid } from "../src/utils/Constant";
import Alert from "../src/services/microbit/Alert";

const MicrobitComponent = ({ device, showAlert }) => {
  const [microbitComponent, setMicrobitComponent] = useState(null);

  useEffect(() => {
    const getName = (fullName) => {
      let regex = /\[([^\]]+)\]/g;
      let nm = regex.exec(fullName);
      return nm[1];
    };

    const buttonPressEvent = (button, deviceName, state) => {
      if (state === 1) {
        document.dispatchEvent(
          new CustomEvent("microbitButtonPress", {
            bubbles: true,
            detail: { button: button, deviceName: deviceName },
          })
        );
      }

      return { button: button, deviceName: deviceName };
    };

    const initiateChars = () => {
      let buttonEventListener;
      this.ledservice = null;
      this.matrixChar = null;
      this.textChar = null;
      this.delayChar = null;
      this.buttonService = null;
      this.buttonAChar = null;
      this.buttonBChar = null;
      this.deviceName = null;

      this.buttonUARTService = null;
      this.txCharacteristic = null;
      this.rxCharacteristic = null;

      this.ioPinService = null;
      this.pinData = null;
      this.pinIOConfiguration = null;
    };

    const setDisconnectCallback = (callback) => {
      this.disconnectCallback = callback;
    };

    const getMicrobitName = () => {
      return this.name;
    };

    const setButtonCallback = (callback) => {
      this.buttonCallback = callback;
    };

    const buttonAChanged = (event) => {
      let devName = getName(event.currentTarget.service.device.name);
      let state = event.target.value.getUint8(0);
      buttonPressEvent("a", devName, state);

      if (this.buttonCallback) {
        this.buttonCallback(this, "a");
      }
    };

    const buttonBChanged = (event) => {
      let devName = getName(event.currentTarget.service.device.name);
      let state = event.target.value.getUint8(0);
      buttonPressEvent("b", devName, state);

      if (this.buttonCallback) {
        this.buttonCallback(this, "b");
      }
    };

    const pinDataChanged = (event) => {
      let devName = getName(event.currentTarget.service.device.name);
      let state = event.target.value.getUint8(0);
      console.log("STATE:", state);
      pinTouchEvent(devName, state);
    };

    const pinTouchEvent = (deviceName, state) => {
      if (state === 1 || state === 2) {
        document.dispatchEvent(
          new CustomEvent("pinTouchEvent", {
            bubbles: true,
            detail: { state: state, deviceName: deviceName },
          })
        );
      }

      return { state: state, deviceName: deviceName };
    };

    const onTxCharacteristicValueChanged = (event) => {
      let devName = getName(event.currentTarget.service.device.name);
      let state = event.target.value.getUint8(0);
      let enc = new TextDecoder("utf-8");
    };

    const ledMatrixDisplay = async (pattern) => {
      if (!microbitComponent || !microbitComponent.matrixChar) {
        showAlert(
          "No LED Matrix characteristic found. Please reconnect the micro:bit."
        );
        return;
      }

      const matrixChar = microbitComponent.matrixChar;
      const buffer = new ArrayBuffer(5);
      const ledMatrix = new DataView(buffer);

      // Convert the pattern into a format suitable for the LED matrix
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
        // Write the LED matrix data to the characteristic
        await matrixChar.writeValue(ledMatrix);
      } catch (error) {
        console.error("Error writing LED matrix data:", error);
        showAlert("Failed to write LED matrix data. Please try again.");
      }
    };

    initiateChars();
    populateCharacteristics(device);
    setMicrobitComponent({ ledMatrixDisplay });

    return () => {
      // Cleanup code if needed
    };
  }, [device]);

  if (!microbitComponent) {
    return <div>Loading...</div>;
  }
  return <div></div>;
};

export default MicrobitComponent;
