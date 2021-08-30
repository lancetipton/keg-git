const { Octokit } = require("@octokit/rest")
const { graphql } = require("@octokit/graphql")
const { retry } = require("@octokit/plugin-retry")
const { throttling } = require("@octokit/plugin-throttling")
const { limbo, noOpObj } = require("@keg-hub/jsutils")

let __REST_API
let __GRAPH_API
let __OCTO_PLUGINS

const graphError = (err, throwErr=true) => {
  console.error(`[Keg-Git] Github provider failed graphQL request`)
  if(throwErr) throw new Error(err)
  
  console.error(err.message)
  return err.data || noOpObj
}

const graphQuery = async (query, options=noOpObj, throwError=true) => {
  const { graph } = getOctokitApis()
  const [ err, resp ] = await limbo(__GRAPH_API(query, options))

  return err ? graphError(err, throwError) : resp
}

const graphMutation = async (mutation, options, throwError=true) => {
  const [ err, resp ] = await limbo(__GRAPH_API(mutation, options))

  return err ? graphError(err, throwError) : resp
}

const setupGraph = provider => {
 __GRAPH_API = __GRAPH_API || graphql.defaults({
    headers: {
      authorization: `token ${provider.auth.token}`,
    },
  })

  return __GRAPH_API
}

const setupRest = provider => {
  __OCTO_PLUGINS = !__OCTO_PLUGINS && Octokit.plugin(throttling).plugin(retry)

  __REST_API = __REST_API || new __OCTO_PLUGINS({
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
  
  return __REST_API
}

const getOctokitApis = () => {
  return {
    rest: __REST_API,
    graph: {
      query: graphQuery,
      error: graphError,
      graphql: __GRAPH_API,
      mutation: graphMutation,
    }
  }
}

const initOctokit = (provider) => {
  setupRest(provider)
  setupGraph(provider)

  return getOctokitApis()
}

module.exports = {
  initOctokit,
  getOctokitApis
}