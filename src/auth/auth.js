
/**
 * @type {Object} Cache holder for git authentication
 * @property {string} [username]
 * @property {string} [password]
 */
let __GIT_AUTH

/**
 * @typedef {Object} GitAuth
 * @property {string} [username]
 * @property {string} [password]
 * @property {Object<string, string>} [headers]
 * @property {boolean} cancel - Tells git to throw a `UserCanceledError` (instead of an `HTTPError`).
 */


/**
 * @callback AuthCallback
 * See https://isomorphic-git.org/docs/en/onAuth
 * @param {string} url
 * @param {GitAuth} auth - Might have some values if the URL itself originally contained a username or password.
 * @returns {GitAuth | void | Promise<GitAuth | void>}
 */
const onAuth = git => {
  return async (url, auth) => {
    return {
      username: 'token / username',
      password: 'Personal Access Token'
    }
  }
}

/**
 * @callback AuthSuccessCallback
 * @param {string} url
 * @param {GitAuth} auth
 * @returns {void | Promise<void>}
 */
const onAuthSuccess = git => {
  return async (url, auth) => {
    
  }
}

/**
 * @callback AuthFailureCallback
 * @param {string} url
 * @param {GitAuth} auth The credentials that failed
 * @returns {GitAuth | void | Promise<GitAuth | void>}
 */
const onAuthFailure = git => {
  return async (url, auth) => {
    // try again
    // return { username: '', password: '', }

    // Cancel
    // return { cancel: true }
  }
}

/**
 * @callback onMessage - Handle messages sent from the git server during git operations
 * @param {Array<string>} messages
 *
 * @returns {function} callback for the onMessage handler
 */
const onMessage = git => {
  return async (...messages) => {
  
  }
}

module.exports = {
  onAuth,
  onAuthFailure,
  onAuthSuccess,
}