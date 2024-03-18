import { microbitUuid } from "../../utils/Constant";

// LoggerComponent.js
export function addLog(string, newLine) {
    const logElement = document.getElementById("log");
    if (logElement) {
      logElement.innerHTML += string;
      if (newLine) {
        logElement.innerHTML += "<br>";
      }
    } else {
      console.error("Log element not found.");
    }
  }
  
export function addLogError(string) {
    addLog("<b><font color='red'>" + string + "</font></b>", true);
  }
  
export function clearLog() {
    const logElement = document.getElementById("log");
    if (logElement) {
      logElement.innerHTML = "";
    } else {
      console.error("Log element not found.");
    }
  }


  export function searchUuid(uuid, serviceOrCharacteristic) {
    for (const key in microbitUuid) {
      if (uuid === microbitUuid[key][0]) {
        return "<font color='blue'>" + microbitUuid[key][1] + "</font>";
      }
    }
    if (serviceOrCharacteristic) {
      return "<font color='red'>Unknown Micro:Bit Service</font>";
    } else {
      return "<font color='red'>Unknown Micro:Bit Characteristic</font>";
    }
};
  



/*
  export function buttonAChanged(event) {
    document.getElementById("buttonA").innerHTML = event.target.value.getUint8(0);
  }
  
 
  export function buttonBChanged (event) {
    document.getElementById("buttonB").innerHTML = event.target.value.getUint8(0);
  }
  */
