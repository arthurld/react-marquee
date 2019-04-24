import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

class Marquee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedWidth: 0,
      overflowWidth: 0
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    this._measureText();

    if (this.props.hoverToStop) {
      this._startAnimation();
    }
  }

  componentDidUpdate() {
    this._measureText();

    if (this.props.hoverToStop) {
      this._startAnimation();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._marqueeTimer);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.text.length != nextProps.text.length) {
      clearTimeout(this._marqueeTimer);
      this.setState({
        animatedWidth: 0
      });
    }
  }

  handleMouseEnter() {
    if (this.props.hoverToStop) {
      clearTimeout(this._marqueeTimer);
    } else if (this.state.overflowWidth > 0) {
      this._startAnimation();
    }
  }

  handleMouseLeave() {
    if (this.props.hoverToStop && this.state.overflowWidth > 0) {
      this._startAnimation();
    } else {
      clearTimeout(this._marqueeTimer);
      this.setState({
        animatedWidth: 0
      });
    }
  }

  render() {
    const style = {
      position: 'relative',
      display: 'inline-block',
      transform: `translateX(-${this.state.animatedWidth}px)`,
      whiteSpace: 'nowrap'
    };

    if (this.state.overflowWidth < 0) {
      return (
        <div
          className={`ui-marquee ${this.props.className}`}
          style={{ overflow: 'hidden' }}
        >
          <span ref="text" style={style} title={this.props.text}>
            {this.props.text}
          </span>
        </div>
      );
    } else {
      return (
        <div
          className={`ui-marquee ${this.props.className}`}
          style={{ overflow: 'hidden' }}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <span ref="text" style={style} title={this.props.text}>
            {this.props.text}
          </span>
        </div>
      );
    }
  }

  _startAnimation() {
    clearTimeout(this._marqueeTimer);
    const speed = (1 / this.props.speed) * 1000;
    const isLeading = this.state.animatedWidth === 0;
    const timeout = isLeading ? this.props.leading : speed;

    const animate = () => {
      const { overflowWidth } = this.state;
      let animatedWidth = this.state.animatedWidth + 1;
      const isRoundOver = animatedWidth > overflowWidth;

      if (isRoundOver) {
        if (this.props.loop) {
          animatedWidth = 0;
        } else {
          return;
        }
      }

      if (isRoundOver && this.props.trailing) {
        this._marqueeTimer = setTimeout(() => {
          this.setState({
            animatedWidth
          });

          this._marqueeTimer = setTimeout(animate, speed);
        }, this.props.trailing);
      } else {
        this.setState({
          animatedWidth
        });

        this._marqueeTimer = setTimeout(animate, speed);
      }
    };

    this._marqueeTimer = setTimeout(animate, timeout);
  }

  _measureText() {
    const container = ReactDOM.findDOMNode(this);
    const node = ReactDOM.findDOMNode(this.refs.text);

    if (container && node) {
      const containerWidth = container.offsetWidth;
      const textWidth = node.offsetWidth;
      const overflowWidth = textWidth - containerWidth;

      if (overflowWidth !== this.state.overflowWidth) {
        this.setState({
          overflowWidth
        });
      }
    }
  }
}

Marquee.defaultProps = {
  text: '',
  hoverToStop: false,
  loop: false,
  leading: 0,
  trailing: 0,
  speed: 50
};

Marquee.propTypes = {
  text: PropTypes.string,
  hoverToStop: PropTypes.bool,
  loop: PropTypes.bool,
  leading: PropTypes.number,
  trailing: PropTypes.number,
  className: PropTypes.string,
  speed: PropTypes.number
};

module.exports = Marquee;
