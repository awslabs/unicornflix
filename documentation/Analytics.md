## Basic Analytics 

This walkthrough shows you how to add Analytics to your app so you can start tracking what you your customers are doing. For example, what client the user is using or location they are visiting your app from.

1. Open up your terminal window where you ran `amplify init` earlier in your workshop and run `amplify status` to verify that your backend is still available.
1. Now run `amplify add analytics` and answer the prompts like so:

    <pre>
    Using service: Pinpoint, provided by: awscloudformation
    ? Provide your pinpoint resource name: <b>unicornflix</b>
    Adding analytics would add the Auth category to the project if not already added.
    ? Apps need authorization to send analytics events. Do you want to allow guests and unauthenticated users to send analytics events? (we recommend you allow this when getting started) <b>Yes</b>
    Successfully updated auth resource locally.
    Successfully added resource unicornflix locally
    </pre>

1. Now run `amplify push` and wait for it complete. (If any prompts appear for codegen complete them with the defaults)
1. When `amplify push` is complete we can now change the code to add analytics to our app.
1. Navigate to `unicornflix/src/Components/GridView/index.jsx` and find the import line.
    ```javascript
    import Amplify, { API, graphqlOperation } from 'aws-amplify';
    ```
    Change this to 
    ```javascript
    import Amplify, { API, graphqlOperation, Analytics } from 'aws-amplify';
    ```
1. And that is that! We are now logging metrics for our website! To view your metrics navigate to the AWS Console and select the service [Pinpoint](https://console.aws.amazon.com/pinpoint/home) and choose your project name. You can now monitor and check your metrics!
1. To extend this let's now add a custom event, let's send back the video name when someone clicks on it to find the most popular videos.
1. To do so navigate to `unicornflix/src/Components/GridView/index.jsx` and find the `displayMovie` function. In this function we need to add some code to send a new record. To see how to send events check out the documentation for [Analytics](https://aws-amplify.github.io/docs/js/analytics#recording-custom-events) for Amplify.
1. For this walkthrough we are just going to send a basic event by adding this code:
    ```javascript
    displayMovie = (item) => {
      Analytics.record({
        name: 'movieClick', 
        attributes: { id: item.video.id }
      });
      //Location 13
      . . .
    }
    ```
1. Now click a few of your videos to generate some metrics. NOTE: it can take a few minutes for the events to appear in your account.
1. Navigate back to the Pinpoint console, select your project, and on the left side select `Events` from the side view. Select the event that we have created (if you only have one event it will be default).
1. Now you see all the events with that name. If you want to filter by the id of the video you can insert a filter for the `id` attribute and now you can see just the clicks for a single video.
1. If you are feeling brave you can take a look at modifying `unicornflix/src/Components/VideoPlayer/index.jsx` to send video metrics back. We are using [video.js](https://docs.videojs.com/) as our video player so you can send metrics back.

Click [here](./Extensions.md) to return to the extensions index and explore other features to implement.
