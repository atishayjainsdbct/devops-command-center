pipeline {
    agent {
        kubernetes {
            inheritFrom 'kaniko-agent'
        }
    }

    stages {

        stage('Agent Check') {
            steps {
                sh 'hostname'
            }
        }

        stage('Kaniko Check') {
            steps {
                container('kaniko') {
                    sh '/kaniko/executor version'
                }
            }
        }
    }
}