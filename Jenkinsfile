pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = '216989120271'
        AWS_REGION = 'ap-south-1'
        ECR_REPOSITORY = 'eScrow-app-repo'
        DOCKER_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest"
    }
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/CrownGituser/eScrow_UI.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        stage('Push to ECR') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'aws-credentials', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        sh 'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com'
                        sh "docker push ${DOCKER_IMAGE}"
                    }
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                script {
                    sh "kubectl set image deployment/eScrow-app eScrow-app=${DOCKER_IMAGE} --record"
                }
            }
        }
    }
}

