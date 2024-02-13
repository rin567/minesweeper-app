import './styles/App.css'
import React, { useState } from 'react';
import Field from './components/field/Field.jsx';
import Header from './components/header/Header.jsx'

function App() {
  
  // Объявление состояний
  const [smiley, setSmiley] = useState('happy');
  const [start, setStart] = useState(0);
  
  return (
    <div className="App">
      <Header 
        smiley={smiley}
        setSmiley={setSmiley}
        start={start}
        setStart={setStart} 
      />
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
