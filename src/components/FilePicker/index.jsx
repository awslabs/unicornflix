import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';

class FilePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePicked: '',
    };
  }


  onChange(e) {
    const file = e.target.files[0];
    const { callbackFromParent } = this.props;
    this.setState({
      filePicked: file.name,
    });
    callbackFromParent(file);
    e.preventDefault();
  }

  render() {
    const { filePicked } = this.state;
    let buttonLabel = 'Choose a file...';
    if (filePicked !== '') {
      buttonLabel = 'Movie file selected';
    }
    return (
      <div>
        <label htmlFor="FilePicker" className="fileInput">
          {buttonLabel}
          <input type="file" name="file" id="FilePicker" className="inputfile" accept="video/*" onChange={(e) => this.onChange(e)} />
        </label>
      </div>
    );
  }
}

FilePicker.propTypes = {
  callbackFromParent: PropTypes.func.isRequired,
};

export default FilePicker;
