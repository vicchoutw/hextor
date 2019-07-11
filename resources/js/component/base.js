import React from 'react';
import ColorPicker from './picker';

let colorArray, colorBtoR, $colors;

let _default = {
  colorTween: {
    steps: 30,
    colors: []
  }
}

class BaseComponent extends React.Component {
  constructor() {
    super();
    this.onClickCloseMask = this.onClickCloseMask.bind(this);
    this.onClickCopyResult = this.onClickCopyResult.bind(this);
    this.includeNewColor = this.includeNewColor.bind(this);
    this.generateOnClick = this.generateOnClick.bind(this);
    this.updateTweenSteps = this.updateTweenSteps.bind(this);
    this.state = {
      steps: '30',
      genActive: '',
      maskShow: {
        display: 'none'
      },
      resultValue: ''
    }
  }

  onClickCloseMask() {
    colorArray = [];
    _default.colorTween.colors = [];
    this.setState({ maskShow: {display: 'none'}, genActive: '' });
  }
  
  onClickCopyResult() {
    alert('Copied!!');
  }

  // Calculate Hex Color Tween
  calculateHexTween() {
    const parseColor = function (hexStr) {
      return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) {
        return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) {
          return parseInt(s, 16);
        }
      );
    };
    const pad = function (s) {return s.length === 1 ? '0' + s : s;};
    const gradientColors = function (start, end, steps, gamma) {
      let i;
      let j;
      let ms;
      let me;
      let output = [];
      let so = [];
      gamma = gamma || 1;
      const normalize = function (channel) {
        return Math.pow(channel / 255, gamma);
      };
      start = parseColor(start).map(normalize);
      end = parseColor(end).map(normalize);
      for (i = 0; i < steps; i = i + 1) {
        ms = i / (steps - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j = j + 1) {
          so[j] = pad(
            Math.round(
              Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255
            ).toString(16)
          );
        }
        
        output.push('#' + so.join(''));
      }
      return output;
    };
    const totalSteps = _default.colorTween.steps;

    colorBtoR = [];

    for (let t = 0; t < _default.colorTween.colors.length; t = t + 1) {
      if (t !== _default.colorTween.colors.length - 1) {
        colorBtoR.push(gradientColors(_default.colorTween.colors[t], _default.colorTween.colors[t + 1], totalSteps));
        if (t === 0) {
          colorArray = colorBtoR[0];
        } else {
          colorArray = colorArray.concat(
            colorBtoR[t]
          );
        }
      }
    }
  }

  // Add new color input on click events
  includeNewColor() {
    let inputBlock = document.getElementById('inputer');
    inputBlock.insertAdjacentHTML("beforeend", "<div class='colorPicker'><span>To</span><input class='jscolor' /></div>");
    setTimeout(() => {
      jscolor.installByClassName('jscolor');
    }, 100);
  }

  // Update the tweenSteps grab from inputer
  updateTweenSteps(event) {
    this.setState({
      steps: event.target.value
    });
    _default.colorTween.steps = event.target.value;
  }

  // Update the colorArrays before calculate
  updateColorTweenArray() {
    $colors = document.getElementsByClassName('jscolor');

    for (let i = 0; i < $colors.length; i = i + 1) {
      _default.colorTween.colors.push(`#${$colors[i].value}`);
    }
    console.log('ColorArray: ', _default.colorTween.colors);
  }

  // Generate results on click events
  generateOnClick() {
    this.updateColorTweenArray();
    this.calculateHexTween();

    this.setState({ genActive: 'active'});

    // const mask = document.getElementById('mask');
    const colorbar = document.getElementById('colorbar');
    const copy = document.getElementById('copy');
    // const result = document.getElementById('content');

    setTimeout(() => {
      let text = JSON.stringify(colorArray).replace(/[^{0-9}{a-z}#,]/g, "");
      // mask.style.display = 'block';
      this.setState({ 
        maskShow: {display: 'block'},
        resultValue: text
      });

      colorbar.style.background = `linear-gradient(to right, ${text})`;
      
      // result.innerHTML = text;
      copy.setAttribute('data-clipboard-text', text);
    }, 1000);
  }

  // renderer
  render() {
    return (
      <div className='wrapper'>
        {/* Mask block */}
        <div id='mask' style={this.state.maskShow}>
          <div id='result'>
            <span>Tween Preview:</span>
            <div id='colorbar'></div>
            <span>Generate Result:</span>
            <div id='content'>{this.state.resultValue}</div>
            <div id='close' onClick={this.onClickCloseMask}>X</div>
            <div id='copy' data-clipboard-text='#content' onClick={this.onClickCopyResult}>copy</div>
          </div>
        </div>

        <div className='base'>
          {/* Description block */}
          <div id='config'>
            <span>Steps between each color</span>
            <input id='steps' value={this.state.steps} onChange={this.updateTweenSteps}></input>
          </div>

          {/* inputer block */}
          <div id='inputer'>
            <ColorPicker text='From'></ColorPicker>
            <ColorPicker text='To'></ColorPicker>
          </div>

          {/* add New Color Button */}
          <div id='add' onClick={this.includeNewColor}>+ New Color</div>

          {/* start Generate Tweens Button */}
          <div id='generate' className={this.state.genActive} onClick={this.generateOnClick}>Generate</div>
        </div>
      </div>
    )
  }
}

export default BaseComponent;