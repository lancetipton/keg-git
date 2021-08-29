const { Repo } = require('./repo')
const { Team } = require('./team')
const { initOctokit } = require('./initOctokit')
const { Organization } = require('./organization')

class GitProvider {

  constructor(git){
    this.git = git
    this.auth = this.git.config.auth
    this.api = initOctokit(this)
    this.repo = new Repo(this)
    this.team = new Team(this)
    this.org = new Organization(this)
  }

}

module.exports = GitProvider