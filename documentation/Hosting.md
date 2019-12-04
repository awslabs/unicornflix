## Host your app with amplify console

So you want to host using the Amplify console and publish with your phone these are the steps for you! To get started follow the steps below!

1. To submit an application for hosting, the Amplify service requires your project to be commited to a git repository.
1. Navigate to GitHub (or codecommit, gitlab, or bitbucket if you prefer!)
1. Create a new repository in your personal github account called unicornflix.
1. Return to the terminal window which is in the unicornflix/ directory of your project.
1. Run the git command `rm -rf .git` and `rm .gitignore`
1. Next run the comand `echo node_modules/ >> .gitignore`
1. Finally, follow the standard process for adding a remote origin and pushing your code by running
```
git init
git add *
git commit -m “Initial Commit"
git remote add origin <insert git remote url>
git push -u origin master
```

1. If you navigate to your personal repo in the browser, all your application files should now be committed.
1. Next, Navigate the the AWS Management Console. Search for the 'Amplify' Service in the search bar.
1. Once you reach the Amplify service splash page, expand the left hand side corner by clicking the `≡` icon and select 'All Apps'.
    ![Amplify Splash](https://www.amplify-video.com/unicornflix/amplify_splash.png)

1. On the following screen, choose connect app.
    ![Amplify Connect](https://www.amplify-video.com/unicornflix/amplify_connect_app.png)
1. Choose Github (or whichever of the supported git providers your repo is hosted in)
    ![Amplify git](https://www.amplify-video.com/unicornflix/amplify_git.png)
1. Next, you will have to authenticate the AWS Amplify service to access your repositories so that it can pull the application code for hosting. Log in with your Github account credentials and then authorize Amplify.
    ![Amplify git_auth](https://www.amplify-video.com/unicornflix/amplify_git_auth.png)
1. We now must choose our new repository(the one in your personal github account) which we previously pushed the application files too. 
    ![Amplify choose_repo](https://www.amplify-video.com/unicornflix/amplify_choose_repo.png)
1. Choose the master branch and hit 'Next'.
1. On the configure build settings screen, for the question 'Would you like Amplify Console to deploy changes to these resources with your frontend?" choose your amplify environment (most likely dev)
1. Next, choose the 'Create new role' button to allow amplify to access your AWS infrastructure.
    ![Amplify build_create](https://www.amplify-video.com/unicornflix/amplify_build_create_role.png)
1. On the 'Select type of trusted entity' page, leave everything as default and choose 'Next:Permissions"
    ![Amplify console_role](https://www.amplify-video.com/unicornflix/amplify_choose_repo.png)
1. On the Review screen, leave everything as default and choose the blue 'Create Role' button.
    ![Amplfiy create_role](https://www.amplify-video.com/unicornflix/amplfiy_create_role.png)
1. Navigate back to the tab where you were working in the amplify service. Click the '⟳' button next to 'Choose an existing service role or create a new one' input field. Click the drop down and choose the role you just created.
    ![Amplify build_create](https://www.amplify-video.com/unicornflix/amplify_role_created.png)
1. On the review screen review all the choices you have made thus far and hit 'save and deploy'.
    ![Amplify deploy](https://www.amplify-video.com/unicornflix/amplify_deploy.png)
1. Our final step is to edit the redirect rules of our newly hosted app. You should be on the main app's main page. Choose 'Rewrites and redirects' from the left hand side menu.
    ![Amplify rewrites](https://www.amplify-video.com/unicornflix/amplify_rewrites.png)
1. There should be one pre-existing rule. Change the Source Address to the following string `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>`
1. Change the 'Type' dropdown to 200 (Rewrite)
    ![Amplify redirect](https://www.amplify-video.com/unicornflix/amplify_redirect.png)
1. Hit save and return to the main app page in the Amplify console. 
1. Your project may still be deploying, once it finishes choose the CloudFront link to see you newly live hosted application!
1. Now, try uploading an asset from your phone and watch it appear in the application dashboard. (Remember to hold your phone in landscape, otherwise your video will appear sideways in the player)

Click [here](./Extensions.md) to return to the extensions index and explore other features to implement.
