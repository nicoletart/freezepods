// import { microbitUuid } from "../../../old/button"; 
import { microbitUuid } from "../src/utils/Constant";
import { Context, createContext, useState } from "react";
import React from "react";
import { addLog, addLogError, clearLog } from "../src/services/button/Log";
import { bluetoothDevice, patterns } from "../src/utils/Constant";
// import Microbit from "./microbit";


export function getName(fullName) {
  let regex = /\[([^\]]+)\]/g;
  let nm = regex.exec(fullName);
  return nm[1];
}

export function buttonPressEvent(button, deviceName, state){
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

export function pinTouchEvent(deviceName, state) {
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
/*
function onTXLightEvent(deviceName, lightLevel){
  if (lightLevel > 240){
    console.log("WORKED")
    this.dispatchEvent(
      new CustomEvent("lightLevel255", {
        bubbles: true,
        detail: { lightLevel: lightLevel, deviceName: deviceName },
      })
    );
  }
}
  */

//


////!!!!
export class Microbit {
  // let ledMatrixChar, ledTextChar, scrollingChar, buttonChar;
  constructor(device) {
    // this.initiateChars();
    this.disconnectCallback = null;
    // let this.
    this.buttonCallback = null;
    this.name = getName(device.name);
    device.addEventListener(
      "gattserverdisconnected",
      this.disconnectMicrobit.bind(this)
    );
    this.populateCharacteristics(device);
    this.enc = new TextEncoder();
  //  this.context.bind(this);
   // this.bind =
  }

  initiateChars() {
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
    //
  }

  setDisconnectCallback(callback) {
    this.disconnectCallback = callback;
  }

  disconnectMicrobit(event) {
    if (this.disconnectCallback) {
      this.disconnectCallback(this);
    }
  }

  getMicrobitName() {
    return this.name;
  }

  setButtonCallback(callback) {
    this.buttonCallback = callback;
  }

  buttonAChanged(event) {
    console.log("BBBBB:", event);
    let devName = getName(event.currentTarget.service.device.name);
    let state = event.target.value.getUint8(0);
    console.log(event, state);
    buttonPressEvent("a", devName, state);
    // console.log(this.getMicrobitName());

    if (this.buttonCallback) {
      this.buttonCallback(this, "a");
    }
  }

  buttonBChanged(event) {
    let devName = getName(event.currentTarget.service.device.name);
    let state = event.target.value.getUint8(0);
    buttonPressEvent("b", devName, state);

    if (this.buttonCallback) {
      this.buttonCallback(this, "b");
    }
  }

  static pinDataChanged(event) {
    console.log("PINPINPIN");
    let devName = getName(event.currentTarget.service.device.name);
    let state = event.target.value.getUint8(0);
    console.log("STATE:", state);
    pinTouchEvent(devName, state);

    // if (this.buttonCallback) {
    //   this.buttonCallback(this, "b");
    // }
  }

  onTxCharacteristicValueChanged(event) {
    let devName = getName(event.currentTarget.service.device.name);
    let state = event.target.value.getUint8(0);
    // buttonHoverEvent("", devName, state);
    // console.log(event.target.value);
    // console.log(event.target.value.getUint8(0));
    let enc = new TextDecoder("utf-8");
    // console.log(event.target.value)
    // console.log(enc.decode(event.target.value));
    ////  onTXLightEvent(devName, enc.decode(event.target.value))
    // document.getElementById("tx").innerHTML += enc.decode(event.target.value) + "<br>";
    //addLog("<font color='green'>OK</font>", true);
  }
  //

  async ledMatrixDisplay(pattern) {
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
  }

  async ledTextDisplay(string) {
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
  }


  async populateCharacteristics(device) {
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

    //

    //     this.pinIOConfiguration = await this.ioPinService.getCharacteristic(
    //         microbitUuid.pinIOConfiguration[0]
    //     );

    //     console.log("IONION:", this.ioPinService)
    //     console.log("IONION:", this.pinIOConfiguration)
  }
}
//export {Microbit, Microbit.pinDataChanged};


////!!!!
export class MicrobitList {
  constructor() {
    this.microbits = {};
  }
  // create a new player and save it in the collection
  addMicrobit(mb) {
    this.microbits[mb.getMicrobitName] = mb;
    mb.setDisconnectCallback((mb) => {
      console.log("removing microbit");
      this.removeMicrobit(mb);
    });
    console.log(this.microbits);
    updateUIMicrobitList();
  }

  removeMicrobit(microbit) {
    delete this.microbits[microbit.name];
    updateUIMicrobitList();
  }

  displayAllMicrobits(pattern) {
    for (let m in this.microbits) {
      this.microbits[m].ledMatrixDisplay(pattern);
    }
  }

  clearDisplays() {
    this.displayAllMicrobits(patterns["clear"]);
  }

  get nameList() {
    return Object.keys(this.microbits);
  }

  get randomMicrobit() {
    // console.log(this.numberOfMicrobits);
    if (this.numberOfMicrobits > 0) {
      let randomName =
        this.nameList[Math.floor(Math.random() * this.nameList.length)];
      return this.microbits[randomName];
    } else {
      return;
    }
  }

  get mbList() {
    return this.microbits;
  }
  // this could include summary stats like average score, etc. For simplicy, just the count for now
  get numberOfMicrobits() {
    return this.nameList.length;
  }
}

export const toastLiveExample = document.getElementById("liveToast");
export const toastBody = document.getElementById("toastBody");

export function showAlert(text){
  const toastBootstrap = window.bootstrap.Toast.getOrCreateInstance(toastLiveExample, {
    delay: 1500,
  });
  toastBody.textContent = text;
  toastBootstrap.show();
}

export function createButton(name) {
  let newButton = document.createElement("button");
  newButton.classList.add("btn", "btn-outline-primary");
  newButton.disabled = true;
  newButton.textContent = name;
  return newButton;
}

export function updateUIMicrobitList() {
  let ml = document.getElementById("microbitList");
  ml.replaceChildren();
  let names = MBList.nameList;
  console.log(names);
  for (let i in names) {
    ml.appendChild(createButton(names[i]));
  }
}

export function updateGameBlock (gameState) {
  console.log(gameState);
  let states = ["running", "inactive"];
  if (!states.includes(gameState)) {
    console.log("didn't find gameState");
    gameState = "inactive";
  }

  let classUpdates = {
    gameBlock: {
      running: "text-bg-success",
      inactive: "text-bg-secondary",
    },
  };

  let textUpdates = {
    gameBlockHeader: {
      running: "Game Running!",
      inactive: "Press Start Game to Start!",
    },
    gameCountdown: {
      running: "0",
      inactive: "Score Here",
    },
    scoreText: {
      running: "0",
      inactive: "Updates Here",
    },
  };

  let gb;
  for (var k in classUpdates) {
    gb = document.getElementById(k);
    gb.classList = "";
    gb.classList.add("card", classUpdates[k][gameState]);
  }

  for (var k in textUpdates) {
    gb = document.getElementById(k);
    gb.textContent = textUpdates[k][gameState];
  }
}


export const showReward = async (score, reward) => {
  let scoreText = document.getElementById("gameCountdown");
  let plusText = document.getElementById("scoreText");

  scoreText.textContent = score;

  plusText.classList.remove("fade");
  plusText.textContent = "+" + reward;

  await new Promise((r) => setTimeout(r, 900));
  plusText.classList.add("fade");
}


export var endGameBoolean = false;

export let MBList = new MicrobitList();

let gameScores = [];
let round = gameScores.length;
export function addRoundRow() {
  round = gameScores.length;
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.setAttribute("scope", "row");
  th.textContent = round;
  let td = document.createElement("td");
  td.id = "round" + round + "score";
  tr.appendChild(th);
  tr.appendChild(td);
  let tbd = document.getElementById("tableBody");
  tbd.appendChild(tr);
}

export function updateRoundScore(round, score) {
  let td = document.getElementById("round" + round + "score");
  td.textContent = score;
}

let gameRunning = false;

export const startingSequence = async () => {
  MBList.displayAllMicrobits(patterns["3"]);
  await new Promise((r) => setTimeout(r, 1000));
  MBList.displayAllMicrobits(patterns["2"]);
  await new Promise((r) => setTimeout(r, 1000));
  MBList.displayAllMicrobits(patterns["1"]);
  await new Promise((r) => setTimeout(r, 1000));
  MBList.displayAllMicrobits(patterns["clear"]);
  return true;
}

export const startGame = async () => {
  console.log("startGame")
  let thisGameScore = 0;
  endGameBoolean = false;

  //
  const gameRounds = 8;
  if (!gameRunning && MBList.numberOfMicrobits > 0) {
    gameRunning = true;
    updateGameBlock("running");

    gameScores.push(thisGameScore);
    round = gameScores.length;
    addRoundRow();

    await startingSequence();
    for (let i = 0; i < gameRounds; i++) {
      if (endGameBoolean !== true) {
        // console.log(i);

        let randomBit = MBList.randomMicrobit;

        console.log(randomBit.getMicrobitName());
        let enc = new TextDecoder("utf-8");
        // console.log("HERE:", enc.decode(event.target.value))

        // console.log(randomBit);
        randomBit.ledMatrixDisplay(patterns["O"]);
        let startTime = Date.now();
        console.log(this);
        let output = await startWait(this, 3000);
        let endTime = Date.now();
        let success = 0;
        // console.log(output, output["key"] === "button press");
        console.log("OUTPUT:", output);

        if (output["key"] === "button press") {
          // console.log(output);
          // console.log("button spotted in time", randomBit.getMicrobitName, output["deviceName"], output["deviceName"] == randomBit.getMicrobitName);
          if (output["deviceName"] === randomBit.getMicrobitName) {
            let speed = endTime - startTime;
            let speedScore = 30 - Math.floor(speed / 100);
            success = 1 * speedScore;
            // console.log(speed, speedScore, success);
          } else {
            success = -10;
          }
        }

        thisGameScore += success;
        showReward(thisGameScore, success);
        gameScores[round - 1] = thisGameScore;
        updateRoundScore(round, thisGameScore);
        MBList.clearDisplays();
        let waitTime = Math.random() * 1500 + 500;
        await new Promise((r) => setTimeout(r, waitTime));
      } else {
        break;
      }
    }
    gameRunning = false;
    updateGameBlock("inactive");
  } else if (MBList.numberOfMicrobits === 0) {
    showAlert("No microbits connected!");
  }
  endGameBoolean = true;
}


  const startWait = async (tt, timeoutDuration) => {
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ key: "time end" });
    }, timeoutDuration);
  });
   let fn = tt;
   console.log(fn)
  /*
  const lightLevelPromise = new Promise((resolve) => {
    fn.addEventListener("lightLevel255", (event) => {
      return resolve({
        key: "light level 255",
        lightLevel: event.detail.lightLevel,
        deviceName: event.detail.deviceName,
      });
    });
  });

  // Wait for either promise to resolve
  let retVal = {"key": "empty"};
  fn.removeEventListener("lightLevel255",  (event) => {
     console.log(event)}, false);
  await Promise.race([timeoutPromise, lightLevelPromise]).then((value) => {
    // console.log(value);
    retVal = value;
    console.log(retVal);
    return value;
  });
  
  */

 const buttonPromise = new Promise((resolve) => {
    console.log("fn: ", fn)
    fn.addEventListener("microbitButtonPress", (event) => {
      resolve({
        key: "button press",
        button: event.detail.button,
        deviceName: event.detail.deviceName,
      });
    });
  });

  // Wait for either promise to resolve
  let retVal = {"key": "empty"};
  fn.removeEventListener(
    "microbitButtonPress",
    (event) => {
      console.log(event);
    },
    false
  );
  await Promise.race([timeoutPromise, buttonPromise]).then((value) => {
    // console.log(value);
    retVal = value;
    console.log(retVal);

  });

  return retVal;
}


