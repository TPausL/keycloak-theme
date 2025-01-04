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
                        def test = createGitHubRelease(credentialId: 'tpausl-github-token', repository: 'tpausl/keycloak-theme', tag: env.GIT_COMMIT.take(7), commitish: env.GIT_COMMIT)
                        echo String.valueOf(test.id)

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
                        def test = createGitHubRelease(credentialId: 'tpausl-github-token', repository: 'tpausl/keycloak-theme', tag: env.GIT_COMMIT.take(7), commitish: env.GIT_COMMIT)
                        echo test
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
