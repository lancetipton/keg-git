const { exists } = require('@keg-hub/jsutils')

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
    // TODO: Figure out a way to filter this pre-rest cal
    // Might make sense to switch to graphQL
    return await this.api.paginate(this.api.repos.listForAuthenticatedUser, {
      visibility: 'all',
      affiliation: 'owner,collaborator,organization_member',
    })

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