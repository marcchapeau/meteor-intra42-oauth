import { ServiceConfiguration } from 'meteor/service-configuration'
import { Random } from 'meteor/random'
import { OAuth } from 'meteor/oauth'
import { Meteor } from 'meteor/meteor'

// const settings = Meteor.settings
// const app = settings.public && settings.public.intra42 && settings.public.intra42.app
// let name = 'intra42'
// if (app) name += `_${app}`

export const Intra42 = {
  requestCredential: function (options, credentialRequestCompleteCallback) {
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
      credentialRequestCompleteCallback = options
      options = {}
    }
    let config = ServiceConfiguration.configurations.findOne({service: 'intra42'})
    if (!config) {
      credentialRequestCompleteCallback && credentialRequestCompleteCallback(
        new ServiceConfiguration.ConfigError())
      return
    } else if (config.multi) {
      config = Meteor && Meteor.settings && Meteor.settings.public && Meteor.settings.public.intra42
      if (config) {
        config.loginStyle = 'redirect'
        config.service = 'intra42'
      }
    }
    const credentialToken = Random.secret()

    const scope = (options && options.requestPermissions) || ['public']
    const flatScope = scope.map(encodeURIComponent).join('+')

    const loginStyle = OAuth._loginStyle('intra42', config, options)

    const loginUrl =
      'https://api.intra.42.fr/oauth/authorize' +
      '?client_id=' + config.clientId +
      '&scope=' + flatScope +
      '&redirect_uri=' + OAuth._redirectUri('intra42', config) +
      '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl) +
      '&response_type=code'
    OAuth.launchLogin({
      loginService: 'intra42',
      loginStyle: loginStyle,
      loginUrl: loginUrl,
      credentialRequestCompleteCallback: credentialRequestCompleteCallback,
      credentialToken: credentialToken,
      popupOptions: {width: 900, height: 450}
    })
  }
}
