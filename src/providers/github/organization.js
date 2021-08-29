

class Organization {

  constructor(provider){
    this.provider = provider
    this.api = this.provider.api
  }

  async listAll(){
    return await this.api.paginate(this.api.orgs.listForAuthenticatedUser)
  }

}

module.exports = {
  Organization
}