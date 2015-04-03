'use strict';

mapService.$inject = ['Heremaps.Config', 'Heremaps.Enums', '$q', '$location', '$document', '$window'];

function mapService(Config, Enums, $q, $location, $document, $window) {

  var
    here,
    initStatus,
    initPromise,
    mapServiceObject = {
      getHere: function getHere() {
        var deferred = $q.defer();
        if (here) {
          deferred.resolve(here);
        } else {
          init().then(function success() {
            deferred.resolve(here);
          });
        }
        return deferred.promise;
      }
    };


  function loadScript(url) {
    var
      deferred = $q.defer(),
      src = $location.protocol() + '://' + url,
      script = $document[0].createElement('script');

    script.async = true;
    script.defer = true;
    script.onload = function () {
      deferred.resolve();
    };

    script.src = src;

    $document[0].querySelector('head').appendChild(script);

    return deferred.promise;
  }


  function init() {
    var
      scripts = Config.api.lib.js,
      promises = [];

    if (initStatus === Enums.INIT_STATUSES.LOADING) {
      return initPromise;
    }

    scripts.forEach(function (s) {
      promises.push(loadScript(s));
    });

    initStatus = Enums.INIT_STATUSES.LOADING;
    initPromise = $q.all(promises);
    initPromise.then(function success() {
      initStatus = Enums.INIT_STATUSES.LOADED;
      here = $window.H;
    });
    return initPromise;
  }

  return mapServiceObject;
}

module.exports = mapService;
