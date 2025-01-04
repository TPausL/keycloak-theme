@Library("teckdigital") _
def appName = "keycloak-theme"
pipeline {
    agent {
    kubernetes {
        inheritFrom "kaniko-template"
    }
  }
    stages {
        stage('Build Jar') {
            steps {
                podTemplate(yaml: """
                                apiVersion: v1
                                kind: Pod
                                spec:
                                    containers:
                                    - name: node-builder
                                    image: node:20
                """) {
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
}