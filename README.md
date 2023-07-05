# The page is under development





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

2. Test MySQL database

Mocha test cases for testing an API that returns entries from a database. The tests as well use Chai assertions and the Chai HTTP plugin for making HTTP requests and asserting the response.

These test cases verify various aspects of the API's response, including the status code, response format, array structure, non-empty response, and the presence and data types of specific properties in the response objects.

- The first test case is named 'should return all entries in the database as JSON'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response has a status code of 200 and is in JSON format.

- The second test case is named 'should return the response is an array'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response body is an array.

- The third test case is named 'ensure the response array is not empty'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response array has a length greater than 0.

- The fourth test case is named 'returned object contains the necessary properties: "id" (and it is the number), "name" (and it is the string)'. It sends an HTTP GET request to 'http://localhost:3000/entries', assumes the response contains an array of objects, and asserts that the first object in the array has the properties 'id' and 'name'. It further asserts that the 'id' property is a number and the 'name' property is a string.

To test the MySQL database connection from within the NodeJS app we add one more endpoint `/entries' in index.js file:

<img width="700" alt="Screenshot 2023-07-05 at 20 33 36" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/4455d9b7-283b-49a6-a73d-5044ead6cff2">

The call to this endpoint just returns the array of suppliers 'id'

<img width="700" alt="Screenshot 2023-07-05 at 20 48 45" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/a1d0bf74-ce03-4a6a-aaf1-7afa3428a432">

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

   it('returned object contains the necessary properties: "id" (and it is the number), "name" (and it is the string)', function(done) {
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

## Result
<br>

1. Based on the output of the Jenkins deployment as well as ```kubectl get all```, Kubernetes deployment and services are running successfully. The ```my-deployment``` deployment has two pods, and both pods are running without any restarts.

Additionally, there are two services: mysql-service and node-app-service. The mysql-service is a ClusterIP service with the IP 10.100.66.111 and exposes port 3306 for MySQL. The node-app-service is a LoadBalancer service with an external IP (af8f35f31190b44878e991cf07db6ec9-63904463.us-east-1.elb.amazonaws.com) and forwards traffic from port 80 to my Node.js application.

<img width="1000" alt="Screenshot 2023-07-04 at 19 31 56" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/cf47a74d-ac54-4b68-bc82-d9888d81b31e">

<br>
<br>

2. The app based on two microservices (a node.js and a MySQL database) and deployed to the Kubernetes cluster is available as well under the load-balancer DNS name:

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

