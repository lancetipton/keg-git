const fs = require('fs')
const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const { config:defConfig } = require('../configs/git.config')
const { exists, deepMerge, noOpObj } = require('@keg-hub/jsutils')

const { Repo } = require('./repo')
const { Branch } = require('./branch')
const { Remote } = require('./remote')
const Providers = require('./providers')
const { initIsoGit } = require('./isoGit')
const { gitLog, gitError } = require('./helpers')
const { onAuth, onAuthFailure, onAuthSuccess } = require('./auth')

class Git {

  config = {
    provider: 'github',
    auth: {
      onAuth: onAuth(this),
      onAuthFailure: onAuthFailure(this),
      onAuthSuccess: onAuthSuccess(this),
    }
  }

  constructor(config=noOpObj){
    this.config = deepMerge(this.config, config)
    // Remove the .com from the provider if it exists
    this.config.provider = this.config.provider.replace('.com', '')

    initIsoGit(git, { fs, path, http })
  
    this.repo = new Repo(this)
    this.branch = new Branch(this)
    this.remote = new Remote(this)

    const Provider = Providers[this.config.provider]
    if(!Provider) throw new Error(`Missing git provider. Provider for ${this.config.provider} does not exist.`)
    this.provider = new Provider(this)
  }

  error(message, ...args){
    this.config.throwOnError &&
      gitError(message, ...args)

    return this.config.log &&
      gitLog.error(message, ...args)
  }

}

const gitInstance = new Git(defConfig)

module.exports = {
  Git,
  git: gitInstance,
}