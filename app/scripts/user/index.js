'use strict';

/**
 * @module heremaps.user
 * @name HeremapsUser
 * @description User module - module to work with current user
 */

var
  angular = require('angular'),
  user = angular
    .module('heremapsUser', [])
    .service('UserService', require('./services/userService'));

module.exports = user;
