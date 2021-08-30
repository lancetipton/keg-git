const { graphCache } = require("./graphCache")
const { noOpObj, isNum, isArr, isStr } = require("@keg-hub/jsutils")
 
const buildGraphOpts = (provider, opts=noOpObj, request) => {
  return {
    ...Object.entries(opts)
      .reduce((acc, [key, data]) => {
        switch(key){
          case 'first':
            isNum(data) && (acc[key] = data)
          break
          case 'after':
            isStr(data) && (acc[key] = data)
          break
          case 'ownerAffiliations':
          case 'affiliations':
            isArr(data) && (acc[key] = data)
          break
        }
        return acc
      }, {}),
    ...graphCache.get(request),
    headers: {authorization: `token ${provider.auth.token}`}
  }
}


module.exports = {
  buildGraphOpts
}
