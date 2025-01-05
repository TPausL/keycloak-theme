@Library('teckdigital') _
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
                            sh "curl -XPOST -H \"Authorization:token ${GITHUB_TOKEN}\" -H \"Content-Type:application/octet-stream\" --data-binary @dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar https://uploads.github.com/repos/${repo}/releases/${releaseId}/assets?name=keycloak-theme-for-kc-all-other-versions.jar"
                        }
                    }
                }
            }
        }

        stage('Update GitOps')  {
            steps {
                script {
                    def gitOpsBranch = 'main'
                    withCredentials([gitUsernamePassword(credentialsId: 'teckdigital-service-user')]) {
                        checkout(changelog: false, poll: false, scm: scmGit(
                            userRemoteConfigs: [
                                [url: 'https://github.com/teckdigital/gitops.git', credentialsId: 'teckdigital-service-user']
                            ],
                            branches: [[name: "origin/${gitOpsBranch}"]],
                            extensions: [localBranch(gitOpsBranch),
                            [
                                $class: 'RelativeTargetDirectory', relativeTargetDir: 'gitops'
                            ]]
                    ))

                        dir('gitops') {
                            def appName = 'keycloak(theme)'
                            def releaseTag = env.GIT_COMMIT.take(7)
                            def valuesPath = 'core/keycloak/values.yaml'

                            def fileName = 'timos-keycloak-theme'
                            sh "sed -i -E 's|(${fileName}\\.jar.*\\/download\\/)([^/]+)(\\/.*)|\\1${releaseTag}\\3|g' ${valuesPath}"

                            hasDiff = sh script: 'git diff --quiet HEAD', returnStatus: true

                            if (hasDiff == 0) {
                                echo 'No changes to commit'
                                return
                            }

                            def email = 'github-bot@teckdigital.de'

                            sh "git config --global user.email '${email}'"
                            sh "git add ${valuesPath}"
                            sh "git commit -m \"chore(${appName}): bump releaseTag to ${releaseTag}\""
                            sh "git push -u origin ${gitOpsBranch}"
                        }
                    }
                }
            }
        }
    }
}
