<p align="center">
  <img src="https://www.amplify-video.com/unicornflix/logo.png" width="450">
</p>

Welcome to UnicornFlix. As the first developer here at UnicornFlix it's your mission to bring humanity closer to the unicorn kingdom by serving up premium videos to subscribers. You've been asked by the founders to develop a minimum-lovable-product to begin serving videos to users as soon as possible. They've also asked you to keep operational overhead at a minimum and to keep the API design flexible as the business model could pivot at any moment.

In this workshop we will build the video on demand streaming platform that allows you to upload, process, and serve videos to authenticated users.

The workshop is split into three primary sections with a collection of optional extensions:

![3 steps to UnicornFlix](https://www.amplify-video.com/unicornflix/steps.png)

**Backend Deployment with Amplify CLI** - Use the Amplify CLI to deploy the API, Authentication, and Video Streaming infrastructure.

**Web Client Admin View** - Build a web application to add videos and associate basic metadata.

**Web Client User View** - Stream videos to users who have signed into the service.

**Optional Extensions** - An optional section containing a collection of tutorials to extend the application functionality.

## Setting up Development Environment

You just started at UnicornFlix and they hooked you up with a brand new laptop - _sweeeet!_ Now let's configure your development environment. 

1. Clone the UnicornFlix workshop by running `git clone https://github.com/awslabs/UnicornFlix.git` or by downloading the zip [here](https://github.com/awslabs/unicornflix/archive/master.zip)
1. Download and install Node and Node Package Manager (NPM) if you don't already have it from [nodejs.org](https://nodejs.org/en/download/). Select **LTS** for the node version.
1. Install/update AWS Amplify CLI using this command `npm install -g @aws-amplify/cli`
1. Install Amplify Video, a custom AWS Amplify CLI plugin for creating our video resource, by running `npm install -g amplify-category-video`
1. If you are using cloud9, please refer to the following steps to configure your cloud9 instance to use you're aws credentials.
<details>
        <summary>Click here for Cloud9 instructions</summary>

1. Create the ~/.aws/config file on your cloud9 instance
1. Copy the contents in the ~/.aws/credentials into the ~/.aws/config file; then when you run amplify init, you will see the option to select the profiles in the ~/.aws/config file. 

You can copy the below example if you want to use a different set of access keys.
```
[default]
aws_access_key_id=<access key id>
aws_secret_access_key=<secret access key>
aws_session_token=<optional session token for temp credentials>
region=<region, such as 'us-west-2'>
```
 
</details>

[Click Here to begin implementing the back end!](./documentation/Backend.md)
