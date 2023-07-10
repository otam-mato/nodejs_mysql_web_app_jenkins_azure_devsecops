
# The page is under development

Prerequisites:

* Linux workstation with Node.js and git installed (I’ll use Ubuntu 22.04)
* Valid GitHub account.
* Valid DockerHub account. Create a repo called jenkins_nodejs_app_demo.
* Jenkins server with a public IP, git and Docker installed (I’ll use Ubuntu 22.04)
* Kubernetes cluster running Docker

<br>
<br>


## Result
<br>

1. Based on the output of the Jenkins deployment as well as ```kubectl get all```, Kubernetes deployment and services are running successfully. The ```my-deployment``` deployment has two pods, and both pods are running without any restarts.

Additionally, there are two services: mysql-service and node-app-service. The mysql-service is a ClusterIP service with the IP 10.100.66.111 and exposes port 3306 for MySQL. The node-app-service is a LoadBalancer service with an external IP (af8f35f31190b44878e991cf07db6ec9-63904463.us-east-1.elb.amazonaws.com) and forwards traffic from port 80 to my Node.js application.

<img width="1000" alt="Screenshot 2023-07-04 at 19 31 56" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/cf47a74d-ac54-4b68-bc82-d9888d81b31e">

<br>
<br>

2. The app based on two microservices (a node.js and a MySQL database) and deployed to the Kubernetes cluster is available under the load-balancer DNS name:

<br>

<img width="1000" alt="Screenshot 2023-07-04 at 19 28 25" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/df3db4ce-5a88-40c6-a6d9-cf482b5cb4ff">

<br>
<br>


<img width="1000" alt="Screenshot 2023-07-04 at 19 36 16" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/77eaf4fc-8922-46c7-9410-1d12520729d8">

<br>
<br>

<img width="1000" alt="Screenshot 2023-07-04 at 19 21 15" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/27f7291a-f796-44e1-b69b-6628a9102b7c">

<br>
<br>

<br>
<br>

## Description

Jenkins pipeline script is used to automate the build, test, and deployment process of a Node.js application using Docker and Kubernetes. The break down of the different stages and their functionalities:

1. **Check out**: This stage checks out the source code from the specified Git repository.

2. **Install dependencies**: This stage installs the Node.js dependencies required by the application using the `npm install` command.

3. **Start the app**: This stage starts the Node.js application using the `node index.js` command. The ampersand (`&`) is used to run the command in the background.

4. **Test the app**: This stage runs the application's tests using the `npm test` command.

5. **Build NodeJS image**: This stage builds a Docker image for the Node.js application. The `docker.build` command is used to build the image with a tag based on the Jenkins build number.

6. **Build MySQL image**: This stage builds a Docker image for MySQL. The MySQL image is built from a separate directory using the `docker.build` command, and the image tag includes the Jenkins build number.

7. **Test NodeJS image**: This stage tests the Node.js Docker image by running the application's tests within a Docker container. The `docker.image().run` command is used to start the container, and the `npx mocha` command is used to execute the tests.

8. **Test MySQL image**: This stage tests the MySQL Docker image by running a separate test script within a Docker container. Similar to the previous stage, the MySQL container is started, and the `npx mocha` command is used to run the tests.

9. **Deploy images**: This stage pushes the built Docker images to a Docker registry. The `docker.withRegistry` block is used to authenticate with the Docker registry, and the `dockerImage.push` command is used to push the Node.js image with tags for the build number and "latest". The same process is repeated for the MySQL image.

10. **Remove images**: This stage removes the local Docker images that were built during the pipeline process using the `docker rmi` command.

11. **K8s Deploy**: This stage deploys the application to a Kubernetes cluster. It configures the Kubernetes context using AWS CLI (`aws eks update-kubeconfig`) and applies the deployment configuration (`kubectl apply -f deployment.yaml`).

Note: The pipeline assumes the existence of a Jenkins credential with ID 'kubern_config' that holds the necessary Kubernetes configuration.

<br>
<br>

<img width="1000" alt="Screenshot 2023-07-04 at 18 59 37" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/22f1b495-5c8c-43de-90d7-13ec0b83db3f">

<br>
<br>

## Test cases

1. Test NodeJS app

