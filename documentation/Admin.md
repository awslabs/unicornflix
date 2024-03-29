## Web Client Admin View  

This workshop provides a react application that will serve as the basis for your development and is split into two views. The Admin view provides UnicornFlix employees video management capabilities and the User view is where subscribers access content after they've logged into the site.

1. To install the dependencies necessary to run the website locally run `npm install` from the UnicornFlix directory. Notable packages include:
    - `aws-amplify` - A javascript library that provides a declarative interface across amplify categories, like auth, in order to make them easier to add them into your application
    - `aws-amplify-react` - A UI component library for React to use with the CLI resources
1. Next, to run the website with a local development environment run `npm start` and navigate to the page running on localhost. You will see an empty page with an orange background. 
    1. If you are running this workshop on Cloud9, a window will appear in cloud9 with a URL, copy this URL and paste it into a new browser tab and remove the https and replace with http.
Let's start with adding connections to all of our AWS resources, so that we can start communicating back and forth with our API and Auth components we added earlier.

1. In an IDE open `unicornflix/src/index.js`. This is the root of our react application.
1. Insert at the top of the file an import to bring in all the required resources for the API and Auth that we created. Inside the `aws-exports` file contains all the API and Auth definitions that are required for this workshop.

    ```javascript
    // Location 1
    import Amplify from 'aws-amplify';
    import awsconfig from './aws-exports';

    Amplify.configure(awsconfig);

    ```

Now that our AWS resources have been configured, lets add the Admin functionality as this will allow us to create new content. To do so, we will first drop in the authenticator component and configure it to wrap the Admin react component that renders the Admin page.

