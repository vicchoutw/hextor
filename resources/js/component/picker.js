import React from 'react';

const ColorPicker = ({text, color}) => (
  <div className='colorPicker'>
    <span>{text}</span>
    <input className='jscolor' value={color} onChange={() => console.log('Color Change!')}></input>
  </div>
)

export default ColorPicker;