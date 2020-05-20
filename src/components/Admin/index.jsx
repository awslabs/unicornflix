/* eslint-disable import/order */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import './index.css';
import uuidv4 from 'uuid/v4';
import FilePicker from '../FilePicker';
import PopoverProgress from '../PopoverProgress';
// Insert Location 2
import { withAuthenticator } from 'aws-amplify-react';

// Insert Location 4
import Amplify, {
  Auth, API, graphqlOperation, Storage,
} from 'aws-amplify';
import awsvideoconfig from '../../aws-video-exports';
import { createVodAsset, createVideoObject } from '../../graphql/mutations';

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
    const region = Amplify._config.aws_project_region;
    Auth.currentSession()
      .then((data) => {
        const groups = data.idToken.payload['cognito:groups'];
        if (groups) {
          this.setState({ groups: data.idToken.payload['cognito:groups'] });
        }
      });
    
    Storage.configure({
      AWSS3: {
        bucket: awsvideoconfig.awsInputVideo,
        region,
      },
    });
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
    const uuid = uuidv4();
const adminPanel = this;
const videoObject = {
  input: {
    id: uuid,
  },
};

API.graphql(graphqlOperation(createVideoObject, videoObject)).then((response, error) => {
  if (error === undefined) {
    const {
      titleVal, descVal, file, fileName,
    } = this.state;
    const fileExtension = fileName.toLowerCase().split('.');
    const videoAsset = {
      input: {
        title: titleVal,
        description: descVal,
        vodAssetVideoId: uuid,
      },
    };
    API.graphql(graphqlOperation(createVodAsset, videoAsset));
    Storage.put(`${uuid}.${fileExtension[fileExtension.length - 1]}`, file, {
      progressCallback(progress) {
        const { loaded, total } = progress;
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        adminPanel.setState({
          progress: (loaded / total) * 100,
        });
      },
      contentType: 'video/*',
    })
      .then(() => console.log(`Successfully Uploaded: ${uuid}`))
      .catch((err) => console.log(`Error: ${err}`));
  }
});

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
export default withAuthenticator(Admin, true);
