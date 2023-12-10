# Node.JS + MySQL Web App.<br><br>Building DevSecOps pipeline with Jenkins to deploy the app on Kubernetes based on AKS.

<br>

> [!NOTE]
> The part of a series of demo projects in which I manipulate a Node.js application using various technologies.<br>
>
> The app built using Node.js and Express, originally presented at this [GitHub Repository](https://github.com/otam-mato/nodejs_mysql_web_app_terraform.git).
>
> In the current installment, I am re-building the CICD pipeline to deploy the app on **AKS Azure** and integrating **DevSecOps** stages to scan the app for vulnerabilities.
<br>

## Deployment

Jenkins pipeline script entails several stages, each responsible for a specific part of the secutity checking and deployment processes:

1. **Clean Workspace:** Cleans the workspace using the `cleanWs()` step.

2. **Checkout from Git:** Checks out the specified branch from the provided Git repository.

3. **Install Dependencies:** Installs Node.js dependencies using the `npm install` command.

4. **Sonarqube Analysis:** Runs SonarQube analysis using the SonarQube scanner. It includes setting project name, key, and login.

5. **OWASP Dependency-Check Vulnerabilities:** Uses OWASP Dependency-Check to analyze dependencies and publishes the results.

6. **Build NodeJS image:** Builds a Docker image for the Node.js application.

7. **Build MySQL image:** Builds a Docker image for the MySQL container.

8. **TRIVY SCAN:** Uses Trivy to perform images scan and outputs the results to `trivyfs.txt`.

9. **Quality Gate:** Waits for the SonarQube Quality Gate to pass.

10. **Deploy images:** Pushes the Node.js and MySQL Docker images to the specified Docker registry.

11. **K8s Deploy:** Deploys Kubernetes resources using `kubectl apply` for MySQL secrets, deployments, Node.js app deployment, and services.

Each stage represents a phase in the DevSecOps process, from scanning te code for vulnerabilities to deploying the application on Kubernetes. The pipeline leverages various tools such as SonarQube for static code analysis, OWASP Dependency-Check for vulnerability scanning, Docker for containerization, Trivy for images scanning, and Kubernetes for deployment.

Please note that the success of this pipeline depends on the proper configuration of Jenkins, the availability of required tools, and the correctness of the associated files (e.g., Kubernetes YAML files, Jenkins credentials storage).

<br>

## Flow Diagram

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/dc154489-6cd0-47bf-8637-1256afd69d03" width="1000px"/>
</p>

<br>

## Technologies used
- **Jenkins**
- **Node.JS**
- **Express**
- **SonarQube**
- **Trivy**
- **OWASP dependency check**
- **MySQL**
- **Docker**
- **MS Azure**
- **VM**
  
<br>

## Functionality

This web application interfaces with a MySQL database, facilitating CRUD (Create, Read, Update, Delete) operations on the database records. Unit and End-to-end testing is implemented via **Mocha** and **Chai**. **Mocha** is used as the testing framework, while **Chai** provides the assertion library.

**<details markdown=1><summary markdown="span">Detailed app description</summary>**

## Summary

The app sets up a web server for a supplier management system. It allows viewing, adding, updating, and deleting suppliers. 

#### **Dependencies and Modules**:
   - **express**: The framework that allows us to set up and run a web server.
   - **body-parser**: A tool that lets the server read and understand data sent in requests.
   - **cors**: Ensures the server can communicate with different web addresses or domains.
   - **mustache-express**: A template engine, letting the server display dynamic web pages using the Mustache format.
   - **serve-favicon**: Provides the small icon seen on browser tabs for the website.
   - **Custom Modules**: 
     - `supplier.controller`: Handles the logic for managing suppliers like fetching, adding, or updating their details.
     - `config.js`: Keeps the server's settings for connectind to the MySQL database.

#### **Configuration**:
   - The server starts on a port taken from a setting (like an environment variable) or uses `3000` as a default.

#### **Middleware**:
   - It's equipped to understand data in JSON format or when it's URL-encoded.
   - It can chat with web pages hosted elsewhere, thanks to CORS.
   - Mustache is the chosen format for web pages, with templates stored in a folder named `views`.
   - There's a public storage (`public`) for things like images or stylesheets, accessible by anyone visiting the site.
   - The site's tiny browser tab icon is fetched using `serve-favicon`.

#### **Routes (Webpage Endpoints)**:
   - **Home**: `GET /`: Serves the home page.
   - **Supplier Operations**: 
     - `GET /suppliers/`: Fetches and displays all suppliers.
     - `GET /supplier-add`: Serves a page to add a new supplier.
     - `POST /supplier-add`: Receives data to add a new supplier.
     - `GET /supplier-update/:id`: Serves a page to update details of a supplier using its ID.
     - `POST /supplier-update`: Receives updated data of a supplier.
     - `POST /supplier-remove/:id`: Removes a supplier using its ID.

#### **Starting Up**:
   - The server comes to life, starts listening for visits, and announces its awakening with a log message.

</details>

**<details markdown=1><summary markdown="span">Unit and End-to-end testing description</summary>**

Test stages involve the following test cases:

   1. **Unit testing example. Test the NodeJS app:**
   <br><br>
   [**unit_test.js**](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/blob/697c67da869b96e3061374cb682384946fc47430/test/unit-test.js)
   
      **Mocha** test script for testing the application running on port 3000. It uses the **Chai** assertion library and the Chai HTTP plugin for making HTTP requests and asserting the response.
      <br><br>
      This test case ensures that when an HTTP GET request is made to 'http://localhost:3000/', the response has a status code of 200 and there are no errors. If any of the assertions fail, the test case will be marked as failed.
   
   2. **End-to-end test examples. Test MySQL database to send a request from within the NodeJS app**

         [**end-to-end-test.js**](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/blob/8cfbcb23d155ae9f6dc30ae170400d73dcd1ea0e/test/end-to-end-test.js)

         **Mocha** test cases for testing an API just returns some entries from a database (id). The tests as well use **Chai** assertions and the Chai HTTP plugin for making HTTP requests and asserting the response.
         
         These test cases verify various aspects of the API's response, including the status code, response format, array structure, non-empty response, and the presence and data types of specific properties in the response objects.
         
         - The first test case is named 'should return all entries in the database as JSON'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response has a status code of 200 and is in JSON format.
         
         - The second test case is named 'should return the response is an array'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response body is an array.
         
         - The third test case is named 'ensure the response array is not empty'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response array has a length greater than 0.
         
         - The fourth test case is named 'returned object contains the necessary properties: "id" (and it is the number)'. It sends an HTTP GET request to 'http://localhost:3000/entries', assumes the response contains an array of objects, and asserts that the first object in the array has the propertiy 'id'. It further asserts that the 'id' property is a number.
         
         To perform the end-to-end and test the MySQL database connection from within the NodeJS app we add one more endpoint `/entries' in index.js file:
         
         <img width="700" alt="Screenshot 2023-07-05 at 20 33 36" src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/765e8c4d-574a-4843-aea1-e70fc2bacaad">
         
   
   <br>
   <br>

</details>

<br>
<br>

## Prerequisites

- A work station or an **EC2** instance.
  
- Install and configure **Jenkins**

  **<details markdown=1><summary markdown="span">Install and configure Jenkins</summary>**
  
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

  </details>

- Install **Docker**

  **<details markdown=1><summary markdown="span">Install Docker to the Linux workstation</summary>**

  1. Install Docker to the Linux workstation

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
   
   2. Install Docker plugins to Jenkins
   
   
   <img width="700" alt="Screenshot 2023-07-10 at 21 16 16 1" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/09837d61-60f1-4d57-981f-f2ababedf9d4">
   <img width="700" alt="Screenshot 2023-07-10 at 21 17 25" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/e29bd21b-4bca-46e0-8342-071167f52ba5">
   <br>
   <br>
   
   3. Set up DockerHub credentials
   
   <img width="700" alt="Screenshot 2023-07-10 at 22 15 29" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/f2cee7d0-5901-4257-a196-873e8a85e977">
   <img width="700" alt="Screenshot 2023-07-10 at 22 14 54" src="https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes/assets/104728608/6481f4b7-35df-43b8-a95e-0009c06b479d">
   
   <br>
   <br>
   
   
   ### 3. Restart services:
   
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

  </details>

- Install MySQL

  **<details markdown=1><summary markdown="span">Install MySQL to the Linux workstation</summary>**

  Install MySQL:

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

</details>
  
- Launch EKS Cluster

   **<details markdown=1><summary markdown="span">Install the AWS CLI version 2 on EC2</summary>**
  
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
   
   Troubleshoot: 
   
   https://stackoverflow.com/questions/75702017/my-kubernetes-deployment-keeps-failing-in-jenkins

</details>

<br>

## Implementation

**Configure and launch Jenkins declarative script.**

[Jenkinsfile](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/blob/238e878bd200063b3c59d6f92d9ff3a5079d0685/Jenkinsfile)

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/1131cbc1-768e-45de-9555-5533ec115eb2" width="800px"/>
</p>

<br>

## Screenshots of the result

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/2b399902-bcc3-470e-aec6-295bd13d6219" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/db282a47-c0fb-435a-9c5e-3d725fe6edf4" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/3f7be45c-da1c-41f4-b46b-091bf81116da" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/9c082c9b-783b-49ce-9bd7-d1cb4ede6bdd" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/27793167-b539-4d48-bccc-2d090b7008a6" width="800px"/>
</p>


