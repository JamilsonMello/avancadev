import React, { useState } from 'react';
import Chart from '../../components/Chart';
import Header from '../../components/Header';

import './style.css';

function App() {
  const [coinSelected, setCoinSelected] = useState('BTC');
  
  return (
    <div className="App">
      <Header onSelected={(coin) => setCoinSelected(coin)}/>
      <Chart coin={coinSelected}/>
    </div>
  );
}

export default App;
