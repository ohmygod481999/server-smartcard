const sdk = require('@ory/client')

exports.ory = new sdk.V0alpha2Api(
  new sdk.Configuration({
    // basePath: 'https://compassionate-cerf-qnxuxdt63h.projects.oryapis.com'
    // basePath: '/.ory'
    basePath: 'https://auth.smartcardnp.vn'
    // ""
  })
)