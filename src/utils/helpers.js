const { gitError } = require('./gitError')
const { getIsoGit } = require('../isoGit')
const { Logger } = require('@keg-hub/cli-utils')
const { exists, isFunc, noOp } = require('@keg-hub/jsutils')

const cleanFolder = folder => {
  return folder.trim()
    .replace(/ /g,'-')
    // TODO - Make this more better
    .replace(/\$\.\\\/\^\&\[\]\'\"/g,'')
}

const resolveLocation = args => {
  const { path } = getIsoGit()
  const {
    loc,
    dir=loc,
    name,
    folder=name,
    rootDir,
  } = args
  
  const cleanFolder = cleanFolder(folder)
  
  // If dir is a root path, then use it
  // Also ensure it's not the root folder of '/'
  const resolved = exists(dir) && dir.indexOf('/') === 0
    ? !cleanFolder
      ? dir
      : path.join(dir, cleanFolder)
    : path.join(rootDir || process.cwd() || '', cleanFolder)
  
  // Ensure the resolved path is not the root directory
  return resolved !== '/'
    ? resolved
    : cleanFolder && cleanFolder.length > 1
      ? path.join(resolved, cleanFolder)
      : gitLog.error(`Cloning into the root directory is not allowed.`, resolved)
}


const gitActionArgs = (args, actionName, onError=noOp) => {
  const {
    loc,
    name,
    dir=loc,
    rootDir,
    folder=name,
    ...actionArgs
  } = args
  
  const locArgs = { dir, rootDir, folder }
  const foundDir = resolveLocation(locArgs)

  return !foundDir
    ? onError(`${actionName} method requires a valid git directory.`, args)
    : [actionArgs, locArgs, foundDir]
}

const gitLog = (type='log', message, ...args) => {
  Logger[type](`[Keg-Git] ${message}`)
  args.length && console.log(...args)
  Logger.empty()
}
gitLog.pair = (part1, part2) => {
  Logger.pair(`[Keg-Git] ${part1}`, part2)
  Logger.empty()
}
gitLog.info = (...args) => gitLog('info', ...args)
gitLog.warn = (...args) => gitLog('warn', ...args)
gitLog.error = (...args) => gitLog('error', ...args)


module.exports = {
  gitLog,
  gitError,
  gitActionArgs,
  resolveLocation
}