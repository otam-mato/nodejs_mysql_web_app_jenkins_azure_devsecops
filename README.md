[under revision]

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

Jenkins pipeline script entails several stages, each responsible for a specific part of the security checking and deployment processes:

1. **Clean Workspace:** Cleans the workspace using the `cleanWs()` step.

2. **Checkout from Git:** Checks out the specified branch from the provided Git repository.

3. **Install Dependencies:** Installs Node.js dependencies using the `npm install` command.

4. **SonarQube Analysis:** Runs SonarQube analysis using the SonarQube scanner. It includes setting project name, key, and login.

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
- **MS AKS**
- **VM**
  
<br>

## Functionality

This web application interfaces with a MySQL database, facilitating CRUD (Create, Read, Update, Delete) operations on the database records. DevSecOps practices implemented with OWASP dependency check, SonarQube and Trivy

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

**<details markdown=1><summary markdown="span">Vulnerability scanning and Dependency checks description</summary>**

Vulnerability scanning involves:

   1. **Scanning of static code with SonarQube:**
   <br><br>
   [**unit_test.js**](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/blob/697c67da869b96e3061374cb682384946fc47430/test/unit-test.js)
   
      **Mocha** test script for testing the application running on port 3000. It uses the **Chai** assertion library and the Chai HTTP plugin for making HTTP requests and asserting the response.
      <br><br>
      This test case ensures that when an HTTP GET request is made to 'http://localhost:3000/', the response has a status code of 200 and there are no errors. If any of the assertions fail, the test case will be marked as failed.

   
   2. **Scanning of images with Trivy**

         [**end-to-end-test.js**](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/blob/8cfbcb23d155ae9f6dc30ae170400d73dcd1ea0e/test/end-to-end-test.js)

         **Mocha** test cases for testing an API just returns some entries from a database (id). The tests as well use **Chai** assertions and the Chai HTTP plugin for making HTTP requests and asserting the response.
         
         These test cases verify various aspects of the API's response, including the status code, response format, array structure, non-empty response, and the presence and data types of specific properties in the response objects.
         

   3. **OWASP Dependency check**

         [**end-to-end-test.js**](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/blob/8cfbcb23d155ae9f6dc30ae170400d73dcd1ea0e/test/end-to-end-test.js)

         **Mocha** test cases for testing an API just returns some entries from a database (id). The tests as well use **Chai** assertions and the Chai HTTP plugin for making HTTP requests and asserting the response.
         
   
   <br>
   <br>

</details>

<br>
<br>

## Prerequisites

- A work station or a **VM**.
  
- Install and configure **Jenkins**, **SonarQube** and **Trivy**

  **<details markdown=1><summary markdown="span">Install Jenkins, SonarQube and Trivy</summary>**
  
    ```bash
    #!/bin/bash
    sudo apt update -y
    wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | tee /etc/apt/keyrings/adoptium.asc
    echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list
    sudo apt update -y
    sudo apt install temurin-17-jdk -y
    /usr/bin/java --version
    curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
    echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install jenkins -y
    sudo systemctl start jenkins
    sudo systemctl status jenkins
    
    #install docker
    sudo apt-get update
    sudo apt-get install docker.io -y
    sudo usermod -aG docker ubuntu  
    newgrp docker
    sudo chmod 777 /var/run/docker.sock
    docker run -d --name sonar -p 9000:9000 sonarqube:lts-community
    
    #install trivy
    sudo apt-get install wget apt-transport-https gnupg lsb-release -y
    wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
    echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
    sudo apt-get update
    sudo apt-get install trivy -y
    ```

  </details>

  **<details markdown=1><summary markdown="span">Configure Jenkins plugins</summary>**

  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/74bf7384-0b49-49b0-8dde-a2345fe3256a)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/781d1a0d-9078-48ee-b14a-9d8e3e1cfb27)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/00ec917e-672e-403b-b131-c814e03d5a64)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/3122513a-1bfe-4d4e-8d77-f09004599242)
  </details>

  **<details markdown=1><summary markdown="span">Configure SonarQube</summary>**

  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/619419d6-92a8-48e4-955d-61f572167d4e)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/fcf6b305-9520-4536-a3c9-61b2d2055b5b)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/6b012562-b776-475c-8a0a-7bc874265628)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/daed306f-2a03-4825-92a5-bcc9b4f4dba5)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/1ae6114c-1fcd-4f8b-821a-447ccbb8b93c)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/f65b2b5b-ab12-4ce8-9da6-ae037ad2edbb)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/e12878a6-bbbd-4dd1-bc0f-55f901b87561)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/02b41c4b-eb00-49e4-84a3-a8a8926c0ad5)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/ea1eeac0-dc23-491b-89aa-50d845cddc08)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/fd20d492-0b67-46c4-a6e1-32092955bd59)
  
  </details>

  **<details markdown=1><summary markdown="span">OWASP</summary>**

  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/fac723ed-d67d-45a8-a815-4142916cae62)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/ff0d6487-cef3-43c4-bae6-123be8cd5067)



  </details>

- Restart services

  **<details markdown=1><summary markdown="span">Restart services</summary>**
  
   **Restart services**:
   
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

- Launch AKS Cluster

   **<details markdown=1><summary markdown="span">Install Azure CLI version 2 on the VM</summary>**
  
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
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/ce13052f-7c9f-4ac8-9a6a-f12fd3a96ec4" width="800px"/>
</p>

<br>

## Screenshots of the result

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/36ee1e41-783e-4e74-a572-2269d02d5366" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/2d70d0d2-3118-490e-b92e-d87de55e8e65" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/0165a622-109f-4434-81d8-af240b1f7e85" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/a9487c58-6eaa-4389-bb6f-ce62fd608352" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/db282a47-c0fb-435a-9c5e-3d725fe6edf4" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/3434f91f-0cbe-4c50-a356-671d19964251" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/715c8f01-ee56-43fe-a774-fa3f75e92acf" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/531a2e3e-2256-4b76-be1b-3c69ac92c147" width="800px"/>
</p>



