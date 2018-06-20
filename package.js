Package.describe({
  summary: 'Intranet 42 OAuth flow',
  version: '1.3.0',
  name: 'chap:intra42-oauth',
  git: 'https://github.com/marcchapeau/meteor-intra42'
})

Package.onUse(function (api) {
  api.use('oauth2', ['client', 'server'])
  api.use('oauth', ['client', 'server'])
  api.use('http', 'server')
  api.use('underscore', ['client', 'server'])
  api.use('random', 'client')
  api.use('service-configuration', ['client', 'server'])

  api.addFiles('intra42_client.js', 'client')
  api.addFiles('intra42_server.js', 'server')

  api.export('Intra42')
})
