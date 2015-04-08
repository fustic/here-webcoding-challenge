'use strict';

var angular = require('angular');

cacheFactory.$inject = ['CacheFactory', 'LoggerService'];
/**
 * @class
 * @name CacheFactory
 * @description Angular-cache CacheFactory wrapper
 * @param {CacheFactory} CacheFactory
 */
function cacheFactory(CacheFactory, LoggerService) {

  function putValue(key, value, clearedCache) {
    try {
      this.put(key, value);
    } catch (exception) {
      LoggerService.critical('Can not populate cache', exception);
      CacheFactory.clearAll();
      if (!clearedCache) {
        putValue(key, value, true);
      }
    }
  }

  return function (cacheName, options) {
    var cache = CacheFactory.get(cacheName);
    if (!cache) {
      /* jshint -W064 */
      cache = CacheFactory(cacheName, options || {});
      cache.removeExpired();
      angular.extend(cache, {
        putValue: putValue
      });
    }

    /**
     * will cover cache clearing depends on app config (a.k.a. force cache clear)
     */
    return cache;
  };
}

module.exports = cacheFactory;

