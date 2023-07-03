# The page is under development

<br>
<br>

## Result

<img width="1000" alt="Screenshot 2023-07-03 at 21 53 06" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/ccca9a07-e03e-4e4e-a70a-7c5e77c2795a">


<br>
<br>

## Install Jenkins:

https://varunmanik1.medium.com/devops-jenkins-aws-series-part-1-how-to-install-jenkins-on-aws-ubuntu-22-04-cb0c3cdb055

1. Install Java: Jenkins requires Java to run, so the first step is to install Java on the Ubuntu instance. You can do this by running the following command:

```sh
sudo apt-get update
sudo apt-get install openjdk-11-jdk
```

2. Add Jenkins repository: Next, you need to add the Jenkins repository to the instance by running the following commands:

```sh
sudo curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee   /usr/share/keyrings/jenkins-keyring.asc > /dev/null
sudo echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]   https://pkg.jenkins.io/debian-stable binary/ | sudo tee   /etc/apt/sources.list.d/jenkins.list > /dev/null
```
3. Install Jenkins: Now you can install Jenkins by running the following command:

```sh
sudo apt-get update
sudo apt-get install jenkins
```
4. Start Jenkins: Once Jenkins is installed, start & enable the Jenkins service using the following command:

```sh
sudo systemctl start jenkins

sudo systemctl status jenkins

sudo systemctl enable jenkins
```

5. Configure Jenkins:

```
cat /var/lib/jenkins/secrets/initialAdminPassword
```

<br>
<br>

##  Install Docker:

```sh
sudo apt-get update
sudo apt install gnupg2 pass -y
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker
```

<br>
<br>

## Restart services:

```sh
newgrp docker
sudo usermod -aG docker $USER
sudo usermod -aG docker jenkins
sudo service jenkins restart
sudo systemctl daemon-reload
sudo service docker restart
```

<br>
<br>

## Install MySQL:

```sh
sudo apt-get install mysql-server
sudo systemctl start mysql
```

```sh
mysql
```

```sh
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
ALTER USER 'root'@'localhost' IDENTIFIED BY '12345678';
```

```sh
sudo mysql -h localhost -u root -p -e "CREATE DATABASE COFFEE;"
```

```sh
sudo mysql -h localhost -u root -p COFFEE < my_sql.sql
```

<br>
<br>

# Coffee suppliers sample app

## Summary
This is a simple CRUD app built with Express.


## Running locally

### 1. Build the local Db
```sql
create DATABASE COFFEE;
use coffee;
create table suppliers(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  PRIMARY KEY ( id )
);
```

### 2. Install and run the server
```zsh
npm install

# define your db vars at start
APP_DB_HOST=localhost \
APP_DB_USER=root \
APP_DB_PASSWORD="" \
APP_DB_NAME=COFFEE \
npm start
```
If you do not set the env vars when starting the app the values 
from `app/config/config.js` will be used

Troubleshoot: 

https://stackoverflow.com/questions/75702017/my-kubernetes-deployment-keeps-failing-in-jenkins

