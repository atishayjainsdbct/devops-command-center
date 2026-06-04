pipeline{
    agent any

    stages{
        stage('Checkout'){
            steps{
                echo 'Source Code checked Out'
            }
        }

        stage('Build'){
            steps {
                sh'echo Building Application'
            }
        }

        stage('Test'){
            steps{
                sh 'echo Running Tests'
            }
        }
    }
}