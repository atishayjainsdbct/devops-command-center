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

        stage('Frontend Validation') {
            steps {
                container('node') {
                    dir('frontend') {
                        sh 'node --version'
                        sh 'npm --version'
                        sh 'ls -la'
                        sh 'cat package.json | head'
                    }
                }
            }
        }

        stage('Backend Validation') {
            steps {
                container('python') {
                    dir('backend') {
                        sh 'python --version'
                        sh 'pip --version'
                        sh 'ls -la'
                        sh 'cat requirements.txt'
                    }
                }
            }
        }

    }
}