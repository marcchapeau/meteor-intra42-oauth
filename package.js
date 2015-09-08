Package.describe({
  name: 'chap:intra42',
  version: '1.0.2',
  summary: 'Intranet 42 OAuth flow'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Intra42');

  api.addFiles(
    ['intra42_configure.html', 'intra42_configure.js'],
    'client');

  api.addFiles('intra42_server.js', 'server');
  api.addFiles('intra42_client.js', 'client');
});
