## Backend Deployment with Amplify CLI

1. First, we need to change directories to the root folder of our project.
    * `cd UnicornFlix`
1. Next we are going to begin development of our Amplify project by using the initialization command.  This command creates new AWS backend resources (in this case a single S3 bucket to host your CloudFormation templates) and pulls the AWS service configurations into the app!
    * `amplify init`
1. Follow the prompts shown below.
    * **PLEASE DOUBLE CHECK THE PROFILE YOU ARE USING.**
    * Note that because of the services leveraged, your AWS profile **MUST USE** us-west-2, us-east-1, eu-west-1, eu-central-1, ap-northeast-1, or ap-southeast-2.
    <pre>
    unicornflix $ <b>amplify init</b>
    
    Note: It is recommended to run this command from the root of your app directory
    ? Enter a name for the project: <b>unicornflix</b>
    ? Enter a name for the environment <b>dev</b>
    ? Choose your default editor: <b>None</b>
    ? Choose the type of app that you're building <b>javascript</b>
    Please tell us about your project
    ? What javascript framework are you using <b>react</b>
    ? Source Directory Path:  <b>src</b>
    ? Distribution Directory Path: <b>build</b>
    ? Build Command:  <b>npm run-script build</b>
    ? Start Command: <b>npm run-script start</b>
    Using default provider  <b>awscloudformation</b>

    For more information on AWS Profiles, see:
    https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html

    ? Do you want to use an AWS profile? <b>Yes</b>
    ? Please choose the profile you want to use <b>default</b>
    </pre>
    
    
1. Now, we are going to add the amplify video module to the project. 
    * `amplify video add`
1. Follow the prompts as shown below. We'll be building in a basic content management system (CMS) as part of our video-on-demand (VOD) platform.
<pre>
unicornflix <b>$amplify add video</b>
? Please select from one of the below mentioned services: <b>Video On Demand (beta)</b>
? Provide a friendly name for your resource to be used as a label for this category in the project: <b>unicornflix</b>
? Select a system-provided encoding template, specify an already-created template name:  <b>Default Encoding Template (Apple HLS
 @ 1080p30)</b>
? Is this a production enviroment? <b>No</b>
? Do you want Amplify to create a new GraphQL API to manage your videos? <b>Yes</b>
</pre>

Above we created the first part of amplify video to support transcoding of files. This workflow stands up two S3 buckets with a pre-processing Lambda function - to create new MediaConvert jobs for the files uploaded - and a post-processing Lambda function - to register the completed job and make the content available for playback. The MediaConvert job is configured to use the template you choose in the prompts above. If we had chosed <b>Yes</b> for the production environment question, Amplify video would spin up AWS CloudFront to host your content on a CDN.

<pre>
Video On Demand only supports GraphQL right now.
If you want to only use API for CMS then choose the default ToDo and don't edit it until later.
? Please select from one of the below mentioned services: <b>GraphQL</b>
? Provide API name: <b>unicornflix</b>
? Choose the default authorization type for the API <b>Amazon Cognito User Pool</b>
</pre>

Above we dive into create the basic infrastructure for our API. Amplify Video for Video on Demand only supports using GraphQL powered by AWS AppSync.

<pre>
? Do you want to use the default authentication and security configuration? <b>Default configuration</b>
? How do you want users to be able to sign in? <b>Username</b>
? Do you want to configure advanced settings? <b>No, I am done.</b>
Successfully added auth resource
</pre>

We take advantage of the built in Auth component for Amplify to add basic authentication to our application. We will keep with the defaults as it supports what we need for our application.

<pre>
? Do you want to configure advanced settings for the GraphQL API <b>No, I am done.</b>
? Do you have an annotated GraphQL schema? <b>No</b>
? Do you want a guided schema creation? <b>Yes</b>
? What best describes your project: <b>Single object with fields (e.g., “Todo” with ID, name, description)</b>
? Do you want to edit the schema now? <b>No</b>
</pre>

Though we choose ToDo and we don't edit the GraphQL schema here, we will be editing below with the correct values for our application.

<pre>
? Define your permission schema (Press *space* to select, *a* to toggle all, *i* to invert selection) <b>Admins can 
only upload videos</b>
? Do you want to edit your newly created model? <b>Yes</b>
Please edit the file in your editor: <b>unicornflix/amplify/backend/api/unicornflix/schema.graphql</b>
</pre>

