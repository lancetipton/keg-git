const { Repo } = require('./repo')
const { Team } = require('./team')
const { initOctokit } = require('./initOctokit')
const { Organization } = require('./organization')

class GitProvider {

  constructor(git){
    this.git = git
    this.auth = this.git.config.auth
    const { rest, graph } = initOctokit(this)
    this.api = rest
    this.graph = graph
    this.repo = new Repo(this)
    this.team = new Team(this)
    this.org = new Organization(this)
  }

}

module.exports = GitProvider