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

        stage('Build') {
            steps {
                script {
                    // Build Node.js (Express) application
                    sh 'cd server && npm install && npm run build'

                    // Build React application
                    sh 'cd client && npm install && npm run build'
                }
            }
        }

        // stage('Test') {
        //     steps {
        //         script {
        //             // Run Unit Tests
        //             sh 'cd server && npm test'
        //             sh 'cd client && npm test'
        //         }
        //     }
        // }

        stage('Docker Build') {
            steps {
                script {
                    // Build Docker images in Minikube's Docker environment
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
                    // Run post-deployment tests
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
                    // Rollback to previous stable version
                    sh 'kubectl rollout undo deployment/mern-server'
                    sh 'kubectl rollout undo deployment/mern-client'
                }
            }
        }
    }
}
