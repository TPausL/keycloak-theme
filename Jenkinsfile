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
                        sh 'apt update'
                        sh 'apt install -y maven'
                        sh 'npm install'
                        sh 'npm run build-keycloak-theme'
                    }
                }
            }
        }
        stage('Create release') {
            steps {
                container('node') {
                    script {
                        def repo = 'tpausl/keycloak-theme'
                        def release = createGitHubRelease(credentialId: 'tpausl-github-token', repository: repo, tag: env.GIT_COMMIT.take(7), commitish: env.GIT_COMMIT)
                        def releaseId = String.valueOf(release.id)
                        withCredentials([string(credentialsId: 'tpausl-github-token', variable: 'GITHUB_TOKEN')]) {
                            sh "curl -XPOST -H \"Authorization:token ${GITHUB_TOKEN}\" -H \"Content-Type:application/octet-stream\" --data-binary @dist_keycloak/keycloak-theme-for-kc-22-to-25.jar https://uploads.github.com/repos/${repo}/releases/${releaseId}/assets?name=keycloak-theme-for-kc-22-to-25.jar"
                            sh "curl -XPOST -H \"Authorization:token ${GITHUB_TOKEN}\" -H \"Content-Type:application/octet-stream\" --data-binary @dist_keycloak/keycloak-theme-for-kc-all-other-versions https://uploads.github.com/repos/${repo}/releases/${releaseId}/assets?name=keycloak-theme-for-kc-all-other-versions"
                        }
                    }
                }
            }
        }
    }
}
