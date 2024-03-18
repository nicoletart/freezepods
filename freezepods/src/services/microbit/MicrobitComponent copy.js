import React, {useState, useEffect} from "react";
import styles from '../../shared/modetheme.module.css';
import { microbitUuid } from "../../utils/Constant";
import Alert from "./Alert";



const MicrobitComponent = ({device, showAlert}) => {
    const [microbitComponent, setMicrobitComponent] = useState(null);


    useEffect (() => {

      const getName = (fullName) => {
        let regex = /\[([^\]]+)\]/g;
        let nm = regex.exec(fullName);
        return nm[1];
      }

      const buttonPressEvent = (button, deviceName, state) => {
        // console.log(button + " " + deviceName);
        if (state === 1) {
          this.dispatchEvent(
            new CustomEvent("microbitButtonPress", {
              bubbles: true,
              detail: { button: button, deviceName: deviceName },
            })
          );
        }
      
        return { button: button, deviceName: deviceName };
      }


        const initiateChars = () => {
            this.ledservice = null;
            this.matrixChar = null;
            this.textChar = null;
            this.delayChar = null;
            this.buttonService = null;
            this.buttonAChar = null;
            this.buttonBChar = null;
            this.deviceName = null;
        
            // NICOLE
            this.buttonUARTService = null;
            this.txCharacteristic = null;
            this.rxCharacteristic = null;
        
            this.ioPinService = null;
            this.pinData = null;
            this.pinIOConfiguration = null;
            //
        };

        const setDisconnectCallback = (callback) => {
            this.disconnectCallback = callback;
        }

        const getMicrobitName = () => {
            return this.name;
        }

        const setButtonCallback = (callback) => {
            this.buttonCallback = callback;
        }

        const buttonAChanged = (event) => {
            console.log("BBBBB:", event);
            let devName = getName(event.currentTarget.service.device.name);
            let state = event.target.value.getUint8(0);
            console.log(event, state);
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
            console.log("PINPINPIN");
            let devName = getName(event.currentTarget.service.device.name);
            let state = event.target.value.getUint8(0);
            console.log("STATE:", state);
            pinTouchEvent(devName, state);
        
            // if (this.buttonCallback) {
            //   this.buttonCallback(this, "b");
            // }
        }


        const pinTouchEvent = (deviceName, state)=> {
          // console.log(button + " " + deviceName);
          if (state === 1 || state === 2) {
            this.dispatchEvent(
              new CustomEvent("pinTouchEvent", {
                bubbles: true,
                detail: { state: state, deviceName: deviceName },
              })
            );
          }
        
          return { state: state, deviceName: deviceName };
        }

        const onTxCharacteristicValueChanged = (event) => {
            let devName = getName(event.currentTarget.service.device.name);
            let state = event.target.value.getUint8(0);
            let enc = new TextDecoder("utf-8");
          

        };


        const ledMatrixDisplay = async (pattern) => {
            // addLog("Writing LED matrix... ", false);
            if (!this.matrixChar) {
              // addLogError("There is no LED Matrix characteristic.");
              showAlert(
                "No LED Matrix characteristic found. Maybe reconnect the microbit or refresh the whole page"
              );
              return false;
            } else {
              let buffer = new ArrayBuffer(5);
              let ledMatrix = new DataView(buffer);
              for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
                ledMatrix.setUint8(rowIndex, 0);
                for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
                  // console.log(ledMatrix.getUint8(rowIndex) | (document.getElementById((rowIndex+1).toString() + (5-columnIndex).toString()).checked << columnIndex));
                  ledMatrix.setUint8(
                    rowIndex,
                    ledMatrix.getUint8(rowIndex) |
                      ((pattern[rowIndex][4 - columnIndex] === 1) << columnIndex)
                  );
                }
              }
              // console.log(ledMatrix);
              await this.matrixChar
                .writeValue(ledMatrix)
                .then((_) => {
                  return true;
                })
                .catch((error) => {
                  console.log(error);
                });
            }
        };

        const ledTextDisplay = async (string) => {
            await this.textChar
              .writeValue(this.enc.encode(string))
              .then((_) => {
                return true;
              })
              .catch((error) => {
                console.error(error);
                showAlert("LED Text printing didn't work, reconnect microbit");
                return false;
              });
            return true;
        };

        const populateCharacteristics = async (device) => {
            let server = await device.gatt.connect();
        
            this.name = getName(device.name);
            console.log(this.name);
            console.log("server: ", server)
        
            console.log("YEAH:", microbitUuid.ioPinService[0]);
            // console.log(device.optionalServices.microbitUuid.ioPinService[0])
        
            this.ioPinService = await server.getPrimaryService(
              microbitUuid.ioPinService[0]
            );
        
            console.log(this.ioPinService)
            this.ledservice = await server.getPrimaryService(
              microbitUuid.ledService[0]
            );
            console.log(this.ledservice);
            this.matrixChar = await this.ledservice.getCharacteristic(
              microbitUuid.ledMatrixState[0]
            );
            this.textChar = await this.ledservice.getCharacteristic(
              microbitUuid.ledText[0]
            );
            this.delayChar = await this.ledservice.getCharacteristic(
              microbitUuid.scrollingDelay[0]
            );
            this.buttonService = await server.getPrimaryService(
              microbitUuid.buttonService[0]
            );
            this.buttonAChar = await this.buttonService.getCharacteristic(
              microbitUuid.buttonAState[0]
            );
            console.log("BUTTONA", this.buttonAChar);
            await this.buttonAChar
              .startNotifications()
              .then((_) => {
                console.log("A great big button A");
                this.buttonAChar.addEventListener(
                  "characteristicvaluechanged",
                  this.buttonAChanged
                );
                console.log("INTERESTING:", this.buttonAChar);
              })
              .catch((error) => {
                console.error(error);
              });
            this.buttonBChar = await this.buttonService.getCharacteristic(
              microbitUuid.buttonBState[0]
            );
            await this.buttonBChar
              .startNotifications()
              .then((_) => {
                this.buttonBChar.addEventListener(
                  "characteristicvaluechanged",
                  this.buttonBChanged
                );
              })
              .catch((error) => {
                console.error(error);
              });
        
            // NICOLE
        
            this.buttonUARTService = await server.getPrimaryService(
              microbitUuid.uartService[0]
            );
        
            console.log("UARTUART:", this.buttonUARTService);
        
            this.txCharacteristicChar = await this.buttonUARTService.getCharacteristic(
              microbitUuid.txCharacteristic[0]
            );
            await this.txCharacteristicChar
              .startNotifications()
              .then((_) => {
                this.txCharacteristicChar.addEventListener(
                  "characteristicvaluechanged",
                  this.onTxCharacteristicValueChanged
                );
              })
              .catch((error) => {
                console.error(error);
              });
        
            this.rxCharacteristicChar = await this.buttonUARTService.getCharacteristic(
              microbitUuid.rxCharacteristic[0]
            );
        
            this.pinData = await this.ioPinService.getCharacteristic(
              microbitUuid.pinData[0]
            );
            /*
            await this.pinData
              .startNotifications()
              .then((_) => {
                console.log("I want a pin");
                this.pinData.addEventListener(
                  "pincharacteristicvaluechanged",
                  this.pinDataChanged
                );
              })
              .catch((error) => {
                console.error(error);
              });
        
            console.log("pindata:", this.pinData);
            
            */
            /*
            this.buttonUARTService0 = await this.buttonUARTService.getCharacteristic(
              microbitUuid._____[0]
               await this.buttonUARTService0
              .startNotifications()
              .then((_) => {
                this.buttonUARTService0.addEventListener(
                  "characteristicvaluechanged",
                  this.buttonUARTServiceC0Changed
            
            */
        };

        const microbit = {
            initiateChars,
            setDisconnectCallback,
            getMicrobitName,
            setButtonCallback,
            buttonAChanged,
            buttonBChanged,
            pinDataChanged,
            onTxCharacteristicValueChanged,
            ledMatrixDisplay,
            ledTextDisplay,
            populateCharacteristics,
        };

        microbit.populateCharacteristics(device);
        setMicrobitComponent(microbit);
        

        return () => {

        };




    }, [device]);

    if (!microbitComponent){
        return <div>Loading...</div>
    }
    return (
        <div></div>
    );




};
export default MicrobitComponent;