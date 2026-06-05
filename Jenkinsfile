pipeline {
    agent {
        kubernetes {
            label 'kaniko'
        }
    }

    stages {

        stage('Agent Test') {
            steps {
                sh 'hostname'
                sh 'pwd'
                sh 'echo Running inside Kubernetes Agent'
            }
        }

    }
}