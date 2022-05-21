### This Phase involves integrating Airnode with Google Vision API

##### Phase demonstrates Label detection, Text detection and Logo detection



Pre-requisites

* Nodejs, NPM and yarn

* Serverless. Use command npm install -g serverless

* Terraform

Use the below commands
* curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
* sudo apt-add-repository "deb [arch=$(dpkg --print-architecture)] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
* sudo apt install terraform=0.13.*

* Note: Terraform should be 0.13 version like shown above

You should also have the Google vision API key


**Configuration**

Vision_node folder. Go to packages/deployer/src/config_data folder and configure the config.json file. Fill up the google vision api key fields and metamask wallet address.
Also fill up the AWS credentials into the .env file of deployer folder

* DO the same for the .env file inside tasks folder. Also for another .env inside tasks/config/folder. Copy the previous config.json to tasks/config/folder.

One of the commands in the deploy script file requires your aws key and secret. So update it.

Once the setup is done, Run the below two scripts.

* sh ./deploy.sh . Run this inside the vision_node folder. 
* sh ./tasks.sh   . Run this inside the tasks folder.

As an example, Text detection is done in the second script.

You can run the below commands inside the tasks folder to test out each feature

* npm run make-text-detection-request
* npm run make-label-detection-request
* npm run make-logo-detection-request

### Result
 
 <img src="https://onlinetexttools.com/images/examples-onlinetexttools/text-custom-font.png" width="500" height="130">

 <img src="https://github.com/BinaRam/Summer2021/blob/main/phase_3/results/text-detection.png" width="900" height="130">

 <img src="https://static.scientificamerican.com/sciam/cache/file/5C51E427-1715-44E6-9B14D9487D7B7F2D_source.jpg" width="500" height="130">
 
<img src="https://github.com/BinaRam/Summer2021/blob/main/phase_3/results/label-detection.png" width="900" height="130">
 
 <img src="https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/fc/3034007-inline-i-applelogo.jpg" width="500" height="130">

<img src="https://github.com/BinaRam/Summer2021/blob/main/phase_3/results/logo-detection.png" width="900" height="130">

