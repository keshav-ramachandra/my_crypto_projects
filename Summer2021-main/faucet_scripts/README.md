### PRE-REQUISITES


######  Install PIP

sudo apt-get install python3-pip


######  INSTALL SELENIUM

sudo pip3 install selenium


I used the pyvirtual display for testing, You can remove this if you are using headless mode(no display) in chrome. If you do this, you can remove the line 4 of faucet.py and indent the successive lines

pip3 install pyvirtualdisplay

###### Install CHROME DRIVER. (It should be of specific version for your chrome)
Go to https://chromedriver.chromium.org/downloads


To check your chrome verson, 
Run the command google-chrome --version. 

Extract the files downloaded. Then run the below commands
sudo mv chromedriver /usr/bin/chromedriver
sudo chown root:root /usr/bin/chromedriver
sudo chmod +x /usr/bin/chromedriver


#### TESTING

On line 16, replace the address with your account address

I placed the script in the desktop.
To check where python is, Run the command which python. Mine is in /usr/bin/python3.
Make sure to give the absolute locations to the script and log file like below.
Also give execute permission to the faucet.py file by running chmod + x faucet.py

###### SET UP A CRON JOB TO RUN EVERY 2 MINUTES

On ubuntu


Type the below command

crontab -e

Insert the below line at the bottom.

*/2 * * * * DISPLAY=:0 /usr/bin/python3 /home/your_name/Desktop/faucet.py >> /home/kesha/name/faucet.log 2>&1

If everything goes right, A chrome window should appear after 2 minutes. If it doesn't work, you should see the errors in the log file.




####  LIVE
##### SET UP A CRON JOB TO RUN EVERY 25 hours

ALSO , set visible to False on line 5 and uncomment the line 8 in faucet.py 

0 */25 * * * DISPLAY=:0 /usr/bin/python3 /home/your_name/Desktop/faucet.py >> /home/kesha/name/faucet.log 2>&1
