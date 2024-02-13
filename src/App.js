import './styles/App.css'
import React, { useState, useEffect } from 'react';
import Timer from './components/timer/Timer.jsx';
import Smiley from './components/smiley/Smiley.jsx'
import Field from './components/field/Field.jsx';

function App() {
  
  // Объявление состояний
  const [minuties, setMinuties] = useState(40);
  const [seconds, setSeconds] = useState(0);
  const [smiley, setSmiley] = useState('happy');
  const [start, setStart] = useState(0);
  
  // Таймер
  function tick() {
    if(minuties === 0 && seconds === 0) {
      setSmiley('loser');
      setStart(0)
      return
    }
    if(seconds === 0){
      setMinuties(minuties-1)
      setSeconds(59)
    } else {
      setSeconds(seconds-1)
    }
  }
  useEffect(() => {
    if(start) {
      const timerID = setInterval(() => tick(), 1000);
      return () => clearInterval(timerID);
    }
  });

  // Старт игры
  function startGame() {
    setStart((start) => start+=1 );
    setMinuties(40);
    setSeconds(0);
    setSmiley('happy');
  }

  return (
    <div className="App">
      <div className="header">
        <Timer time={minuties}/>
        <Smiley
          onClick={startGame}
          smiley={smiley}
          setSmiley = {setSmiley}
        />
        <Timer time={seconds}/>
      </div>
      <div className='fieldContainer'>
        <Field
          setSmiley={setSmiley}
          start={start}
          setStart={setStart}
        />
      </div>
    </div>
  );
}

export default App;
