# Octokit Provider

## Github Rest API

### Option 1
Call with paging iterator helper
```js
  let repos = []
  for await (const response of this.api.paginate.iterator(
    this.api.repos.listForAuthenticatedUser,
    {
      visibility: 'private',
      affiliation: 'owner',
    })) {
    repos = repos.concat(response.data)
  }

  return repos
```
### Option 2
Call with paging helper
```js
  const repos = await this.api.paginate(this.api.repos.listForAuthenticatedUser, {
    visibility: 'private',
    affiliation: 'owner',
  })

  return repos
```

### Option 3
Direct call, no paging
```js
  const repos = await this.api.repos.listForAuthenticatedUser({
    visibility: 'private',
    per_page: 100,
    affiliation: 'owner',
  })

  return repos && repos.data
```

## Github GraphQL API

### Options 1
Get only owner name and url
```graphql
{
  viewer {
    repositories(first: 100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER] ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
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
 }
 
#  With pagination - Add `after: <endCursor>`
 {
  viewer {
    repositories(after: "Y3Vyc29yOnYyOpHOCjzstQ==", first: 100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER] ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
      # ...query
   }
 }
```

### Option 2
Query with variables
```graphql
query($first: Int!, $after: String, $affiliations: [RepositoryAffiliation], $ownerAffiliations: [RepositoryAffiliation])
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
}
```
```json
// First request
{
  "first": 100,
  "affiliations": ["OWNER", "COLLABORATOR", "ORGANIZATION_MEMBER"],
  "ownerAffiliations": ["OWNER", "COLLABORATOR", "ORGANIZATION_MEMBER"],
  "after": null
}
// Second request, with endCursor
{
  "first": 100,
  "affiliations": ["OWNER", "COLLABORATOR", "ORGANIZATION_MEMBER"],
  "ownerAffiliations": ["OWNER", "COLLABORATOR", "ORGANIZATION_MEMBER"],
  "after": "Y3Vyc29yOnYyOpHOCPrZIA=="
}
```

