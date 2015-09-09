Intra42 = {};

OAuth.registerService('intra42', 2, null, function (query) {
  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);
  return {
    serviceData: {
      id: identity.id,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity.email,
      login: identity.login
    },
    options: {profile: {name: identity.displayname}}
  };
});

var userAgent = 'Meteor';
if (Meteor.release)
  userAgent += '/' + Meteor.release;

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'intra42'});
  if (!config)throw new ServiceConfiguration.ConfigError();
  var response;
  try {
    response = HTTP.post('https://api.intrav2.42.fr/oauth/token', {
        headers: {
          Accept: 'application/json',
          'User-Agent': userAgent
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('intra42', config),
          state: query.state,
          grant_type: 'authorization_code'
        }
      });
  } catch (err) {
    throw _.extend(new Error('Failed to complete OAuth handshake with Intranet 42. ' + err.message), {response: err.response});
  }
  if (response.data.error) {
    throw new Error('Failed to complete OAuth handshake with Intranet 42. ' + response.data.error);
  } else {
    return response.data.access_token;
  }
};

var getIdentity = function   (accessToken) {
  try {
    return HTTP.get('https://api.intrav2.42.fr/v2/me', {
        headers: {
          'User-Agent': userAgent,
          Authorization: 'Bearer ' + accessToken
        }
      }).data;
  } catch (err) {
    throw _.extend(new Error('Failed to fetch identity from Intranet 42. ' + err.message), {response: err.response});
  }
};

Intra42.retrieveCredential = function (credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};