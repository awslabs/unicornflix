import React from 'react';
import './index.css';
import {
  Auth, API, graphqlOperation, Storage,
} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import uuidv4 from 'uuid/v4';
import { createVodAsset, createVideoObject } from '../../graphql/mutations';
import awsvideoconfig from '../../aws-video-exports';
import FilePicker from '../FilePicker';

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
    Auth.currentSession()
      .then((data) => {
        const groups = data.idToken.payload['cognito:groups'];
        if (groups) {
          this.setState({ groups: data.idToken.payload['cognito:groups'] });
        }
      });

    Storage.configure({
      AWSS3: {
        bucket: awsvideoconfig.awsOutputVideo,
        region: 'us-west-2',
      },
    });
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

    const uuid = uuidv4();

    const videoObject = {
      input: {
        id: uuid,
        objectID: uuid,
      },
    };

    API.graphql(graphqlOperation(createVideoObject, videoObject)).then((response, error) => {
      if (error !== undefined) {
        const { titleVal, descVal, file } = this.state;
        const videoAsset = {
          input: {
            title: titleVal,
            description: descVal,
            vodAssetVideoId: uuid,
          },
        };
        API.graphql(graphqlOperation(createVodAsset, videoAsset));
        Storage.put(`${uuid}.mp4`, file, {
          contentType: 'video/*',
        })
          .then(() => console.log(`Successfully Uploaded: ${uuid}`))
          .catch((err) => console.log(`Error: ${err}`));
      }
    });
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

export default withAuthenticator(Admin, true);
