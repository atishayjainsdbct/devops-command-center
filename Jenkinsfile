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
                sh 'npm install'
            }
        }
    }
}
}

        stage('Backend Install') {
    steps {
        container('python') {
            dir('backend') {
                sh 'pip install -r requirements.txt'
            }
        }
    }
}

    }
