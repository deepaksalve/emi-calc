import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class Slider extends Component {
  state = {
    limit: 0,
    grab: 0
  };

  slider = React.createRef();
  handle = React.createRef();

  componentDidMount() {
    this.handleUpdate();
  }

  onMouseMove = e => {
    e.stopPropagation();

    const { onChange } = this.props;

    if (onChange) {
      const value = this.getPosition(e);

      onChange(value, e);
    }
  }

  onMouseDown = e => {
    // Handle events even the mouse is not on within component boundaries.
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseUp = e => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onKeyDown = e => {
    e.preventDefault();

    const { keyCode } = e;
    const { value, min, max, step, onChange } = this.props;
    let sliderValue;

    switch (keyCode) {
      case 38:
      case 39:
        sliderValue = value + step > max ? max : value + step;
        onChange && onChange(sliderValue, e);
        break;
      case 37:
      case 40:
        sliderValue = value - step < min ? min : value - step;
        onChange && onChange(sliderValue, e);
        break;
    }
  }

  handleUpdate = () => {
    if (!this.slider) return;

    const sliderPos = this.slider['offsetWidth'];
    const handlePos = this.handle['offsetWidth'];

    this.setState({
      limit: sliderPos - handlePos,
      grab: handlePos / 2
    });
  }

  getPositionFromValue = value => {
    const { limit } = this.state;
    const { min, max } = this.props;
    const diffMaxMin = max - min;
    const diffValMin = value - min;
    const percentage = diffValMin / diffMaxMin;

    return Math.round(percentage * limit);
  }

  getValueFromPosition = pos => {
    const { limit } = this.state;
    const { min, max, step } = this.props;
    const percentage = _.clamp(pos, 0, limit) / (limit || 1);
    const baseVal = step * Math.round(percentage * (max - min) / step);
    const value = baseVal + min;

    return _.clamp(value, min, max);
  }

  getPosition = e => {
    const { grab } = this.state;
    const node = this.slider;
    const coordinate = !e.touches ? e.clientX : e.touches[0].clientX;
    const direction = node.getBoundingClientRect()['left'];
    const pos = coordinate - direction - grab;

    return this.getValueFromPosition(pos);
  }

  getCoordinates = pos => {
    const { grab } = this.state;
    const value = this.getValueFromPosition(pos);
    const position = this.getPositionFromValue(value);
    const handlePos = position + grab;

    return {
      fill: handlePos,
      handle: handlePos,
      label: handlePos
    };
  }

  render() {
    const { value, knobLabel } = this.props;
    const position = this.getPositionFromValue(value);
    const coords = this.getCoordinates(position);

    return (
      <div
        ref={n => (this.slider = n)}
        className='slider'
        onMouseUp={this.onMouseUp}
        onTouchEnd={this.onMouseUp}
        onMouseDown={this.onMouseMove}
        onTouchStart={this.onMouseDown}
      >
        <div className='slider__bar' style={{ width: `${coords.fill}px` }} />
        <div
          ref={sh => (this.handle = sh)}
          className='slider__knob'
          onMouseDown={this.onMouseDown}
          onTouchMove={this.onMouseMove}
          onTouchEnd={this.onMouseUp}
          onKeyDown={this.onKeyDown}
          style={{ left: `${coords.handle}px` }}
          tabIndex={0}
        >
          <div className='slider__label'>{knobLabel}</div>
        </div>
      </div>
    );
  }
}

Slider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  knobLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  value: 0,
  knobLabel: ''
};

export default Slider;
