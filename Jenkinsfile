pipeline {
    agent any
    
    environment {
        dockerregistry = 'https://registry.hub.docker.com'
        dockerhuburl = "montcarotte/jenkins_nodejs_app_demo"
        githuburl = "otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes"
        dockerhubcrd = 'dockerhub'
    }
 
    tools {nodejs "node"}
 
    stages {
 
        stage('Check out') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/otammato/Jenkins_pipeliline_build_deploy_nodejs_kubernetes.git']])
            }
        }    
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Start the app') {
            steps {
                sh 'node index.js &'
            }
        }
        
        stage('Test the app') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build NodeJS image') {
          steps{
            script {
              dockerImage = docker.build(dockerhuburl + ":$BUILD_NUMBER")
            }
          }
        }
        
        stage('Build MySQL image') {
          steps {
            dir('/var/lib/jenkins/workspace/nodejs_app_pipeline/mysql_container') { 
              script {
                dockerImageMySQL = docker.build(dockerhuburl + ":${BUILD_NUMBER}_mysql")
              }
            }
          }
        }
        
        stage('Test NodeJS image') {
            steps {
                script {
                    // Start the Docker container
                    def container = docker.image("${dockerhuburl}:$BUILD_NUMBER").run("-d")
                    try {
                        // Wait for the container to start running
                        sh 'sleep 10'
                        
                        // Run the test command outside the container
                        sh "npx mocha test/test.js"
                    } finally {
                        // Stop the container
                        container.stop()
                    }
                }
            }
        }
        
        stage('Test MySQL image') {
          steps {
            script {
              // Start the MySQL Docker container
              def mysqlContainer = docker.image("${dockerhuburl}:${BUILD_NUMBER}_mysql").run("-d")
              try {
                // Wait for the container to start running
                sh 'sleep 10'
        
                // Run the test script outside the MySQL container
                sh "npx mocha test/test_mysql.js"
              } finally {
                // Stop the MySQL container
                mysqlContainer.stop()
              }
            }
          }
        }

        
        stage('Deploy images') {
          steps{
            script {
              docker.withRegistry(dockerregistry, dockerhubcrd ) {
                dockerImage.push("${env.BUILD_NUMBER}")
                dockerImage.push("latest")
                dockerImageMySQL.push("${env.BUILD_NUMBER}_mysql")
                dockerImageMySQL.push("mysql_latest")
              }
            }
          }
        }
 
        stage('Remove images') {
          steps{
            sh "docker rmi ${dockerhuburl}:${BUILD_NUMBER}"
            sh "docker rmi ${dockerhuburl}:${BUILD_NUMBER}_mysql"
          }
        }
        
        stage('K8s Deploy') {
            steps{
                withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'kubern_config', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {
                    sh "aws eks update-kubeconfig --name demo-eks1"
                    sh "kubectl apply -f deployment.yaml"
                }
            }
        }
    }
}
