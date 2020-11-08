import React from 'react';

import './styles.css';

interface LegendProps {
  legend: string
}

const Legend: React.FC<LegendProps> = ({ legend }) => {
  return (
    <div className="legend">
      {legend}
    </div>
  )
}

export default Legend;