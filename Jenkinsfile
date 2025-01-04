@Library('teckdigital') _
def appName = 'keycloak-theme'
pipeline {
    agent {
        kubernetes {
            inheritFrom 'node-builder'
        }
    }
    stages {
        stage('Build Jar') {
            steps {
                container('node-builder') {
                    script {
                        sh 'npm install'
                        sh 'npm run build-keycloak-theme'
                    }
                }
            }
        }
    }
}
