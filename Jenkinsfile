pipeline {
    agent {
        kubernetes {
            inheritFrom 'kaniko-agent'
        }
    }

    stages {

        stage('Workspace Check') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Frontend Install') {
            steps {
                container('node') {
                    dir('frontend') {
                        sh 'node --version'
                        sh 'npm --version'
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Backend Install') {
            steps {
                container('python') {
                    dir('backend') {
                        sh 'python --version'
                        sh 'pip --version'
                        sh 'pip install -r requirements.txt'
                    }
                }
            }
        }

        stage('Frontend Build') {
            steps {
                container('node') {
                    dir('frontend') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Backend Validation') {
            steps {
                container('python') {
                    dir('backend') {
                        sh 'python -m compileall app'
                    }
                }
            }
        }

    }

    post {
        success {
            echo 'CI Pipeline completed successfully!'
        }

        failure {
            echo 'CI Pipeline failed!'
        }
    }
}