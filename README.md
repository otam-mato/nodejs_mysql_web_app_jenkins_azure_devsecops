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

2. **Testing Stages with Mocha and Chai:** <br>
   In this phase, we employ Mocha and Chai to conduct comprehensive testing. Mocha is used as the testing framework, while Chai provides the assertion library. The tests cover various aspects of the application, including unit tests, integration tests, and possibly end-to-end tests to ensure the app functions as expected.

3. **Pushing built images to Docker Hub and deploying them to a Kubernetes Cluster launched on Amazon EKS:** <br>
   Following successful testing, the built Docker images are pushed to Docker Hub for versioning and storage. Then, utilizing Jenkins, the images are deployed to a Kubernetes Cluster running on Amazon EKS. 
<br>

## Flow Diagram

<p align="center">
  <img src="https://github.com/otam-mato/nodejs_mysql_web_app_prometheus_grafana_ansible/assets/113034133/6a0e37d0-e467-4e22-99e8-8afcb9db98f1" width="800px"/>
</p>

<br>
