require('./plugins/jscolor.min.js');
const ClipboardJS = require('clipboard');

import React from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './component/base';
import '../sass/app.scss';

new ClipboardJS('#copy');

class AppComponent extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <BaseComponent />
    )
  }
}

ReactDOM.render(<AppComponent/>, document.getElementById('app'));