const path = require('path')
const moduleAlias = require('module-alias')
const { deepFreeze } = require('@keg-hub/jsutils')

const KEG_ROOT = path.join(__dirname, '../')
const KG_SRC = path.join(KEG_ROOT, 'src')

// aliases shared by jest and module-alias
const aliases = deepFreeze({
  KGRoot: KEG_ROOT,
  KGConfig: path.join(KEG_ROOT, 'configs'),
  KgSrc: KG_SRC,
  KGAuth: path.join(KG_SRC, 'auth'),
  KGRepo: path.join(KG_SRC, 'repo'),
  KGIsoGit: path.join(KG_SRC, 'isoGit'),
  KGRemote: path.join(KG_SRC, 'remote'),
  KGBranch: path.join(KG_SRC, 'branch'),
  KGConstants: path.join(KG_SRC, 'constants'),
  KGProviders: path.join(KG_SRC, 'providers'),
  KGGitHub: path.join(KG_SRC, 'providers/github'),
})

// Registers module-alias aliases (done programatically so we can reuse the aliases object for jest)
const registerAliases = () => moduleAlias.addAliases(aliases)

/**
 * Jest is not compatible with module-alias b/c it uses its own require function,
 * and it requires some slight changes to the format of each key and value.
 * `jestAliases` can be set as value of any jest config's `moduleNameMapper` property
 */
const jestAliases = deepFreeze(Object.keys(aliases).reduce(
  (aliasMap, key) => {
    const formattedKey = key + '(.*)'
    aliasMap[formattedKey] = aliases[key] + '$1'
    return aliasMap
  },
  {}
))

module.exports = {
  aliases,
  registerAliases,
  jestAliases
}
