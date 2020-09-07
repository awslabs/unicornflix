## Web Client User View

 Again we need to include the authenticator component. For the user view the authentication ensures only signed-in users can access videos on UnicornFlix

1. In an IDE, open `unicornflix/src/Components/App/index.jsx` this is the react component that will render when a user hits the main page.
1. At the bottom of the import block, bring in the authenticator by adding:
    ```javascript
    // Location 7
    import { withAuthenticator } from 'aws-amplify-react';

    ```

1. Change ```export default App;``` to the following statement which wraps the react App component with the amplify Authenticator.
    ```javascript
    // Location 8
    export default withAuthenticator(App, true);

    ```

Create a user account using the app sign-up page instead of the Cognito console. You may have to sign out if you're still logged in as the admin user.

1. Refresh the tab that the application is running in to see the login page. (react's local dev server may do this for you)
1. Create a new user. This user will not be an admin and thus won't have rights to publish content to UnicornFlix. Make sure to provide a valid email to activate your account. The code may take a minute or two to arrive in your inbox.

Now we need to render the videos on our site for our viewers. Let's start by submitting a query for existing content.

1. Navigate to `unicornflix/src/Components/GridView/index.jsx`. This component will dynamically render new tiles for each video that is uploaded to the application by an administrator.
1. Like before we will need to import some libraries & files into our application at the top of the file. All them will be similar to what you did in the Admin panel.
    ```javascript
    // Location 9
    import Amplify, { API, graphqlOperation } from 'aws-amplify';
    import * as queries from '../../graphql/queries';

    ```

1. Find `Location 10` inside of the `componentDidMount` function and add the ability to list all assets we have uploaded to the UnicornFlix. We will be taking advantage of the `listVodAssets` from the queries we imported. We will again be using the [API](https://aws-amplify.github.io/docs/js/api#simple-query) library to make our queries. We will need to be getting two things from the API. First we need to set our `this.state.items` array to contain all the items returned and `this.state.nextToken` with the next token to provide pagination.
    <details>
      <summary>Sample code</summary>
    
    ```javascript
    // Location 10
    const assets = await API.graphql(graphqlOperation(queries.listVodAssets));
    let { nextToken } = assets.data.listVodAssets;
    if (nextToken === undefined) {
      nextToken = '';
    }
    this.setState({ items: assets.data.listVodAssets.items, nextToken });
        
    ```
    </details>

1. Find `Location 11` inside of the `handleOnDocumentBottom` function. Here we are going to implement loading more items into our view. To do this we are going to take our Query functionality we implemented before hand and add in our `{ nextToken}` as a parameter. Then we will have to modify the existing `this.state.items` array to add the new items. An example can be found below on how to do this.
    <details>
      <summary>Sample code</summary>

    ```javascript
    // Location 11
    const { nextToken, items } = this.state;
    if (nextToken !== '' && nextToken !== null && nextToken !== undefined) {
      console.log(nextToken);
      const assets = await API.graphql(graphqlOperation(queries.listVodAssets, { nextToken }));
      const newItems = items.concat(assets.data.listVodAssets.items);
      let newNextToken = assets.data.listVodAssets.nextToken;
      if (newNextToken === undefined) {
        newNextToken = '';
      }
      this.setState({ items: newItems, nextToken: newNextToken });
    }
        
    ```
    </details>

You should now see any content that you've previously uploaded through the Admin view, but when you click on the card no video shows up! So lets hook up our video player to our assets to get started.

1. Still in the `unicornflix/src/Components/GridView/index.jsx` file we will need to add the code to actually view the video!

1. At the top of the file add another import to get the storage location of our videos.
    ```javascript
    // Location 12
    import awsvideo from '../../aws-video-exports';

    ```

1. Now that we have our video info we can now hook up our source to our video file. Find `Location 13` inside `displayMove` and paste the code below. What the code does is it sets the state of our src of our video and tells the React code to show a module with our video player embedded inside.
    ```javascript
    // Location 13
    // eslint-disable-next-line no-underscore-dangle
    const region = Amplify._config.aws_project_region;
    this.setState({
      sources: [{
          src: `https://${awsvideo.awsOutputVideo}/${item.video.id}/${item.video.id}.m3u8`,
          type: 'application/x-mpegURL',
        }],
      displayingMovie: true,
      choosenItem: item,
    });
        
    ```
    
Congratulations, you should now be stream a video uploaded by the admin user!

Now that our users can play back our content, let's add a real time content system to our web view. To do so, we will setup a subscription so that new content uploaded will appear for users already viewing the application.

1. Staying on the `unicornflix/src/Components/GridView/index.jsx`
1. Add the following line of code to the bottom of the import block to bring in the code generated automatically by Amplify:
    ```javascript
    // Location 14
    import { onCreateVodAsset } from '../../graphql/subscriptions';

    ```

1. Find `Location 15` inside of `listenForNewAssets` function and add in a GraphQL subscriber. The purpose of this is to listen for newly posted videos. We are going back to using the [API](https://aws-amplify.github.io/docs/js/api#subscriptions). We will want to be subscribing to all the `onCreateVodAsset` mutations that happen as these signal new updates to our video content. Sample code is provided below, but feel free to try yourself.
    <details>
      <summary>Sample Code</summary>

    ```javascript
    // Location 15
    API.graphql(
      graphqlOperation(onCreateVodAsset),
    ).subscribe({
      next: (((data) => {
        const { items } = this.state;
        items.push(data.value.data.onCreateVodAsset);
        this.setState({
          items,
        });
      })),
    });
        
    ```
    </details>

1. To kick off the subscription, we will need to call this function. To do so, paste in a call to function in `Location 16` inside of `componentDidMount`.
    ```javascript
    // Location 16
    this.listenForNewAssets();
        
    ```

1. Now that you have the app fully functional, try opening a different web browser or a private/incognito tab and logging into the admin user. With both browser windows up side-by-side upload a new  asset to the system through the admin panel and see the video appear in the user view of the site automatically via the subscription. You now have a functional video-on-demand application. 

## Choose Your Own Adventure

Congratulations on building UnicornFlix! With the base application complete with video processing, a GraphQL API for serving URLs, and authentication, it's time to choose which features you'd like to add to delight your audience.

- [Amplify Hosting](./Hosting.md) - Publish your web application through the Amplify Console and upload your own videos to UnicornFlix. After completing this exension, you'll be able to upload videos from your mobile device and ask your friends and family to provide their own.

- [Amplify Analytics](./Analytics.md) - Start capturing metrics on UnicornFlix usage. This extension uses AWS Pinpoint to gather clickstream data from the app and help us make informed decisions about what type of content is resonating with our viewers or how the audience is using UnicornFlix.

- [Custom Metadata](./CustomMeta.md) - Viewers want more information on content they watch on UnicornFlix. This extension walks you through adding additional fields to the API so that admin users can supply more information on upload that is stored and presented to users on UnicornFlix.
