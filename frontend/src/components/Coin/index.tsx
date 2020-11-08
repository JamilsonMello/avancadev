import React from 'react';

import './styles.css';

interface CoinProps {
  coin: string;
  oldPrice: number;
  currentPrice: number;
}

const Coin: React.FC<CoinProps> = ({ coin, currentPrice, oldPrice, children }) => {
  return (
    <div className={`coin ${oldPrice < currentPrice ? 'up' : 'down'}`}>
      <span>{coin}</span>
      <span>R$ {currentPrice.toLocaleString()}</span>
    </div>  
  )
}

export default Coin;