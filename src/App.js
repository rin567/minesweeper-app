import './styles/App.css'
import React, { useState, useEffect } from 'react';
import Timer from './components/timer/Timer.jsx';
import Smiley from './components/smiley/Smiley.jsx'
import Field from './components/field/Field.jsx';

function App() {
  // Объявление констант
  const myMask = [{base: 'Base'}, {transparent: 'null'}, {flag: 'Flag'}, {question: 'Question'}];
  const size = 16;
  const bomb = -1;

  // Создание поля
  function createField(size) {
    const myField = Array(size*size).fill(0);

    function inc(x, y) {
      if(x >= 0 && x < size && y >= 0 && y < size) {
        if(myField[y * size + x] === bomb) return;
        myField[y * size + x] += 1;
      }
    }
    // Распределение бомб, i = количество бомб
    for(let i=0; i< size*2;) {
      const x = Math.floor(Math.random()*size);
      const y = Math.floor(Math.random()*size);

      if(myField[y * size + x] === bomb) continue;

      myField[y * size + x] = bomb;
      i++;

      inc(x+1, y);
      inc(x-1, y);
      inc(x, y+1);
      inc(x, y-1);
      inc(x+1, y-1);
      inc(x-1, y-1);
      inc(x+1, y+1);
      inc(x-1, y+1);
    }
    return myField
  }

  // Объявление состояний
  const [minuties, setMinuties] = useState(40);
  const [seconds, setSeconds] = useState(0);
  const [smiley, setSmiley] = useState('happy');
  const [start, setStart] = useState(false);
  const [field, setField] = useState(() => createField(size));
  const [mask, setMask] = useState(() => Array(size*size).fill(myMask[0].base))


  // Таймер
  function tick() {
    if(minuties === 0 && seconds === 0) {
      setSmiley('loser');
      setStart(false)
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
    setStart(true);
    setMinuties(40);
    setSeconds(0);
    setSmiley('happy');
    setField(() => createField(size));
    setMask(() => Array(size*size).fill(myMask[0].base));
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
          field={field}
          setField={setField}
          mask={mask}
          setMask={setMask}
          myMask={myMask}
          size={size}
          bomb={bomb}
        />
      </div>
    </div>
  );
}

export default App;
