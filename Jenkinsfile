pipeline {
    agent {
        kubernetes {
            inheritFrom 'kaniko-agent'
        }
    }

    stages {
        stage('Agent Test') {
            steps {
                sh 'hostname'
                sh 'pwd'
                sh 'echo Running in Kubernetes Agent'
            }
        }
    }
}