const { isObj } = require('@keg-hub/jsutils')
const { gitError } = require('../helpers/gitError')

let __ISO_GIT
let __ISO_MODULES = {}
let __ISO_CACHE = {}

const validateModules = ({ path, fs, http }) => {
  !path && gitError(`Isomorphic Git requires a path module.`)
  !http && gitError(`Isomorphic Git requires an http module.`)
  !fs && gitError(`Isomorphic Git requires an fs (fileSystem) module.`)
}

const initIsoGit = (git, modules, cache) => {
  validateModules(modules)

  __ISO_GIT = git
  __ISO_MODULES = modules
  isObj(cache) && (__ISO_CACHE = cache)
}

const clearIsoCache = () => {
  __ISO_CACHE = {}
}

const getIsoGit = () => {
  !__ISO_GIT && gitError(`Isomorphic Git has not been initialized!`)

  return {
    ...__ISO_MODULES,
    cache: __ISO_CACHE,
    git: __ISO_GIT,
  }
}

module.exports = {
  clearIsoCache,
  getIsoGit,
  initIsoGit
}