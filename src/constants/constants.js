const { deepFreeze } = require("@keg-hub/jsutils")

module.exports = deepFreeze({
  GRAPH: {
    REPO: {
      LIST_ALL: {
        KEY: 'repos.listAll',
        DATA_PATH: 'viewer.repositories',
      },
    },
    OPTS: {
      AFFILIATIONS: [
        'OWNER',
        'COLLABORATOR',
        'ORGANIZATION_MEMBER'
      ]
    }
  },
})