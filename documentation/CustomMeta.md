## Custom Metadata field (keywords, cast, etc)

To add custom metadata to your VOD solution this is the right walkthrough. We walk you through how to edit your API and guide you to how to update your Admin Panel to allow you to upload new assets.

1. Navigate to `unicornflix/amplify/backend/api/unicornflix/schema.graphql`
1. Make a change to the schema by adding a new custom field. For example you could add an `genre` field as shown below:
    
    ```graphql
    type vodAsset @model
    @auth(
      rules: [
        {allow: groups, groups:["Admin"], operations: [create, update, delete, read]},
        {allow: private, operations: [read]}
      ]
    )
    {
      id:ID!
      title:String!
      description:String!
      genre:String
      #DO NOT EDIT
      video:videoObject
    } 
    ```
1. Now we need to push these schema changes to the appsync service. We do this using the `amplify push` command once again.
1. Next we can add a new input field in the admin panel form for our HTML, so we can capture our new metadata field each time we upload a new asset. Navigate to `unicornflix/src/components/Admin/index.js` and add a new field to the form similar to how the title field HTML has been implemented. For more info on how forms work in HTML read these [docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form). One thing to note is that in React you need to implement a `onChange` functionality to store the value into the state so when we submit the form we can read the form data. These changes will happen in the `render` function
1. Now that we have the value in the state from the form we can now add the value to our API calls. Find the `videoAsset` variable in the `submitFormHandler` function and add our new field to the GraphQL call.
1. When you visit the website again you should be able to see the new field you have created and also add a value to it and send it over.
1. This is a sample of what the implementation could look like for the entire `unicornflix/src/components/Admin/index.js` file:
    <details>
      <summary>Example:</summary>

      ```javascript
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
            titleVal: '', descVal: '', groups: [], progress: 0, genreVal: ''
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
                titleVal, descVal, file, fileName, genreVal,
              } = this.state;
              const fileExtension = fileName.toLowerCase().split('.');
              const videoAsset = {
                input: {
                  title: titleVal,
                  description: descVal,
                  vodAssetVideoId: uuid,
                  genre: genreVal,
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
            genreVal,
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
                      <input type="text" value={genreVal} name="genreVal" placeholder="Genre" onChange={this.handleChange} />
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
      ```
    </details>

1. If you're feeling brave, try and figure out how you could implement a Actors field which is an array in AppSync. Think about how you could make the Form & API accept an array of objects!
    <details>
      <summary>GraphQL example</summary>

      ```graphql
      type vodAsset @model
      @auth(
        rules: [
          {allow: groups, groups:["Admin"], operations: [create, update, delete, read]},
          {allow: private, operations: [read]}
        ]
      )
      {
        id:ID!
        title:String!
        description:String!
        genre:String
        actors:[String]
        #DO NOT EDIT
        video:videoObject
      }
      ```
    </details>
    
Click [here](./Extensions.md) to return to the extensions index and explore other features to implement.
