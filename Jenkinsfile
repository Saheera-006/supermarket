pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Saheera-006/supermarket'
            }
        }

        stage('Build') {
            steps {
                echo 'No build needed for HTML/CSS project'
            }
        }

        stage('Test') {
            steps {
                echo 'No tests available'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}