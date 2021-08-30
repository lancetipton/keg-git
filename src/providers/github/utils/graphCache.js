const { GRAPH } = require("KGConstants")
const { noOpObj, get, deepClone, deepMerge } = require("@keg-hub/jsutils")

const defGraphCacheData = {
  [GRAPH.REPO.LIST_ALL.KEY]: {
    first: 50,
    after: null,
    affiliations: GRAPH.OPTS.AFFILIATIONS,
    ownerAffiliations: GRAPH.OPTS.AFFILIATIONS,
  }
}

const graphCacheData = deepClone(defGraphCacheData)

const graphCache = {
  get: request => {
    return graphCacheData[request] || noOpObj
  },
  set: (request, data) => {
    graphCacheData[request] = deepMerge(graphCacheData[request], data)
  },
  reset: request => {
    graphCacheData[request] &&
      (graphCacheData[request] = deepClone(defGraphCacheData[request]))
  }
}

module.exports = {
  graphCache
}