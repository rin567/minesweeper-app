import "./Header.css"
import React, { useEffect, useState } from 'react'
import Timer from '../timer/Timer.jsx';
import Smiley from '../smiley/Smiley.jsx'

const Header = ({smiley, setSmiley, start, setStart}) => {

	const [minuties, setMinuties] = useState(40);
  const [seconds, setSeconds] = useState(0);

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


	return(
		<div className="header">
        <Timer time={minuties}/>
        <Smiley
          onClick={startGame}
          smiley={smiley}
          setSmiley = {setSmiley}
        />
        <Timer time={seconds}/>
    </div>
	)
}
export default Header