// Call the function with a timeout duration in milliseconds (e.g., 5000 for 5 seconds)

export function endGame() {
  endGameBoolean = true;
  console.log(endGameBoolean);

}




// Create a context object
//export const MyContext = React.createContext();

console.log("MBList: ", MBList)
export const MyContext = createContext();
const MyMicrobit = ({children}) => {
  const [myMicrobitList, setMyMicrobitList] = useState(MBList);

  console.log("MyMicrobit.myMicrobitList", myMicrobitList)


  const disconnect = async() => {
    addLog("Disconnecting... ", false);
    if (!bluetoothDevice) {
      addLogError("There is no device connected.");
    } else {
      if (bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
        const body = document.getElementById("body");
        body.style = "background-color:#FFD0D0";
        
        if (!bluetoothDevice.gatt.connected) {
          addLog("<font color='green'>OK</font>", true);
        }
      } else {
        addLogError("There is no device connected.");
      }
    }
  }




  //???????
  const connect = async () => {
    if (!navigator.bluetooth) {
      console.error("Bluetooth not available in this browser or computer.");
      alert("Bluetooth not available in this browser or computer.");
    } else {
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
      bluetoothDevice = device;
      console.log(device.name);
      let mb = new Microbit(device);
      MBList.addMicrobit(mb);
      console.log(MBList);
      setMyMicrobitList(MBList);
      
    // return mb;
    }
  };
  const [data, setData] = React.useState({ value: 1 });
  console.log("D:", data)
  return (
    <MyContext.Provider value={{myMicrobitList, setMyMicrobitList, connect}}>
      {children}
    </MyContext.Provider>
  );

}
export default MyMicrobit;