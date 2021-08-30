const { GRAPH } = require("KGConstants")
const { graphCache } = require('./utils/graphCache')
const { exists, limbo, get, noOpObj, noPropArr } = require('@keg-hub/jsutils')
const { buildGraphOpts } = require('./utils/buildGraphOpts')


const getUserRepos = async (api, args) => {
  return await api.paginate(api.repos.listForAuthenticatedUser, {
    visibility: 'private',
    affiliation: 'owner',
  })
}

class Repo {
  constructor(provider){
    this.provider = provider
    this.api = provider.api
  }

  async listAll(args){
    const listAllKey = GRAPH.REPO.LIST_ALL.KEY
    const [ err, resp ] = await limbo(this.provider.graph.query(
      `query($first: Int!, $after: String, $affiliations: [RepositoryAffiliation], $ownerAffiliations: [RepositoryAffiliation])
        {
          viewer {
            repositories(first: $first, after: $after, affiliations: $affiliations, ownerAffiliations: $ownerAffiliations) {
              totalCount
              pageInfo {
                endCursor
                hasNextPage
              }
              nodes{
                url
                name
                  owner {
                    login
                  }
              }
            }
          }
        }`,
      buildGraphOpts(this.provider, args, listAllKey)
    ))

    err && this.provider.graph.error(err)

    const data = get(resp, get(GRAPH, `REPO.LIST_ALL.DATA_PATH`), noOpObj)
    const { nodes=noPropArr, pageInfo=noOpObj } = data

    pageInfo.hasNextPage && pageInfo.endCursor
      ? graphCache.set(listAllKey, { after: data.pageInfo.endCursor })
      : graphCache.reset(listAllKey)

    return nodes
  }

  async create(args){
    const { name, description } = args
    if(!name)
      throw new Error(`[Github Error] Repository name is required to create a new repository.`)

    const resp = await this.api.repos.createForAuthenticatedUser({
      name,
      description,
      private: exists(args.private) ? args.private : true,
    })

    // TODO: Validate this response
    return resp && resp.data
  }
}

module.exports = {
  Repo
}