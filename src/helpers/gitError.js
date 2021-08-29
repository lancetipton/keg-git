const { Logger } = require('@keg-hub/cli-utils')

const gitError = (message, ...args) => {
  Logger.empty()
  throw new Error(`[Keg-Git] ${message}`, ...args)
}

module.exports = {
  gitError
}