pipeline {
    agent any
    
    environment {
        SCANNER_HOME=tool 'sonarqube-scanner'
        dockerregistry = 'https://registry.hub.docker.com'
        dockerhuburl = 'montcarotte/jenkins_nodejs_app_demo'
        githuburl = 'otammato/nodejs_mysql_web_app_jenkins_azure_devsecops'
        dockerhubcrd = 'dockerhub'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/otam-mato/nodejs_mysql_web_app_jenkins.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }
        

        stage("Sonarqube Analysis "){
            steps{
                withSonarQubeEnv('SonarQube-Server') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=COFFEE_APP \
                    -Dsonar.projectKey=COFFEE_APP \
                    -Dsonar.login='squ_7fdce1e749c064deb7f3ffa2871f9145c5343f9f' '''
                }
            }
        }
        
        
        stage('OWASP Dependency-Check Vulnerabilities') {
            steps {
                dependencyCheck additionalArguments: ''' 
                            -o './'
                            -s './'
                            -f 'ALL' 
                            --prettyPrint''', odcInstallation: 'DP'
                
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
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
            dir('./mysql_container') { 
              script {
                dockerImageMySQL = docker.build(dockerhuburl + ":${BUILD_NUMBER}_mysql")
              }
            }
          }
        }
        
        stage('Trivy Scan NodeJS Image') {
            steps {
                script {
                    def trivyResult = sh(script: "trivy image montcarotte/jenkins_nodejs_app_demo:latest > trivyimagescan.txt", returnStatus: true)
                    if (trivyResult != 0) {
                        error("Trivy scan failed for Node.js image")
                    }
                }
            }
        }
        
        // stage('Trivy Scan MySQL Image') {
        //     steps {
        //         script {
        //             def trivyResultMySQL = sh(script: "trivy image ${dockerImageMySQL}", returnStatus: true)
        //             if (trivyResultMySQL != 0) {
        //                 error("Trivy scan failed for MySQL image")
        //             }
        //         }
        //     }
        // }
        
        stage("Quality Gate") {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'SonarQube-Token2'
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
        
        stage('K8s Deploy') {
            steps{
                withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'Kube_config', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {
                    sh "kubectl apply -f ./kubernetes_files/mysql_secret.yml"
                    sh "kubectl apply -f ./kubernetes_files/mysqldb_deployment.yml"
                    sh "kubectl apply -f ./kubernetes_files/nodejs_app_deployment.yml"
                    sh "kubectl apply -f ./kubernetes_files/services.yml"
                }
            }
        }
        
    }
}
