'use strict';

var H = require('H');

platformService.$inject = ['$q', 'Heremaps.Config'];

function platformService($q, Config) {

  var
    platform,
    platformServiceObject = {
      getPlatform: function getPlatform() {
        if (!platform) {
          platform = new H.service.Platform({
            app_id: Config.api.keys.appId,
            app_code: Config.api.keys.appCode
          });
        }
        return platform;
      }
    };

  return platformServiceObject;
}

module.exports = platformService;