Navigate to the file schema.graphql located at unicornflix/amplify/backend/api/unicornflix/schema.graphql using the Cloud9 file explorer on the left hand side panel, and double click schema.graphql file to open it. We are going to edit the schema to remove the Todo model that was added earlier by the default API generation. **Do not click enter until in the terminal until the schema has been modified and the file has been saved**

The new schema should look like this if you removed just the Todo model:

```graphql
type vodAsset @model (subscriptions: {level: public})
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

  #DO NOT EDIT
  video:videoObject @connection
} 

#DO NOT EDIT
type videoObject @model
@auth(
  rules: [
    {allow: groups, groups:["Admin"], operations: [create, update, delete, read]},
    {allow: private, operations: [read]}
  ]
)
{
  id:ID!
}
```

<pre>
? Press enter to continue 

GraphQL schema compiled successfully.

Edit your schema at unicornflix/amplify/backend/api/unicornflix/schema.graphql or 
place .graphql files in a directory at unicornflix/amplify/backend/api/unicornflix/schema

</pre>

1. Once the prompts complete, make sure the module was added by checking the project status.
    * `amplify status`
<pre>
unicornflix $ <b>`amplify status`</b>

Current Environment: <b>dev</b>

| Category | Resource name       | Operation | Provider plugin   |
| -------- | ------------------- | --------- | ----------------- |
| <b>Auth</b>     | <b>unicornflix1e7c3699</b> | Create    | awscloudformation |
| <b>Auth</b>     | <b>userPoolGroups</b>      | Create    | awscloudformation |
| <b>Api</b>      | <b>unicornflix</b>         | Create    | awscloudformation |
| <b>Video</b>    | <b>unicornflix</b>         | Create    | awscloudformation |

</pre>
Now it is time to actually create the resources by pushing the configuration to the cloud. 

1. Run amplify push to create the backend video resource which is comprised of the services necessary to manage, process, and serve our videos. We'll need to answer a few questions to generate code for interacting with GraphQL from our application, which will be used later in our development.
    * `amplify push`

<pre>
unicornflix $ <b>amplify push</b>
? Do you want to generate code for your newly created GraphQL API <b>Yes</b>
? Choose the code generation language target <b>javascript</b>
? Enter the file name pattern of graphql queries, mutations and subscriptions <b>src/graphql/**/*.js</b>
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions <b>Yes</b>
? Enter maximum statement depth [increase from default if your schema is deeply nested] <b>2</b>
</pre>


It will take a few minutes to stage and create the resources in your AWS environment. While that runs, let's take a brief look at what was just created:

  ![architecture](https://www.amplify-video.com/unicornflix/amplify_arch.png)

The video processing plane of Amplify Video VOD uses an S3 bucket for source material that generates S3 events on object PUT. A Lambda Function, triggered from the S3 event, schedules the MediaConvert job to process  content. The outputs of MediaConvert are put into the Output S3 bucket and also generate S3 events on object PUT. These events trigger a final Lambda function which sets access policies on the content served to users in the output bucket.

The data plane consists of AppSync hosted GraphQL APIs, Lambda Resolvers, and DynamoDB as the persistance layer for video metadata and access URLs. 

Authentication for the web application is governed through Cognito User Pools, which protect access to the GraphQL API. The API has fine-grained access based on the group in the Cognito User Pool. Cognito also generates temporary, limited-privilege AWS credentials for access to upload content into S3.


With the infrastructure deployed, let's test processing and streaming a video asset. 

1. Open the S3 console and upload a small video file to the 'Input Storage Bucket' which was returned when you ran amplify push. You can download and upload [this sample clip](https://www.amplify-video.com/unicornflix/sample2.mp4) or [this other sample clip](https://www.amplify-video.com/unicornflix/sample.mp4) if you don't have your own video handy. **Tip:** Right click on the link and select `Save as...` to grab the clip.
1. Check the MediaConvert console, you should see an asset in 'progressing' shortly after the upload to S3 completes. Once the MediaConvert job is finished, continue on to the next step.
1. Click the checkbox in the S3 console next to the .m3u8 object to open the information panel. Copy the Object URL and paste it into safari, iOS, VLC, or by using a test player like the [Amplify Video Stream Tester](https://www.amplify-video.com/Player)

Congratulations, you are now hosting a Video-on-Demand platform on AWS! Now let's setup a website that we will use to upload more content and deliver it to viewers. [Click here to move onwards to Admin View.](./Admin.md)

