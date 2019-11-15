import React from 'react';
import './index.css';
import uuidv4 from 'uuid/v4';
import FilePicker from '../FilePicker';
// Place the imports for Admin/index.jsx here

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleVal: '', descVal: '', groups: [],
    };
    this.submitFormHandler = this.submitFormHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createAdminPanel = this.createAdminPanel.bind(this);
  }

  componentDidMount() {
    // Place the Auth currentSession and Storage configure for Admin/index.jsx here
  }

  myCallback = (dataFromChild) => {
    this.setState({
      file: dataFromChild,
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
    // Place the form upload code for Admin/index.jsx here
  }

  createAdminPanel() {
    const { groups, titleVal, descVal } = this.state;
    if (groups.includes('Admin')) {
      return (
        <div>
          <h1>Admin Panel</h1>
          <form onSubmit={this.submitFormHandler}>
            <div>
              Title:
              {' '}
              <input type="text" value={titleVal} name="titleVal" onChange={this.handleChange} />
              <br />
              Description:
              {' '}
              <br />
              <textarea rows="4" cols="50" value={descVal} name="descVal" onChange={this.handleChange} />
              <br />
              <FilePicker callbackFromParent={this.myCallback} />
              <input type="submit" value="Submit" />
            </div>
          </form>
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
      <div className="App-header">
        {this.createAdminPanel()}
      </div>
    );
  }
}

export default Admin;
