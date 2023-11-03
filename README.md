# Node.JS + MySQL Web App.<br><br>Building CICD pipeline with Jenkins to deploy on Kubernetes.

<br>

> **Note:** The part of a series of demo projects in which I manipulate a Node.js application using various technologies.<br>
>
> The app built using Node.js and Express, originally presented at this [GitHub Repository](https://github.com/otam-mato/nodejs_mysql_web_app_terraform.git).
>
> In the current installment, I am building CICD pipeline with Jenkins to deploy the app on Kubernetes.
<br>

## Deployment Strategy

1. **Building Stages with Docker:** <br> 
   Here, we create Docker images of the Node.js application. This involves defining Dockerfiles, setting up the necessary configurations, and packaging the application into Docker containers. The build process ensures that the application is properly containerized and ready for deployment.

2. **Testing Stages covered by Mocha and Chai:** <br>
   In this phase, we employ Mocha and Chai to conduct comprehensive testing. Mocha is used as the testing framework, while Chai provides the assertion library. The tests cover various aspects of the application, including unit tests, integration tests, and possibly end-to-end tests to ensure the app functions as expected.

3. **Pushing built images to Docker Hub and deploying them to a Kubernetes Cluster launched on Amazon EKS:** <br>
   Following successful testing, the built Docker images are pushed to Docker Hub for versioning and storage. Then, utilizing Jenkins, the images are deployed to a Kubernetes Cluster running on Amazon EKS. 
<br>

## Flow Diagram

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/1e6b100e-cc20-4e5b-80f5-8932cf9ca4dd" width="800px"/>
</p>

<br>

## Technologies used
- **Jenkins**
- **Node.JS**
- **Express**
- **Mocha**
- **Chai**
- **JavaScript**
- **MySQL**
- **Docker**
- **AWS**
- **EC2**
  
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

**<details markdown=1><summary markdown="span">Unit and End-to-end testing</summary>**

Test stages involve the following test cases:

   1. **Unit testing example. Test the NodeJS app:**
   <br><br>
   **Mocha** test script for testing the application running on port 3000. It uses the **Chai** assertion library and the Chai HTTP plugin for making HTTP requests and asserting the response.
   <br><br>
   This test case ensures that when an HTTP GET request is made to 'http://localhost:3000/', the response has a status code of 200 and there are no errors. If any of the assertions fail, the test case will be marked as failed.
   
      [**unit_test.js**](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/blob/697c67da869b96e3061374cb682384946fc47430/test/unit-test.js)
   
   2. **End-to-end test examples. Test MySQL database to send a request from within the NodeJS app**

         Mocha test cases for testing an API that returns id's of entries from a database. The tests as well use Chai assertions and the Chai HTTP plugin for making HTTP requests and asserting the response.
         
         These test cases verify various aspects of the API's response, including the status code, response format, array structure, non-empty response, and the presence and data types of specific properties in the response objects.
         
         - The first test case is named 'should return all entries in the database as JSON'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response has a status code of 200 and is in JSON format.
         
         - The second test case is named 'should return the response is an array'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response body is an array.
         
         - The third test case is named 'ensure the response array is not empty'. It sends an HTTP GET request to 'http://localhost:3000/entries' and asserts that the response array has a length greater than 0.
         
         - The fourth test case is named 'returned object contains the necessary properties: "id" (and it is the number)'. It sends an HTTP GET request to 'http://localhost:3000/entries', assumes the response contains an array of objects, and asserts that the first object in the array has the propertiy 'id'. It further asserts that the 'id' property is a number.
         
         To test the MySQL database connection from within the NodeJS app we add one more endpoint `/entries' in index.js file:
         
         <img width="700" alt="Screenshot 2023-07-05 at 20 33 36" src="https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/assets/113034133/765e8c4d-574a-4843-aea1-e70fc2bacaad">
         
         [**end-to-end-test.js**](https://github.com/otam-mato/nodejs_mysql_web_app_jenkins/blob/8cfbcb23d155ae9f6dc30ae170400d73dcd1ea0e/test/end-to-end-test.js)
   
   <br>
   <br>

</details>
