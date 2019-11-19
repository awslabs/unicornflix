## Web Client User View

 Again we need to include the authenticator component. For the user view the authentication ensures only signed-in users can access videos on UnicornFlix

1. In an IDE, open `unicornflix/src/components/App/index.jsx`
1. At the bottom of the import block, add:
```javascript

import { withAuthenticator } from 'aws-amplify-react';

```

1. Change ```export default App;``` to the following statement which wraps the react App component with the amplify Authenticator.
```javascript

export default withAuthenticator(App, true);

```

Create a user account using the app sign-up page instead of the Cognito console.

1. Refresh the tab that the application is running in to see the login page. (react's local dev server may do this for you)
1. Create a new user. This user will not be an admin and thus won't have rights to publish content to UnicornFlix. Make sure to provide a valid email to activate your account. The code may take a minute or two to arrive in your inbox.

Now we need to render the videos on our site for our viewers. Let's start by submitting a query for existing content.

1. Navigate to `unicornflix/src/Components/GridView/index.jsx`
1. Like before we will need to import some libraries & files into our application at the top of the file. All them will be similiar to what you did in the Admin panel.
```javascript

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../graphql/queries';

```

1. Find `Location 10` inside of the `componentDidMount` function and paste the following code:
```javascript

const assets = await API.graphql(graphqlOperation(queries.listVodAssets));
let { nextToken } = assets.data.listVodAssets;
if (nextToken === undefined) {
  nextToken = '';
}
this.setState({ items: assets.data.listVodAssets.items, nextToken });
    
```

1. Find `Location 11` inside of the `handleOnDocumentBottom` function and paste the following code:
```javascript

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

You should now see any content that you've previously uploaded through the Admin view, but when you click on the card no video shows up! So lets hook up our video player to our assets to get started.

1. Still in the `unicornflix/src/Components/GridView/index.jsx` file we will need to add the code to actually view the video!

1. At the top of the file add another import to get the storage location of our videos.
```javascript

import awsvideo from '../../aws-video-exports';

```

1. Now that we have our video info we can now hook up our source to our video file. Find `Location 13` inside `displayMove` and paste the code below. What the code does is it sets the state of our src of our video and tells the React code to show a module with our video player embded inside.
```javascript

// eslint-disable-next-line no-underscore-dangle
const region = Amplify._config.aws_project_region;
this.setState({
  sources: [{
    src: `https://${awsvideo.awsOutputVideo}.s3-${region}.amazonaws.com/output/${item.video.id}.m3u8`,
    type: 'application/x-mpegURL',
  }],
  displayingMovie: true,
  choosenItem: item,
});
    
```

Now that our users can play back our content, let's add a real time content system to our web view. To do so, we will setup a subscription so that new content uploaded will appear for users already viewing the application.

1. Staying on the `unicornflix/src/Components/GridView/index.jsx`
1. Add the following line of code to the bottom of the import block:
```javascript

import { onCreateVodAsset } from '../../graphql/subscriptions';

```

1. Find `Location 15` inside of `listenForNewAssets` function and paste the following code into the function body.
```javascript

API.graphql(
  graphqlOperation(onCreateVodAsset),
).subscribe({
  next: (((data) => {
    const { items } = this.state;
    const newItems = items.push(data.value.data.onCreateVodAsset);
    this.setState({
      items: newItems,
    });
  })),
});
    
```

1. To kick off the subscription, we will need to call this function. To do so, paste in a call to function in `Location 5` inside of `componentDidMount`.
```javascript

this.listenForNewAssets();
    
```

1. Now that you have the app fully functional, try uploading another asset to the system through the admin panel and see the video appear in the site. If all goes well, you'll have a functional video-on-demand application. 

Congratulations on completing the workshop! [Click here](./Extensions.md) to learn how to extend the application and take on some tougher developer challenges!
