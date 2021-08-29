const { getIsoGit } = require('../isoGit')
const { gitLog, resolveLocation, gitActionArgs } = require('../helpers')
const { limbo, isUrl } = require('@keg-hub/jsutils')

class Repo {
  
  constructor(git){
    this.git = git
  }

  clone = async args => {
    if(!isUrl(args.url))
      return this.git.error(`clone method requires a valid url.`, args.url)

    const [cmdArgs, locArgs, dir] = gitActionArgs(args, 'clone', this.git.error)

    const { fs, git, http, cache } = getIsoGit()
    const [err, resp] = await limbo(git.clone({
      fs,
      http,
      dir,
      cache,
      ...this.git.config.auth,
      ...this.git.config.clone,
      ...cmdArgs
    }).bind(git))

    return err
      ? this.git.error(err.message, args)
      : true
  }

  status = async args => {
    const [cmdArgs, locArgs, dir] = gitActionArgs(args, 'status', this.git.error)

    const { fs, git, cache } = getIsoGit()
    const [err, resp] = await limbo(git.status({
      dir,
      fs,
      git,
      ...this.git.config.status,
      ...cmdArgs,
    }).bind(git))

    return err
      ? this.git.error(err.message, args)
      : resp
  }

  add = async args => {
    const [cmdArgs, locArgs, dir] = gitActionArgs(args, 'add', this.git.error)

    const { fs, git, cache } = getIsoGit()
    const [err, resp] = await limbo(git.add({
      fs,
      dir,
      cache,
      filepath,
      ...this.git.config.add,
      ...cmdArgs,
    }))

    return err
      ? this.git.error(err.message, args)
      : resp
  }

  remove = async args => {
    const [cmdArgs, locArgs, dir] = gitActionArgs(args, 'remove', this.git.error)

    const { fs, git, cache } = getIsoGit()
    const [err, resp] = await limbo(git.remove({
      fs,
      dir,
      cache,
      filepath,
      ...this.git.config.remove,
      ...cmdArgs,
    }))

    return err
      ? this.git.error(err.message, args)
      : resp
  }

  commit = async args => {
    const [cmdArgs, locArgs, dir] = gitActionArgs(args, 'commit', this.git.error)

    message = cmdArgs.message || this.git.config.commit || `[Keg-Git] Auto Commit`
    
    // See https://runkit.com/wmhilton/isomorphic-git-quick-start
    // Returns a commit hash object
    const { fs, git, cache } = getIsoGit()
    const [err, resp] = await limbo(git.remove({
      fs,
      dir,
      cache,
      ...this.git.config.commit,
      ...cmdArgs,
      message,
      author: {
        // name,
        // email,
        ...this.git.config.author,
        ...cmdArgs.author
      }
    }))

    return err
      ? this.git.error(err.message, args)
      : resp
  }

}

module.exports = {
  Repo
}