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

The app's frontend interfaces with a MySQL database, facilitating CRUD (Create, Read, Update, Delete) operations on the database records.<br>
The app is built on two containerized microservices.
<br>
<br>
DevSecOps practices implemented with OWASP dependency check, SonarQube and Trivy

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
   
      SonarQube is an open-source platform designed to continuously inspect and analyze code quality in software projects. It is widely used in the software development industry to identify and manage code quality issues throughout the development lifecycle. SonarQube provides a range of features and tools to assess the health of codebases and to help teams improve the maintainability, reliability, and security of their software.
      
      Key features and uses of SonarQube include:
      
      - **Static Code Analysis:**
         - SonarQube performs static code analysis by scanning the source code without executing it.
         - It identifies and reports on various code quality issues, such as code smells, bugs, security vulnerabilities, and potential maintainability problems.
      
      - **Code Quality Metrics:**
         - SonarQube measures and reports on a variety of code quality metrics, including code duplication, code complexity, and test coverage.
         - These metrics provide insights into the overall health and maintainability of the codebase.
      
      - **Security Vulnerability Detection:**
         - SonarQube includes security analyzers that can detect common security vulnerabilities in the code.
         - It helps developers identify and address security issues early in the development process.
      
      - **Integration with CI/CD Pipelines:**
         - SonarQube integrates seamlessly with continuous integration and continuous deployment (CI/CD) pipelines.
         - Developers can configure the pipeline to trigger SonarQube analyses automatically, providing immediate feedback on code changes.
      
      - **Quality Gates:**
         - Quality Gates in SonarQube allow teams to set and enforce specific criteria for code quality.
         - The pipeline can be configured to pass or fail based on whether the code meets predefined quality standards.
      
      - **Historical Analysis:**
         - SonarQube keeps track of historical code quality data, allowing teams to monitor trends over time.
         - This feature helps teams identify areas of improvement and track the impact of code changes on overall code quality.
      
      - **Language Support:**
         - SonarQube supports a wide range of programming languages, including Java, JavaScript, C#, Python, Ruby, and more.
         - This makes it versatile and applicable to projects developed in various languages.
      
      - **Custom Rules and Extensions:**
         - Teams can define custom coding rules and extend SonarQube's capabilities to meet specific project requirements.
      
      By using SonarQube, development teams can proactively address code quality issues, reduce technical debt, and improve the overall reliability and maintainability of their software projects. It plays a crucial role in fostering a culture of continuous improvement in software development practices.

  2. **Scanning of images with Trivy**

     Trivy is an open-source vulnerability scanner specifically designed for containers and containerized applications. It focuses on providing security scanning for container images and is commonly used in containerized environments such as Docker and Kubernetes. Trivy helps identify vulnerabilities in the software packages and dependencies included in container images, allowing developers and operators to address security issues early in the development and deployment process.
      
      Key features and uses of Trivy include:
      
      - **Container Image Scanning:**
         - Trivy scans container images for vulnerabilities by analyzing the software packages and libraries included in the image layers.
         - It checks against known vulnerabilities in public vulnerability databases to identify potential security issues.
      
      - **Fast and Lightweight:**
         - Trivy is designed to be fast and lightweight, making it suitable for integration into CI/CD pipelines and other automated workflows.
         - Its quick scanning capabilities allow for efficient security checks during the development and deployment lifecycle.
      
      - **Multiple Language Support:**
         - Trivy supports scanning images for vulnerabilities in various programming languages, including Java, Python, Ruby, JavaScript, Go, and others.
         - This flexibility makes it applicable to a wide range of containerized applications.
      
      - **Offline Mode:**
         - Trivy supports an offline mode, allowing users to cache vulnerability databases locally.
         - This is useful in environments with restricted internet access or for scenarios where users want to scan container images without an active internet connection.
      
      - **Integration with CI/CD Pipelines:**
         - Trivy can be integrated into CI/CD pipelines to automate security scans as part of the continuous integration and deployment process.
         - Automated scanning helps ensure that container images being deployed to production are free from known vulnerabilities.
      
      - **JSON Output and Formats:**
         - Trivy provides results in JSON format, making it easy to integrate with other tools and systems.
         - This output can be parsed and used for reporting, logging, or integration with security information and event management (SIEM) systems.
      
      - **Advisory Database Support:**
         - Trivy uses vulnerability databases such as the National Vulnerability Database (NVD) and the Red Hat Security Data API to identify known vulnerabilities.
      
      In summary, Trivy is a container image vulnerability scanner that aids in securing containerized applications by identifying and reporting on known vulnerabilities in the software packages and dependencies used within container images. Its focus on speed, flexibility, and integration capabilities makes it a valuable tool for DevSecOps practices, helping organizations maintain a strong security posture in their containerized environments.
         
  3. **OWASP Dependency check**

     OWASP Dependency-Check is an open-source security tool that specializes in identifying and alerting on project dependencies with known vulnerabilities. It is developed by the Open Web Application Security Project (OWASP) and is designed to be integrated into the software development life cycle to enhance application security.
      
      Key features and uses of OWASP Dependency-Check include:
      
      - **Dependency Analysis:**
         - Dependency-Check focuses on analyzing and identifying vulnerabilities in project dependencies, including libraries and third-party components.
         - It scans dependencies for known vulnerabilities by checking against various vulnerability databases.
      
      - **Wide Language Support:**
         - OWASP Dependency-Check supports a wide range of programming languages, making it versatile and applicable to projects developed in different languages.
         - Commonly supported languages include Java, JavaScript, .NET, Python, Ruby, PHP, and more.
      
      - **Integration with Build Tools:**
         - Dependency-Check is designed to be integrated into the build process and various build tools such as Apache Maven, Gradle, npm, and others.
         - It can be configured to run automatically as part of the build or CI/CD pipeline.
      
      - **Vulnerability Databases:**
         - Dependency-Check uses multiple vulnerability databases, including the National Vulnerability Database (NVD), to identify known vulnerabilities.
         - It provides information about the severity of vulnerabilities, affected versions, and references to additional resources.
      
      - **Build Failures and Reporting:**
         - When vulnerabilities are detected, Dependency-Check can be configured to fail the build or generate reports.
         - This ensures that developers are promptly notified of security issues and can take appropriate actions to remediate them.
      
      - **Integration with CI/CD Pipelines:**
         - Dependency-Check integrates well with CI/CD pipelines, enabling automated security scanning as part of the continuous integration and deployment process.
         - Automated scanning helps identify and address vulnerabilities early in the development lifecycle.
      
      - **Command-Line Interface and APIs:**
         - Dependency-Check provides a command-line interface (CLI) for manual execution and configuration.
         - It also offers APIs that allow for integration with other tools and systems.
      
      - **Suppression Mechanisms:**
         - Dependency-Check supports mechanisms to suppress false positives and known issues, allowing for more flexible use in complex projects.
      
      By using OWASP Dependency-Check, development teams can proactively identify and address security vulnerabilities in their projects' dependencies. This helps mitigate the risk of including components with known security flaws and contributes to overall application security by promoting the use of up-to-date and secure dependencies. The tool is part of the broader movement toward integrating security practices into the software development life cycle, often referred to as DevSecOps.

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

    ```sh
    newgrp docker
    sudo usermod -aG docker $USER
    sudo usermod -aG docker jenkins
    sudo service jenkins restart
    sudo systemctl daemon-reload
    sudo service docker restart
    ```

  </details>

  **<details markdown=1><summary markdown="span">Configure Jenkins plugins</summary>**

  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/74bf7384-0b49-49b0-8dde-a2345fe3256a)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/781d1a0d-9078-48ee-b14a-9d8e3e1cfb27)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/00ec917e-672e-403b-b131-c814e03d5a64)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/3122513a-1bfe-4d4e-8d77-f09004599242)
  </details>

  **<details markdown=1><summary markdown="span">Configure Docker</summary>**

  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/8cfd85ba-28ac-4c60-92ab-db5c6f6a5b31)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/0b21b287-ace8-4f32-9e56-c9f76bb768a8)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/74ef4b5e-3d0b-494f-91ab-39c8d4d37070)




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

  **<details markdown=1><summary markdown="span">Configure OWASP</summary>**

  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/fac723ed-d67d-45a8-a815-4142916cae62)
  ![image](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/ff0d6487-cef3-43c4-bae6-123be8cd5067)
  </details>


- Launch Azure AKS Cluster

  **<details markdown=1><summary markdown="span">Install and configure Azure CLI on the VM</summary>**

  ```
  sudo apt install azure-cli
  az login
  az account set --subscription <your_id>
  az aks get-credentials --resource-group DefaultResourceGroup --name tester3
  cat /home/azureuser/.kube/config
  ```  
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
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/f72ee832-cd1c-4a38-96a6-88f2a550dbcf" width="800px"/>
</p>

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/f960f377-40be-466a-9287-c344e72cfd13" width="800px"/>
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

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins_azure_devsecops/assets/113034133/1cda5c04-6cf7-4715-b483-c7a095ea1ddb" width="800px"/>
</p>

