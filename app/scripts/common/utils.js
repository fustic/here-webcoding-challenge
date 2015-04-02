'use strict';

module.exports = {
  /**
   * @param {Object} obj
   * @return {boolean}
   */
  isEmptyObject: function isEmptyObject(obj) {
    if (Object.keys) {
      return !Object.keys(obj).length;
    }
    var key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  },
  emptyLinkFunction: function emptyLinkFunction(scope, element) {
    scope.$on('$destroy', function () {
      element.find('*').off();
      element.off().empty().remove();
      element = null;
    });
  },
  isInt: function isInt(number) {
    return number % 1 === 0;
  },
  addClassToElement: function addClassToElement(element, className) {
    if (element) {
      if (element.classList) {
        element.classList.add(className);
      } else {
        element.className += ' ' + className;
      }
    }
  },
  removeClassFromElement: function (element, className) {
    if (element) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        element.className = element.className.replace(className, '');
      }
    }
  }
};
