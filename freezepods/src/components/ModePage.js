import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ModeTheme from '../shared/ModeTheme';
import MicrobitList from '../services/microbit/MicrobitList'; // Import MicrobitList
import GameLogic from '../services/microbit/GameLogic';
// import BlocklyComponent from 'blockly-react-component'
// import ReactBlockly from "react-blockly";
// import Blockly from "blockly";

const ModePage = () => {
  const { gameId, modeId } = useParams();
  const modeTheme = ModeTheme.getTheme(gameId, modeId);

  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const showAlertHandler = (text) => {
    setAlertText(text);
    setShowAlert(true);
  };

  const [microbitDevices, setMicrobitDevices] = useState([]);

  const initialXml =
    '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>';
  const toolboxCategories = [
    {
      name: "Custom",
      colour: "#5CA699",
      blocks: [
        {
          type: "stringOf",
        },
        {
          type: "responceontext",
        },
        {
          type: "simplebot",
        },
        {
          type: "text",
        },
        {
          type: "regexInput",
        },
      ],
    },
    {
      name: "Logic",
      colour: "#5C81A6",
      blocks: [
        {
          type: "controls_if",
        },
        {
          type: "logic_compare",
        },
      ],
    },
    {
      name: "Math",
      colour: "#5CA65C",
      blocks: [
        {
          type: "math_round",
        },
        {
          type: "math_number",
        },
      ],
    },
  ];
  function workspaceDidChange(workspace) {
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    document.getElementById("generated-xml").innerText = newXml;

    const code = Blockly.JavaScript.workspaceToCode(workspace);
    document.getElementById("code").value = code;
  }
  function runCode() {
    // Generate JavaScript code and run it.
    console.log('AXAXAXAX');
    const code = document.getElementById("code").value
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
      eval(code);
    } catch (e) {
      alert(e);
    }
  }





  return (
    <div>
      <h2>{`Game ${gameId} - ${modeId}`}</h2>
      <div style={{ background: modeTheme.backgroundColor, color: modeTheme.textColor }}>
        <p>This is the content for Game {gameId}, {modeId}.</p>
      </div>
      
      <div>
        <MicrobitList microbitDevices={microbitDevices} setMicrobitDevices={setMicrobitDevices} />
      </div>
      
    </div>
  );
};

export default ModePage;
