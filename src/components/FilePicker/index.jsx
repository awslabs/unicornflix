import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';

class FilePicker extends Component {
  onChange(e) {
    const file = e.target.files[0];
    const { callbackFromParent } = this.props;
    callbackFromParent(file);
    e.preventDefault();
  }

  render() {
    return (
      <input type="file" id="FilePicker" accept="video/*" onChange={(e) => this.onChange(e)} />
    );
  }
}

FilePicker.propTypes = {
  callbackFromParent: PropTypes.func.isRequired,
};

export default FilePicker;
