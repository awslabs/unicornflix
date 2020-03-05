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

You just started at UnicornFlix and they hooked you up with a brand new laptop - _sweeeet!_ Now let's configure your development environment. For this workshop we will be using AWS Cloud9 a cloud native IDE! If you would like to run this workshop in your local environment, [click here](./documentation/Local_Env.md) to navigate to an alternate set of instructions.

### Create an Cloud9 EC2 Environment with the Console<a name="create-environment-console"></a>

1. Navigate to the Cloud9 Service dashboard by Choosing the "Services" drop down in the top left hand corner of the screen and search for Cloud9.
1. After you sign in to the AWS Cloud9 console, in the top navigation bar, choose an AWS Region to create the environment in\. For a list of available AWS Regions, see [AWS Cloud9](https://docs.aws.amazon.com/general/latest/gr/rande.html#cloud9_region) in the *AWS General Reference*\. **Note, if you are using Event Engine, use only the specified region from the EE console!** 
![\[AWS Region selector in the AWS Cloud9 console\]](http://docs.aws.amazon.com/cloud9/latest/user-guide/images/console-region.png)

1. Choose the large **Create environment** button in one of the locations shown below\.

   If you have no AWS Cloud9 environments yet, the button is shown on a welcome page\.  
![\[Welcome page in the AWS Cloud9 console\]](http://docs.aws.amazon.com/cloud9/latest/user-guide/images/console-welcome-new-env.png)

   If you already have AWS Cloud9 environments, the button is shown as follows\.  
![\[Create environment button in the AWS Cloud9 console\]](http://docs.aws.amazon.com/cloud9/latest/user-guide/images/console-new-env.png)

1. On the **Name environment** page, for **Name**, enter a name for your environment\.

1. To add a description to your environment, enter it in **Description**\.

1. Choose **Next step**\.

1. On the **Configure settings** page, for **Environment type**, choose **Create a new instance for environment \(EC2\)**\.

1. For **Instance type**, choose an instance type with the amount of RAM and vCPUs you think you need for the kinds of tasks you want to do. For this lab a **t2.micro** should be sufficient\.

    **Warning**  Choosing instance types with more RAM and vCPUs might result in additional charges to your AWS account for Amazon EC2\.

1. For **Platform**, choose the type of Amazon EC2 instance that you want: We will be using **Amazon Linux**\. AWS Cloud9 creates the instance and then connects the environment to it\.

1. Choose a value for **Cost\-saving setting**\. When all web browser instances that are connected to the IDE for the environment are closed, AWS Cloud9 waits this amount of time and then shuts down the Amazon EC2 instance for the environment\. 
**Warning**  Choosing a longer time period might result in more charges to your AWS account\.

1. You can optionally add up to 50 tags by supplying a **Key** and a **Value** for each tag\. The tags will be attached to the AWS Cloud9 environment as resource tags, and are propagated to the following underlying resources: the AWS CloudFormation stack, the Amazon EC2 instance, and Amazon EC2 security groups\. You can find information about tags in [Control Access Using AWS Resource Tags](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_tags.html) in the *[IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/)*\. Also see the [advanced information](tags.md) about tags\.
**Warning**  
If you update these tags after you create them, the changes are NOT automatically propagated to the underlying resources\. For more information, see [Propagating Tag Updates to Underlying Resources](tags.md#tags-propagate) in the advanced information about [tags](tags.md)\.

1. Choose **Next step**\.

1. On the **Review** page, choose **Create environment**\. Wait while AWS Cloud9 creates your environment\. This can take several minutes\.
    
    **Note**  If account creation fails, a banner is displayed at the top of the console page\. Additionally, the card for the environment, if it exists, indicates that environment creation failed\. After AWS Cloud9 creates your environment, it displays the AWS Cloud9 IDE for the environment\.

    If AWS Cloud9 doesn't display the IDE after at least five minutes, there might be a problem with your web browser, your AWS access permissions, the instance, or the associated virtual private cloud \(VPC\)\. For possible fixes, see [Cannot Open an Environment](troubleshooting.md#troubleshooting-env-loading) in *Troubleshooting*\.
  
1. Once your Cloud9 instance spins up and you have logged into your IDE, click on the terminal in the bottom center of the screen to begin developing.

### Installing Packages and Configuring Environment

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
