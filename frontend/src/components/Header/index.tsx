import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Coin from '../Coin';

import './styles.css';

interface HeaderProps {
  onSelected: (coin: string) => void
}

interface Price {
  [key:string]: {
    oldPrice: number;
    currentPrice: number;
  }
}

interface Coin {
  [key:string]: {
    BRL: number;
  }
}

const ALL_PRICES = {
  BTC: {
    oldPrice: 0, 
    currentPrice: 0
  },
  LTC: {
    oldPrice: 0, 
    currentPrice: 0
  },
}

const Header: React.FC<HeaderProps> = ({ onSelected }) => {
  const [prices, setPrices] = useState<Price>(ALL_PRICES);

  useEffect(() => {
    const keyCoins = Object.keys(ALL_PRICES).map(coin => {
      return coin;
    });

    const interval = setInterval(async () => {
      const response = await api.get(`pricemulti?fsyms=${keyCoins.join(',')}&tsyms=BRL`);

      Object.keys(response.data).map(coin => {
        setPrices((prevState) => {
          return {
            ...prevState,
            [coin]: {
              oldPrice: prevState[coin].currentPrice,
              currentPrice: response.data[coin].BRL
            }
          }
        })
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header">
      {
        Object.keys(prices).map(coin => (
          <div onClick={() => onSelected(coin)}>
            <Coin key={coin} coin={coin} oldPrice={prices[coin].oldPrice} currentPrice={prices[coin].currentPrice}/>
          </div>
        ))
      }
    </div>
  )
}

export default Header;