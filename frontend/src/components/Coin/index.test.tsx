import React from 'react';
import { render } from '@testing-library/react';
import Coin from '.';

describe('Coin Component', () => {
  it('Check coin label', () => {
    const { getByText } = render(<Coin coin="BTC" currentPrice={-10} oldPrice={10} />);
  
    expect(getByText('BTC'));
  })
});

