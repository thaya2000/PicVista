pipeline {
    agent any

    environment {
        PORT = credentials('PORT_CI')
        REACT_APP_PUBLIC_FOLDER = credentials('REACT_APP_PUBLIC_FOLDER_CI')
        MONGO_DB = credentials('MONGO_DB_CI')
        JWT_KEY = credentials('JWT_KEY')
        CLIENT_DOCKER_IMAGE = 'thayanan/client'
        SERVER_DOCKER_IMAGE = 'thayanan/server'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    git url: 'https://github.com/thaya2000/PicVista.git', branch: 'main'
                }
            }
        }

        stage('Build Client') {
            steps {
                script {
                    sh 'cd client && npm install && npm run build'
                }
            }
        }

        stage('Build Server') {
            steps {
                script {
                    sh 'cd server && npm install'
                }
            }
        }

        // stage('Test') {
        //     steps {
        //         script {
        //             sh 'cd server && npm test'
        //             sh 'cd client && npm test'
        //         }
        //     }
        // }

        stage('Docker Build') {
            steps {
                script {
                    sh 'docker build -t ${SERVER_DOCKER_IMAGE}:${GIT_COMMIT} ./server'
                    sh 'docker build -t ${CLIENT_DOCKER_IMAGE}:${GIT_COMMIT} ./client'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy MongoDB
                    sh 'kubectl apply -f k8s/mongodb.yml'

                    // Deploy MERN stack applications
                    sh 'kubectl apply -f k8s/deployment.yml'
                    sh 'kubectl apply -f k8s/service.yml'
                }
            }
        }

        stage('Post-Deployment Tests') {
            steps {
                script {
                    sh 'curl -f http://$(minikube ip):NodePort || exit 1'
                }
            }
        }

        stage('Rollback') {
            when {
                expression { return currentBuild.result == 'FAILURE' }
            }
            steps {
                script {
                    sh 'kubectl rollout undo deployment/mern-server'
                    sh 'kubectl rollout undo deployment/mern-client'
                }
            }
        }
    }
}
