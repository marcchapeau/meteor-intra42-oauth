import { OAuth } from 'meteor/oauth'
import { Meteor } from 'meteor/meteor'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { HTTP } from 'meteor/http'

// const settings = Meteor.settings
// const app = settings.public && settings.public.intra42 && settings.public.intra42.app
// let name = 'intra42'
// if (app) name += `_${app}`

OAuth.registerService('intra42', 2, null, function (query) {
  const accessToken = getAccessToken(query)
  const identity = getIdentity(accessToken)
  return {
    serviceData: {
      id: identity.id,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity.email,
      login: identity.login
    },
    options: {profile: {name: identity.displayname}}
  }
})

const userAgent = `Meteor${Meteor.release ? `/${Meteor.release}` : ''}`

const getAccessToken = function (query) {
  let config = ServiceConfiguration.configurations.findOne({service: 'intra42'})
  if (!config) {
    throw new ServiceConfiguration.ConfigError()
  } else if (config.multi) {
    config = Meteor && Meteor.settings && Meteor.settings.private && Meteor.settings.private.intra42
    if (config) {
      config.loginStyle = 'redirect'
      config.service = 'intra42'
    }
  }
  let response
  try {
    response = HTTP.post('https://api.intra.42.fr/oauth/token', {
      headers: {Accept: 'application/json', 'User-Agent': userAgent},
      params: {
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: OAuth._redirectUri('intra42', config),
        state: query.state,
        grant_type: 'authorization_code'
      }
    })
  } catch (err) {
    const error = new Error('Failed to complete OAuth handshake with Intranet 42. ' + err.message)
    error.response = err.response
    throw error
  }
  if (response.data.error) {
    throw new Error('Failed to complete OAuth handshake with Intranet 42. ' + response.data.error)
  } else return response.data.access_token
}

const getIdentity = function (accessToken) {
  try {
    return HTTP.get('https://api.intra.42.fr/v2/me', {
      headers: {'User-Agent': userAgent, Authorization: 'Bearer ' + accessToken}
    }).data
  } catch (err) {
    const error = new Error('Failed to fetch identity from Intranet 42. ' + err.message)
    error.response = err.response
    throw error
  }
}

export const Intra42 = {
  retrieveCredential: function (credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret)
  }
}