1. In an IDE open `unicornflix/src/components/Admin/index.jsx`. This is the react component that will render when we go to the admin page. More information on React can be found [here](https://reactjs.org/) on the official site
1. At the bottom of the import block, add the following statement to bring in the Authenticator component:

    ```javascript
    // Location 2
    import { withAuthenticator } from 'aws-amplify-react';

    ```

1. Replace `export default Admin;` to the following statement which wraps the Admin page with the newly imported Authenticator component:

    ```javascript
    // Location 3
    export default withAuthenticator(Admin, true);

    ```

1. Visit `localhost:3000/Admin` or whatever hosting url + `/Admin` you will now see a new login page.
  ![adminpanel](https://amplifyvideo.wizages.com/unicornflix/adminpanel.png)

Now we need an Admin user to test out the authentication functionality, let's create an admin user through the Cognito console. 

1. Open the AWS Management Console and Search for Cognito.
  ![cognito_main](https://amplifyvideo.wizages.com/unicornflix/cognito_main.png)
1. Select the blue "Manage User Pools" button
  ![cognito_splash](https://amplifyvideo.wizages.com/unicornflix/cognito_splash.png)
1. Select the userpool labeled "Unicornflix" or your project name + a random string.
1. Under General Settings, choose "Users and Groups"
  ![cognito_users](https://amplifyvideo.wizages.com/unicornflix/cognito_users.png)
1. Select the blue "create user" button and enter the user creation form. You will need to enter a phone number that includes country code, for example +15558888888
1. Fill out the form to create a user. Now we will have to add admin privileges in order to enable this user to publish videos through the app.
  ![cognito_create_user](https://amplifyvideo.wizages.com/unicornflix/cognito_create_user.png)
1. Go back to the application and log in and create a new password.
1. Navigate back Cognito in the console.
1. Select the user you just created.
1. Select the blue "Add to Group" button, and select the admin group.
  ![cognito_add_group](https://amplifyvideo.wizages.com/unicornflix/cognito_add_group.png)
Now that we have an admin user, let's implement the asset upload logic that enables them to create new assets on the platform.(Note: You will need to log out of the application and log back in to make the admin privilages go into effect.)
1. Don't be alarmed if you see a "Not Authenticated" message since we have yet to implement the view for the admin panel.
1. In and IDE, Open `unicornflix/src/Components/Admin/index.jsx`
1. First we will need to import some important files and libraries to assist us with connecting the backend to our React app. The first import adds in some library components provided by Amplify's libraries to get Authentication information, perform API requests, generate GraphQL operations and interact with the Storage added in Amplify Video. The second file is generated by the Amplify Video CLI command you ran earlier. This file contains both the input and output bucket for your Video On Demand Assets. The last file, GraphQL mutations contains the two mutations we will be performing to create new Assets.

    ```javascript
    // Location 4
    import Amplify, {
      Auth, API, graphqlOperation, Storage,
    } from 'aws-amplify';
    import awsvideoconfig from '../../aws-video-exports';
    import { createVodAsset, createVideoObject } from '../../graphql/mutations';

    ```

1. Now that our backend is configured with our frontend we will now need to provide some context to the Storage component and get the current users status from the Auth module. In the `componentDidMount` function paste the following code into the function body.

    ```javascript
    // Location 5
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
        customPrefix: {
          public: '',
        }
      },
    });
        
    ```

1. Find the `submitFormHandler(event)` at `Location 6` and add the upload functionality to the Admin Panel. This is the form that contains basic metadata to be submitted alongside the asset upload. The API calls first create the asset tracker in the DynamoDB table. After the asset tracker is create then we will fire off the operation to create the VideoObject and the Storage operation to upload all the metadata and the video file. Feel free to attempt to do this without using the code before copying the code below. We are using the library [API](https://aws-amplify.github.io/docs/js/api#mutations) to make our GraphQL operations and [Storage](https://aws-amplify.github.io/docs/js/storage#put) to insert the items. The general flow should be create video object, then create both the video asset and put the video in the bucket at the same time. `this.state` contains both the `file` bitstream and `filename` for the Storage component. 

    <details>
      <summary>Location 6 Code</summary>

      ```javascript
      // Location 6
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
          
      ```
    </details>


Let's put our implementation of the admin page to the test by uploading an asset.

1. Navigate back to the application running on your Localhost.
1. Log in to the admin user you created. Note: if you were previously logged in before creating your admin user, log out and log back in to refresh your tokens giving you access to post content.
1. Navigate to the Admin Panel by going to the `/Admin` page in the browser
1. Fill out the form and select a video with the file picker or use the sample video located [here](https://amplifyvideo.wizages.com/unicornflix/sample2.mp4) (Right click and select `Save Link as...`)
1. Once all the fields have been selected, choose the "Create Asset" button to begin the upload process.

Since we haven't implemented the user view yet, let's use the AWS console to explore what happened when we created the asset.

1. Open the AWS management console and navigate to the DynamoDB service using the search bar.
1. In the left hand side bar, choose "Tables"
1. You should see two DynamoDB Tables that were deployed on your behalf by Amplify Video: VodAsset- (the video metadata) and VideoObject- (the video access URLs)
1. Select the VodAsset- table and choose "Items" to view the asset you just pushed to the cloud using the Application. Here you can see that the API gave each asset a GUID as well as createdAt/updatedAt fields.
1. In the management console, select the services drop down from the top left corner of the browser screen.
1. In the search bar type MediaConvert and navigate to the Elemental MediaConvert service page.
1. Click on the `≡` button to expand the left hand side menu and choose "Jobs"
    ![mediaconvert_console](https://amplifyvideo.wizages.com/unicornflix/mediaconvert_console.png)
1. You should see a job that was kicked off when you uploaded an asset through the console. You can view the input file name to be sure that the upload from the application was successful.
1. (Optional) Select the job and select the "View JSON" button in the top right of the screen. Here you can view the job file which was submitted to the Elemental MediaConvert Service. Here, you can view the input and output locations as well as presets used during the transcoding process.

Now that we have a functioning backend with an admin portal, [let's set up the end user view!](./UserView.md).
