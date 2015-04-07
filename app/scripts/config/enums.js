'use strict';

/**
 * @class
 * @name HeremapsEnums
 */
module.exports = {
  /**
   * @this HeremapsEnums
   * @readonly
   * @name InitStatuses
   * @enum {string}
   */
  INIT_STATUSES: {
    LOADING: 'loading',
    LOADED: 'loaded'
  },
  SEARCH_STATE: {
    PLACES: 'places',
    ROUTES: 'routes'
  },
  BUBBLE_STATES: {
    OPEN: 'open',
    CLOSED: 'closed'
  },
  DIRECTION_TYPES: {
    FROM: 'From',
    VIA: 'via',
    TO: 'To'
  },
  EVENTS: {
    ADD_DIRECTION: 'adddirection'
  }
};
