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

You just started at UnicornFlix and they hooked you up with a brand new laptop - _sweeeet!_ Now let's configure your development environment. For this workshop we will be using AWS Cloud9 a cloud native IDE!

1. Click the below links and follow the instructions to create and open your cloud9 environment!(We will be using all the default configurations for this workshop)
    * [Creating a Cloud9 Instance](https://docs.aws.amazon.com/cloud9/latest/user-guide/create-environment-main.html)
    * [Opening your Cloud9 Instance to the IDE](https://docs.aws.amazon.com/cloud9/latest/user-guide/open-environment.html)
1. Once your Cloud9 instance spins up and you have logged into your IDE, click on the terminal in the bottom center of the screen to begin developing.
1. The first step is to copy your aws  credentials from the credentials file into a file called config. Run the following command in the terminal.
    * `cp ~/.aws/credentials ~/.aws/config`
1. Next, clone the UnicornFlix workshop. 
    * `git clone https://github.com/awslabs/UnicornFlix.git`
1. We will now be installing the development tools using the Node Package Manager(NPM)
1. Install the AWS Amplify CLI using this command.
    * `npm install -g @aws-amplify/cli`
1. Finally, install Amplify Video, a custom AWS Amplify CLI plugin for creating our video resource, by running this command. 
    * `npm install -g amplify-category-video`


[Click Here to begin implementing the back end!](./documentation/Backend.md)
