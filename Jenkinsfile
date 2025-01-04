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
                container('node') {
                    script {
                        sh 'apt install -y mvn'
                        sh 'npm install'
                        sh 'npm run build-keycloak-theme'
                    }
                }
            }
        }
    }
}
