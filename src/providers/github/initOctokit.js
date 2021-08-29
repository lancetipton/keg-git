const { Octokit } = require("@octokit/rest")
const { retry } = require("@octokit/plugin-retry")
const { throttling } = require("@octokit/plugin-throttling")
const { omitKeys, pickKeys, noOpObj } = require("@keg-hub/jsutils")

const initOctokit = (provider) => {
  const Okt = Octokit.plugin(throttling).plugin(retry)

  return new Okt({
      timeout: 0,
      auth: provider.auth.token,
      log: {
        info: (msg, info) => console.log(`[Github Info]`, msg),
        warn: (msg, info) => console.warn(`[Github Warn]`, msg),
        error: (msg, info) => console.error(`[Github Error]`, msg),
      },
      throttle: {
        onRateLimit: (retryAfter, options) => {
          provider.api.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`)
          if(options.request.retryCount > 2) return undefined

          // Retry twice after hitting a rate limit error, then give up
          provider.api.log.info(`Retrying after ${retryAfter} seconds!`)
          return true
        },
        onAbuseLimit: (retryAfter, options) => {
          // does not retry, only logs a warning
          provider.api.log.warn(`Abuse detected for request ${options.method} ${options.url}`)
        },
      },
    })
}

module.exports = {
  initOctokit
}