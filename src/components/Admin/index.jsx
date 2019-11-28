/* eslint-disable import/order */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import './index.css';
import uuidv4 from 'uuid/v4';
import FilePicker from '../FilePicker';
import PopoverProgress from '../PopoverProgress';
// Insert Location 2

// Insert Location 4


class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleVal: '', descVal: '', groups: [], progress: 0,
    };
    this.submitFormHandler = this.submitFormHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createAdminPanel = this.createAdminPanel.bind(this);
  }

  componentDidMount() {
    // Insert Location 5

  }

  myCallback = (dataFromChild) => {
    this.setState({
      file: dataFromChild,
      fileName: dataFromChild.name,
    });
  }

  handleChange(event) {
    const { value } = event.target;
    const { name } = event.target;
    this.setState({
      [name]: value,
    });
  }

  handledescChange(event) {
    this.setState({ descVal: event.target.value });
  }


  submitFormHandler(event) {
    event.preventDefault();
    // Insert Location 6

  }

  createAdminPanel() {
    const {
      groups,
      titleVal,
      descVal,
      progress,
    } = this.state;
    if (groups.includes('Admin')) {
      return (
        <div>
          <header>
            <h1 className="pageName">Admin Panel</h1>
            <form onSubmit={this.submitFormHandler}>
              <div>
                <input type="text" value={titleVal} name="titleVal" placeholder="Title" onChange={this.handleChange} />
                <br />
                <textarea className="desTextA" rows="4" cols="50" value={descVal} name="descVal" placeholder="Description" onChange={this.handleChange} />
                <br />
                <FilePicker callbackFromParent={this.myCallback} />
                <label htmlFor="submitButton" className="submitLabel">
                  Create Asset
                  <input type="submit" className="submitButton" id="submitButton" value="Create Asset" />
                </label>
                <PopoverProgress progress={progress} />
              </div>
            </form>
          </header>
        </div>
      );
    }
    return (
      <div>
        Not Authenticated
      </div>
    );
  }

  render() {
    return (
      <div className="adminHeader">
        {this.createAdminPanel()}
      </div>
    );
  }
}
// Insert Location 3
export default Admin;
