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
                        def releases = listGitHubReleases(
                            credentialId: 'tpausl-github-token',
                            includeDrafts: false,
                            repository: 'tpausl/keycloak-theme'
                        )

                        echo releases

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
                        createGitHubRelease(credentialId: 'tpausl-github-token', repository: 'tpausl/keycloak-theme', tag: env.GIT_COMMIT.take(7), commitish: env.GIT_COMMIT)
                        uploadGithubReleaseAsset(credentialId: 'tpausl-github-token', repository: 'tpausl/keycloak-theme', uploadAssets: [
                            [filePath: 'dist_keycloak/keycloak-theme-for-kc-22-to-25.jar'],
                            [filePath: 'dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar']
                        ], tagName: env.GIT_COMMIT.take(7))
                    }
                }
            }
        }
    }
}
