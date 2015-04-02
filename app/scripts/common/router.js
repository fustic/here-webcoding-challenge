'use strict';
/**
 * @name common router settings
 */

module.exports = {
  trailingSlash: function trailingSlash($injector, $location) {
    var path = $location.url();
    // check to see if the path already has a slash where it should be
    if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
      return;
    }

    if (path.indexOf('?') > -1) {
      return path.replace('?', '/?');
    }

    return path + '/';
  }
};