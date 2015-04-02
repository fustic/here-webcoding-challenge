'use strict';

utilService.$inject = [
  'LoggerService',
  '$mdToast'
];

/**
 * @class
 * @name UtilService
 * @param {LoggerService} LoggerService
 * @param {$mdToast} $mdToast
 */
function utilService(LoggerService, $mdToast) {
  return {
    /**
     * show Error message at the top right
     * @param {string} text
     * @param {Object} error
     */
    showErrorMessage: function (text, error) {
      var errorDescription = error && error.response ? error.response.errorDescription : '';
      LoggerService.error(text, errorDescription);
      $mdToast.show({
        template: '<md-toast md-theme="error"><span flex>' + text + '<br/><b>' + errorDescription + '</b></span></md-toast>',
        position: 'top right'
      });
    },
    /**
     * show success message at the top right
     * @param {string} text
     */
    showSuccessMessage: function (text) {
      $mdToast.show({
        template: '<md-toast md-theme="success"><span flex>' + text + '<br/></span></md-toast>',
        position: 'top right'
      });
    }
  };
}

module.exports = utilService;