Mocha test script for testing an application running on port 3000. It uses the Chai assertion library and the Chai HTTP plugin for making HTTP requests and asserting the response.

This test case ensures that when an HTTP GET request is made to 'http://localhost:3000/', the response has a status code of 200 and there are no errors. If any of the assertions fail, the test case will be marked as failed.

```js
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('App', function() {
  it('should be running on port 3000', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
    });
  });
});
```

2. Test MySQL database from within the NodeJS app

```js
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('App', function() {
  it('should return all entries in the database as JSON', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
   });

  it('should return the response is an array', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        expect(res.body).to.be.an('array'); // Ensure the response is an array
        done();
      });
   });

   it('ensure the response array is not empty', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        expect(res.body.length).to.be.greaterThan(0); // Ensure the response array is not empty
        done();
      });
   });

   it('returned object contains the necessary properties: "id" (and it is the number)', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        const supplier = res.body[0]; // Assuming the response contains an array of supplier objects
        expect(supplier).to.have.property('id');
        expect(supplier.id).to.be.a('number');
        done();
      });
   });
});
```

Mocha test cases for testing an API that returns id's of entries from a database. The tests as well use Chai assertions and the Chai HTTP plugin for making HTTP requests and asserting the response.

These test cases verify various aspects of the API's response, including the status code, response format, array structure, non-empty response, and the presence and data types of specific properties in the response objects.

- The first test case is named 'should return all entries in the database as JSON'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response has a status code of 200 and is in JSON format.

- The second test case is named 'should return the response is an array'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response body is an array.

- The third test case is named 'ensure the response array is not empty'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response array has a length greater than 0.

- The fourth test case is named 'returned object contains the necessary properties: "id" (and it is the number)'. It sends an HTTP GET request to 'http://localhost:3000/entries', assumes the response contains an array of objects, and asserts that the first object in the array has the propertiy 'id'. It further asserts that the 'id' property is a number.

To test the MySQL database connection from within the NodeJS app we add one more endpoint `/entries' in index.js file:

<img width="700" alt="Screenshot 2023-07-05 at 20 33 36" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/4455d9b7-283b-49a6-a73d-5044ead6cff2">

The call to this endpoint just returns the array of suppliers 'id'

<img width="700" alt="Screenshot 2023-07-05 at 20 48 45" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/a1d0bf74-ce03-4a6a-aaf1-7afa3428a432">



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

<img width="700" alt="Screenshot 2023-07-09 at 14 15 15" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/524b21c0-2078-4abb-a041-faf5b76747bc">
<img width="700" alt="Screenshot 2023-07-09 at 14 20 35" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/c52f3abd-9538-4332-9c52-09fd00d3bf74">

6. Create the pipeline

<img width="700" alt="Screenshot 2023-07-09 at 14 22 25" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/3373fc50-a5e8-4592-91b8-b2d742bf7ae1">
<img width="700" alt="Screenshot 2023-07-09 at 14 23 43" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/2784771c-ff58-4c1a-88dc-3bc69ca80b23">

7. Install NodeJS plugin

<img width="700" alt="Screenshot 2023-07-09 at 14 27 48" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/7d60d4d4-cf66-44e2-a709-706de9d38cde">
<img width="700" alt="Screenshot 2023-07-09 at 14 32 01" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/1f2a7724-1700-45dc-abb5-ebc550f42551">

8. Activate and configure NodeJS plugin

<img width="700" alt="Screenshot 2023-07-09 at 14 32 29" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/784955ad-375d-4427-8596-a6db8abaa54b">
<img width="700" alt="Screenshot 2023-07-09 at 14 34 20" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/ee4ea1f7-164a-44d1-a382-2f267299753b">

<br>
<br>

###  Install Docker:

1. Install Docker

```sh
sudo apt-get update
sudo apt install gnupg2 pass -y
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker
```

2. Install Docker plugins
   
<img width="700" alt="Screenshot 2023-07-10 at 21 17 25" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/e29bd21b-4bca-46e0-8342-071167f52ba5">
<img width="700" alt="Screenshot 2023-07-10 at 21 16 16 1" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/09837d61-60f1-4d57-981f-f2ababedf9d4">
<img width="700" alt="Screenshot 2023-07-10 at 21 16 16" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/0b8aa02b-1fee-4618-b18e-3182067aaa8b">

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

<details markdown=1><summary markdown="span">Resolving 'access denied' issue </summary>

The output of the `SELECT user, host, plugin FROM mysql.user WHERE user = 'root';` command shows that there are two 'root' user entries with different authentication plugins: 'caching_sha2_password' and 'auth_socket'.

The 'caching_sha2_password' plugin is associated with the 'root' user when connecting from any host ('%'), while the 'auth_socket' plugin is associated with the 'root' user specifically when connecting from the 'localhost' host.

The 'caching_sha2_password' plugin is the default authentication plugin introduced in MySQL 8.0, which uses SHA-256 hashing algorithm. On the other hand, the 'auth_socket' plugin uses the operating system's socket-based authentication mechanism.

To resolve the access denied issue, you have a couple of options:

1. Update the authentication method for the 'root' user with the 'localhost' host to use the password-based authentication plugin ('caching_sha2_password'). Run the following command to update the plugin:

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'your_password';
   ```

   Replace 'your_password' with the desired password for the 'root' user. This will set the password and update the authentication plugin.

