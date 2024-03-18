import React, { Component } from "react";
import { microbitUuid } from "../../utils/Constant";
import Alert from "./Alert";

class MicrobitComponent extends Component {
    constructor(props) {
        super(props);
        console.log("Props received by MicrobitComponent:", props);

        this.state = {
          microbitName: '',
          microbitComponent: null
        };
    }

    componentDidMount() {
        this.populateCharacteristics(this.props.device);
    }

    getName(fullName) {
        let regex = /\[([^\]]+)\]/g;
        let nm = regex.exec(fullName);
        return nm[1];
    }

    buttonPressEvent(button, deviceName, state) {
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

    initiateChars() {
        this.name = "";
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
    }

    setDisconnectCallback(callback) {
        this.disconnectCallback = callback;
    }

    getMicrobitName() {
        return this.name;
    }

    setButtonCallback(callback) {
        this.buttonCallback = callback;
    }

    buttonAChanged(event) {
        let devName = this.getName(event.currentTarget.service.device.name);
        let state = event.target.value.getUint8(0);
        this.buttonPressEvent("a", devName, state);
    
        if (this.buttonCallback) {
            this.buttonCallback(this, "a");
        }
    }

    buttonBChanged(event) {
        let devName = this.getName(event.currentTarget.service.device.name);
        let state = event.target.value.getUint8(0);
        this.buttonPressEvent("b", devName, state);
    
        if (this.buttonCallback) {
            this.buttonCallback(this, "b");
        }
    }

    pinDataChanged(event) {
        let devName = this.getName(event.currentTarget.service.device.name);
        let state = event.target.value.getUint8(0);
        this.pinTouchEvent(devName, state);
    }

    pinTouchEvent(deviceName, state) {
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

    onTxCharacteristicValueChanged(event) {
        let devName = this.getName(event.currentTarget.service.device.name);
        let state = event.target.value.getUint8(0);
        let enc = new TextDecoder("utf-8");
    }

    async ledMatrixDisplay(pattern) {
        if (!this.matrixChar) {
            this.props.showAlert(
                "No LED Matrix characteristic found. Maybe reconnect the microbit or refresh the whole page"
            );
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
            await this.matrixChar
                .writeValue(ledMatrix)
                .then((_) => {
                    return true;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    async ledTextDisplay(string) {
        await this.textChar
            .writeValue(this.enc.encode(string))
            .then((_) => {
                return true;
            })
            .catch((error) => {
                console.error(error);
                this.props.showAlert("LED Text printing didn't work, reconnect microbit");
                return false;
            });
        return true;
    }

    async populateCharacteristics(device) {
        let server = await device.gatt.connect();
    
        this.name = this.getName(device.name);
    
        this.ioPinService = await server.getPrimaryService(
            microbitUuid.ioPinService[0]
        );
    
        this.ledservice = await server.getPrimaryService(
            microbitUuid.ledService[0]
        );
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
        await this.buttonAChar
            .startNotifications()
            .then((_) => {
                this.buttonAChar.addEventListener(
                    "characteristicvaluechanged",
                    this.buttonAChanged
                );
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
    
        this.buttonUARTService = await server.getPrimaryService(
            microbitUuid.uartService[0]
        );
    
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
        this.setState({ microbitName: this.getName(device.name), microbitComponent: this });

    }

    render() {
        const { microbitComponent } = this.state;
        if (!microbitComponent) {
            return <div>Loading...</div>;
        }
        return (
            <div></div>
        );
    }
}

export default MicrobitComponent;
