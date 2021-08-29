const { noPropAdd, eitherArr } = require('@keg-hub/jsutils')

class Team {

  constructor(provider){
    this.provider = provider
    this.api = this.provider.api
  }

  async listAllTeams(orgs=noPropArr){
    const toGet = eitherArr(orgs, [orgs])

    return toGet.reduce(async (toResolve, org) => {
      const teams = await toResolve
      teams[org] = await this.api.paginate(this.api.teams.list, { org })

      return teams
    }, Promise.resolve({}))
  }

  async listTeamRepos({ org, team }) {
    return await this.api.paginate(this.api.teams.listReposInOrg, {
      org,
      team_slug: team
    })
  }

}

module.exports = {
  Team
}