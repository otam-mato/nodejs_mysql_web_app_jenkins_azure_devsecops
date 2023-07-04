# The page is under development

<br>
<br>

<img width="1000" alt="Screenshot 2023-07-04 at 18 59 37" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/22f1b495-5c8c-43de-90d7-13ec0b83db3f">


## Result

Based on the output of the Jenkins deployment as well as ```kubectl get all```, Kubernetes deployment and services are running successfully. The ```my-deployment``` deployment has two pods, and both pods are running without any restarts.

Additionally, there are two services: mysql-service and node-app-service. The mysql-service is a ClusterIP service with the IP 10.100.66.111 and exposes port 3306 for MySQL. The node-app-service is a LoadBalancer service with an external IP (af8f35f31190b44878e991cf07db6ec9-63904463.us-east-1.elb.amazonaws.com) and forwards traffic from port 80 to my Node.js application.

<img width="1000" alt="Screenshot 2023-07-04 at 19 31 56" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/cf47a74d-ac54-4b68-bc82-d9888d81b31e">

<br>
<br>

<img width="1000" alt="Screenshot 2023-07-04 at 19 28 25" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/df3db4ce-5a88-40c6-a6d9-cf482b5cb4ff">

<br>
<br>

<img width="1000" alt="Screenshot 2023-07-03 at 22 01 25" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/d1f1966a-d199-486e-b369-1236847d9703">

<br>
<br>

<img width="1000" alt="Screenshot 2023-07-04 at 19 21 15" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/27f7291a-f796-44e1-b69b-6628a9102b7c">

<br>
<br>

## Steps to follow:

### Install Jenkins:

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

###  Install Docker:

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

### Restart services:

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

### Install MySQL:

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