2. Connect to MySQL using the 'auth_socket' plugin. Since you have the 'auth_socket' plugin associated with the 'root' user for 'localhost', you can connect without providing a password using the following command:

   ```bash
   mysql -h localhost -P 3306 -u root
   ```

   This command will use the operating system's authentication to verify your credentials. Note that you must run the command from the same host where MySQL is installed.

</details>

```sh
sudo mysql -h localhost -u root -p -e "CREATE DATABASE COFFEE;"
```
```
cd /var/lib/jenkins/workspace/nodejs_app_pipeline/mysql_container
```

```sh
sudo mysql -h localhost -u root -p COFFEE < my_sql.sql
```

<br>
<br>

<br><br>

### Create EKS cluster

Install the AWS CLI version 2 on EC2

```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" 

sudo apt install unzip

sudo unzip awscliv2.zip  

sudo ./aws/install

aws --version
```

Configure aws cli using your Access key and Secret access key

```
aws configure
```

Install eksctl on EC2 Instance

```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp

sudo mv /tmp/eksctl /usr/local/bin

eksctl version
```

Install kubectl on EC2 Instance

```
sudo curl --silent --location -o /usr/local/bin/kubectl   https://s3.us-west-2.amazonaws.com/amazon-eks/1.22.6/2022-03-09/bin/linux/amd64/kubectl

sudo chmod +x /usr/local/bin/kubectl 

kubectl version --short --client
```
For the smooth testing create IAM Role with Administrator Access. Later the privileges must be limited according to the "least privilege" principle.

<br>
<img width="700" alt="Screenshot 2023-03-22 at 08 30 45" src="https://user-images.githubusercontent.com/104728608/226843952-8aa6336f-4dfa-4d1b-9f00-caa9fac1e53d.png">

<img width="700" alt="Screenshot 2023-03-22 at 08 40 16" src="https://user-images.githubusercontent.com/104728608/226847236-76b88323-f6f2-45b0-b360-bab57292de6c.png">


<br>

```
sudo su - jenkins
```
```
eksctl create cluster --name demo-eks --region us-east-1 --nodegroup-name my-nodes --node-type t3.small --managed --nodes 2 

eksctl get cluster --name demo-eks --region us-east-1

aws eks update-kubeconfig --name demo-eks --region us-east-1

cat  /var/lib/jenkins/.kube/config
```
<img width="700" alt="Screenshot 2023-03-21 at 14 57 03" src="https://user-images.githubusercontent.com/104728608/226848177-38710c6a-3b2d-460b-9331-a718d0ef07db.png">

save /var/lib/jenkins/.kube/config content at your local machine in kubeconfig_mar2023.txt file and upload it as global credentials to  Jenkins

<img width="700" alt="Screenshot 2023-03-21 at 14 57 52" src="https://user-images.githubusercontent.com/104728608/226848957-044c701a-8bf6-4b51-be46-49411fb4d0e5.png">

<img width="700" alt="Screenshot 2023-03-22 at 08 51 00" src="https://user-images.githubusercontent.com/104728608/226849926-e84e642c-3245-4c90-a363-d7eff1243920.png">



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

