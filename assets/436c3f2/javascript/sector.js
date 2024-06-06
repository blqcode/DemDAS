(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _require = require('lory.js'),
    lory = _require.lory;

var carouselAnimation = require('../utils/carousel-animation');

var carouselDots = require('../utils/carousel-dots.js');
/**
 * Initializes Home Page carousels.
 * @returns {void}
 */


module.exports = function () {
  var options = {
    infinite: 1,
    enableMouseEvents: true,
    slideSpeed: 500
  };
  var carousels = document.getElementsByClassName('carousel');

  for (var i = 0; i < carousels.length; i++) {
    var element = carousels[i];
    var animate = carouselAnimation(element);
    var dots = carouselDots(element, options);
    var carousel = lory(element, options);
    animate(dots(carousel));
  }
};

},{"../utils/carousel-animation":8,"../utils/carousel-dots.js":9,"lory.js":78}],2:[function(require,module,exports){
'use strict';

if (typeof window.Element.prototype.matches !== 'function') {
  window.Element.prototype.matches = window.Element.prototype.msMatchesSelector || window.Element.prototype.webkitMatchesSelector;
}

},{}],3:[function(require,module,exports){
'use strict';

var isCustomEventSupported = typeof window.CustomEvent === 'function';
var isEventSupported = typeof window.Event === 'function';
module.exports = {
  createCustomEvent: createCustomEvent,
  createEvent: createEvent
};
/**
 * Uses CustomEvent() constructor when possible.
 * As IE does not support it, the deprecated method document.createEvent() is used instead.
 * @template T
 * @param {string} type
 * @param {CustomEventInit<T>} params
 * @returns {CustomEvent<T>}
 */

function createCustomEvent(type) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    bubbles: false,
    cancelable: false,
    details: null
  };
  if (isCustomEventSupported) return new window.CustomEvent(type, params);
  /** @type {CustomEvent<T>} */

  var event = document.createEvent('CustomEvent');
  event.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  return event;
}
/**
 * Uses Event() constructor when possible.
 * As IE does not support it, the deprecated method document.createEvent() is used instead.
 * @param {string} type
 * @param {EventInit} params
 */


function createEvent(type) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    bubbles: false,
    cancelable: false
  };
  if (isEventSupported) return new window.Event(type, params);
  var event = document.createEvent('Event');
  event.initEvent(type, params.bubbles, params.cancelable);
  return event;
}

},{}],4:[function(require,module,exports){
'use strict';

var anchors = document.querySelector('#sector-rankings-anchors > div');
if (anchors) Stickyfill.addOne(anchors);

require('./home/carousel.js')();

require('./utils/foldable.js')(0, 80);

require('./sector/rankings.js')();

require('./utils/gotop.js')();

require('./utils/events.js').trackEvents();

require('./utils/searchBar.js')();

require('./utils/banners/common.js');

},{"./home/carousel.js":1,"./sector/rankings.js":5,"./utils/banners/common.js":6,"./utils/events.js":11,"./utils/foldable.js":12,"./utils/gotop.js":13,"./utils/searchBar.js":14}],5:[function(require,module,exports){
'use strict';

require("core-js/modules/es.array.for-each");

require("core-js/modules/web.dom-collections.for-each");

module.exports = function initializeRankingGroups() {
  Array.prototype.forEach.call(document.querySelectorAll('#sector-rankings-datagrid .sector-rankings-group'), initializeRankingGroup);
};
/**
 * Initialize a foldable list.
 * @param {Element} container
 * @returns {void}
 */


function initializeRankingGroup(container) {
  var CLASS_FODLED = 'mobile-folded';
  var foldable = container.querySelector('.foldable');
  var toggler = container.querySelector('.mobile-foldable-toggler');

  toggler.onclick = function () {
    if (foldable.classList.contains(CLASS_FODLED)) {
      foldable.classList.remove(CLASS_FODLED);
    } else {
      foldable.classList.add(CLASS_FODLED);
    }

    if (toggler.classList.contains(CLASS_FODLED)) {
      toggler.classList.remove(CLASS_FODLED);
    } else {
      toggler.classList.add(CLASS_FODLED);
    }
  };
}

},{"core-js/modules/es.array.for-each":74,"core-js/modules/web.dom-collections.for-each":77}],6:[function(require,module,exports){
'use strict';

var createIframeBanner = require('./generator.js');

if (window.nmx.banner) {
  var banner = createIframeBanner(window.nmx.banner.url);
  banner.open();
}

},{"./generator.js":7}],7:[function(require,module,exports){
'use strict';

var tracking = require('../events.js');
/**
 * @param {string} src
 */


module.exports = function createIframeBanner(src) {
  var localStorageKey = "banner-wrapper-iframe__".concat(src);
  /** @type {HTMLIFrameElement|undefined} */

  var iframe;
  return {
    open: open,
    close: close
  };
  /**
   * @returns {boolean} - `true` if the iframe could be open, `false` otherwise.
   */

  function open() {
    if (!iframe && !window.localStorage.getItem(localStorageKey)) {
      iframe = createIframe();
      document.body.append(iframe);
      return true;
    }

    return false;
  }

  function close() {
    window.localStorage.setItem(localStorageKey, 'true');
    iframe = undefined;
  }

  function createIframe() {
    var element = document.createElement('iframe');
    element.setAttribute('frameborder', '0');
    element.setAttribute('scrolling', 'no');
    element.setAttribute('src', src);
    element.className = 'banner-wrapper-iframe';
    element.addEventListener('close', close);
    element.addEventListener('tracking', onTracking);
    return element;
  }
  /**
   * @param {CustomEvent} event
   */


  function onTracking(event) {
    if (event.detail && event.detail.action) {
      tracking.track(event.detail);
    }
  }
};

},{"../events.js":11}],8:[function(require,module,exports){
'use strict';
/**
 * Animates a carousel.
 * @param {Element} element
 * @param {Carousel.DynamicCarouselOptions} [options]
 * @returns {Carousel.bindCarousel}
 */

module.exports = function carouselAnimation(element) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$classNameSlideCo = _ref.classNameSlideContainer,
      classNameSlideContainer = _ref$classNameSlideCo === void 0 ? 'js_slides' : _ref$classNameSlideCo,
      _ref$slidePause = _ref.slidePause,
      slidePause = _ref$slidePause === void 0 ? 10000 : _ref$slidePause;

  /** @type {import('lory.js').LoryStatic} */
  var carousel;
  /** @type {number} */

  var timeoutId;
  var slideContainer = element.querySelector(".".concat(classNameSlideContainer));
  var slideCount = slideContainer ? slideContainer.children.length : 0;

  if (slidePause > 0 && slideCount > 1) {
    element.addEventListener('after.lory.init', moveForward);
    element.addEventListener('before.lory.slide', function () {
      return clearTimeout(timeoutId);
    });
    element.addEventListener('after.lory.slide', moveForward);
    element.addEventListener('on.lory.resize', resetTimer);
  }

  return function (lory) {
    return carousel = lory;
  };
  /**
   * Prepares next slide to show.
   * @returns {void}
   */

  function moveForward() {
    var time = Math.abs(+element.querySelector(".".concat(classNameSlideContainer, " > .active")).getAttribute('data-time'));
    timeoutId = setTimeout(function () {
      return carousel.next();
    }, time || slidePause);
  }
  /**
   * Resets timer to the trigger the next slide after the right tiem.
   * @returns {void}
   */


  function resetTimer() {
    clearTimeout(timeoutId);
    moveForward();
  }
};

},{}],9:[function(require,module,exports){
'use strict';
/**
 * Adds clickable dots to the given carousel.
 * @param {Element} element
 * @param {Carousel.DotsCarouselOptions} [options]
 * @returns {Carousel.bindCarousel}
 */

require("core-js/modules/es.array.index-of");

module.exports = function carouselDots(element) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$classNameDotCont = _ref.classNameDotContainer,
      classNameDotContainer = _ref$classNameDotCont === void 0 ? 'js_dots' : _ref$classNameDotCont,
      _ref$classNameSlideCo = _ref.classNameSlideContainer,
      classNameSlideContainer = _ref$classNameSlideCo === void 0 ? 'js_slides' : _ref$classNameSlideCo,
      infinite = _ref.infinite;

  /** @type {import('lory.js').LoryStatic} */
  var carousel;
  var CLASS_ACTIVE = 'active';
  var dotContainer = element.querySelector(".".concat(classNameDotContainer));
  var slideContainer = element.querySelector(".".concat(classNameSlideContainer));
  var dotCount = slideContainer ? slideContainer.children.length : 0;

  if (dotContainer && dotCount > 1) {
    element.addEventListener('before.lory.init', createDots);
    element.addEventListener('after.lory.init', bindDots);
    element.addEventListener('after.lory.slide', selectActiveDot);
    element.addEventListener('on.lory.resize', function () {
      return selectDot(0);
    });
  }

  return function (lory) {
    return carousel = lory;
  };
  /**
   * Creates as many dots as slides in the carousel.
   * @returns {void}
   */

  function createDots() {
    for (var i = 0; i < dotCount; i++) {
      dotContainer.appendChild(document.createElement('li'));
    }

    dotContainer.children[0].classList.add(CLASS_ACTIVE);
  }
  /**
   * Binds dots event handlers.
   * @returns {void}
   */


  function bindDots() {
    for (var i = 0; i < dotContainer.children.length; i++) {
      dotContainer.children[i].addEventListener('click', onDotClick);
    }
  }
  /**
   * Selects the new active dot and unselect the previous active one.
   * @param {CustomEvent} event
   * @returns {void}
   */


  function selectActiveDot(event) {
    selectDot(infinite ? event.detail.currentSlide - 1 : event.detail.currentSlide);
  }
  /**
   * Displays the slide associated to the clicked dot.
   * @param {Event} event
   * @returns {void}
   */


  function onDotClick(event) {
    var index = Array.prototype.indexOf.call(dotContainer.children, event.target);
    carousel.slideTo(index);
  }
  /**
   * Selects the dot at the given index and unselect all the others.
   * @param {number} index
   * @returns {void}
   */


  function selectDot(index) {
    for (var i = 0; i < dotContainer.children.length; i++) {
      dotContainer.children[i].classList.remove(CLASS_ACTIVE);
    }

    dotContainer.children[index].classList.add(CLASS_ACTIVE);
  }
};

},{"core-js/modules/es.array.index-of":75}],10:[function(require,module,exports){
'use strict';
/**
 * Delays function `func` invocation for `wait` milliseconds, using `setTimeout()`, so the return value will be lost.
 * If the debounced function is invoked multiple times within the `wait` period,
 * only the last invocation will actually call the function `func`, canceling the preceding invocations.
 * For a more advanced implementation, see [lodash.debounce](https://lodash.com/docs/4.17.15#debounce).
 * @param {Function} func
 * @param {number} wait time in milliseconds
 */

module.exports = function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  /** @type {number} */
  var timeoutId;
  /** @this any */

  return function debounced() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      return func.apply(_this, args);
    }, wait);
  };
};

},{}],11:[function(require,module,exports){
'use strict';

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.string.trim");

require("core-js/modules/web.dom-collections.for-each");

require('../polyfills/element-matches.js');

module.exports = {
  trackEvents: trackEvents,
  trackEventsInContainer: trackEventsInContainer,
  onTrackedAction: onTrackedAction,
  track: track,
  getDataEvent: getDataEvent,
  getPageName: getPageName
};
var SELECTOR_FOLD = '.foldable-toggler';
var SELECTOR_ANALYTICS_FORM = 'form.search[data-event-action]';
var SELECTOR_ANALYTICS = '[data-event-action]:not(form)';

function trackEvents() {
  Array.prototype.forEach.call(document.querySelectorAll(SELECTOR_FOLD), function (foldableElement) {
    foldableElement.addEventListener('toggle', onFoldAction);
  });
  Array.prototype.forEach.call(document.querySelectorAll(SELECTOR_ANALYTICS_FORM), function (formElement) {
    formElement.addEventListener('submit', onSearchAction);
  });
  Array.prototype.forEach.call(document.querySelectorAll(SELECTOR_ANALYTICS), function (element) {
    element.addEventListener('click', onTrackedAction);
  });
}
/**
 * Like `trackEvents()`, but uses event delegation to track actions in a live container (which deletes or creates new children).
 * @param {HTMLElement} container
 */


function trackEventsInContainer(container) {
  container.addEventListener('toggle', function (event) {
    if (event.target.matches(SELECTOR_FOLD)) {
      trakFoldAction(event.target, event.detail);
    }
  });
  container.addEventListener('click', function (event) {
    if (event.target.matches(SELECTOR_ANALYTICS)) {
      trackAction(event.target);
    }
  });
  container.addEventListener('submit', function (event) {
    if (event.target.matches(SELECTOR_ANALYTICS_FORM)) {
      trackSearchAction(event.target);
    }
  });
}
/** @param {CustomEvent<boolean>} event */


function onFoldAction(event) {
  trakFoldAction(event.currentTarget, event.detail);
}
/**
 * @param {HTMLElement} element
 * @param {boolean} isFolded toggler new state
 */


function trakFoldAction(element, isFolded) {
  /* We want to track the click on the toggler before it changes its state.
   * But at this point, it has changed already.
   * So we get the data corresponding to its previous state, when the click occurred.
   */
  var data = getFoldDataEvent(element, !isFolded);

  if (data && data.action) {
    track(data);
  }
}
/**
 * @param {HTMLElement} element
 * @param {boolean} isFolded toggler new state
 */


function getFoldDataEvent(element, isFolded) {
  if (element) {
    var state = isFolded ? 'folded' : 'unfolded';
    return getDataEvent(element, {
      eventActionClass: "data-event-action-".concat(state),
      eventLabelClass: "data-event-label-".concat(state)
    });
  }
}
/**
 * Track submit form with page as category and action as data-event-action on form element
 * The form must contain an input[type="search"] to get a label tracking
 * @param {Event} event
 */


function onSearchAction(event) {
  trackSearchAction(event.currentTarget);
}
/** @param {HTMLElement} element */


function trackSearchAction(element) {
  var searchInputElement = element.querySelector('input[type="search"]');
  track({
    category: getPageName(),
    action: element.getAttribute('data-event-action'),
    label: searchInputElement && searchInputElement.value || ''
  });
}
/** @param {Event} event */


function onTrackedAction(event) {
  trackAction(event.currentTarget);
}
/** @param {HTMLElement} element */


function trackAction(element) {
  var data = getDataEvent(element);

  if (data && data.action) {
    track(data);
  }
}
/**
 * @param {Element} element
 * @param {{ eventActionClass?: string, eventLabelClass?: string }} [options]
 * @returns {{ category: string, action: string|null, label: string } | undefined}
 */


function getDataEvent(element) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$eventActionClass = _ref.eventActionClass,
      eventActionClass = _ref$eventActionClass === void 0 ? 'data-event-action' : _ref$eventActionClass,
      _ref$eventLabelClass = _ref.eventLabelClass,
      eventLabelClass = _ref$eventLabelClass === void 0 ? 'data-event-label' : _ref$eventLabelClass;

  if (element) {
    return {
      category: getPageName(),
      action: element.getAttribute(eventActionClass),
      label: element.getAttribute(eventLabelClass) || element.textContent.trim()
    };
  }
}

function track(_ref2) {
  var category = _ref2.category,
      action = _ref2.action,
      label = _ref2.label;
  var _window = window,
      gtag = _window.gtag;

  if (gtag) {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
}
/**
 * @param {Window} context
 * @returns
 */


function getPageName() {
  var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  var urlPrefix = context.urlPrefix;
  var pageName = context.document.location.pathname;

  if (pageName === "/") {
    pageName = "Home Page";
  } else if (pageName.indexOf("".concat(urlPrefix, "/sector/")) === 0) {
    pageName = "Sector Page";
  } else if (pageName.indexOf("".concat(urlPrefix, "/ranking/")) === 0) {
    pageName = "Ranking Page";
  } else if (pageName.indexOf('/search') === 0) {
    pageName = 'Search Page';
  } else if (pageName.indexOf("".concat(urlPrefix, "/timeseries/")) === 0) {
    pageName = "Data Page";
  }

  return pageName;
}

},{"../polyfills/element-matches.js":2,"core-js/modules/es.array.for-each":74,"core-js/modules/es.array.index-of":75,"core-js/modules/es.string.trim":76,"core-js/modules/web.dom-collections.for-each":77}],12:[function(require,module,exports){
'use strict';

require("core-js/modules/es.array.for-each");

require("core-js/modules/web.dom-collections.for-each");

var _require = require('../ponyfills/events.js'),
    createCustomEvent = _require.createCustomEvent;
/**
 * Initialize all foldable lists on the page.
 * @param {number} [offsetX=0]
 * @param {number} [offsetY=0]
 * @returns{void}
 */


module.exports = function initializaFoldableLists() {
  var offsetX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var offsetY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  Array.prototype.forEach.call(document.querySelectorAll('.foldable'), function (foldable) {
    return initializeFoldableList(foldable, offsetX, offsetY);
  });
};
/**
 * Initialize a foldable list.
 * If you need to watch state changes, subscribe to the **toggle** event.
 * @param {Element} foldable
 * @param {number} offsetX
 * @param {number} offsetY
 * @returns {void}
 */


function initializeFoldableList(foldable, offsetX, offsetY) {
  var CLASS_FOLDED = 'folded';
  var toggler = foldable.querySelector('.foldable-toggler');
  var scrollOrigin = foldable.querySelector('.foldable-scroll-origin') || foldable;
  if (!toggler) return;
  toggler.textContent = foldable.classList.contains(CLASS_FOLDED) ? toggler.dataset.labelFolded : toggler.dataset.labelUnfolded;
  toggler.addEventListener('click', function () {
    var isFolded = foldable.classList.contains(CLASS_FOLDED);

    if (isFolded) {
      foldable.classList.remove(CLASS_FOLDED);
      toggler.textContent = toggler.dataset.labelUnfolded;
    } else {
      foldable.classList.add(CLASS_FOLDED);
      toggler.textContent = toggler.dataset.labelFolded;
      var boundingBox = scrollOrigin.getBoundingClientRect();

      if (boundingBox.left < offsetX || boundingBox.top < offsetY) {
        var bodyBoundingBox = document.documentElement.getBoundingClientRect();
        window.scrollTo(boundingBox.left - bodyBoundingBox.left - offsetX, boundingBox.top - bodyBoundingBox.top - offsetY);
      }
    }

    toggler.dispatchEvent(createCustomEvent('toggle', {
      bubbles: true,
      detail: !isFolded
    }));
  });
}

},{"../ponyfills/events.js":3,"core-js/modules/es.array.for-each":74,"core-js/modules/web.dom-collections.for-each":77}],13:[function(require,module,exports){
'use strict';
/**
 * Initializes the Go Top button.
 * @returns {void}
 */

module.exports = function initializeGotop() {
  var CLASS_ACTIVE = 'gotop-active';
  var SCROLL_LIMIT = 80; // corresponds to the header's height (px)

  var button = document.getElementById('gotop');
  button.onclick = goBackToTop;
  document.addEventListener('scroll', toggleGoTopButton);
  toggleGoTopButton();

  function toggleGoTopButton() {
    if (document.documentElement.scrollTop >= SCROLL_LIMIT) {
      button.classList.add(CLASS_ACTIVE);
    } else {
      button.classList.remove(CLASS_ACTIVE);
    }
  }
  /**
   * @param {Event} event
   * @returns {void}
   */


  function goBackToTop(event) {
    event.preventDefault();
    document.documentElement.scrollTop = 0;
  }
};

},{}],14:[function(require,module,exports){
'use strict';

require("core-js/modules/es.array.for-each");

require("core-js/modules/web.dom-collections.for-each");

var MIN_SUGGESTION_SIZE = 3;
var INPUT_DELTA = 100;
var ESCAPE_KEY = 27;
var HTTP_STATUS_CODE_OK = 200;
var SUGGEST_PATH = '/search/suggest';

var eventsService = require('./events');

var debounce = require('./debounce.js');

module.exports = function search() {
  var form = document.getElementById('header-search-bar');
  var suggestionsContainer = document.getElementById('header-search-suggestions-results');
  var input = form.querySelector('input');
  var hasContent = false;
  form.appendChild(suggestionsContainer);
  input.oninput = debounce(processNewInputEvent, INPUT_DELTA);
  input.onblur = hideSuggestionsContainer;
  input.onfocus = showSuggestionsContainer;

  input.onkeyup = function (event) {
    if (event.keyCode === ESCAPE_KEY) {
      hideSuggestionsContainer();
      input.blur();
    }
  };

  function processNewInputEvent(event) {
    var text = event.target.value;

    if (text.length >= MIN_SUGGESTION_SIZE) {
      var request = new window.XMLHttpRequest();
      request.open('GET', "".concat(SUGGEST_PATH, "?text=").concat(text));
      request.onload = handleSearchSuggestions;
      request.send();
    } else {
      clearSearchSuggestions();
    }
  }

  function handleSearchSuggestions(event) {
    if (event.target.status === HTTP_STATUS_CODE_OK) {
      suggestionsContainer.innerHTML = event.target.responseText; // prevents the mouse click from trigger the input onblur event

      Array.prototype.forEach.call(suggestionsContainer.querySelectorAll('a, #suggestion-did-you-mean'), function (link) {
        link.onmousedown = function (linkEvent) {
          return linkEvent.preventDefault();
        };
      });
      var didYouMean = suggestionsContainer.querySelector('#suggestion-did-you-mean');

      if (didYouMean) {
        didYouMean.addEventListener('click', function () {
          input.value = didYouMean.textContent;
          form.submit();
        });
      }

      hasContent = true;
      showSuggestionsContainer();
    } else {
      clearSearchSuggestions();
    }
  }

  function clearSearchSuggestions() {
    hideSuggestionsContainer();
    suggestionsContainer.innerHTML = '';
    hasContent = false;
  }

  function showSuggestionsContainer() {
    if (hasContent) {
      suggestionsContainer.classList.add('active'); //monitor clicks on suggestions

      Array.prototype.forEach.call(document.querySelectorAll('#header-search-suggestions-results *[data-event-action]'), function (element) {
        element.addEventListener('click', eventsService.onTrackedAction);
      });
    }
  }

  function hideSuggestionsContainer() {
    suggestionsContainer.classList.remove('active');
  }
};

},{"./debounce.js":10,"./events":11,"core-js/modules/es.array.for-each":74,"core-js/modules/web.dom-collections.for-each":77}],15:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

},{}],16:[function(require,module,exports){
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

},{"../internals/is-object":44}],17:[function(require,module,exports){
'use strict';
var $forEach = require('../internals/array-iteration').forEach;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var arrayMethodUsesToLength = require('../internals/array-method-uses-to-length');

var STRICT_METHOD = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;

},{"../internals/array-iteration":19,"../internals/array-method-is-strict":20,"../internals/array-method-uses-to-length":21}],18:[function(require,module,exports){
var toIndexedObject = require('../internals/to-indexed-object');
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

},{"../internals/to-absolute-index":64,"../internals/to-indexed-object":65,"../internals/to-length":67}],19:[function(require,module,exports){
var bind = require('../internals/function-bind-context');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var arraySpeciesCreate = require('../internals/array-species-create');

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};

},{"../internals/array-species-create":22,"../internals/function-bind-context":33,"../internals/indexed-object":39,"../internals/to-length":67,"../internals/to-object":68}],20:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

},{"../internals/fails":32}],21:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var has = require('../internals/has');

var defineProperty = Object.defineProperty;
var cache = {};

var thrower = function (it) { throw it; };

module.exports = function (METHOD_NAME, options) {
  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
  if (!options) options = {};
  var method = [][METHOD_NAME];
  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
  var argument0 = has(options, 0) ? options[0] : thrower;
  var argument1 = has(options, 1) ? options[1] : undefined;

  return cache[METHOD_NAME] = !!method && !fails(function () {
    if (ACCESSORS && !DESCRIPTORS) return true;
    var O = { length: -1 };

    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
    else O[1] = 1;

    method.call(O, argument0, argument1);
  });
};

},{"../internals/descriptors":27,"../internals/fails":32,"../internals/has":36}],22:[function(require,module,exports){
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

},{"../internals/is-array":42,"../internals/is-object":44,"../internals/well-known-symbol":72}],23:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],24:[function(require,module,exports){
var has = require('../internals/has');
var ownKeys = require('../internals/own-keys');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

},{"../internals/has":36,"../internals/object-define-property":48,"../internals/object-get-own-property-descriptor":49,"../internals/own-keys":54}],25:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":26,"../internals/descriptors":27,"../internals/object-define-property":48}],26:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],27:[function(require,module,exports){
var fails = require('../internals/fails');

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

},{"../internals/fails":32}],28:[function(require,module,exports){
var global = require('../internals/global');
var isObject = require('../internals/is-object');

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

},{"../internals/global":35,"../internals/is-object":44}],29:[function(require,module,exports){
// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],30:[function(require,module,exports){
// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

},{}],31:[function(require,module,exports){
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var setGlobal = require('../internals/set-global');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var isForced = require('../internals/is-forced');

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

},{"../internals/copy-constructor-properties":24,"../internals/create-non-enumerable-property":25,"../internals/global":35,"../internals/is-forced":43,"../internals/object-get-own-property-descriptor":49,"../internals/redefine":56,"../internals/set-global":58}],32:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],33:[function(require,module,exports){
var aFunction = require('../internals/a-function');

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"../internals/a-function":15}],34:[function(require,module,exports){
var path = require('../internals/path');
var global = require('../internals/global');

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};

},{"../internals/global":35,"../internals/path":55}],35:[function(require,module,exports){
(function (global){
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],36:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],37:[function(require,module,exports){
module.exports = {};

},{}],38:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var createElement = require('../internals/document-create-element');

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":27,"../internals/document-create-element":28,"../internals/fails":32}],39:[function(require,module,exports){
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

},{"../internals/classof-raw":23,"../internals/fails":32}],40:[function(require,module,exports){
var store = require('../internals/shared-store');

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;

},{"../internals/shared-store":60}],41:[function(require,module,exports){
var NATIVE_WEAK_MAP = require('../internals/native-weak-map');
var global = require('../internals/global');
var isObject = require('../internals/is-object');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var objectHas = require('../internals/has');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/create-non-enumerable-property":25,"../internals/global":35,"../internals/has":36,"../internals/hidden-keys":37,"../internals/is-object":44,"../internals/native-weak-map":47,"../internals/shared-key":59}],42:[function(require,module,exports){
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};

},{"../internals/classof-raw":23}],43:[function(require,module,exports){
var fails = require('../internals/fails');

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

},{"../internals/fails":32}],44:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],45:[function(require,module,exports){
module.exports = false;

},{}],46:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

},{"../internals/fails":32}],47:[function(require,module,exports){
var global = require('../internals/global');
var inspectSource = require('../internals/inspect-source');

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

},{"../internals/global":35,"../internals/inspect-source":40}],48:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var anObject = require('../internals/an-object');
var toPrimitive = require('../internals/to-primitive');

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/an-object":16,"../internals/descriptors":27,"../internals/ie8-dom-define":38,"../internals/to-primitive":69}],49:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPrimitive = require('../internals/to-primitive');
var has = require('../internals/has');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};

},{"../internals/create-property-descriptor":26,"../internals/descriptors":27,"../internals/has":36,"../internals/ie8-dom-define":38,"../internals/object-property-is-enumerable":53,"../internals/to-indexed-object":65,"../internals/to-primitive":69}],50:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/enum-bug-keys":30,"../internals/object-keys-internal":52}],51:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],52:[function(require,module,exports){
var has = require('../internals/has');
var toIndexedObject = require('../internals/to-indexed-object');
var indexOf = require('../internals/array-includes').indexOf;
var hiddenKeys = require('../internals/hidden-keys');

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

},{"../internals/array-includes":18,"../internals/has":36,"../internals/hidden-keys":37,"../internals/to-indexed-object":65}],53:[function(require,module,exports){
'use strict';
var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

},{}],54:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var anObject = require('../internals/an-object');

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

},{"../internals/an-object":16,"../internals/get-built-in":34,"../internals/object-get-own-property-names":50,"../internals/object-get-own-property-symbols":51}],55:[function(require,module,exports){
var global = require('../internals/global');

module.exports = global;

},{"../internals/global":35}],56:[function(require,module,exports){
var global = require('../internals/global');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var has = require('../internals/has');
var setGlobal = require('../internals/set-global');
var inspectSource = require('../internals/inspect-source');
var InternalStateModule = require('../internals/internal-state');

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});

},{"../internals/create-non-enumerable-property":25,"../internals/global":35,"../internals/has":36,"../internals/inspect-source":40,"../internals/internal-state":41,"../internals/set-global":58}],57:[function(require,module,exports){
// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

},{}],58:[function(require,module,exports){
var global = require('../internals/global');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/create-non-enumerable-property":25,"../internals/global":35}],59:[function(require,module,exports){
var shared = require('../internals/shared');
var uid = require('../internals/uid');

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":61,"../internals/uid":70}],60:[function(require,module,exports){
var global = require('../internals/global');
var setGlobal = require('../internals/set-global');

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;

},{"../internals/global":35,"../internals/set-global":58}],61:[function(require,module,exports){
var IS_PURE = require('../internals/is-pure');
var store = require('../internals/shared-store');

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.5',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});

},{"../internals/is-pure":45,"../internals/shared-store":60}],62:[function(require,module,exports){
var fails = require('../internals/fails');
var whitespaces = require('../internals/whitespaces');

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

},{"../internals/fails":32,"../internals/whitespaces":73}],63:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');
var whitespaces = require('../internals/whitespaces');

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};

},{"../internals/require-object-coercible":57,"../internals/whitespaces":73}],64:[function(require,module,exports){
var toInteger = require('../internals/to-integer');

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer":66}],65:[function(require,module,exports){
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":39,"../internals/require-object-coercible":57}],66:[function(require,module,exports){
var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

},{}],67:[function(require,module,exports){
var toInteger = require('../internals/to-integer');

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer":66}],68:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

},{"../internals/require-object-coercible":57}],69:[function(require,module,exports){
var isObject = require('../internals/is-object');

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"../internals/is-object":44}],70:[function(require,module,exports){
var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

},{}],71:[function(require,module,exports){
var NATIVE_SYMBOL = require('../internals/native-symbol');

module.exports = NATIVE_SYMBOL
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';

},{"../internals/native-symbol":46}],72:[function(require,module,exports){
var global = require('../internals/global');
var shared = require('../internals/shared');
var has = require('../internals/has');
var uid = require('../internals/uid');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

},{"../internals/global":35,"../internals/has":36,"../internals/native-symbol":46,"../internals/shared":61,"../internals/uid":70,"../internals/use-symbol-as-uid":71}],73:[function(require,module,exports){
// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],74:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var forEach = require('../internals/array-for-each');

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});

},{"../internals/array-for-each":17,"../internals/export":31}],75:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $indexOf = require('../internals/array-includes').indexOf;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var arrayMethodUsesToLength = require('../internals/array-method-uses-to-length');

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');
var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-includes":18,"../internals/array-method-is-strict":20,"../internals/array-method-uses-to-length":21,"../internals/export":31}],76:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $trim = require('../internals/string-trim').trim;
var forcedStringTrimMethod = require('../internals/string-trim-forced');

// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

},{"../internals/export":31,"../internals/string-trim":63,"../internals/string-trim-forced":62}],77:[function(require,module,exports){
var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var forEach = require('../internals/array-for-each');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}

},{"../internals/array-for-each":17,"../internals/create-non-enumerable-property":25,"../internals/dom-iterables":29,"../internals/global":35}],78:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* globals jQuery */

exports.lory = lory;

var _detectPrefixes = __webpack_require__(1);

var _detectPrefixes2 = _interopRequireDefault(_detectPrefixes);

var _detectSupportsPassive = __webpack_require__(2);

var _detectSupportsPassive2 = _interopRequireDefault(_detectSupportsPassive);

var _dispatchEvent = __webpack_require__(3);

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _defaults = __webpack_require__(6);

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slice = Array.prototype.slice;

function lory(slider, opts) {
    var position = void 0;
    var slidesWidth = void 0;
    var frameWidth = void 0;
    var slides = void 0;

    /**
     * slider DOM elements
     */
    var frame = void 0;
    var slideContainer = void 0;
    var prevCtrl = void 0;
    var nextCtrl = void 0;
    var prefixes = void 0;
    var transitionEndCallback = void 0;

    var index = 0;
    var options = {};
    var touchEventParams = (0, _detectSupportsPassive2.default)() ? { passive: true } : false;

    /**
     * if object is jQuery convert to native DOM element
     */
    if (typeof jQuery !== 'undefined' && slider instanceof jQuery) {
        slider = slider[0];
    }

    /**
     * private
     * set active class to element which is the current slide
     */
    function setActiveElement(slides, currentIndex) {
        var _options = options,
            classNameActiveSlide = _options.classNameActiveSlide;


        slides.forEach(function (element, index) {
            if (element.classList.contains(classNameActiveSlide)) {
                element.classList.remove(classNameActiveSlide);
            }
        });

        slides[currentIndex].classList.add(classNameActiveSlide);
    }

    /**
     * private
     * setupInfinite: function to setup if infinite is set
     *
     * @param  {array} slideArray
     * @return {array} array of updated slideContainer elements
     */
    function setupInfinite(slideArray) {
        var _options2 = options,
            infinite = _options2.infinite;


        var front = slideArray.slice(0, infinite);
        var back = slideArray.slice(slideArray.length - infinite, slideArray.length);

        front.forEach(function (element) {
            var cloned = element.cloneNode(true);

            slideContainer.appendChild(cloned);
        });

        back.reverse().forEach(function (element) {
            var cloned = element.cloneNode(true);

            slideContainer.insertBefore(cloned, slideContainer.firstChild);
        });

        slideContainer.addEventListener(prefixes.transitionEnd, onTransitionEnd);

        return slice.call(slideContainer.children);
    }

    /**
     * [dispatchSliderEvent description]
     * @return {[type]} [description]
     */
    function dispatchSliderEvent(phase, type, detail) {
        (0, _dispatchEvent2.default)(slider, phase + '.lory.' + type, detail);
    }

    /**
     * translates to a given position in a given time in milliseconds
     *
     * @to        {number} number in pixels where to translate to
     * @duration  {number} time in milliseconds for the transistion
     * @ease      {string} easing css property
     */
    function translate(to, duration, ease) {
        var style = slideContainer && slideContainer.style;

        if (style) {
            style[prefixes.transition + 'TimingFunction'] = ease;
            style[prefixes.transition + 'Duration'] = duration + 'ms';
            style[prefixes.transform] = 'translateX(' + to + 'px)';
        }
    }

    /**
     * returns an element's width
     */
    function elementWidth(element) {
        return element.getBoundingClientRect().width || element.offsetWidth;
    }

    /**
     * slidefunction called by prev, next & touchend
     *
     * determine nextIndex and slide to next postion
     * under restrictions of the defined options
     *
     * @direction  {boolean}
     */
    function slide(nextIndex, direction) {
        var _options3 = options,
            slideSpeed = _options3.slideSpeed,
            slidesToScroll = _options3.slidesToScroll,
            infinite = _options3.infinite,
            rewind = _options3.rewind,
            rewindPrev = _options3.rewindPrev,
            rewindSpeed = _options3.rewindSpeed,
            ease = _options3.ease,
            classNameActiveSlide = _options3.classNameActiveSlide,
            _options3$classNameDi = _options3.classNameDisabledNextCtrl,
            classNameDisabledNextCtrl = _options3$classNameDi === undefined ? 'disabled' : _options3$classNameDi,
            _options3$classNameDi2 = _options3.classNameDisabledPrevCtrl,
            classNameDisabledPrevCtrl = _options3$classNameDi2 === undefined ? 'disabled' : _options3$classNameDi2;


        var duration = slideSpeed;

        var nextSlide = direction ? index + 1 : index - 1;
        var maxOffset = Math.round(slidesWidth - frameWidth);

        dispatchSliderEvent('before', 'slide', {
            index: index,
            nextSlide: nextSlide
        });

        /**
         * Reset control classes
         */
        if (prevCtrl) {
            prevCtrl.classList.remove(classNameDisabledPrevCtrl);
        }
        if (nextCtrl) {
            nextCtrl.classList.remove(classNameDisabledNextCtrl);
        }

        if (typeof nextIndex !== 'number') {
            if (direction) {
                if (infinite && index + infinite * 2 !== slides.length) {
                    nextIndex = index + (infinite - index % infinite);
                } else {
                    nextIndex = index + slidesToScroll;
                }
            } else {
                if (infinite && index % infinite !== 0) {
                    nextIndex = index - index % infinite;
                } else {
                    nextIndex = index - slidesToScroll;
                }
            }
        }

        nextIndex = Math.min(Math.max(nextIndex, 0), slides.length - 1);

        if (infinite && direction === undefined) {
            nextIndex += infinite;
        }

        if (rewindPrev && Math.abs(position.x) === 0 && direction === false) {
            nextIndex = slides.length - 1;
            duration = rewindSpeed;
        }

        var nextOffset = Math.min(Math.max(slides[nextIndex].offsetLeft * -1, maxOffset * -1), 0);

        if (rewind && Math.abs(position.x) === maxOffset && direction) {
            nextOffset = 0;
            nextIndex = 0;
            duration = rewindSpeed;
        }

        /**
         * translate to the nextOffset by a defined duration and ease function
         */
        translate(nextOffset, duration, ease);

        /**
         * update the position with the next position
         */
        position.x = nextOffset;

        /**
         * update the index with the nextIndex only if
         * the offset of the nextIndex is in the range of the maxOffset
         */
        if (slides[nextIndex].offsetLeft <= maxOffset) {
            index = nextIndex;
        }

        if (infinite && (nextIndex === slides.length - infinite || nextIndex === slides.length - slides.length % infinite || nextIndex === 0)) {
            if (direction) {
                index = infinite;
            }

            if (!direction) {
                index = slides.length - infinite * 2;
            }

            position.x = slides[index].offsetLeft * -1;

            transitionEndCallback = function transitionEndCallback() {
                translate(slides[index].offsetLeft * -1, 0, undefined);
            };
        }

        if (classNameActiveSlide) {
            setActiveElement(slice.call(slides), index);
        }

        /**
         * update classes for next and prev arrows
         * based on user settings
         */
        if (prevCtrl && !infinite && !rewindPrev && nextIndex === 0) {
            prevCtrl.classList.add(classNameDisabledPrevCtrl);
        }

        if (nextCtrl && !infinite && !rewind && nextIndex + 1 === slides.length) {
            nextCtrl.classList.add(classNameDisabledNextCtrl);
        }

        dispatchSliderEvent('after', 'slide', {
            currentSlide: index
        });
    }

    /**
     * public
     * setup function
     */
    function setup() {
        dispatchSliderEvent('before', 'init');

        prefixes = (0, _detectPrefixes2.default)();
        options = _extends({}, _defaults2.default, opts);

        var _options4 = options,
            classNameFrame = _options4.classNameFrame,
            classNameSlideContainer = _options4.classNameSlideContainer,
            classNamePrevCtrl = _options4.classNamePrevCtrl,
            classNameNextCtrl = _options4.classNameNextCtrl,
            _options4$classNameDi = _options4.classNameDisabledNextCtrl,
            classNameDisabledNextCtrl = _options4$classNameDi === undefined ? 'disabled' : _options4$classNameDi,
            _options4$classNameDi2 = _options4.classNameDisabledPrevCtrl,
            classNameDisabledPrevCtrl = _options4$classNameDi2 === undefined ? 'disabled' : _options4$classNameDi2,
            enableMouseEvents = _options4.enableMouseEvents,
            classNameActiveSlide = _options4.classNameActiveSlide,
            initialIndex = _options4.initialIndex;


        index = initialIndex;
        frame = slider.getElementsByClassName(classNameFrame)[0];
        slideContainer = frame.getElementsByClassName(classNameSlideContainer)[0];
        prevCtrl = slider.getElementsByClassName(classNamePrevCtrl)[0];
        nextCtrl = slider.getElementsByClassName(classNameNextCtrl)[0];

        position = {
            x: slideContainer.offsetLeft,
            y: slideContainer.offsetTop
        };

        if (options.infinite) {
            slides = setupInfinite(slice.call(slideContainer.children));
        } else {
            slides = slice.call(slideContainer.children);

            if (prevCtrl && !options.rewindPrev) {
                prevCtrl.classList.add(classNameDisabledPrevCtrl);
            }

            if (nextCtrl && slides.length === 1 && !options.rewind) {
                nextCtrl.classList.add(classNameDisabledNextCtrl);
            }
        }

        reset();

        if (classNameActiveSlide) {
            setActiveElement(slides, index);
        }

        if (prevCtrl && nextCtrl) {
            prevCtrl.addEventListener('click', prev);
            nextCtrl.addEventListener('click', next);
        }

        frame.addEventListener('touchstart', onTouchstart, touchEventParams);

        if (enableMouseEvents) {
            frame.addEventListener('mousedown', onTouchstart);
            frame.addEventListener('click', onClick);
        }

        options.window.addEventListener('resize', onResize);

        dispatchSliderEvent('after', 'init');
    }

    /**
     * public
     * reset function: called on resize
     */
    function reset() {
        var _options5 = options,
            infinite = _options5.infinite,
            ease = _options5.ease,
            rewindSpeed = _options5.rewindSpeed,
            rewindOnResize = _options5.rewindOnResize,
            classNameActiveSlide = _options5.classNameActiveSlide,
            initialIndex = _options5.initialIndex;


        slidesWidth = elementWidth(slideContainer);
        frameWidth = elementWidth(frame);

        if (frameWidth === slidesWidth) {
            slidesWidth = slides.reduce(function (previousValue, slide) {
                return previousValue + elementWidth(slide);
            }, 0);
        }

        if (rewindOnResize) {
            index = initialIndex;
        } else {
            ease = null;
            rewindSpeed = 0;
        }

        if (infinite) {
            translate(slides[index + infinite].offsetLeft * -1, 0, null);

            index = index + infinite;
            position.x = slides[index].offsetLeft * -1;
        } else {
            translate(slides[index].offsetLeft * -1, rewindSpeed, ease);
            position.x = slides[index].offsetLeft * -1;
        }

        if (classNameActiveSlide) {
            setActiveElement(slice.call(slides), index);
        }
    }

    /**
     * public
     * slideTo: called on clickhandler
     */
    function slideTo(index) {
        slide(index);
    }

    /**
     * public
     * returnIndex function: called on clickhandler
     */
    function returnIndex() {
        return index - options.infinite || 0;
    }

    /**
     * public
     * prev function: called on clickhandler
     */
    function prev() {
        slide(false, false);
    }

    /**
     * public
     * next function: called on clickhandler
     */
    function next() {
        slide(false, true);
    }

    /**
     * public
     * destroy function: called to gracefully destroy the lory instance
     */
    function destroy() {
        dispatchSliderEvent('before', 'destroy');

        // remove event listeners
        frame.removeEventListener(prefixes.transitionEnd, onTransitionEnd);
        frame.removeEventListener('touchstart', onTouchstart, touchEventParams);
        frame.removeEventListener('touchmove', onTouchmove, touchEventParams);
        frame.removeEventListener('touchend', onTouchend);
        frame.removeEventListener('mousemove', onTouchmove);
        frame.removeEventListener('mousedown', onTouchstart);
        frame.removeEventListener('mouseup', onTouchend);
        frame.removeEventListener('mouseleave', onTouchend);
        frame.removeEventListener('click', onClick);

        options.window.removeEventListener('resize', onResize);

        if (prevCtrl) {
            prevCtrl.removeEventListener('click', prev);
        }

        if (nextCtrl) {
            nextCtrl.removeEventListener('click', next);
        }

        // remove cloned slides if infinite is set
        if (options.infinite) {
            Array.apply(null, Array(options.infinite)).forEach(function () {
                slideContainer.removeChild(slideContainer.firstChild);
                slideContainer.removeChild(slideContainer.lastChild);
            });
        }

        dispatchSliderEvent('after', 'destroy');
    }

    // event handling

    var touchOffset = void 0;
    var delta = void 0;
    var isScrolling = void 0;

    function onTransitionEnd() {
        if (transitionEndCallback) {
            transitionEndCallback();

            transitionEndCallback = undefined;
        }
    }

    function onTouchstart(event) {
        var _options6 = options,
            enableMouseEvents = _options6.enableMouseEvents;

        var touches = event.touches ? event.touches[0] : event;

        if (enableMouseEvents) {
            frame.addEventListener('mousemove', onTouchmove);
            frame.addEventListener('mouseup', onTouchend);
            frame.addEventListener('mouseleave', onTouchend);
        }

        frame.addEventListener('touchmove', onTouchmove, touchEventParams);
        frame.addEventListener('touchend', onTouchend);

        var pageX = touches.pageX,
            pageY = touches.pageY;


        touchOffset = {
            x: pageX,
            y: pageY,
            time: Date.now()
        };

        isScrolling = undefined;

        delta = {};

        dispatchSliderEvent('on', 'touchstart', {
            event: event
        });
    }

    function onTouchmove(event) {
        var touches = event.touches ? event.touches[0] : event;
        var pageX = touches.pageX,
            pageY = touches.pageY;


        delta = {
            x: pageX - touchOffset.x,
            y: pageY - touchOffset.y
        };

        if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
        }

        if (!isScrolling && touchOffset) {
            translate(position.x + delta.x, 0, null);
        }

        // may be
        dispatchSliderEvent('on', 'touchmove', {
            event: event
        });
    }

    function onTouchend(event) {
        /**
         * time between touchstart and touchend in milliseconds
         * @duration {number}
         */
        var duration = touchOffset ? Date.now() - touchOffset.time : undefined;

        /**
         * is valid if:
         *
         * -> swipe attempt time is over 300 ms
         * and
         * -> swipe distance is greater than 25px
         * or
         * -> swipe distance is more then a third of the swipe area
         *
         * @isValidSlide {Boolean}
         */
        var isValid = Number(duration) < 300 && Math.abs(delta.x) > 25 || Math.abs(delta.x) > frameWidth / 3;

        /**
         * is out of bounds if:
         *
         * -> index is 0 and delta x is greater than 0
         * or
         * -> index is the last slide and delta is smaller than 0
         *
         * @isOutOfBounds {Boolean}
         */
        var isOutOfBounds = !index && delta.x > 0 || index === slides.length - 1 && delta.x < 0;

        var direction = delta.x < 0;

        if (!isScrolling) {
            if (isValid && !isOutOfBounds) {
                slide(false, direction);
            } else {
                translate(position.x, options.snapBackSpeed);
            }
        }

        touchOffset = undefined;

        /**
         * remove eventlisteners after swipe attempt
         */
        frame.removeEventListener('touchmove', onTouchmove);
        frame.removeEventListener('touchend', onTouchend);
        frame.removeEventListener('mousemove', onTouchmove);
        frame.removeEventListener('mouseup', onTouchend);
        frame.removeEventListener('mouseleave', onTouchend);

        dispatchSliderEvent('on', 'touchend', {
            event: event
        });
    }

    function onClick(event) {
        if (delta.x) {
            event.preventDefault();
        }
    }

    function onResize(event) {
        if (frameWidth !== elementWidth(frame)) {
            reset();

            dispatchSliderEvent('on', 'resize', {
                event: event
            });
        }
    }

    // trigger initial setup
    setup();

    // expose public api
    return {
        setup: setup,
        reset: reset,
        slideTo: slideTo,
        returnIndex: returnIndex,
        prev: prev,
        next: next,
        destroy: destroy
    };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = detectPrefixes;
/**
 * Detecting prefixes for saving time and bytes
 */
function detectPrefixes() {
    var transform = void 0;
    var transition = void 0;
    var transitionEnd = void 0;

    (function () {
        var el = document.createElement('_');
        var style = el.style;

        var prop = void 0;

        if (style[prop = 'webkitTransition'] === '') {
            transitionEnd = 'webkitTransitionEnd';
            transition = prop;
        }

        if (style[prop = 'transition'] === '') {
            transitionEnd = 'transitionend';
            transition = prop;
        }

        if (style[prop = 'webkitTransform'] === '') {
            transform = prop;
        }

        if (style[prop = 'msTransform'] === '') {
            transform = prop;
        }

        if (style[prop = 'transform'] === '') {
            transform = prop;
        }

        document.body.insertBefore(el, null);
        style[transform] = 'translateX(0)';
        document.body.removeChild(el);
    })();

    return {
        transform: transform,
        transition: transition,
        transitionEnd: transitionEnd
    };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = detectSupportsPassive;
function detectSupportsPassive() {
    var supportsPassive = false;

    try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function get() {
                supportsPassive = true;
            }
        });

        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
    } catch (e) {}

    return supportsPassive;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = dispatchEvent;

var _customEvent = __webpack_require__(4);

var _customEvent2 = _interopRequireDefault(_customEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * dispatch custom events
 *
 * @param  {element} el         slideshow element
 * @param  {string}  type       custom event name
 * @param  {object}  detail     custom detail information
 */
function dispatchEvent(target, type, detail) {
    var event = new _customEvent2.default(type, {
        bubbles: true,
        cancelable: true,
        detail: detail
    });

    target.dispatchEvent(event);
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
var NativeCustomEvent = global.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'undefined' !== typeof document && 'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  /**
   * slides scrolled at once
   * @slidesToScroll {Number}
   */
  slidesToScroll: 1,

  /**
   * time in milliseconds for the animation of a valid slide attempt
   * @slideSpeed {Number}
   */
  slideSpeed: 300,

  /**
   * time in milliseconds for the animation of the rewind after the last slide
   * @rewindSpeed {Number}
   */
  rewindSpeed: 600,

  /**
   * time for the snapBack of the slider if the slide attempt was not valid
   * @snapBackSpeed {Number}
   */
  snapBackSpeed: 200,

  /**
   * Basic easing functions: https://developer.mozilla.org/de/docs/Web/CSS/transition-timing-function
   * cubic bezier easing functions: http://easings.net/de
   * @ease {String}
   */
  ease: 'ease',

  /**
   * if slider reached the last slide, with next click the slider goes back to the startindex.
   * use infinite or rewind, not both
   * @rewind {Boolean}
   */
  rewind: false,

  /**
   * number of visible slides or false
   * use infinite or rewind, not both
   * @infinite {number}
   */
  infinite: false,

  /**
   * the slide index to show when the slider is initialized.
   * @initialIndex {number}
   */
  initialIndex: 0,

  /**
   * class name for slider frame
   * @classNameFrame {string}
   */
  classNameFrame: 'js_frame',

  /**
   * class name for slides container
   * @classNameSlideContainer {string}
   */
  classNameSlideContainer: 'js_slides',

  /**
   * class name for slider prev control
   * @classNamePrevCtrl {string}
   */
  classNamePrevCtrl: 'js_prev',

  /**
   * class name for slider next control
   * @classNameNextCtrl {string}
   */
  classNameNextCtrl: 'js_next',

  /**
   * class name for current active slide
   * if emptyString then no class is set
   * @classNameActiveSlide {string}
   */
  classNameActiveSlide: 'active',

  /**
   * enables mouse events for swiping on desktop devices
   * @enableMouseEvents {boolean}
   */
  enableMouseEvents: false,

  /**
   * window instance
   * @window {object}
   */
  window: typeof window !== 'undefined' ? window : null,

  /**
   * If false, slides lory to the first slide on window resize.
   * @rewindOnResize {boolean}
   */
  rewindOnResize: true
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvY2xpZW50L2hvbWUvY2Fyb3VzZWwuanMiLCJhcHAvY2xpZW50L3BvbHlmaWxscy9lbGVtZW50LW1hdGNoZXMuanMiLCJhcHAvY2xpZW50L3BvbnlmaWxscy9ldmVudHMuanMiLCJhcHAvY2xpZW50L3NlY3Rvci5qcyIsImFwcC9jbGllbnQvc2VjdG9yL3JhbmtpbmdzLmpzIiwiYXBwL2NsaWVudC91dGlscy9iYW5uZXJzL2NvbW1vbi5qcyIsImFwcC9jbGllbnQvdXRpbHMvYmFubmVycy9nZW5lcmF0b3IuanMiLCJhcHAvY2xpZW50L3V0aWxzL2Nhcm91c2VsLWFuaW1hdGlvbi5qcyIsImFwcC9jbGllbnQvdXRpbHMvY2Fyb3VzZWwtZG90cy5qcyIsImFwcC9jbGllbnQvdXRpbHMvZGVib3VuY2UuanMiLCJhcHAvY2xpZW50L3V0aWxzL2V2ZW50cy5qcyIsImFwcC9jbGllbnQvdXRpbHMvZm9sZGFibGUuanMiLCJhcHAvY2xpZW50L3V0aWxzL2dvdG9wLmpzIiwiYXBwL2NsaWVudC91dGlscy9zZWFyY2hCYXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktZm9yLWVhY2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaXRlcmF0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LW1ldGhvZC1pcy1zdHJpY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLXVzZXMtdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NsYXNzb2YtcmF3LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZG9tLWl0ZXJhYmxlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLWNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGlkZGVuLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW5zcGVjdC1zb3VyY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtZm9yY2VkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1wdXJlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25hdGl2ZS1zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXdlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1wcm9wZXJ0eS1pcy1lbnVtZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL293bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3BhdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NldC1nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLWtleS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQtc3RvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N0cmluZy10cmltLWZvcmNlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zdHJpbmctdHJpbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWxlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93aGl0ZXNwYWNlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuZm9yLWVhY2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmluZGV4LW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcudHJpbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLmRvbS1jb2xsZWN0aW9ucy5mb3ItZWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb3J5LmpzL2Rpc3QvbG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztlQUVpQixPQUFPLENBQUMsU0FBRCxDO0lBQWhCLEksWUFBQSxJOztBQUNSLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLDZCQUFELENBQWpDOztBQUNBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQywyQkFBRCxDQUE1QjtBQUVBOzs7Ozs7QUFJQSxNQUFNLENBQUMsT0FBUCxHQUFpQixZQUFNO0FBQ3JCLE1BQU0sT0FBTyxHQUFHO0FBQ2QsSUFBQSxRQUFRLEVBQUUsQ0FESTtBQUVkLElBQUEsaUJBQWlCLEVBQUUsSUFGTDtBQUdkLElBQUEsVUFBVSxFQUFFO0FBSEUsR0FBaEI7QUFNQSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsc0JBQVQsQ0FBZ0MsVUFBaEMsQ0FBbEI7O0FBRUEsT0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUE3QixFQUFxQyxDQUFDLEVBQXRDLEVBQXlDO0FBQ3ZDLFFBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFELENBQXpCO0FBQ0EsUUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsT0FBRCxDQUFqQztBQUNBLFFBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxPQUFELEVBQVUsT0FBVixDQUF6QjtBQUNBLFFBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFELEVBQVUsT0FBVixDQUFyQjtBQUNBLElBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFELENBQUws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QUF0QztBQUNEO0FBQ0YsQ0FwRkQ7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7IGxvcnkgfSA9IHJlcXVpcmUoJ2xvcnkuanMnKTtcbmNvbnN0IGNhcm91c2VsQW5pbWF0aW9uID0gcmVxdWlyZSgnLi4vdXRpbHMvY2Fyb3VzZWwtYW5pbWF0aW9uJyk7XG5jb25zdCBjYXJvdXNlbERvdHMgPSByZXF1aXJlKCcuLi91dGlscy9jYXJvdXNlbC1kb3RzLmpzJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgSG9tZSBQYWdlIGNhcm91c2Vscy5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpbmZpbml0ZTogMSxcbiAgICBlbmFibGVNb3VzZUV2ZW50czogdHJ1ZSxcbiAgICBzbGlkZVNwZWVkOiA1MDAsXG4gIH07XG5cbiAgY29uc3QgY2Fyb3VzZWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2Fyb3VzZWwnKTtcblxuICBmb3IobGV0IGkgPSAwOyBpIDwgY2Fyb3VzZWxzLmxlbmd0aDsgaSsrKXtcbiAgICBjb25zdCBlbGVtZW50ID0gY2Fyb3VzZWxzW2ldO1xuICAgIGNvbnN0IGFuaW1hdGUgPSBjYXJvdXNlbEFuaW1hdGlvbihlbGVtZW50KTtcbiAgICBjb25zdCBkb3RzID0gY2Fyb3VzZWxEb3RzKGVsZW1lbnQsIG9wdGlvbnMpO1xuICAgIGNvbnN0IGNhcm91c2VsID0gbG9yeShlbGVtZW50LCBvcHRpb25zKTtcbiAgICBhbmltYXRlKGRvdHMoY2Fyb3VzZWwpKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYodHlwZW9mIHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzICE9PSAnZnVuY3Rpb24nKXtcbiAgd2luZG93LkVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgPSB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgd2luZG93LkVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNDdXN0b21FdmVudFN1cHBvcnRlZCA9IHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbic7XG5jb25zdCBpc0V2ZW50U3VwcG9ydGVkID0gdHlwZW9mIHdpbmRvdy5FdmVudCA9PT0gJ2Z1bmN0aW9uJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZUN1c3RvbUV2ZW50LFxuICBjcmVhdGVFdmVudCxcbn07XG5cblxuLyoqXG4gKiBVc2VzIEN1c3RvbUV2ZW50KCkgY29uc3RydWN0b3Igd2hlbiBwb3NzaWJsZS5cbiAqIEFzIElFIGRvZXMgbm90IHN1cHBvcnQgaXQsIHRoZSBkZXByZWNhdGVkIG1ldGhvZCBkb2N1bWVudC5jcmVhdGVFdmVudCgpIGlzIHVzZWQgaW5zdGVhZC5cbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtDdXN0b21FdmVudEluaXQ8VD59IHBhcmFtc1xuICogQHJldHVybnMge0N1c3RvbUV2ZW50PFQ+fVxuICovXG5mdW5jdGlvbiBjcmVhdGVDdXN0b21FdmVudCh0eXBlLCBwYXJhbXMgPSB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsczogbnVsbCB9KXtcbiAgaWYoaXNDdXN0b21FdmVudFN1cHBvcnRlZCkgcmV0dXJuIG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQodHlwZSwgcGFyYW1zKTtcblxuICAvKiogQHR5cGUge0N1c3RvbUV2ZW50PFQ+fSAqL1xuICBjb25zdCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICBldmVudC5pbml0Q3VzdG9tRXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgcmV0dXJuIGV2ZW50O1xufVxuXG4vKipcbiAqIFVzZXMgRXZlbnQoKSBjb25zdHJ1Y3RvciB3aGVuIHBvc3NpYmxlLlxuICogQXMgSUUgZG9lcyBub3Qgc3VwcG9ydCBpdCwgdGhlIGRlcHJlY2F0ZWQgbWV0aG9kIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCkgaXMgdXNlZCBpbnN0ZWFkLlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RXZlbnRJbml0fSBwYXJhbXNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRXZlbnQodHlwZSwgcGFyYW1zID0geyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UgfSl7XG4gIGlmKGlzRXZlbnRTdXBwb3J0ZWQpIHJldHVybiBuZXcgd2luZG93LkV2ZW50KHR5cGUsIHBhcmFtcyk7XG5cbiAgY29uc3QgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSk7XG4gIHJldHVybiBldmVudDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgYW5jaG9ycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWN0b3ItcmFua2luZ3MtYW5jaG9ycyA+IGRpdicpO1xuXG5pZihhbmNob3JzKSBTdGlja3lmaWxsLmFkZE9uZShhbmNob3JzKTtcbnJlcXVpcmUoJy4vaG9tZS9jYXJvdXNlbC5qcycpKCk7XG5yZXF1aXJlKCcuL3V0aWxzL2ZvbGRhYmxlLmpzJykoMCwgODApO1xucmVxdWlyZSgnLi9zZWN0b3IvcmFua2luZ3MuanMnKSgpO1xucmVxdWlyZSgnLi91dGlscy9nb3RvcC5qcycpKCk7XG5yZXF1aXJlKCcuL3V0aWxzL2V2ZW50cy5qcycpLnRyYWNrRXZlbnRzKCk7XG5yZXF1aXJlKCcuL3V0aWxzL3NlYXJjaEJhci5qcycpKCk7XG5yZXF1aXJlKCcuL3V0aWxzL2Jhbm5lcnMvY29tbW9uLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5pdGlhbGl6ZVJhbmtpbmdHcm91cHMoKXtcbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjc2VjdG9yLXJhbmtpbmdzLWRhdGFncmlkIC5zZWN0b3ItcmFua2luZ3MtZ3JvdXAnKSxcbiAgICBpbml0aWFsaXplUmFua2luZ0dyb3VwXG4gICk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBmb2xkYWJsZSBsaXN0LlxuICogQHBhcmFtIHtFbGVtZW50fSBjb250YWluZXJcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBpbml0aWFsaXplUmFua2luZ0dyb3VwKGNvbnRhaW5lcil7XG4gIGNvbnN0IENMQVNTX0ZPRExFRCA9ICdtb2JpbGUtZm9sZGVkJztcbiAgY29uc3QgZm9sZGFibGUgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmZvbGRhYmxlJyk7XG4gIGNvbnN0IHRvZ2dsZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLm1vYmlsZS1mb2xkYWJsZS10b2dnbGVyJyk7XG5cbiAgdG9nZ2xlci5vbmNsaWNrID0gKCkgPT4ge1xuICAgIGlmKGZvbGRhYmxlLmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19GT0RMRUQpKXtcbiAgICAgIGZvbGRhYmxlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfRk9ETEVEKTtcbiAgICB9ZWxzZXtcbiAgICAgIGZvbGRhYmxlLmNsYXNzTGlzdC5hZGQoQ0xBU1NfRk9ETEVEKTtcbiAgICB9XG5cbiAgICBpZih0b2dnbGVyLmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19GT0RMRUQpKXtcbiAgICAgIHRvZ2dsZXIuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19GT0RMRUQpO1xuICAgIH1lbHNle1xuICAgICAgdG9nZ2xlci5jbGFzc0xpc3QuYWRkKENMQVNTX0ZPRExFRCk7XG4gICAgfVxuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjcmVhdGVJZnJhbWVCYW5uZXIgPSByZXF1aXJlKCcuL2dlbmVyYXRvci5qcycpO1xuXG5pZih3aW5kb3cubm14LmJhbm5lcil7XG4gIGNvbnN0IGJhbm5lciA9IGNyZWF0ZUlmcmFtZUJhbm5lcih3aW5kb3cubm14LmJhbm5lci51cmwpO1xuICBiYW5uZXIub3BlbigpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB0cmFja2luZyA9IHJlcXVpcmUoJy4uL2V2ZW50cy5qcycpO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzcmNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJZnJhbWVCYW5uZXIoc3JjKSB7XG4gIGNvbnN0IGxvY2FsU3RvcmFnZUtleSA9IGBiYW5uZXItd3JhcHBlci1pZnJhbWVfXyR7IHNyYyB9YDtcblxuICAvKiogQHR5cGUge0hUTUxJRnJhbWVFbGVtZW50fHVuZGVmaW5lZH0gKi9cbiAgbGV0IGlmcmFtZTtcblxuICByZXR1cm4ge1xuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIGB0cnVlYCBpZiB0aGUgaWZyYW1lIGNvdWxkIGJlIG9wZW4sIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBpZighaWZyYW1lICYmICF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlS2V5KSl7XG4gICAgICBpZnJhbWUgPSBjcmVhdGVJZnJhbWUoKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGlmcmFtZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0obG9jYWxTdG9yYWdlS2V5LCAndHJ1ZScpO1xuICAgIGlmcmFtZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUlmcmFtZSgpe1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZnJhbWVib3JkZXInLCAnMCcpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzY3JvbGxpbmcnLCAnbm8nKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjKTtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9ICdiYW5uZXItd3JhcHBlci1pZnJhbWUnO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsIGNsb3NlKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYWNraW5nJywgb25UcmFja2luZyk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0N1c3RvbUV2ZW50fSBldmVudFxuICAgKi9cbiAgZnVuY3Rpb24gb25UcmFja2luZyhldmVudCl7XG4gICAgaWYoZXZlbnQuZGV0YWlsICYmIGV2ZW50LmRldGFpbC5hY3Rpb24pe1xuICAgICAgdHJhY2tpbmcudHJhY2soZXZlbnQuZGV0YWlsKTtcbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQW5pbWF0ZXMgYSBjYXJvdXNlbC5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtDYXJvdXNlbC5EeW5hbWljQ2Fyb3VzZWxPcHRpb25zfSBbb3B0aW9uc11cbiAqIEByZXR1cm5zIHtDYXJvdXNlbC5iaW5kQ2Fyb3VzZWx9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2Fyb3VzZWxBbmltYXRpb24oZWxlbWVudCwgeyBjbGFzc05hbWVTbGlkZUNvbnRhaW5lciA9ICdqc19zbGlkZXMnLCBzbGlkZVBhdXNlID0gMTAwMDAgfSA9IHt9KXtcbiAgLyoqIEB0eXBlIHtpbXBvcnQoJ2xvcnkuanMnKS5Mb3J5U3RhdGljfSAqL1xuICBsZXQgY2Fyb3VzZWw7XG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICBsZXQgdGltZW91dElkO1xuICBjb25zdCBzbGlkZUNvbnRhaW5lciA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgLiR7IGNsYXNzTmFtZVNsaWRlQ29udGFpbmVyIH1gKTtcbiAgY29uc3Qgc2xpZGVDb3VudCA9IHNsaWRlQ29udGFpbmVyID8gc2xpZGVDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoIDogMDtcblxuICBpZihzbGlkZVBhdXNlID4gMCAmJiBzbGlkZUNvdW50ID4gMSl7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdhZnRlci5sb3J5LmluaXQnLCBtb3ZlRm9yd2FyZCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmUubG9yeS5zbGlkZScsICgpID0+IGNsZWFyVGltZW91dCh0aW1lb3V0SWQpKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2FmdGVyLmxvcnkuc2xpZGUnLCBtb3ZlRm9yd2FyZCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdvbi5sb3J5LnJlc2l6ZScsIHJlc2V0VGltZXIpO1xuICB9XG5cbiAgcmV0dXJuIGxvcnkgPT4gKGNhcm91c2VsID0gbG9yeSk7XG5cbiAgLyoqXG4gICAqIFByZXBhcmVzIG5leHQgc2xpZGUgdG8gc2hvdy5cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBmdW5jdGlvbiBtb3ZlRm9yd2FyZCgpe1xuICAgIGNvbnN0IHRpbWUgPSBNYXRoLmFicygrZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAuJHsgY2xhc3NOYW1lU2xpZGVDb250YWluZXIgfSA+IC5hY3RpdmVgKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGltZScpKTtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IGNhcm91c2VsLm5leHQoKSwgdGltZSB8fCBzbGlkZVBhdXNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGltZXIgdG8gdGhlIHRyaWdnZXIgdGhlIG5leHQgc2xpZGUgYWZ0ZXIgdGhlIHJpZ2h0IHRpZW0uXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gcmVzZXRUaW1lcigpe1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIG1vdmVGb3J3YXJkKCk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQWRkcyBjbGlja2FibGUgZG90cyB0byB0aGUgZ2l2ZW4gY2Fyb3VzZWwuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7Q2Fyb3VzZWwuRG90c0Nhcm91c2VsT3B0aW9uc30gW29wdGlvbnNdXG4gKiBAcmV0dXJucyB7Q2Fyb3VzZWwuYmluZENhcm91c2VsfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhcm91c2VsRG90cyhlbGVtZW50LCB7IGNsYXNzTmFtZURvdENvbnRhaW5lciA9ICdqc19kb3RzJywgY2xhc3NOYW1lU2xpZGVDb250YWluZXIgPSAnanNfc2xpZGVzJywgaW5maW5pdGUgfSA9IHt9KXtcbiAgLyoqIEB0eXBlIHtpbXBvcnQoJ2xvcnkuanMnKS5Mb3J5U3RhdGljfSAqL1xuICBsZXQgY2Fyb3VzZWw7XG4gIGNvbnN0IENMQVNTX0FDVElWRSA9ICdhY3RpdmUnO1xuICBjb25zdCBkb3RDb250YWluZXIgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC4keyBjbGFzc05hbWVEb3RDb250YWluZXIgfWApO1xuICBjb25zdCBzbGlkZUNvbnRhaW5lciA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgLiR7IGNsYXNzTmFtZVNsaWRlQ29udGFpbmVyIH1gKTtcbiAgY29uc3QgZG90Q291bnQgPSBzbGlkZUNvbnRhaW5lciA/IHNsaWRlQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA6IDA7XG5cbiAgaWYoZG90Q29udGFpbmVyICYmIGRvdENvdW50ID4gMSl7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmUubG9yeS5pbml0JywgY3JlYXRlRG90cyk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdhZnRlci5sb3J5LmluaXQnLCBiaW5kRG90cyk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdhZnRlci5sb3J5LnNsaWRlJywgc2VsZWN0QWN0aXZlRG90KTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ29uLmxvcnkucmVzaXplJywgKCkgPT4gc2VsZWN0RG90KDApKTtcbiAgfVxuXG4gIHJldHVybiBsb3J5ID0+IChjYXJvdXNlbCA9IGxvcnkpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFzIG1hbnkgZG90cyBhcyBzbGlkZXMgaW4gdGhlIGNhcm91c2VsLlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZURvdHMoKXtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZG90Q291bnQ7IGkrKyl7XG4gICAgICBkb3RDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XG4gICAgfVxuXG4gICAgZG90Q29udGFpbmVyLmNoaWxkcmVuWzBdLmNsYXNzTGlzdC5hZGQoQ0xBU1NfQUNUSVZFKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBkb3RzIGV2ZW50IGhhbmRsZXJzLlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIGJpbmREb3RzKCl7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGRvdENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICBkb3RDb250YWluZXIuY2hpbGRyZW5baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkRvdENsaWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyB0aGUgbmV3IGFjdGl2ZSBkb3QgYW5kIHVuc2VsZWN0IHRoZSBwcmV2aW91cyBhY3RpdmUgb25lLlxuICAgKiBAcGFyYW0ge0N1c3RvbUV2ZW50fSBldmVudFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIHNlbGVjdEFjdGl2ZURvdChldmVudCl7XG4gICAgc2VsZWN0RG90KGluZmluaXRlID8gZXZlbnQuZGV0YWlsLmN1cnJlbnRTbGlkZSAtIDEgOiBldmVudC5kZXRhaWwuY3VycmVudFNsaWRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyB0aGUgc2xpZGUgYXNzb2NpYXRlZCB0byB0aGUgY2xpY2tlZCBkb3QuXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gb25Eb3RDbGljayhldmVudCl7XG4gICAgY29uc3QgaW5kZXggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGRvdENvbnRhaW5lci5jaGlsZHJlbiwgZXZlbnQudGFyZ2V0KTtcbiAgICBjYXJvdXNlbC5zbGlkZVRvKGluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIHRoZSBkb3QgYXQgdGhlIGdpdmVuIGluZGV4IGFuZCB1bnNlbGVjdCBhbGwgdGhlIG90aGVycy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gc2VsZWN0RG90KGluZGV4KXtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZG90Q29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgIGRvdENvbnRhaW5lci5jaGlsZHJlbltpXS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX0FDVElWRSk7XG4gICAgfVxuXG4gICAgZG90Q29udGFpbmVyLmNoaWxkcmVuW2luZGV4XS5jbGFzc0xpc3QuYWRkKENMQVNTX0FDVElWRSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGVsYXlzIGZ1bmN0aW9uIGBmdW5jYCBpbnZvY2F0aW9uIGZvciBgd2FpdGAgbWlsbGlzZWNvbmRzLCB1c2luZyBgc2V0VGltZW91dCgpYCwgc28gdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIGxvc3QuXG4gKiBJZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIGlzIGludm9rZWQgbXVsdGlwbGUgdGltZXMgd2l0aGluIHRoZSBgd2FpdGAgcGVyaW9kLFxuICogb25seSB0aGUgbGFzdCBpbnZvY2F0aW9uIHdpbGwgYWN0dWFsbHkgY2FsbCB0aGUgZnVuY3Rpb24gYGZ1bmNgLCBjYW5jZWxpbmcgdGhlIHByZWNlZGluZyBpbnZvY2F0aW9ucy5cbiAqIEZvciBhIG1vcmUgYWR2YW5jZWQgaW1wbGVtZW50YXRpb24sIHNlZSBbbG9kYXNoLmRlYm91bmNlXShodHRwczovL2xvZGFzaC5jb20vZG9jcy80LjE3LjE1I2RlYm91bmNlKS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmNcbiAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IHRpbWUgaW4gbWlsbGlzZWNvbmRzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCA9IDApe1xuICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgbGV0IHRpbWVvdXRJZDtcblxuICAvKiogQHRoaXMgYW55ICovXG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoLi4uYXJncyl7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpLCB3YWl0KTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL3BvbHlmaWxscy9lbGVtZW50LW1hdGNoZXMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRyYWNrRXZlbnRzLFxuICB0cmFja0V2ZW50c0luQ29udGFpbmVyLFxuICBvblRyYWNrZWRBY3Rpb24sXG4gIHRyYWNrLFxuICBnZXREYXRhRXZlbnQsXG4gIGdldFBhZ2VOYW1lLFxufTtcblxuY29uc3QgU0VMRUNUT1JfRk9MRCA9ICcuZm9sZGFibGUtdG9nZ2xlcic7XG5jb25zdCBTRUxFQ1RPUl9BTkFMWVRJQ1NfRk9STSA9ICdmb3JtLnNlYXJjaFtkYXRhLWV2ZW50LWFjdGlvbl0nO1xuY29uc3QgU0VMRUNUT1JfQU5BTFlUSUNTID0gJ1tkYXRhLWV2ZW50LWFjdGlvbl06bm90KGZvcm0pJztcblxuZnVuY3Rpb24gdHJhY2tFdmVudHMoKSB7XG4gIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUl9GT0xEKSxcbiAgICBmb2xkYWJsZUVsZW1lbnQgPT4geyBmb2xkYWJsZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG9nZ2xlJywgb25Gb2xkQWN0aW9uKTsgfVxuICApO1xuXG4gIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUl9BTkFMWVRJQ1NfRk9STSksXG4gICAgZm9ybUVsZW1lbnQgPT4geyBmb3JtRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBvblNlYXJjaEFjdGlvbik7IH1cbiAgKTtcblxuICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1JfQU5BTFlUSUNTKSxcbiAgICBlbGVtZW50ID0+IHsgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVHJhY2tlZEFjdGlvbik7IH1cbiAgKTtcbn1cblxuLyoqXG4gKiBMaWtlIGB0cmFja0V2ZW50cygpYCwgYnV0IHVzZXMgZXZlbnQgZGVsZWdhdGlvbiB0byB0cmFjayBhY3Rpb25zIGluIGEgbGl2ZSBjb250YWluZXIgKHdoaWNoIGRlbGV0ZXMgb3IgY3JlYXRlcyBuZXcgY2hpbGRyZW4pLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gKi9cbmZ1bmN0aW9uIHRyYWNrRXZlbnRzSW5Db250YWluZXIoY29udGFpbmVyKXtcbiAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvZ2dsZScsIGV2ZW50ID0+IHtcbiAgICBpZihldmVudC50YXJnZXQubWF0Y2hlcyhTRUxFQ1RPUl9GT0xEKSl7XG4gICAgICB0cmFrRm9sZEFjdGlvbihldmVudC50YXJnZXQsIGV2ZW50LmRldGFpbCk7XG4gICAgfVxuICB9KTtcblxuICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgaWYoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoU0VMRUNUT1JfQU5BTFlUSUNTKSl7XG4gICAgICB0cmFja0FjdGlvbihldmVudC50YXJnZXQpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGV2ZW50ID0+IHtcbiAgICBpZihldmVudC50YXJnZXQubWF0Y2hlcyhTRUxFQ1RPUl9BTkFMWVRJQ1NfRk9STSkpe1xuICAgICAgdHJhY2tTZWFyY2hBY3Rpb24oZXZlbnQudGFyZ2V0KTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKiogQHBhcmFtIHtDdXN0b21FdmVudDxib29sZWFuPn0gZXZlbnQgKi9cbmZ1bmN0aW9uIG9uRm9sZEFjdGlvbihldmVudCl7XG4gIHRyYWtGb2xkQWN0aW9uKGV2ZW50LmN1cnJlbnRUYXJnZXQsIGV2ZW50LmRldGFpbCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtib29sZWFufSBpc0ZvbGRlZCB0b2dnbGVyIG5ldyBzdGF0ZVxuICovXG5mdW5jdGlvbiB0cmFrRm9sZEFjdGlvbihlbGVtZW50LCBpc0ZvbGRlZCl7XG4gIC8qIFdlIHdhbnQgdG8gdHJhY2sgdGhlIGNsaWNrIG9uIHRoZSB0b2dnbGVyIGJlZm9yZSBpdCBjaGFuZ2VzIGl0cyBzdGF0ZS5cbiAgICogQnV0IGF0IHRoaXMgcG9pbnQsIGl0IGhhcyBjaGFuZ2VkIGFscmVhZHkuXG4gICAqIFNvIHdlIGdldCB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIGl0cyBwcmV2aW91cyBzdGF0ZSwgd2hlbiB0aGUgY2xpY2sgb2NjdXJyZWQuXG4gICAqL1xuICBjb25zdCBkYXRhID0gZ2V0Rm9sZERhdGFFdmVudChlbGVtZW50LCAhaXNGb2xkZWQpO1xuICBpZihkYXRhICYmIGRhdGEuYWN0aW9uKXtcbiAgICB0cmFjayhkYXRhKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNGb2xkZWQgdG9nZ2xlciBuZXcgc3RhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0Rm9sZERhdGFFdmVudChlbGVtZW50LCBpc0ZvbGRlZCl7XG4gIGlmKGVsZW1lbnQpe1xuICAgIGNvbnN0IHN0YXRlID0gaXNGb2xkZWQgPyAnZm9sZGVkJyA6ICd1bmZvbGRlZCc7XG4gICAgcmV0dXJuIGdldERhdGFFdmVudChlbGVtZW50LCB7XG4gICAgICBldmVudEFjdGlvbkNsYXNzOiBgZGF0YS1ldmVudC1hY3Rpb24tJHsgc3RhdGUgfWAsXG4gICAgICBldmVudExhYmVsQ2xhc3M6IGBkYXRhLWV2ZW50LWxhYmVsLSR7IHN0YXRlIH1gLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVHJhY2sgc3VibWl0IGZvcm0gd2l0aCBwYWdlIGFzIGNhdGVnb3J5IGFuZCBhY3Rpb24gYXMgZGF0YS1ldmVudC1hY3Rpb24gb24gZm9ybSBlbGVtZW50XG4gKiBUaGUgZm9ybSBtdXN0IGNvbnRhaW4gYW4gaW5wdXRbdHlwZT1cInNlYXJjaFwiXSB0byBnZXQgYSBsYWJlbCB0cmFja2luZ1xuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqL1xuZnVuY3Rpb24gb25TZWFyY2hBY3Rpb24oZXZlbnQpIHtcbiAgdHJhY2tTZWFyY2hBY3Rpb24oZXZlbnQuY3VycmVudFRhcmdldCk7XG59XG5cbi8qKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50ICovXG5mdW5jdGlvbiB0cmFja1NlYXJjaEFjdGlvbihlbGVtZW50KXtcbiAgY29uc3Qgc2VhcmNoSW5wdXRFbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwic2VhcmNoXCJdJyk7XG4gIHRyYWNrKHtcbiAgICBjYXRlZ29yeTogZ2V0UGFnZU5hbWUoKSxcbiAgICBhY3Rpb246IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWV2ZW50LWFjdGlvbicpLFxuICAgIGxhYmVsOiBzZWFyY2hJbnB1dEVsZW1lbnQgJiYgc2VhcmNoSW5wdXRFbGVtZW50LnZhbHVlIHx8ICcnLFxuICB9KTtcbn1cblxuLyoqIEBwYXJhbSB7RXZlbnR9IGV2ZW50ICovXG5mdW5jdGlvbiBvblRyYWNrZWRBY3Rpb24oZXZlbnQpe1xuICB0cmFja0FjdGlvbihldmVudC5jdXJyZW50VGFyZ2V0KTtcbn1cblxuLyoqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgKi9cbmZ1bmN0aW9uIHRyYWNrQWN0aW9uKGVsZW1lbnQpe1xuICBjb25zdCBkYXRhID0gZ2V0RGF0YUV2ZW50KGVsZW1lbnQpO1xuICBpZihkYXRhICYmIGRhdGEuYWN0aW9uKXtcbiAgICB0cmFjayhkYXRhKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHt7IGV2ZW50QWN0aW9uQ2xhc3M/OiBzdHJpbmcsIGV2ZW50TGFiZWxDbGFzcz86IHN0cmluZyB9fSBbb3B0aW9uc11cbiAqIEByZXR1cm5zIHt7IGNhdGVnb3J5OiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nfG51bGwsIGxhYmVsOiBzdHJpbmcgfSB8IHVuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gZ2V0RGF0YUV2ZW50KGVsZW1lbnQsIHsgZXZlbnRBY3Rpb25DbGFzcz0nZGF0YS1ldmVudC1hY3Rpb24nLCBldmVudExhYmVsQ2xhc3M9J2RhdGEtZXZlbnQtbGFiZWwnfSA9IHt9KXtcbiAgaWYoZWxlbWVudCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNhdGVnb3J5OiBnZXRQYWdlTmFtZSgpLFxuICAgICAgYWN0aW9uOiBlbGVtZW50LmdldEF0dHJpYnV0ZShldmVudEFjdGlvbkNsYXNzKSxcbiAgICAgIGxhYmVsOiBlbGVtZW50LmdldEF0dHJpYnV0ZShldmVudExhYmVsQ2xhc3MpIHx8IGVsZW1lbnQudGV4dENvbnRlbnQudHJpbSgpLFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhY2soeyBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCB9KSB7XG4gIGNvbnN0IHsgZ3RhZyB9ID0gd2luZG93O1xuXG4gIGlmKGd0YWcpe1xuICAgIGd0YWcoJ2V2ZW50JywgYWN0aW9uLCB7XG4gICAgICBldmVudF9jYXRlZ29yeTogY2F0ZWdvcnksXG4gICAgICBldmVudF9sYWJlbDogbGFiZWwsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge1dpbmRvd30gY29udGV4dFxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gZ2V0UGFnZU5hbWUoY29udGV4dCA9IHdpbmRvdyl7XG4gIGNvbnN0IHsgdXJsUHJlZml4IH0gPSBjb250ZXh0O1xuICBsZXQgcGFnZU5hbWUgPSBjb250ZXh0LmRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lO1xuICBpZihwYWdlTmFtZSA9PT0gXCIvXCIpIHtcbiAgICBwYWdlTmFtZSA9IFwiSG9tZSBQYWdlXCI7XG4gIH0gZWxzZSBpZihwYWdlTmFtZS5pbmRleE9mKGAke3VybFByZWZpeH0vc2VjdG9yL2ApID09PSAwKSB7XG4gICAgcGFnZU5hbWUgPSBcIlNlY3RvciBQYWdlXCI7XG4gIH0gZWxzZSBpZiAocGFnZU5hbWUuaW5kZXhPZihgJHt1cmxQcmVmaXh9L3JhbmtpbmcvYCkgPT09IDApIHtcbiAgICBwYWdlTmFtZSA9IFwiUmFua2luZyBQYWdlXCI7XG4gIH0gZWxzZSBpZiAocGFnZU5hbWUuaW5kZXhPZignL3NlYXJjaCcpID09PSAwKSB7XG4gICAgcGFnZU5hbWUgPSAnU2VhcmNoIFBhZ2UnO1xuICB9IGVsc2UgaWYgKHBhZ2VOYW1lLmluZGV4T2YoYCR7dXJsUHJlZml4fS90aW1lc2VyaWVzL2ApID09PSAwKSB7XG4gICAgcGFnZU5hbWUgPSBcIkRhdGEgUGFnZVwiO1xuICB9XG4gIHJldHVybiBwYWdlTmFtZTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgeyBjcmVhdGVDdXN0b21FdmVudCB9ID0gcmVxdWlyZSgnLi4vcG9ueWZpbGxzL2V2ZW50cy5qcycpO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYWxsIGZvbGRhYmxlIGxpc3RzIG9uIHRoZSBwYWdlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtvZmZzZXRYPTBdXG4gKiBAcGFyYW0ge251bWJlcn0gW29mZnNldFk9MF1cbiAqIEByZXR1cm5ze3ZvaWR9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5pdGlhbGl6YUZvbGRhYmxlTGlzdHMob2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwKXtcbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZm9sZGFibGUnKSxcbiAgICAoZm9sZGFibGUpID0+IGluaXRpYWxpemVGb2xkYWJsZUxpc3QoZm9sZGFibGUsIG9mZnNldFgsIG9mZnNldFkpXG4gICk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBmb2xkYWJsZSBsaXN0LlxuICogSWYgeW91IG5lZWQgdG8gd2F0Y2ggc3RhdGUgY2hhbmdlcywgc3Vic2NyaWJlIHRvIHRoZSAqKnRvZ2dsZSoqIGV2ZW50LlxuICogQHBhcmFtIHtFbGVtZW50fSBmb2xkYWJsZVxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldFhcbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXRZXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gaW5pdGlhbGl6ZUZvbGRhYmxlTGlzdChmb2xkYWJsZSwgb2Zmc2V0WCwgb2Zmc2V0WSl7XG4gIGNvbnN0IENMQVNTX0ZPTERFRCA9ICdmb2xkZWQnO1xuICBjb25zdCB0b2dnbGVyID0gZm9sZGFibGUucXVlcnlTZWxlY3RvcignLmZvbGRhYmxlLXRvZ2dsZXInKTtcbiAgY29uc3Qgc2Nyb2xsT3JpZ2luID0gZm9sZGFibGUucXVlcnlTZWxlY3RvcignLmZvbGRhYmxlLXNjcm9sbC1vcmlnaW4nKSB8fCBmb2xkYWJsZTtcblxuICBpZighdG9nZ2xlcikgcmV0dXJuO1xuXG4gIHRvZ2dsZXIudGV4dENvbnRlbnQgPSBmb2xkYWJsZS5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfRk9MREVEKSA/IHRvZ2dsZXIuZGF0YXNldC5sYWJlbEZvbGRlZCA6IHRvZ2dsZXIuZGF0YXNldC5sYWJlbFVuZm9sZGVkO1xuXG4gIHRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc3QgaXNGb2xkZWQgPSBmb2xkYWJsZS5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfRk9MREVEKTtcblxuICAgIGlmKGlzRm9sZGVkKXtcbiAgICAgIGZvbGRhYmxlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfRk9MREVEKTtcbiAgICAgIHRvZ2dsZXIudGV4dENvbnRlbnQgPSB0b2dnbGVyLmRhdGFzZXQubGFiZWxVbmZvbGRlZDtcbiAgICB9ZWxzZXtcbiAgICAgIGZvbGRhYmxlLmNsYXNzTGlzdC5hZGQoQ0xBU1NfRk9MREVEKTtcbiAgICAgIHRvZ2dsZXIudGV4dENvbnRlbnQgPSB0b2dnbGVyLmRhdGFzZXQubGFiZWxGb2xkZWQ7XG5cbiAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gc2Nyb2xsT3JpZ2luLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICBpZihib3VuZGluZ0JveC5sZWZ0IDwgb2Zmc2V0WCB8fCBib3VuZGluZ0JveC50b3AgPCBvZmZzZXRZKXtcbiAgICAgICAgY29uc3QgYm9keUJvdW5kaW5nQm94ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyhcbiAgICAgICAgICBib3VuZGluZ0JveC5sZWZ0IC0gYm9keUJvdW5kaW5nQm94LmxlZnQgLSBvZmZzZXRYLFxuICAgICAgICAgIGJvdW5kaW5nQm94LnRvcCAtIGJvZHlCb3VuZGluZ0JveC50b3AgLSBvZmZzZXRZXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlci5kaXNwYXRjaEV2ZW50KGNyZWF0ZUN1c3RvbUV2ZW50KCd0b2dnbGUnLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogIWlzRm9sZGVkIH0pKTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIEdvIFRvcCBidXR0b24uXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbml0aWFsaXplR290b3AoKXtcbiAgY29uc3QgQ0xBU1NfQUNUSVZFID0gJ2dvdG9wLWFjdGl2ZSc7XG4gIGNvbnN0IFNDUk9MTF9MSU1JVCA9IDgwOyAvLyBjb3JyZXNwb25kcyB0byB0aGUgaGVhZGVyJ3MgaGVpZ2h0IChweClcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dvdG9wJyk7XG5cbiAgYnV0dG9uLm9uY2xpY2sgPSBnb0JhY2tUb1RvcDtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdG9nZ2xlR29Ub3BCdXR0b24pO1xuICB0b2dnbGVHb1RvcEJ1dHRvbigpO1xuXG4gIGZ1bmN0aW9uIHRvZ2dsZUdvVG9wQnV0dG9uKCl7XG4gICAgaWYoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA+PSBTQ1JPTExfTElNSVQpe1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoQ0xBU1NfQUNUSVZFKTtcbiAgICB9ZWxzZXtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX0FDVElWRSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gZ29CYWNrVG9Ub3AoZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IE1JTl9TVUdHRVNUSU9OX1NJWkUgPSAzO1xuY29uc3QgSU5QVVRfREVMVEEgPSAxMDA7XG5jb25zdCBFU0NBUEVfS0VZID0gMjc7XG5jb25zdCBIVFRQX1NUQVRVU19DT0RFX09LID0gMjAwO1xuY29uc3QgU1VHR0VTVF9QQVRIID0gJy9zZWFyY2gvc3VnZ2VzdCc7XG5jb25zdCBldmVudHNTZXJ2aWNlID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcbmNvbnN0IGRlYm91bmNlID0gcmVxdWlyZSgnLi9kZWJvdW5jZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlYXJjaCgpIHtcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXItc2VhcmNoLWJhcicpO1xuICBjb25zdCBzdWdnZXN0aW9uc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXItc2VhcmNoLXN1Z2dlc3Rpb25zLXJlc3VsdHMnKTtcbiAgY29uc3QgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gIGxldCBoYXNDb250ZW50ID0gZmFsc2U7XG5cbiAgZm9ybS5hcHBlbmRDaGlsZChzdWdnZXN0aW9uc0NvbnRhaW5lcik7XG5cbiAgaW5wdXQub25pbnB1dCA9IGRlYm91bmNlKHByb2Nlc3NOZXdJbnB1dEV2ZW50LCBJTlBVVF9ERUxUQSk7XG5cbiAgaW5wdXQub25ibHVyID0gaGlkZVN1Z2dlc3Rpb25zQ29udGFpbmVyO1xuXG4gIGlucHV0Lm9uZm9jdXMgPSBzaG93U3VnZ2VzdGlvbnNDb250YWluZXI7XG5cbiAgaW5wdXQub25rZXl1cCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRV9LRVkpIHtcbiAgICAgIGhpZGVTdWdnZXN0aW9uc0NvbnRhaW5lcigpO1xuICAgICAgaW5wdXQuYmx1cigpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBwcm9jZXNzTmV3SW5wdXRFdmVudChldmVudCkge1xuICAgIGNvbnN0IHRleHQgPSBldmVudC50YXJnZXQudmFsdWU7XG5cbiAgICBpZiAodGV4dC5sZW5ndGggPj0gTUlOX1NVR0dFU1RJT05fU0laRSkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgYCR7U1VHR0VTVF9QQVRIfT90ZXh0PSR7dGV4dH1gKTtcblxuICAgICAgcmVxdWVzdC5vbmxvYWQgPSBoYW5kbGVTZWFyY2hTdWdnZXN0aW9ucztcblxuICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsZWFyU2VhcmNoU3VnZ2VzdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVTZWFyY2hTdWdnZXN0aW9ucyhldmVudCkge1xuICAgIGlmIChldmVudC50YXJnZXQuc3RhdHVzID09PSBIVFRQX1NUQVRVU19DT0RFX09LKSB7XG5cbiAgICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLmlubmVySFRNTCA9IGV2ZW50LnRhcmdldC5yZXNwb25zZVRleHQ7XG5cbiAgICAgIC8vIHByZXZlbnRzIHRoZSBtb3VzZSBjbGljayBmcm9tIHRyaWdnZXIgdGhlIGlucHV0IG9uYmx1ciBldmVudFxuICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChcbiAgICAgICAgc3VnZ2VzdGlvbnNDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnYSwgI3N1Z2dlc3Rpb24tZGlkLXlvdS1tZWFuJyksXG4gICAgICAgIGxpbmsgPT4geyBsaW5rLm9ubW91c2Vkb3duID0gbGlua0V2ZW50ID0+IGxpbmtFdmVudC5wcmV2ZW50RGVmYXVsdCgpOyB9XG4gICAgICApO1xuXG4gICAgICBjb25zdCBkaWRZb3VNZWFuID0gc3VnZ2VzdGlvbnNDb250YWluZXIucXVlcnlTZWxlY3RvcignI3N1Z2dlc3Rpb24tZGlkLXlvdS1tZWFuJyk7XG5cbiAgICAgIGlmIChkaWRZb3VNZWFuKSB7XG4gICAgICAgIGRpZFlvdU1lYW4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgaW5wdXQudmFsdWUgPSBkaWRZb3VNZWFuLnRleHRDb250ZW50O1xuICAgICAgICAgIGZvcm0uc3VibWl0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcbiAgICAgIHNob3dTdWdnZXN0aW9uc0NvbnRhaW5lcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhclNlYXJjaFN1Z2dlc3Rpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJTZWFyY2hTdWdnZXN0aW9ucygpIHtcbiAgICBoaWRlU3VnZ2VzdGlvbnNDb250YWluZXIoKTtcbiAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBoYXNDb250ZW50ID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBzaG93U3VnZ2VzdGlvbnNDb250YWluZXIoKSB7XG4gICAgaWYgKGhhc0NvbnRlbnQpIHtcbiAgICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG4gICAgICAvL21vbml0b3IgY2xpY2tzIG9uIHN1Z2dlc3Rpb25zXG4gICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKFxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjaGVhZGVyLXNlYXJjaC1zdWdnZXN0aW9ucy1yZXN1bHRzICpbZGF0YS1ldmVudC1hY3Rpb25dJyksXG4gICAgICAgIGVsZW1lbnQgPT4geyBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnRzU2VydmljZS5vblRyYWNrZWRBY3Rpb24pOyB9XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGVTdWdnZXN0aW9uc0NvbnRhaW5lcigpIHtcbiAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IFR5cGVFcnJvcihTdHJpbmcoaXQpICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhpdCkgKyAnIGlzIG5vdCBhbiBvYmplY3QnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLmZvckVhY2g7XG52YXIgYXJyYXlNZXRob2RJc1N0cmljdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaXMtc3RyaWN0Jyk7XG52YXIgYXJyYXlNZXRob2RVc2VzVG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLXVzZXMtdG8tbGVuZ3RoJyk7XG5cbnZhciBTVFJJQ1RfTUVUSE9EID0gYXJyYXlNZXRob2RJc1N0cmljdCgnZm9yRWFjaCcpO1xudmFyIFVTRVNfVE9fTEVOR1RIID0gYXJyYXlNZXRob2RVc2VzVG9MZW5ndGgoJ2ZvckVhY2gnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG5tb2R1bGUuZXhwb3J0cyA9ICghU1RSSUNUX01FVEhPRCB8fCAhVVNFU19UT19MRU5HVEgpID8gZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICByZXR1cm4gJGZvckVhY2godGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xufSA6IFtdLmZvckVhY2g7XG4iLCJ2YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4Jyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBpbmRleE9mLCBpbmNsdWRlcyB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgIGlmICgoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykgJiYgT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5pbmNsdWRlc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xuICBpbmNsdWRlczogY3JlYXRlTWV0aG9kKHRydWUpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuICBpbmRleE9mOiBjcmVhdGVNZXRob2QoZmFsc2UpXG59O1xuIiwidmFyIGJpbmQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1jb250ZXh0Jyk7XG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWxlbmd0aCcpO1xudmFyIGFycmF5U3BlY2llc0NyZWF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xuXG52YXIgcHVzaCA9IFtdLnB1c2g7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBmb3JFYWNoLCBtYXAsIGZpbHRlciwgc29tZSwgZXZlcnksIGZpbmQsIGZpbmRJbmRleCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgdmFyIElTX01BUCA9IFRZUEUgPT0gMTtcbiAgdmFyIElTX0ZJTFRFUiA9IFRZUEUgPT0gMjtcbiAgdmFyIElTX1NPTUUgPSBUWVBFID09IDM7XG4gIHZhciBJU19FVkVSWSA9IFRZUEUgPT0gNDtcbiAgdmFyIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDY7XG4gIHZhciBOT19IT0xFUyA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYO1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0LCBzcGVjaWZpY0NyZWF0ZSkge1xuICAgIHZhciBPID0gdG9PYmplY3QoJHRoaXMpO1xuICAgIHZhciBzZWxmID0gSW5kZXhlZE9iamVjdChPKTtcbiAgICB2YXIgYm91bmRGdW5jdGlvbiA9IGJpbmQoY2FsbGJhY2tmbiwgdGhhdCwgMyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjcmVhdGUgPSBzcGVjaWZpY0NyZWF0ZSB8fCBhcnJheVNwZWNpZXNDcmVhdGU7XG4gICAgdmFyIHRhcmdldCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHZhbHVlLCByZXN1bHQ7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKSB7XG4gICAgICB2YWx1ZSA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzdWx0ID0gYm91bmRGdW5jdGlvbih2YWx1ZSwgaW5kZXgsIE8pO1xuICAgICAgaWYgKFRZUEUpIHtcbiAgICAgICAgaWYgKElTX01BUCkgdGFyZ2V0W2luZGV4XSA9IHJlc3VsdDsgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYgKHJlc3VsdCkgc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWx1ZTsgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHB1c2guY2FsbCh0YXJnZXQsIHZhbHVlKTsgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZiAoSVNfRVZFUlkpIHJldHVybiBmYWxzZTsgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiB0YXJnZXQ7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbiAgZm9yRWFjaDogY3JlYXRlTWV0aG9kKDApLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLm1hcGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5tYXBcbiAgbWFwOiBjcmVhdGVNZXRob2QoMSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmlsdGVyYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbHRlclxuICBmaWx0ZXI6IGNyZWF0ZU1ldGhvZCgyKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5zb21lYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnNvbWVcbiAgc29tZTogY3JlYXRlTWV0aG9kKDMpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmV2ZXJ5YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmV2ZXJ5XG4gIGV2ZXJ5OiBjcmVhdGVNZXRob2QoNCksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmluZGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maW5kXG4gIGZpbmQ6IGNyZWF0ZU1ldGhvZCg1KSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXhgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZEluZGV4XG4gIGZpbmRJbmRleDogY3JlYXRlTWV0aG9kKDYpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBhcmd1bWVudCkge1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICByZXR1cm4gISFtZXRob2QgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGwsbm8tdGhyb3ctbGl0ZXJhbFxuICAgIG1ldGhvZC5jYWxsKG51bGwsIGFyZ3VtZW50IHx8IGZ1bmN0aW9uICgpIHsgdGhyb3cgMTsgfSwgMSk7XG4gIH0pO1xufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgY2FjaGUgPSB7fTtcblxudmFyIHRocm93ZXIgPSBmdW5jdGlvbiAoaXQpIHsgdGhyb3cgaXQ7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBvcHRpb25zKSB7XG4gIGlmIChoYXMoY2FjaGUsIE1FVEhPRF9OQU1FKSkgcmV0dXJuIGNhY2hlW01FVEhPRF9OQU1FXTtcbiAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gIHZhciBtZXRob2QgPSBbXVtNRVRIT0RfTkFNRV07XG4gIHZhciBBQ0NFU1NPUlMgPSBoYXMob3B0aW9ucywgJ0FDQ0VTU09SUycpID8gb3B0aW9ucy5BQ0NFU1NPUlMgOiBmYWxzZTtcbiAgdmFyIGFyZ3VtZW50MCA9IGhhcyhvcHRpb25zLCAwKSA/IG9wdGlvbnNbMF0gOiB0aHJvd2VyO1xuICB2YXIgYXJndW1lbnQxID0gaGFzKG9wdGlvbnMsIDEpID8gb3B0aW9uc1sxXSA6IHVuZGVmaW5lZDtcblxuICByZXR1cm4gY2FjaGVbTUVUSE9EX05BTUVdID0gISFtZXRob2QgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoQUNDRVNTT1JTICYmICFERVNDUklQVE9SUykgcmV0dXJuIHRydWU7XG4gICAgdmFyIE8gPSB7IGxlbmd0aDogLTEgfTtcblxuICAgIGlmIChBQ0NFU1NPUlMpIGRlZmluZVByb3BlcnR5KE8sIDEsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiB0aHJvd2VyIH0pO1xuICAgIGVsc2UgT1sxXSA9IDE7XG5cbiAgICBtZXRob2QuY2FsbChPLCBhcmd1bWVudDAsIGFyZ3VtZW50MSk7XG4gIH0pO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbi8vIGBBcnJheVNwZWNpZXNDcmVhdGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXlzcGVjaWVzY3JlYXRlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbEFycmF5LCBsZW5ndGgpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsQXJyYXkpKSB7XG4gICAgQyA9IG9yaWdpbmFsQXJyYXkuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGVsc2UgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gbmV3IChDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEMpKGxlbmd0aCA9PT0gMCA/IDAgOiBsZW5ndGgpO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgb3duS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vd24ta2V5cycpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuICB2YXIga2V5cyA9IG93bktleXMoc291cmNlKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHlNb2R1bGUuZjtcbiAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZS5mO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoIWhhcyh0YXJnZXQsIGtleSkpIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTtcbiAgfVxufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBrZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgMSwgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSlbMV0gIT0gNztcbn0pO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxudmFyIGRvY3VtZW50ID0gZ2xvYmFsLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgRVhJU1RTID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gRVhJU1RTID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBpdGVyYWJsZSBET00gY29sbGVjdGlvbnNcbi8vIGZsYWcgLSBgaXRlcmFibGVgIGludGVyZmFjZSAtICdlbnRyaWVzJywgJ2tleXMnLCAndmFsdWVzJywgJ2ZvckVhY2gnIG1ldGhvZHNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBDU1NSdWxlTGlzdDogMCxcbiAgQ1NTU3R5bGVEZWNsYXJhdGlvbjogMCxcbiAgQ1NTVmFsdWVMaXN0OiAwLFxuICBDbGllbnRSZWN0TGlzdDogMCxcbiAgRE9NUmVjdExpc3Q6IDAsXG4gIERPTVN0cmluZ0xpc3Q6IDAsXG4gIERPTVRva2VuTGlzdDogMSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IDAsXG4gIEZpbGVMaXN0OiAwLFxuICBIVE1MQWxsQ29sbGVjdGlvbjogMCxcbiAgSFRNTENvbGxlY3Rpb246IDAsXG4gIEhUTUxGb3JtRWxlbWVudDogMCxcbiAgSFRNTFNlbGVjdEVsZW1lbnQ6IDAsXG4gIE1lZGlhTGlzdDogMCxcbiAgTWltZVR5cGVBcnJheTogMCxcbiAgTmFtZWROb2RlTWFwOiAwLFxuICBOb2RlTGlzdDogMSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogMCxcbiAgUGx1Z2luOiAwLFxuICBQbHVnaW5BcnJheTogMCxcbiAgU1ZHTGVuZ3RoTGlzdDogMCxcbiAgU1ZHTnVtYmVyTGlzdDogMCxcbiAgU1ZHUGF0aFNlZ0xpc3Q6IDAsXG4gIFNWR1BvaW50TGlzdDogMCxcbiAgU1ZHU3RyaW5nTGlzdDogMCxcbiAgU1ZHVHJhbnNmb3JtTGlzdDogMCxcbiAgU291cmNlQnVmZmVyTGlzdDogMCxcbiAgU3R5bGVTaGVldExpc3Q6IDAsXG4gIFRleHRUcmFja0N1ZUxpc3Q6IDAsXG4gIFRleHRUcmFja0xpc3Q6IDAsXG4gIFRvdWNoTGlzdDogMFxufTtcbiIsIi8vIElFOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdjb25zdHJ1Y3RvcicsXG4gICdoYXNPd25Qcm9wZXJ0eScsXG4gICdpc1Byb3RvdHlwZU9mJyxcbiAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgJ3RvU3RyaW5nJyxcbiAgJ3ZhbHVlT2YnXG5dO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpLmY7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgc2V0R2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwnKTtcbnZhciBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcycpO1xudmFyIGlzRm9yY2VkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCcpO1xuXG4vKlxuICBvcHRpb25zLnRhcmdldCAgICAgIC0gbmFtZSBvZiB0aGUgdGFyZ2V0IG9iamVjdFxuICBvcHRpb25zLmdsb2JhbCAgICAgIC0gdGFyZ2V0IGlzIHRoZSBnbG9iYWwgb2JqZWN0XG4gIG9wdGlvbnMuc3RhdCAgICAgICAgLSBleHBvcnQgYXMgc3RhdGljIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucHJvdG8gICAgICAgLSBleHBvcnQgYXMgcHJvdG90eXBlIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucmVhbCAgICAgICAgLSByZWFsIHByb3RvdHlwZSBtZXRob2QgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLmZvcmNlZCAgICAgIC0gZXhwb3J0IGV2ZW4gaWYgdGhlIG5hdGl2ZSBmZWF0dXJlIGlzIGF2YWlsYWJsZVxuICBvcHRpb25zLmJpbmQgICAgICAgIC0gYmluZCBtZXRob2RzIHRvIHRoZSB0YXJnZXQsIHJlcXVpcmVkIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy53cmFwICAgICAgICAtIHdyYXAgY29uc3RydWN0b3JzIHRvIHByZXZlbnRpbmcgZ2xvYmFsIHBvbGx1dGlvbiwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLnVuc2FmZSAgICAgIC0gdXNlIHRoZSBzaW1wbGUgYXNzaWdubWVudCBvZiBwcm9wZXJ0eSBpbnN0ZWFkIG9mIGRlbGV0ZSArIGRlZmluZVByb3BlcnR5XG4gIG9wdGlvbnMuc2hhbSAgICAgICAgLSBhZGQgYSBmbGFnIHRvIG5vdCBjb21wbGV0ZWx5IGZ1bGwgcG9seWZpbGxzXG4gIG9wdGlvbnMuZW51bWVyYWJsZSAgLSBleHBvcnQgYXMgZW51bWVyYWJsZSBwcm9wZXJ0eVxuICBvcHRpb25zLm5vVGFyZ2V0R2V0IC0gcHJldmVudCBjYWxsaW5nIGEgZ2V0dGVyIG9uIHRhcmdldFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMsIHNvdXJjZSkge1xuICB2YXIgVEFSR0VUID0gb3B0aW9ucy50YXJnZXQ7XG4gIHZhciBHTE9CQUwgPSBvcHRpb25zLmdsb2JhbDtcbiAgdmFyIFNUQVRJQyA9IG9wdGlvbnMuc3RhdDtcbiAgdmFyIEZPUkNFRCwgdGFyZ2V0LCBrZXksIHRhcmdldFByb3BlcnR5LCBzb3VyY2VQcm9wZXJ0eSwgZGVzY3JpcHRvcjtcbiAgaWYgKEdMT0JBTCkge1xuICAgIHRhcmdldCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChTVEFUSUMpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWxbVEFSR0VUXSB8fCBzZXRHbG9iYWwoVEFSR0VULCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0ID0gKGdsb2JhbFtUQVJHRVRdIHx8IHt9KS5wcm90b3R5cGU7XG4gIH1cbiAgaWYgKHRhcmdldCkgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgc291cmNlUHJvcGVydHkgPSBzb3VyY2Vba2V5XTtcbiAgICBpZiAob3B0aW9ucy5ub1RhcmdldEdldCkge1xuICAgICAgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gICAgICB0YXJnZXRQcm9wZXJ0eSA9IGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci52YWx1ZTtcbiAgICB9IGVsc2UgdGFyZ2V0UHJvcGVydHkgPSB0YXJnZXRba2V5XTtcbiAgICBGT1JDRUQgPSBpc0ZvcmNlZChHTE9CQUwgPyBrZXkgOiBUQVJHRVQgKyAoU1RBVElDID8gJy4nIDogJyMnKSArIGtleSwgb3B0aW9ucy5mb3JjZWQpO1xuICAgIC8vIGNvbnRhaW5lZCBpbiB0YXJnZXRcbiAgICBpZiAoIUZPUkNFRCAmJiB0YXJnZXRQcm9wZXJ0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodHlwZW9mIHNvdXJjZVByb3BlcnR5ID09PSB0eXBlb2YgdGFyZ2V0UHJvcGVydHkpIGNvbnRpbnVlO1xuICAgICAgY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyhzb3VyY2VQcm9wZXJ0eSwgdGFyZ2V0UHJvcGVydHkpO1xuICAgIH1cbiAgICAvLyBhZGQgYSBmbGFnIHRvIG5vdCBjb21wbGV0ZWx5IGZ1bGwgcG9seWZpbGxzXG4gICAgaWYgKG9wdGlvbnMuc2hhbSB8fCAodGFyZ2V0UHJvcGVydHkgJiYgdGFyZ2V0UHJvcGVydHkuc2hhbSkpIHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShzb3VyY2VQcm9wZXJ0eSwgJ3NoYW0nLCB0cnVlKTtcbiAgICB9XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzb3VyY2VQcm9wZXJ0eSwgb3B0aW9ucyk7XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwidmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWZ1bmN0aW9uJyk7XG5cbi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCk7XG4gICAgfTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJ2YXIgcGF0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9wYXRoJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG52YXIgYUZ1bmN0aW9uID0gZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFyaWFibGUgPT0gJ2Z1bmN0aW9uJyA/IHZhcmlhYmxlIDogdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBtZXRob2QpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAyID8gYUZ1bmN0aW9uKHBhdGhbbmFtZXNwYWNlXSkgfHwgYUZ1bmN0aW9uKGdsb2JhbFtuYW1lc3BhY2VdKVxuICAgIDogcGF0aFtuYW1lc3BhY2VdICYmIHBhdGhbbmFtZXNwYWNlXVttZXRob2RdIHx8IGdsb2JhbFtuYW1lc3BhY2VdICYmIGdsb2JhbFtuYW1lc3BhY2VdW21ldGhvZF07XG59O1xuIiwidmFyIGNoZWNrID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAmJiBpdC5NYXRoID09IE1hdGggJiYgaXQ7XG59O1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxubW9kdWxlLmV4cG9ydHMgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgY2hlY2sodHlwZW9mIGdsb2JhbFRoaXMgPT0gJ29iamVjdCcgJiYgZ2xvYmFsVGhpcykgfHxcbiAgY2hlY2sodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cpIHx8XG4gIGNoZWNrKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYpIHx8XG4gIGNoZWNrKHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKSB8fFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQnKTtcblxuLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhREVTQ1JJUFRPUlMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjcmVhdGVFbGVtZW50KCdkaXYnKSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9XG4gIH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xuXG52YXIgc3BsaXQgPSAnJy5zcGxpdDtcblxuLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3Ncbm1vZHVsZS5leHBvcnRzID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyB0aHJvd3MgYW4gZXJyb3IgaW4gcmhpbm8sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9yaGluby9pc3N1ZXMvMzQ2XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgcmV0dXJuICFPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKTtcbn0pID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjbGFzc29mKGl0KSA9PSAnU3RyaW5nJyA/IHNwbGl0LmNhbGwoaXQsICcnKSA6IE9iamVjdChpdCk7XG59IDogT2JqZWN0O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xuXG52YXIgZnVuY3Rpb25Ub1N0cmluZyA9IEZ1bmN0aW9uLnRvU3RyaW5nO1xuXG4vLyB0aGlzIGhlbHBlciBicm9rZW4gaW4gYDMuNC4xLTMuNC40YCwgc28gd2UgY2FuJ3QgdXNlIGBzaGFyZWRgIGhlbHBlclxuaWYgKHR5cGVvZiBzdG9yZS5pbnNwZWN0U291cmNlICE9ICdmdW5jdGlvbicpIHtcbiAgc3RvcmUuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBmdW5jdGlvblRvU3RyaW5nLmNhbGwoaXQpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlLmluc3BlY3RTb3VyY2U7XG4iLCJ2YXIgTkFUSVZFX1dFQUtfTUFQID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL25hdGl2ZS13ZWFrLW1hcCcpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgb2JqZWN0SGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHNoYXJlZEtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQta2V5Jyk7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xudmFyIHNldCwgZ2V0LCBoYXM7XG5cbnZhciBlbmZvcmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBoYXMoaXQpID8gZ2V0KGl0KSA6IHNldChpdCwge30pO1xufTtcblxudmFyIGdldHRlckZvciA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXQpIHtcbiAgICB2YXIgc3RhdGU7XG4gICAgaWYgKCFpc09iamVjdChpdCkgfHwgKHN0YXRlID0gZ2V0KGl0KSkudHlwZSAhPT0gVFlQRSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCcpO1xuICAgIH0gcmV0dXJuIHN0YXRlO1xuICB9O1xufTtcblxuaWYgKE5BVElWRV9XRUFLX01BUCkge1xuICB2YXIgc3RvcmUgPSBuZXcgV2Vha01hcCgpO1xuICB2YXIgd21nZXQgPSBzdG9yZS5nZXQ7XG4gIHZhciB3bWhhcyA9IHN0b3JlLmhhcztcbiAgdmFyIHdtc2V0ID0gc3RvcmUuc2V0O1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgd21zZXQuY2FsbChzdG9yZSwgaXQsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWdldC5jYWxsKHN0b3JlLCBpdCkgfHwge307XG4gIH07XG4gIGhhcyA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWhhcy5jYWxsKHN0b3JlLCBpdCk7XG4gIH07XG59IGVsc2Uge1xuICB2YXIgU1RBVEUgPSBzaGFyZWRLZXkoJ3N0YXRlJyk7XG4gIGhpZGRlbktleXNbU1RBVEVdID0gdHJ1ZTtcbiAgc2V0ID0gZnVuY3Rpb24gKGl0LCBtZXRhZGF0YSkge1xuICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShpdCwgU1RBVEUsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBvYmplY3RIYXMoaXQsIFNUQVRFKSA/IGl0W1NUQVRFXSA6IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gb2JqZWN0SGFzKGl0LCBTVEFURSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldCxcbiAgZ2V0OiBnZXQsXG4gIGhhczogaGFzLFxuICBlbmZvcmNlOiBlbmZvcmNlLFxuICBnZXR0ZXJGb3I6IGdldHRlckZvclxufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbi8vIGBJc0FycmF5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzYXJyYXlcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY2xhc3NvZihhcmcpID09ICdBcnJheSc7XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbnZhciByZXBsYWNlbWVudCA9IC8jfFxcLnByb3RvdHlwZVxcLi87XG5cbnZhciBpc0ZvcmNlZCA9IGZ1bmN0aW9uIChmZWF0dXJlLCBkZXRlY3Rpb24pIHtcbiAgdmFyIHZhbHVlID0gZGF0YVtub3JtYWxpemUoZmVhdHVyZSldO1xuICByZXR1cm4gdmFsdWUgPT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PSBOQVRJVkUgPyBmYWxzZVxuICAgIDogdHlwZW9mIGRldGVjdGlvbiA9PSAnZnVuY3Rpb24nID8gZmFpbHMoZGV0ZWN0aW9uKVxuICAgIDogISFkZXRlY3Rpb247XG59O1xuXG52YXIgbm9ybWFsaXplID0gaXNGb3JjZWQubm9ybWFsaXplID0gZnVuY3Rpb24gKHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZShyZXBsYWNlbWVudCwgJy4nKS50b0xvd2VyQ2FzZSgpO1xufTtcblxudmFyIGRhdGEgPSBpc0ZvcmNlZC5kYXRhID0ge307XG52YXIgTkFUSVZFID0gaXNGb3JjZWQuTkFUSVZFID0gJ04nO1xudmFyIFBPTFlGSUxMID0gaXNGb3JjZWQuUE9MWUZJTEwgPSAnUCc7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGb3JjZWQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gQ2hyb21lIDM4IFN5bWJvbCBoYXMgaW5jb3JyZWN0IHRvU3RyaW5nIGNvbnZlcnNpb25cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHJldHVybiAhU3RyaW5nKFN5bWJvbCgpKTtcbn0pO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpbnNwZWN0U291cmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlJyk7XG5cbnZhciBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIFdlYWtNYXAgPT09ICdmdW5jdGlvbicgJiYgL25hdGl2ZSBjb2RlLy50ZXN0KGluc3BlY3RTb3VyY2UoV2Vha01hcCkpO1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcblxudmFyIG5hdGl2ZURlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyBuYXRpdmVEZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcblxudmFyIG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApIHtcbiAgTyA9IHRvSW5kZXhlZE9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoaGFzKE8sIFApKSByZXR1cm4gY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKCFwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsInZhciBpbnRlcm5hbE9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzJyk7XG5cbnZhciBoaWRkZW5LZXlzID0gZW51bUJ1Z0tleXMuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHluYW1lc1xuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgaW5kZXhPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pbmNsdWRlcycpLmluZGV4T2Y7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSAhaGFzKGhpZGRlbktleXMsIGtleSkgJiYgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5pbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIG5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gTmFzaG9ybiB+IEpESzggYnVnXG52YXIgTkFTSE9STl9CVUcgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgIW5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoeyAxOiAyIH0sIDEpO1xuXG4vLyBgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZWAgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QucHJvdG90eXBlLnByb3BlcnR5aXNlbnVtZXJhYmxlXG5leHBvcnRzLmYgPSBOQVNIT1JOX0JVRyA/IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKFYpIHtcbiAgdmFyIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcywgVik7XG4gIHJldHVybiAhIWRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5lbnVtZXJhYmxlO1xufSA6IG5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwidmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcycpO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbi8vIGFsbCBvYmplY3Qga2V5cywgaW5jbHVkZXMgbm9uLWVudW1lcmFibGUgYW5kIHN5bWJvbHNcbm1vZHVsZS5leHBvcnRzID0gZ2V0QnVpbHRJbignUmVmbGVjdCcsICdvd25LZXlzJykgfHwgZnVuY3Rpb24gb3duS2V5cyhpdCkge1xuICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUuZihhbk9iamVjdChpdCkpO1xuICB2YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlLmY7XG4gIHJldHVybiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPyBrZXlzLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpKSA6IGtleXM7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgc2V0R2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwnKTtcbnZhciBpbnNwZWN0U291cmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xuXG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyIGVuZm9yY2VJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5lbmZvcmNlO1xudmFyIFRFTVBMQVRFID0gU3RyaW5nKFN0cmluZykuc3BsaXQoJ1N0cmluZycpO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgdW5zYWZlID0gb3B0aW9ucyA/ICEhb3B0aW9ucy51bnNhZmUgOiBmYWxzZTtcbiAgdmFyIHNpbXBsZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMuZW51bWVyYWJsZSA6IGZhbHNlO1xuICB2YXIgbm9UYXJnZXRHZXQgPSBvcHRpb25zID8gISFvcHRpb25zLm5vVGFyZ2V0R2V0IDogZmFsc2U7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICh0eXBlb2Yga2V5ID09ICdzdHJpbmcnICYmICFoYXModmFsdWUsICduYW1lJykpIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSh2YWx1ZSwgJ25hbWUnLCBrZXkpO1xuICAgIGVuZm9yY2VJbnRlcm5hbFN0YXRlKHZhbHVlKS5zb3VyY2UgPSBURU1QTEFURS5qb2luKHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBrZXkgOiAnJyk7XG4gIH1cbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICAgIGVsc2Ugc2V0R2xvYmFsKGtleSwgdmFsdWUpO1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmICghdW5zYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgfSBlbHNlIGlmICghbm9UYXJnZXRHZXQgJiYgT1trZXldKSB7XG4gICAgc2ltcGxlID0gdHJ1ZTtcbiAgfVxuICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgZWxzZSBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoTywga2V5LCB2YWx1ZSk7XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIGdldEludGVybmFsU3RhdGUodGhpcykuc291cmNlIHx8IGluc3BlY3RTb3VyY2UodGhpcyk7XG59KTtcbiIsIi8vIGBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlcXVpcmVvYmplY3Rjb2VyY2libGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdHJ5IHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoZ2xvYmFsLCBrZXksIHZhbHVlKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBnbG9iYWxba2V5XSA9IHZhbHVlO1xuICB9IHJldHVybiB2YWx1ZTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZCcpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcblxudmFyIGtleXMgPSBzaGFyZWQoJ2tleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBrZXlzW2tleV0gfHwgKGtleXNba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHNldEdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtZ2xvYmFsJyk7XG5cbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IHNldEdsb2JhbChTSEFSRUQsIHt9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZTtcbiIsInZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246ICczLjYuNScsXG4gIG1vZGU6IElTX1BVUkUgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAyMCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgd2hpdGVzcGFjZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2hpdGVzcGFjZXMnKTtcblxudmFyIG5vbiA9ICdcXHUyMDBCXFx1MDA4NVxcdTE4MEUnO1xuXG4vLyBjaGVjayB0aGF0IGEgbWV0aG9kIHdvcmtzIHdpdGggdGhlIGNvcnJlY3QgbGlzdFxuLy8gb2Ygd2hpdGVzcGFjZXMgYW5kIGhhcyBhIGNvcnJlY3QgbmFtZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgcmV0dXJuIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gISF3aGl0ZXNwYWNlc1tNRVRIT0RfTkFNRV0oKSB8fCBub25bTUVUSE9EX05BTUVdKCkgIT0gbm9uIHx8IHdoaXRlc3BhY2VzW01FVEhPRF9OQU1FXS5uYW1lICE9PSBNRVRIT0RfTkFNRTtcbiAgfSk7XG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG52YXIgd2hpdGVzcGFjZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2hpdGVzcGFjZXMnKTtcblxudmFyIHdoaXRlc3BhY2UgPSAnWycgKyB3aGl0ZXNwYWNlcyArICddJztcbnZhciBsdHJpbSA9IFJlZ0V4cCgnXicgKyB3aGl0ZXNwYWNlICsgd2hpdGVzcGFjZSArICcqJyk7XG52YXIgcnRyaW0gPSBSZWdFeHAod2hpdGVzcGFjZSArIHdoaXRlc3BhY2UgKyAnKiQnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUueyB0cmltLCB0cmltU3RhcnQsIHRyaW1FbmQsIHRyaW1MZWZ0LCB0cmltUmlnaHQgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUoJHRoaXMpKTtcbiAgICBpZiAoVFlQRSAmIDEpIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKGx0cmltLCAnJyk7XG4gICAgaWYgKFRZUEUgJiAyKSBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShydHJpbSwgJycpO1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUueyB0cmltTGVmdCwgdHJpbVN0YXJ0IH1gIG1ldGhvZHNcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS50cmltc3RhcnRcbiAgc3RhcnQ6IGNyZWF0ZU1ldGhvZCgxKSxcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUueyB0cmltUmlnaHQsIHRyaW1FbmQgfWAgbWV0aG9kc1xuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1lbmRcbiAgZW5kOiBjcmVhdGVNZXRob2QoMiksXG4gIC8vIGBTdHJpbmcucHJvdG90eXBlLnRyaW1gIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1cbiAgdHJpbTogY3JlYXRlTWV0aG9kKDMpXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyJyk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gSGVscGVyIGZvciBhIHBvcHVsYXIgcmVwZWF0aW5nIGNhc2Ugb2YgdGhlIHNwZWM6XG4vLyBMZXQgaW50ZWdlciBiZSA/IFRvSW50ZWdlcihpbmRleCkuXG4vLyBJZiBpbnRlZ2VyIDwgMCwgbGV0IHJlc3VsdCBiZSBtYXgoKGxlbmd0aCArIGludGVnZXIpLCAwKTsgZWxzZSBsZXQgcmVzdWx0IGJlIG1pbihpbnRlZ2VyLCBsZW5ndGgpLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICB2YXIgaW50ZWdlciA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbnRlZ2VyIDwgMCA/IG1heChpbnRlZ2VyICsgbGVuZ3RoLCAwKSA6IG1pbihpbnRlZ2VyLCBsZW5ndGgpO1xufTtcbiIsIi8vIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJbmRleGVkT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoaXQpKTtcbn07XG4iLCJ2YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBUb0ludGVnZXJgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9pbnRlZ2VyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gaXNOYU4oYXJndW1lbnQgPSArYXJndW1lbnQpID8gMCA6IChhcmd1bWVudCA+IDAgPyBmbG9vciA6IGNlaWwpKGFyZ3VtZW50KTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcblxudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBgVG9MZW5ndGhgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBhcmd1bWVudCA+IDAgPyBtaW4odG9JbnRlZ2VyKGFyZ3VtZW50KSwgMHgxRkZGRkZGRkZGRkZGRikgOiAwOyAvLyAyICoqIDUzIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbi8vIGBUb09iamVjdGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b29iamVjdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIE9iamVjdChyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KSk7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG4vLyBgVG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9wcmltaXRpdmVcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5wdXQsIFBSRUZFUlJFRF9TVFJJTkcpIHtcbiAgaWYgKCFpc09iamVjdChpbnB1dCkpIHJldHVybiBpbnB1dDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChQUkVGRVJSRURfU1RSSU5HICYmIHR5cGVvZiAoZm4gPSBpbnB1dC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGlucHV0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFQUkVGRVJSRURfU1RSSU5HICYmIHR5cGVvZiAoZm4gPSBpbnB1dC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcgKyBTdHJpbmcoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSkgKyAnKV8nICsgKCsraWQgKyBwb3N0Zml4KS50b1N0cmluZygzNik7XG59O1xuIiwidmFyIE5BVElWRV9TWU1CT0wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5BVElWRV9TWU1CT0xcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICYmICFTeW1ib2wuc2hhbVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJztcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG52YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtc3ltYm9sJyk7XG52YXIgVVNFX1NZTUJPTF9BU19VSUQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdXNlLXN5bWJvbC1hcy11aWQnKTtcblxudmFyIFdlbGxLbm93blN5bWJvbHNTdG9yZSA9IHNoYXJlZCgnd2tzJyk7XG52YXIgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbnZhciBjcmVhdGVXZWxsS25vd25TeW1ib2wgPSBVU0VfU1lNQk9MX0FTX1VJRCA/IFN5bWJvbCA6IFN5bWJvbCAmJiBTeW1ib2wud2l0aG91dFNldHRlciB8fCB1aWQ7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgaWYgKCFoYXMoV2VsbEtub3duU3ltYm9sc1N0b3JlLCBuYW1lKSkge1xuICAgIGlmIChOQVRJVkVfU1lNQk9MICYmIGhhcyhTeW1ib2wsIG5hbWUpKSBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPSBTeW1ib2xbbmFtZV07XG4gICAgZWxzZSBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPSBjcmVhdGVXZWxsS25vd25TeW1ib2woJ1N5bWJvbC4nICsgbmFtZSk7XG4gIH0gcmV0dXJuIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXTtcbn07XG4iLCIvLyBhIHN0cmluZyBvZiBhbGwgdmFsaWQgdW5pY29kZSB3aGl0ZXNwYWNlc1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbm1vZHVsZS5leHBvcnRzID0gJ1xcdTAwMDlcXHUwMDBBXFx1MDAwQlxcdTAwMENcXHUwMDBEXFx1MDAyMFxcdTAwQTBcXHUxNjgwXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4XFx1MjAyOVxcdUZFRkYnO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1mb3ItZWFjaCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IFtdLmZvckVhY2ggIT0gZm9yRWFjaCB9LCB7XG4gIGZvckVhY2g6IGZvckVhY2hcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgJGluZGV4T2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMnKS5pbmRleE9mO1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xudmFyIGFycmF5TWV0aG9kVXNlc1RvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LW1ldGhvZC11c2VzLXRvLWxlbmd0aCcpO1xuXG52YXIgbmF0aXZlSW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbnZhciBORUdBVElWRV9aRVJPID0gISFuYXRpdmVJbmRleE9mICYmIDEgLyBbMV0uaW5kZXhPZigxLCAtMCkgPCAwO1xudmFyIFNUUklDVF9NRVRIT0QgPSBhcnJheU1ldGhvZElzU3RyaWN0KCdpbmRleE9mJyk7XG52YXIgVVNFU19UT19MRU5HVEggPSBhcnJheU1ldGhvZFVzZXNUb0xlbmd0aCgnaW5kZXhPZicsIHsgQUNDRVNTT1JTOiB0cnVlLCAxOiAwIH0pO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluZGV4b2ZcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IE5FR0FUSVZFX1pFUk8gfHwgIVNUUklDVF9NRVRIT0QgfHwgIVVTRVNfVE9fTEVOR1RIIH0sIHtcbiAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50IC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiBORUdBVElWRV9aRVJPXG4gICAgICAvLyBjb252ZXJ0IC0wIHRvICswXG4gICAgICA/IG5hdGl2ZUluZGV4T2YuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCAwXG4gICAgICA6ICRpbmRleE9mKHRoaXMsIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkdHJpbSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctdHJpbScpLnRyaW07XG52YXIgZm9yY2VkU3RyaW5nVHJpbU1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctdHJpbS1mb3JjZWQnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUudHJpbWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1cbiQoeyB0YXJnZXQ6ICdTdHJpbmcnLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBmb3JjZWRTdHJpbmdUcmltTWV0aG9kKCd0cmltJykgfSwge1xuICB0cmltOiBmdW5jdGlvbiB0cmltKCkge1xuICAgIHJldHVybiAkdHJpbSh0aGlzKTtcbiAgfVxufSk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIERPTUl0ZXJhYmxlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb20taXRlcmFibGVzJyk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1mb3ItZWFjaCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcblxuZm9yICh2YXIgQ09MTEVDVElPTl9OQU1FIGluIERPTUl0ZXJhYmxlcykge1xuICB2YXIgQ29sbGVjdGlvbiA9IGdsb2JhbFtDT0xMRUNUSU9OX05BTUVdO1xuICB2YXIgQ29sbGVjdGlvblByb3RvdHlwZSA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIC8vIHNvbWUgQ2hyb21lIHZlcnNpb25zIGhhdmUgbm9uLWNvbmZpZ3VyYWJsZSBtZXRob2RzIG9uIERPTVRva2VuTGlzdFxuICBpZiAoQ29sbGVjdGlvblByb3RvdHlwZSAmJiBDb2xsZWN0aW9uUHJvdG90eXBlLmZvckVhY2ggIT09IGZvckVhY2gpIHRyeSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KENvbGxlY3Rpb25Qcm90b3R5cGUsICdmb3JFYWNoJywgZm9yRWFjaCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ29sbGVjdGlvblByb3RvdHlwZS5mb3JFYWNoID0gZm9yRWFjaDtcbiAgfVxufVxuIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGk6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bDogZmFsc2UsXG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuLyoqKioqKi8gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4vKioqKioqLyBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4vKioqKioqLyBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4vKioqKioqLyBcdFx0XHRcdGdldDogZ2V0dGVyXG4vKioqKioqLyBcdFx0XHR9KTtcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbi8qKioqKiovIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbi8qKioqKiovIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4vKioqKioqLyBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbi8qKioqKiovIFx0XHRyZXR1cm4gZ2V0dGVyO1xuLyoqKioqKi8gXHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNyk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgLyogZ2xvYmFscyBqUXVlcnkgKi9cblxuZXhwb3J0cy5sb3J5ID0gbG9yeTtcblxudmFyIF9kZXRlY3RQcmVmaXhlcyA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cbnZhciBfZGV0ZWN0UHJlZml4ZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGV0ZWN0UHJlZml4ZXMpO1xuXG52YXIgX2RldGVjdFN1cHBvcnRzUGFzc2l2ZSA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5cbnZhciBfZGV0ZWN0U3VwcG9ydHNQYXNzaXZlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RldGVjdFN1cHBvcnRzUGFzc2l2ZSk7XG5cbnZhciBfZGlzcGF0Y2hFdmVudCA9IF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cbnZhciBfZGlzcGF0Y2hFdmVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaXNwYXRjaEV2ZW50KTtcblxudmFyIF9kZWZhdWx0cyA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cbnZhciBfZGVmYXVsdHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmYXVsdHMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIGxvcnkoc2xpZGVyLCBvcHRzKSB7XG4gICAgdmFyIHBvc2l0aW9uID0gdm9pZCAwO1xuICAgIHZhciBzbGlkZXNXaWR0aCA9IHZvaWQgMDtcbiAgICB2YXIgZnJhbWVXaWR0aCA9IHZvaWQgMDtcbiAgICB2YXIgc2xpZGVzID0gdm9pZCAwO1xuXG4gICAgLyoqXG4gICAgICogc2xpZGVyIERPTSBlbGVtZW50c1xuICAgICAqL1xuICAgIHZhciBmcmFtZSA9IHZvaWQgMDtcbiAgICB2YXIgc2xpZGVDb250YWluZXIgPSB2b2lkIDA7XG4gICAgdmFyIHByZXZDdHJsID0gdm9pZCAwO1xuICAgIHZhciBuZXh0Q3RybCA9IHZvaWQgMDtcbiAgICB2YXIgcHJlZml4ZXMgPSB2b2lkIDA7XG4gICAgdmFyIHRyYW5zaXRpb25FbmRDYWxsYmFjayA9IHZvaWQgMDtcblxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgdG91Y2hFdmVudFBhcmFtcyA9ICgwLCBfZGV0ZWN0U3VwcG9ydHNQYXNzaXZlMi5kZWZhdWx0KSgpID8geyBwYXNzaXZlOiB0cnVlIH0gOiBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIGlmIG9iamVjdCBpcyBqUXVlcnkgY29udmVydCB0byBuYXRpdmUgRE9NIGVsZW1lbnRcbiAgICAgKi9cbiAgICBpZiAodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcgJiYgc2xpZGVyIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG4gICAgICAgIHNsaWRlciA9IHNsaWRlclswXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwcml2YXRlXG4gICAgICogc2V0IGFjdGl2ZSBjbGFzcyB0byBlbGVtZW50IHdoaWNoIGlzIHRoZSBjdXJyZW50IHNsaWRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0QWN0aXZlRWxlbWVudChzbGlkZXMsIGN1cnJlbnRJbmRleCkge1xuICAgICAgICB2YXIgX29wdGlvbnMgPSBvcHRpb25zLFxuICAgICAgICAgICAgY2xhc3NOYW1lQWN0aXZlU2xpZGUgPSBfb3B0aW9ucy5jbGFzc05hbWVBY3RpdmVTbGlkZTtcblxuXG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZUFjdGl2ZVNsaWRlKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWVBY3RpdmVTbGlkZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNsaWRlc1tjdXJyZW50SW5kZXhdLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lQWN0aXZlU2xpZGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHByaXZhdGVcbiAgICAgKiBzZXR1cEluZmluaXRlOiBmdW5jdGlvbiB0byBzZXR1cCBpZiBpbmZpbml0ZSBpcyBzZXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge2FycmF5fSBzbGlkZUFycmF5XG4gICAgICogQHJldHVybiB7YXJyYXl9IGFycmF5IG9mIHVwZGF0ZWQgc2xpZGVDb250YWluZXIgZWxlbWVudHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXR1cEluZmluaXRlKHNsaWRlQXJyYXkpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zMiA9IG9wdGlvbnMsXG4gICAgICAgICAgICBpbmZpbml0ZSA9IF9vcHRpb25zMi5pbmZpbml0ZTtcblxuXG4gICAgICAgIHZhciBmcm9udCA9IHNsaWRlQXJyYXkuc2xpY2UoMCwgaW5maW5pdGUpO1xuICAgICAgICB2YXIgYmFjayA9IHNsaWRlQXJyYXkuc2xpY2Uoc2xpZGVBcnJheS5sZW5ndGggLSBpbmZpbml0ZSwgc2xpZGVBcnJheS5sZW5ndGgpO1xuXG4gICAgICAgIGZyb250LmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZWQgPSBlbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICAgICAgc2xpZGVDb250YWluZXIuYXBwZW5kQ2hpbGQoY2xvbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYmFjay5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGNsb25lZCA9IGVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgICAgICBzbGlkZUNvbnRhaW5lci5pbnNlcnRCZWZvcmUoY2xvbmVkLCBzbGlkZUNvbnRhaW5lci5maXJzdENoaWxkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2xpZGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwcmVmaXhlcy50cmFuc2l0aW9uRW5kLCBvblRyYW5zaXRpb25FbmQpO1xuXG4gICAgICAgIHJldHVybiBzbGljZS5jYWxsKHNsaWRlQ29udGFpbmVyLmNoaWxkcmVuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBbZGlzcGF0Y2hTbGlkZXJFdmVudCBkZXNjcmlwdGlvbl1cbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXNwYXRjaFNsaWRlckV2ZW50KHBoYXNlLCB0eXBlLCBkZXRhaWwpIHtcbiAgICAgICAgKDAsIF9kaXNwYXRjaEV2ZW50Mi5kZWZhdWx0KShzbGlkZXIsIHBoYXNlICsgJy5sb3J5LicgKyB0eXBlLCBkZXRhaWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRyYW5zbGF0ZXMgdG8gYSBnaXZlbiBwb3NpdGlvbiBpbiBhIGdpdmVuIHRpbWUgaW4gbWlsbGlzZWNvbmRzXG4gICAgICpcbiAgICAgKiBAdG8gICAgICAgIHtudW1iZXJ9IG51bWJlciBpbiBwaXhlbHMgd2hlcmUgdG8gdHJhbnNsYXRlIHRvXG4gICAgICogQGR1cmF0aW9uICB7bnVtYmVyfSB0aW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHRyYW5zaXN0aW9uXG4gICAgICogQGVhc2UgICAgICB7c3RyaW5nfSBlYXNpbmcgY3NzIHByb3BlcnR5XG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKHRvLCBkdXJhdGlvbiwgZWFzZSkge1xuICAgICAgICB2YXIgc3R5bGUgPSBzbGlkZUNvbnRhaW5lciAmJiBzbGlkZUNvbnRhaW5lci5zdHlsZTtcblxuICAgICAgICBpZiAoc3R5bGUpIHtcbiAgICAgICAgICAgIHN0eWxlW3ByZWZpeGVzLnRyYW5zaXRpb24gKyAnVGltaW5nRnVuY3Rpb24nXSA9IGVhc2U7XG4gICAgICAgICAgICBzdHlsZVtwcmVmaXhlcy50cmFuc2l0aW9uICsgJ0R1cmF0aW9uJ10gPSBkdXJhdGlvbiArICdtcyc7XG4gICAgICAgICAgICBzdHlsZVtwcmVmaXhlcy50cmFuc2Zvcm1dID0gJ3RyYW5zbGF0ZVgoJyArIHRvICsgJ3B4KSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGFuIGVsZW1lbnQncyB3aWR0aFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVsZW1lbnRXaWR0aChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIHx8IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xpZGVmdW5jdGlvbiBjYWxsZWQgYnkgcHJldiwgbmV4dCAmIHRvdWNoZW5kXG4gICAgICpcbiAgICAgKiBkZXRlcm1pbmUgbmV4dEluZGV4IGFuZCBzbGlkZSB0byBuZXh0IHBvc3Rpb25cbiAgICAgKiB1bmRlciByZXN0cmljdGlvbnMgb2YgdGhlIGRlZmluZWQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQGRpcmVjdGlvbiAge2Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gc2xpZGUobmV4dEluZGV4LCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIF9vcHRpb25zMyA9IG9wdGlvbnMsXG4gICAgICAgICAgICBzbGlkZVNwZWVkID0gX29wdGlvbnMzLnNsaWRlU3BlZWQsXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbCA9IF9vcHRpb25zMy5zbGlkZXNUb1Njcm9sbCxcbiAgICAgICAgICAgIGluZmluaXRlID0gX29wdGlvbnMzLmluZmluaXRlLFxuICAgICAgICAgICAgcmV3aW5kID0gX29wdGlvbnMzLnJld2luZCxcbiAgICAgICAgICAgIHJld2luZFByZXYgPSBfb3B0aW9uczMucmV3aW5kUHJldixcbiAgICAgICAgICAgIHJld2luZFNwZWVkID0gX29wdGlvbnMzLnJld2luZFNwZWVkLFxuICAgICAgICAgICAgZWFzZSA9IF9vcHRpb25zMy5lYXNlLFxuICAgICAgICAgICAgY2xhc3NOYW1lQWN0aXZlU2xpZGUgPSBfb3B0aW9uczMuY2xhc3NOYW1lQWN0aXZlU2xpZGUsXG4gICAgICAgICAgICBfb3B0aW9uczMkY2xhc3NOYW1lRGkgPSBfb3B0aW9uczMuY2xhc3NOYW1lRGlzYWJsZWROZXh0Q3RybCxcbiAgICAgICAgICAgIGNsYXNzTmFtZURpc2FibGVkTmV4dEN0cmwgPSBfb3B0aW9uczMkY2xhc3NOYW1lRGkgPT09IHVuZGVmaW5lZCA/ICdkaXNhYmxlZCcgOiBfb3B0aW9uczMkY2xhc3NOYW1lRGksXG4gICAgICAgICAgICBfb3B0aW9uczMkY2xhc3NOYW1lRGkyID0gX29wdGlvbnMzLmNsYXNzTmFtZURpc2FibGVkUHJldkN0cmwsXG4gICAgICAgICAgICBjbGFzc05hbWVEaXNhYmxlZFByZXZDdHJsID0gX29wdGlvbnMzJGNsYXNzTmFtZURpMiA9PT0gdW5kZWZpbmVkID8gJ2Rpc2FibGVkJyA6IF9vcHRpb25zMyRjbGFzc05hbWVEaTI7XG5cblxuICAgICAgICB2YXIgZHVyYXRpb24gPSBzbGlkZVNwZWVkO1xuXG4gICAgICAgIHZhciBuZXh0U2xpZGUgPSBkaXJlY3Rpb24gPyBpbmRleCArIDEgOiBpbmRleCAtIDE7XG4gICAgICAgIHZhciBtYXhPZmZzZXQgPSBNYXRoLnJvdW5kKHNsaWRlc1dpZHRoIC0gZnJhbWVXaWR0aCk7XG5cbiAgICAgICAgZGlzcGF0Y2hTbGlkZXJFdmVudCgnYmVmb3JlJywgJ3NsaWRlJywge1xuICAgICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgbmV4dFNsaWRlOiBuZXh0U2xpZGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2V0IGNvbnRyb2wgY2xhc3Nlc1xuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHByZXZDdHJsKSB7XG4gICAgICAgICAgICBwcmV2Q3RybC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZURpc2FibGVkUHJldkN0cmwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXh0Q3RybCkge1xuICAgICAgICAgICAgbmV4dEN0cmwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWVEaXNhYmxlZE5leHRDdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgbmV4dEluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGlmIChpbmZpbml0ZSAmJiBpbmRleCArIGluZmluaXRlICogMiAhPT0gc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0SW5kZXggPSBpbmRleCArIChpbmZpbml0ZSAtIGluZGV4ICUgaW5maW5pdGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJbmRleCA9IGluZGV4ICsgc2xpZGVzVG9TY3JvbGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5maW5pdGUgJiYgaW5kZXggJSBpbmZpbml0ZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0SW5kZXggPSBpbmRleCAtIGluZGV4ICUgaW5maW5pdGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEluZGV4ID0gaW5kZXggLSBzbGlkZXNUb1Njcm9sbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0SW5kZXggPSBNYXRoLm1pbihNYXRoLm1heChuZXh0SW5kZXgsIDApLCBzbGlkZXMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgaWYgKGluZmluaXRlICYmIGRpcmVjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXh0SW5kZXggKz0gaW5maW5pdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV3aW5kUHJldiAmJiBNYXRoLmFicyhwb3NpdGlvbi54KSA9PT0gMCAmJiBkaXJlY3Rpb24gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBuZXh0SW5kZXggPSBzbGlkZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0gcmV3aW5kU3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV4dE9mZnNldCA9IE1hdGgubWluKE1hdGgubWF4KHNsaWRlc1tuZXh0SW5kZXhdLm9mZnNldExlZnQgKiAtMSwgbWF4T2Zmc2V0ICogLTEpLCAwKTtcblxuICAgICAgICBpZiAocmV3aW5kICYmIE1hdGguYWJzKHBvc2l0aW9uLngpID09PSBtYXhPZmZzZXQgJiYgZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBuZXh0T2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIG5leHRJbmRleCA9IDA7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHJld2luZFNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRyYW5zbGF0ZSB0byB0aGUgbmV4dE9mZnNldCBieSBhIGRlZmluZWQgZHVyYXRpb24gYW5kIGVhc2UgZnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIHRyYW5zbGF0ZShuZXh0T2Zmc2V0LCBkdXJhdGlvbiwgZWFzZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHVwZGF0ZSB0aGUgcG9zaXRpb24gd2l0aCB0aGUgbmV4dCBwb3NpdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgcG9zaXRpb24ueCA9IG5leHRPZmZzZXQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHVwZGF0ZSB0aGUgaW5kZXggd2l0aCB0aGUgbmV4dEluZGV4IG9ubHkgaWZcbiAgICAgICAgICogdGhlIG9mZnNldCBvZiB0aGUgbmV4dEluZGV4IGlzIGluIHRoZSByYW5nZSBvZiB0aGUgbWF4T2Zmc2V0XG4gICAgICAgICAqL1xuICAgICAgICBpZiAoc2xpZGVzW25leHRJbmRleF0ub2Zmc2V0TGVmdCA8PSBtYXhPZmZzZXQpIHtcbiAgICAgICAgICAgIGluZGV4ID0gbmV4dEluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZmluaXRlICYmIChuZXh0SW5kZXggPT09IHNsaWRlcy5sZW5ndGggLSBpbmZpbml0ZSB8fCBuZXh0SW5kZXggPT09IHNsaWRlcy5sZW5ndGggLSBzbGlkZXMubGVuZ3RoICUgaW5maW5pdGUgfHwgbmV4dEluZGV4ID09PSAwKSkge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5maW5pdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBzbGlkZXMubGVuZ3RoIC0gaW5maW5pdGUgKiAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb3NpdGlvbi54ID0gc2xpZGVzW2luZGV4XS5vZmZzZXRMZWZ0ICogLTE7XG5cbiAgICAgICAgICAgIHRyYW5zaXRpb25FbmRDYWxsYmFjayA9IGZ1bmN0aW9uIHRyYW5zaXRpb25FbmRDYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoc2xpZGVzW2luZGV4XS5vZmZzZXRMZWZ0ICogLTEsIDAsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZUFjdGl2ZVNsaWRlKSB7XG4gICAgICAgICAgICBzZXRBY3RpdmVFbGVtZW50KHNsaWNlLmNhbGwoc2xpZGVzKSwgaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHVwZGF0ZSBjbGFzc2VzIGZvciBuZXh0IGFuZCBwcmV2IGFycm93c1xuICAgICAgICAgKiBiYXNlZCBvbiB1c2VyIHNldHRpbmdzXG4gICAgICAgICAqL1xuICAgICAgICBpZiAocHJldkN0cmwgJiYgIWluZmluaXRlICYmICFyZXdpbmRQcmV2ICYmIG5leHRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgcHJldkN0cmwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWVEaXNhYmxlZFByZXZDdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0Q3RybCAmJiAhaW5maW5pdGUgJiYgIXJld2luZCAmJiBuZXh0SW5kZXggKyAxID09PSBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXh0Q3RybC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZURpc2FibGVkTmV4dEN0cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlzcGF0Y2hTbGlkZXJFdmVudCgnYWZ0ZXInLCAnc2xpZGUnLCB7XG4gICAgICAgICAgICBjdXJyZW50U2xpZGU6IGluZGV4XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHB1YmxpY1xuICAgICAqIHNldHVwIGZ1bmN0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICAgIGRpc3BhdGNoU2xpZGVyRXZlbnQoJ2JlZm9yZScsICdpbml0Jyk7XG5cbiAgICAgICAgcHJlZml4ZXMgPSAoMCwgX2RldGVjdFByZWZpeGVzMi5kZWZhdWx0KSgpO1xuICAgICAgICBvcHRpb25zID0gX2V4dGVuZHMoe30sIF9kZWZhdWx0czIuZGVmYXVsdCwgb3B0cyk7XG5cbiAgICAgICAgdmFyIF9vcHRpb25zNCA9IG9wdGlvbnMsXG4gICAgICAgICAgICBjbGFzc05hbWVGcmFtZSA9IF9vcHRpb25zNC5jbGFzc05hbWVGcmFtZSxcbiAgICAgICAgICAgIGNsYXNzTmFtZVNsaWRlQ29udGFpbmVyID0gX29wdGlvbnM0LmNsYXNzTmFtZVNsaWRlQ29udGFpbmVyLFxuICAgICAgICAgICAgY2xhc3NOYW1lUHJldkN0cmwgPSBfb3B0aW9uczQuY2xhc3NOYW1lUHJldkN0cmwsXG4gICAgICAgICAgICBjbGFzc05hbWVOZXh0Q3RybCA9IF9vcHRpb25zNC5jbGFzc05hbWVOZXh0Q3RybCxcbiAgICAgICAgICAgIF9vcHRpb25zNCRjbGFzc05hbWVEaSA9IF9vcHRpb25zNC5jbGFzc05hbWVEaXNhYmxlZE5leHRDdHJsLFxuICAgICAgICAgICAgY2xhc3NOYW1lRGlzYWJsZWROZXh0Q3RybCA9IF9vcHRpb25zNCRjbGFzc05hbWVEaSA9PT0gdW5kZWZpbmVkID8gJ2Rpc2FibGVkJyA6IF9vcHRpb25zNCRjbGFzc05hbWVEaSxcbiAgICAgICAgICAgIF9vcHRpb25zNCRjbGFzc05hbWVEaTIgPSBfb3B0aW9uczQuY2xhc3NOYW1lRGlzYWJsZWRQcmV2Q3RybCxcbiAgICAgICAgICAgIGNsYXNzTmFtZURpc2FibGVkUHJldkN0cmwgPSBfb3B0aW9uczQkY2xhc3NOYW1lRGkyID09PSB1bmRlZmluZWQgPyAnZGlzYWJsZWQnIDogX29wdGlvbnM0JGNsYXNzTmFtZURpMixcbiAgICAgICAgICAgIGVuYWJsZU1vdXNlRXZlbnRzID0gX29wdGlvbnM0LmVuYWJsZU1vdXNlRXZlbnRzLFxuICAgICAgICAgICAgY2xhc3NOYW1lQWN0aXZlU2xpZGUgPSBfb3B0aW9uczQuY2xhc3NOYW1lQWN0aXZlU2xpZGUsXG4gICAgICAgICAgICBpbml0aWFsSW5kZXggPSBfb3B0aW9uczQuaW5pdGlhbEluZGV4O1xuXG5cbiAgICAgICAgaW5kZXggPSBpbml0aWFsSW5kZXg7XG4gICAgICAgIGZyYW1lID0gc2xpZGVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lRnJhbWUpWzBdO1xuICAgICAgICBzbGlkZUNvbnRhaW5lciA9IGZyYW1lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lU2xpZGVDb250YWluZXIpWzBdO1xuICAgICAgICBwcmV2Q3RybCA9IHNsaWRlci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZVByZXZDdHJsKVswXTtcbiAgICAgICAgbmV4dEN0cmwgPSBzbGlkZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWVOZXh0Q3RybClbMF07XG5cbiAgICAgICAgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiBzbGlkZUNvbnRhaW5lci5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgeTogc2xpZGVDb250YWluZXIub2Zmc2V0VG9wXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuaW5maW5pdGUpIHtcbiAgICAgICAgICAgIHNsaWRlcyA9IHNldHVwSW5maW5pdGUoc2xpY2UuY2FsbChzbGlkZUNvbnRhaW5lci5jaGlsZHJlbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpZGVzID0gc2xpY2UuY2FsbChzbGlkZUNvbnRhaW5lci5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIGlmIChwcmV2Q3RybCAmJiAhb3B0aW9ucy5yZXdpbmRQcmV2KSB7XG4gICAgICAgICAgICAgICAgcHJldkN0cmwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWVEaXNhYmxlZFByZXZDdHJsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5leHRDdHJsICYmIHNsaWRlcy5sZW5ndGggPT09IDEgJiYgIW9wdGlvbnMucmV3aW5kKSB7XG4gICAgICAgICAgICAgICAgbmV4dEN0cmwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWVEaXNhYmxlZE5leHRDdHJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk7XG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZUFjdGl2ZVNsaWRlKSB7XG4gICAgICAgICAgICBzZXRBY3RpdmVFbGVtZW50KHNsaWRlcywgaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZXZDdHJsICYmIG5leHRDdHJsKSB7XG4gICAgICAgICAgICBwcmV2Q3RybC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHByZXYpO1xuICAgICAgICAgICAgbmV4dEN0cmwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblRvdWNoc3RhcnQsIHRvdWNoRXZlbnRQYXJhbXMpO1xuXG4gICAgICAgIGlmIChlbmFibGVNb3VzZUV2ZW50cykge1xuICAgICAgICAgICAgZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Ub3VjaHN0YXJ0KTtcbiAgICAgICAgICAgIGZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayk7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zLndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvblJlc2l6ZSk7XG5cbiAgICAgICAgZGlzcGF0Y2hTbGlkZXJFdmVudCgnYWZ0ZXInLCAnaW5pdCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHB1YmxpY1xuICAgICAqIHJlc2V0IGZ1bmN0aW9uOiBjYWxsZWQgb24gcmVzaXplXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHZhciBfb3B0aW9uczUgPSBvcHRpb25zLFxuICAgICAgICAgICAgaW5maW5pdGUgPSBfb3B0aW9uczUuaW5maW5pdGUsXG4gICAgICAgICAgICBlYXNlID0gX29wdGlvbnM1LmVhc2UsXG4gICAgICAgICAgICByZXdpbmRTcGVlZCA9IF9vcHRpb25zNS5yZXdpbmRTcGVlZCxcbiAgICAgICAgICAgIHJld2luZE9uUmVzaXplID0gX29wdGlvbnM1LnJld2luZE9uUmVzaXplLFxuICAgICAgICAgICAgY2xhc3NOYW1lQWN0aXZlU2xpZGUgPSBfb3B0aW9uczUuY2xhc3NOYW1lQWN0aXZlU2xpZGUsXG4gICAgICAgICAgICBpbml0aWFsSW5kZXggPSBfb3B0aW9uczUuaW5pdGlhbEluZGV4O1xuXG5cbiAgICAgICAgc2xpZGVzV2lkdGggPSBlbGVtZW50V2lkdGgoc2xpZGVDb250YWluZXIpO1xuICAgICAgICBmcmFtZVdpZHRoID0gZWxlbWVudFdpZHRoKGZyYW1lKTtcblxuICAgICAgICBpZiAoZnJhbWVXaWR0aCA9PT0gc2xpZGVzV2lkdGgpIHtcbiAgICAgICAgICAgIHNsaWRlc1dpZHRoID0gc2xpZGVzLnJlZHVjZShmdW5jdGlvbiAocHJldmlvdXNWYWx1ZSwgc2xpZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldmlvdXNWYWx1ZSArIGVsZW1lbnRXaWR0aChzbGlkZSk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXdpbmRPblJlc2l6ZSkge1xuICAgICAgICAgICAgaW5kZXggPSBpbml0aWFsSW5kZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlYXNlID0gbnVsbDtcbiAgICAgICAgICAgIHJld2luZFNwZWVkID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmZpbml0ZSkge1xuICAgICAgICAgICAgdHJhbnNsYXRlKHNsaWRlc1tpbmRleCArIGluZmluaXRlXS5vZmZzZXRMZWZ0ICogLTEsIDAsIG51bGwpO1xuXG4gICAgICAgICAgICBpbmRleCA9IGluZGV4ICsgaW5maW5pdGU7XG4gICAgICAgICAgICBwb3NpdGlvbi54ID0gc2xpZGVzW2luZGV4XS5vZmZzZXRMZWZ0ICogLTE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFuc2xhdGUoc2xpZGVzW2luZGV4XS5vZmZzZXRMZWZ0ICogLTEsIHJld2luZFNwZWVkLCBlYXNlKTtcbiAgICAgICAgICAgIHBvc2l0aW9uLnggPSBzbGlkZXNbaW5kZXhdLm9mZnNldExlZnQgKiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGFzc05hbWVBY3RpdmVTbGlkZSkge1xuICAgICAgICAgICAgc2V0QWN0aXZlRWxlbWVudChzbGljZS5jYWxsKHNsaWRlcyksIGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHB1YmxpY1xuICAgICAqIHNsaWRlVG86IGNhbGxlZCBvbiBjbGlja2hhbmRsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzbGlkZVRvKGluZGV4KSB7XG4gICAgICAgIHNsaWRlKGluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwdWJsaWNcbiAgICAgKiByZXR1cm5JbmRleCBmdW5jdGlvbjogY2FsbGVkIG9uIGNsaWNraGFuZGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJldHVybkluZGV4KCkge1xuICAgICAgICByZXR1cm4gaW5kZXggLSBvcHRpb25zLmluZmluaXRlIHx8IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcHVibGljXG4gICAgICogcHJldiBmdW5jdGlvbjogY2FsbGVkIG9uIGNsaWNraGFuZGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHByZXYoKSB7XG4gICAgICAgIHNsaWRlKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcHVibGljXG4gICAgICogbmV4dCBmdW5jdGlvbjogY2FsbGVkIG9uIGNsaWNraGFuZGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgIHNsaWRlKGZhbHNlLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwdWJsaWNcbiAgICAgKiBkZXN0cm95IGZ1bmN0aW9uOiBjYWxsZWQgdG8gZ3JhY2VmdWxseSBkZXN0cm95IHRoZSBsb3J5IGluc3RhbmNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgZGlzcGF0Y2hTbGlkZXJFdmVudCgnYmVmb3JlJywgJ2Rlc3Ryb3knKTtcblxuICAgICAgICAvLyByZW1vdmUgZXZlbnQgbGlzdGVuZXJzXG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIocHJlZml4ZXMudHJhbnNpdGlvbkVuZCwgb25UcmFuc2l0aW9uRW5kKTtcbiAgICAgICAgZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uVG91Y2hzdGFydCwgdG91Y2hFdmVudFBhcmFtcyk7XG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2htb3ZlLCB0b3VjaEV2ZW50UGFyYW1zKTtcbiAgICAgICAgZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoZW5kKTtcbiAgICAgICAgZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Ub3VjaG1vdmUpO1xuICAgICAgICBmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvblRvdWNoc3RhcnQpO1xuICAgICAgICBmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Ub3VjaGVuZCk7XG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvblRvdWNoZW5kKTtcbiAgICAgICAgZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrKTtcblxuICAgICAgICBvcHRpb25zLndpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvblJlc2l6ZSk7XG5cbiAgICAgICAgaWYgKHByZXZDdHJsKSB7XG4gICAgICAgICAgICBwcmV2Q3RybC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHByZXYpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHRDdHJsKSB7XG4gICAgICAgICAgICBuZXh0Q3RybC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG5leHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGNsb25lZCBzbGlkZXMgaWYgaW5maW5pdGUgaXMgc2V0XG4gICAgICAgIGlmIChvcHRpb25zLmluZmluaXRlKSB7XG4gICAgICAgICAgICBBcnJheS5hcHBseShudWxsLCBBcnJheShvcHRpb25zLmluZmluaXRlKSkuZm9yRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2xpZGVDb250YWluZXIucmVtb3ZlQ2hpbGQoc2xpZGVDb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgc2xpZGVDb250YWluZXIucmVtb3ZlQ2hpbGQoc2xpZGVDb250YWluZXIubGFzdENoaWxkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlzcGF0Y2hTbGlkZXJFdmVudCgnYWZ0ZXInLCAnZGVzdHJveScpO1xuICAgIH1cblxuICAgIC8vIGV2ZW50IGhhbmRsaW5nXG5cbiAgICB2YXIgdG91Y2hPZmZzZXQgPSB2b2lkIDA7XG4gICAgdmFyIGRlbHRhID0gdm9pZCAwO1xuICAgIHZhciBpc1Njcm9sbGluZyA9IHZvaWQgMDtcblxuICAgIGZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZCgpIHtcbiAgICAgICAgaWYgKHRyYW5zaXRpb25FbmRDYWxsYmFjaykge1xuICAgICAgICAgICAgdHJhbnNpdGlvbkVuZENhbGxiYWNrKCk7XG5cbiAgICAgICAgICAgIHRyYW5zaXRpb25FbmRDYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uVG91Y2hzdGFydChldmVudCkge1xuICAgICAgICB2YXIgX29wdGlvbnM2ID0gb3B0aW9ucyxcbiAgICAgICAgICAgIGVuYWJsZU1vdXNlRXZlbnRzID0gX29wdGlvbnM2LmVuYWJsZU1vdXNlRXZlbnRzO1xuXG4gICAgICAgIHZhciB0b3VjaGVzID0gZXZlbnQudG91Y2hlcyA/IGV2ZW50LnRvdWNoZXNbMF0gOiBldmVudDtcblxuICAgICAgICBpZiAoZW5hYmxlTW91c2VFdmVudHMpIHtcbiAgICAgICAgICAgIGZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uVG91Y2htb3ZlKTtcbiAgICAgICAgICAgIGZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvblRvdWNoZW5kKTtcbiAgICAgICAgICAgIGZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvblRvdWNoZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2htb3ZlLCB0b3VjaEV2ZW50UGFyYW1zKTtcbiAgICAgICAgZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoZW5kKTtcblxuICAgICAgICB2YXIgcGFnZVggPSB0b3VjaGVzLnBhZ2VYLFxuICAgICAgICAgICAgcGFnZVkgPSB0b3VjaGVzLnBhZ2VZO1xuXG5cbiAgICAgICAgdG91Y2hPZmZzZXQgPSB7XG4gICAgICAgICAgICB4OiBwYWdlWCxcbiAgICAgICAgICAgIHk6IHBhZ2VZLFxuICAgICAgICAgICAgdGltZTogRGF0ZS5ub3coKVxuICAgICAgICB9O1xuXG4gICAgICAgIGlzU2Nyb2xsaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIGRlbHRhID0ge307XG5cbiAgICAgICAgZGlzcGF0Y2hTbGlkZXJFdmVudCgnb24nLCAndG91Y2hzdGFydCcsIHtcbiAgICAgICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblRvdWNobW92ZShldmVudCkge1xuICAgICAgICB2YXIgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXMgPyBldmVudC50b3VjaGVzWzBdIDogZXZlbnQ7XG4gICAgICAgIHZhciBwYWdlWCA9IHRvdWNoZXMucGFnZVgsXG4gICAgICAgICAgICBwYWdlWSA9IHRvdWNoZXMucGFnZVk7XG5cblxuICAgICAgICBkZWx0YSA9IHtcbiAgICAgICAgICAgIHg6IHBhZ2VYIC0gdG91Y2hPZmZzZXQueCxcbiAgICAgICAgICAgIHk6IHBhZ2VZIC0gdG91Y2hPZmZzZXQueVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0eXBlb2YgaXNTY3JvbGxpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpc1Njcm9sbGluZyA9ICEhKGlzU2Nyb2xsaW5nIHx8IE1hdGguYWJzKGRlbHRhLngpIDwgTWF0aC5hYnMoZGVsdGEueSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1Njcm9sbGluZyAmJiB0b3VjaE9mZnNldCkge1xuICAgICAgICAgICAgdHJhbnNsYXRlKHBvc2l0aW9uLnggKyBkZWx0YS54LCAwLCBudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1heSBiZVxuICAgICAgICBkaXNwYXRjaFNsaWRlckV2ZW50KCdvbicsICd0b3VjaG1vdmUnLCB7XG4gICAgICAgICAgICBldmVudDogZXZlbnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Ub3VjaGVuZChldmVudCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogdGltZSBiZXR3ZWVuIHRvdWNoc3RhcnQgYW5kIHRvdWNoZW5kIGluIG1pbGxpc2Vjb25kc1xuICAgICAgICAgKiBAZHVyYXRpb24ge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IHRvdWNoT2Zmc2V0ID8gRGF0ZS5ub3coKSAtIHRvdWNoT2Zmc2V0LnRpbWUgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGlzIHZhbGlkIGlmOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtPiBzd2lwZSBhdHRlbXB0IHRpbWUgaXMgb3ZlciAzMDAgbXNcbiAgICAgICAgICogYW5kXG4gICAgICAgICAqIC0+IHN3aXBlIGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiAyNXB4XG4gICAgICAgICAqIG9yXG4gICAgICAgICAqIC0+IHN3aXBlIGRpc3RhbmNlIGlzIG1vcmUgdGhlbiBhIHRoaXJkIG9mIHRoZSBzd2lwZSBhcmVhXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpc1ZhbGlkU2xpZGUge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgaXNWYWxpZCA9IE51bWJlcihkdXJhdGlvbikgPCAzMDAgJiYgTWF0aC5hYnMoZGVsdGEueCkgPiAyNSB8fCBNYXRoLmFicyhkZWx0YS54KSA+IGZyYW1lV2lkdGggLyAzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBpcyBvdXQgb2YgYm91bmRzIGlmOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtPiBpbmRleCBpcyAwIGFuZCBkZWx0YSB4IGlzIGdyZWF0ZXIgdGhhbiAwXG4gICAgICAgICAqIG9yXG4gICAgICAgICAqIC0+IGluZGV4IGlzIHRoZSBsYXN0IHNsaWRlIGFuZCBkZWx0YSBpcyBzbWFsbGVyIHRoYW4gMFxuICAgICAgICAgKlxuICAgICAgICAgKiBAaXNPdXRPZkJvdW5kcyB7Qm9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBpc091dE9mQm91bmRzID0gIWluZGV4ICYmIGRlbHRhLnggPiAwIHx8IGluZGV4ID09PSBzbGlkZXMubGVuZ3RoIC0gMSAmJiBkZWx0YS54IDwgMDtcblxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gZGVsdGEueCA8IDA7XG5cbiAgICAgICAgaWYgKCFpc1Njcm9sbGluZykge1xuICAgICAgICAgICAgaWYgKGlzVmFsaWQgJiYgIWlzT3V0T2ZCb3VuZHMpIHtcbiAgICAgICAgICAgICAgICBzbGlkZShmYWxzZSwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKHBvc2l0aW9uLngsIG9wdGlvbnMuc25hcEJhY2tTcGVlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0b3VjaE9mZnNldCA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogcmVtb3ZlIGV2ZW50bGlzdGVuZXJzIGFmdGVyIHN3aXBlIGF0dGVtcHRcbiAgICAgICAgICovXG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2htb3ZlKTtcbiAgICAgICAgZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoZW5kKTtcbiAgICAgICAgZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Ub3VjaG1vdmUpO1xuICAgICAgICBmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Ub3VjaGVuZCk7XG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvblRvdWNoZW5kKTtcblxuICAgICAgICBkaXNwYXRjaFNsaWRlckV2ZW50KCdvbicsICd0b3VjaGVuZCcsIHtcbiAgICAgICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmIChkZWx0YS54KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25SZXNpemUoZXZlbnQpIHtcbiAgICAgICAgaWYgKGZyYW1lV2lkdGggIT09IGVsZW1lbnRXaWR0aChmcmFtZSkpIHtcbiAgICAgICAgICAgIHJlc2V0KCk7XG5cbiAgICAgICAgICAgIGRpc3BhdGNoU2xpZGVyRXZlbnQoJ29uJywgJ3Jlc2l6ZScsIHtcbiAgICAgICAgICAgICAgICBldmVudDogZXZlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gdHJpZ2dlciBpbml0aWFsIHNldHVwXG4gICAgc2V0dXAoKTtcblxuICAgIC8vIGV4cG9zZSBwdWJsaWMgYXBpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0dXA6IHNldHVwLFxuICAgICAgICByZXNldDogcmVzZXQsXG4gICAgICAgIHNsaWRlVG86IHNsaWRlVG8sXG4gICAgICAgIHJldHVybkluZGV4OiByZXR1cm5JbmRleCxcbiAgICAgICAgcHJldjogcHJldixcbiAgICAgICAgbmV4dDogbmV4dCxcbiAgICAgICAgZGVzdHJveTogZGVzdHJveVxuICAgIH07XG59XG5cbi8qKiovIH0pLFxuLyogMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBkZXRlY3RQcmVmaXhlcztcbi8qKlxuICogRGV0ZWN0aW5nIHByZWZpeGVzIGZvciBzYXZpbmcgdGltZSBhbmQgYnl0ZXNcbiAqL1xuZnVuY3Rpb24gZGV0ZWN0UHJlZml4ZXMoKSB7XG4gICAgdmFyIHRyYW5zZm9ybSA9IHZvaWQgMDtcbiAgICB2YXIgdHJhbnNpdGlvbiA9IHZvaWQgMDtcbiAgICB2YXIgdHJhbnNpdGlvbkVuZCA9IHZvaWQgMDtcblxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ18nKTtcbiAgICAgICAgdmFyIHN0eWxlID0gZWwuc3R5bGU7XG5cbiAgICAgICAgdmFyIHByb3AgPSB2b2lkIDA7XG5cbiAgICAgICAgaWYgKHN0eWxlW3Byb3AgPSAnd2Via2l0VHJhbnNpdGlvbiddID09PSAnJykge1xuICAgICAgICAgICAgdHJhbnNpdGlvbkVuZCA9ICd3ZWJraXRUcmFuc2l0aW9uRW5kJztcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSBwcm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0eWxlW3Byb3AgPSAndHJhbnNpdGlvbiddID09PSAnJykge1xuICAgICAgICAgICAgdHJhbnNpdGlvbkVuZCA9ICd0cmFuc2l0aW9uZW5kJztcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSBwcm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0eWxlW3Byb3AgPSAnd2Via2l0VHJhbnNmb3JtJ10gPT09ICcnKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm0gPSBwcm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0eWxlW3Byb3AgPSAnbXNUcmFuc2Zvcm0nXSA9PT0gJycpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybSA9IHByb3A7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3R5bGVbcHJvcCA9ICd0cmFuc2Zvcm0nXSA9PT0gJycpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybSA9IHByb3A7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShlbCwgbnVsbCk7XG4gICAgICAgIHN0eWxlW3RyYW5zZm9ybV0gPSAndHJhbnNsYXRlWCgwKSc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIH0pKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybSxcbiAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNpdGlvbixcbiAgICAgICAgdHJhbnNpdGlvbkVuZDogdHJhbnNpdGlvbkVuZFxuICAgIH07XG59XG5cbi8qKiovIH0pLFxuLyogMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBkZXRlY3RTdXBwb3J0c1Bhc3NpdmU7XG5mdW5jdGlvbiBkZXRlY3RTdXBwb3J0c1Bhc3NpdmUoKSB7XG4gICAgdmFyIHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIG9wdHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3RQYXNzaXZlJywgbnVsbCwgb3B0cyk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0ZXN0UGFzc2l2ZScsIG51bGwsIG9wdHMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICByZXR1cm4gc3VwcG9ydHNQYXNzaXZlO1xufVxuXG4vKioqLyB9KSxcbi8qIDMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZGlzcGF0Y2hFdmVudDtcblxudmFyIF9jdXN0b21FdmVudCA9IF9fd2VicGFja19yZXF1aXJlX18oNCk7XG5cbnZhciBfY3VzdG9tRXZlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3VzdG9tRXZlbnQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIGRpc3BhdGNoIGN1c3RvbSBldmVudHNcbiAqXG4gKiBAcGFyYW0gIHtlbGVtZW50fSBlbCAgICAgICAgIHNsaWRlc2hvdyBlbGVtZW50XG4gKiBAcGFyYW0gIHtzdHJpbmd9ICB0eXBlICAgICAgIGN1c3RvbSBldmVudCBuYW1lXG4gKiBAcGFyYW0gIHtvYmplY3R9ICBkZXRhaWwgICAgIGN1c3RvbSBkZXRhaWwgaW5mb3JtYXRpb25cbiAqL1xuZnVuY3Rpb24gZGlzcGF0Y2hFdmVudCh0YXJnZXQsIHR5cGUsIGRldGFpbCkge1xuICAgIHZhciBldmVudCA9IG5ldyBfY3VzdG9tRXZlbnQyLmRlZmF1bHQodHlwZSwge1xuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICBkZXRhaWw6IGRldGFpbFxuICAgIH0pO1xuXG4gICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG4vKioqLyB9KSxcbi8qIDQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuLyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKGdsb2JhbCkge1xudmFyIE5hdGl2ZUN1c3RvbUV2ZW50ID0gZ2xvYmFsLkN1c3RvbUV2ZW50O1xuXG5mdW5jdGlvbiB1c2VOYXRpdmUgKCkge1xuICB0cnkge1xuICAgIHZhciBwID0gbmV3IE5hdGl2ZUN1c3RvbUV2ZW50KCdjYXQnLCB7IGRldGFpbDogeyBmb286ICdiYXInIH0gfSk7XG4gICAgcmV0dXJuICAnY2F0JyA9PT0gcC50eXBlICYmICdiYXInID09PSBwLmRldGFpbC5mb287XG4gIH0gY2F0Y2ggKGUpIHtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ3Jvc3MtYnJvd3NlciBgQ3VzdG9tRXZlbnRgIGNvbnN0cnVjdG9yLlxuICpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DdXN0b21FdmVudC5DdXN0b21FdmVudFxuICpcbiAqIEBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVzZU5hdGl2ZSgpID8gTmF0aXZlQ3VzdG9tRXZlbnQgOlxuXG4vLyBJRSA+PSA5XG4ndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGRvY3VtZW50ICYmICdmdW5jdGlvbicgPT09IHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFdmVudCA/IGZ1bmN0aW9uIEN1c3RvbUV2ZW50ICh0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgaWYgKHBhcmFtcykge1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gIH0gZWxzZSB7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlLCB2b2lkIDApO1xuICB9XG4gIHJldHVybiBlO1xufSA6XG5cbi8vIElFIDw9IDhcbmZ1bmN0aW9uIEN1c3RvbUV2ZW50ICh0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuICBlLnR5cGUgPSB0eXBlO1xuICBpZiAocGFyYW1zKSB7XG4gICAgZS5idWJibGVzID0gQm9vbGVhbihwYXJhbXMuYnViYmxlcyk7XG4gICAgZS5jYW5jZWxhYmxlID0gQm9vbGVhbihwYXJhbXMuY2FuY2VsYWJsZSk7XG4gICAgZS5kZXRhaWwgPSBwYXJhbXMuZGV0YWlsO1xuICB9IGVsc2Uge1xuICAgIGUuYnViYmxlcyA9IGZhbHNlO1xuICAgIGUuY2FuY2VsYWJsZSA9IGZhbHNlO1xuICAgIGUuZGV0YWlsID0gdm9pZCAwO1xuICB9XG4gIHJldHVybiBlO1xufVxuXG4vKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyg1KSkpXG5cbi8qKiovIH0pLFxuLyogNSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG52YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuLyoqKi8gfSksXG4vKiA2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gIC8qKlxuICAgKiBzbGlkZXMgc2Nyb2xsZWQgYXQgb25jZVxuICAgKiBAc2xpZGVzVG9TY3JvbGwge051bWJlcn1cbiAgICovXG4gIHNsaWRlc1RvU2Nyb2xsOiAxLFxuXG4gIC8qKlxuICAgKiB0aW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIGFuaW1hdGlvbiBvZiBhIHZhbGlkIHNsaWRlIGF0dGVtcHRcbiAgICogQHNsaWRlU3BlZWQge051bWJlcn1cbiAgICovXG4gIHNsaWRlU3BlZWQ6IDMwMCxcblxuICAvKipcbiAgICogdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSBhbmltYXRpb24gb2YgdGhlIHJld2luZCBhZnRlciB0aGUgbGFzdCBzbGlkZVxuICAgKiBAcmV3aW5kU3BlZWQge051bWJlcn1cbiAgICovXG4gIHJld2luZFNwZWVkOiA2MDAsXG5cbiAgLyoqXG4gICAqIHRpbWUgZm9yIHRoZSBzbmFwQmFjayBvZiB0aGUgc2xpZGVyIGlmIHRoZSBzbGlkZSBhdHRlbXB0IHdhcyBub3QgdmFsaWRcbiAgICogQHNuYXBCYWNrU3BlZWQge051bWJlcn1cbiAgICovXG4gIHNuYXBCYWNrU3BlZWQ6IDIwMCxcblxuICAvKipcbiAgICogQmFzaWMgZWFzaW5nIGZ1bmN0aW9uczogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZGUvZG9jcy9XZWIvQ1NTL3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uXG4gICAqIGN1YmljIGJlemllciBlYXNpbmcgZnVuY3Rpb25zOiBodHRwOi8vZWFzaW5ncy5uZXQvZGVcbiAgICogQGVhc2Uge1N0cmluZ31cbiAgICovXG4gIGVhc2U6ICdlYXNlJyxcblxuICAvKipcbiAgICogaWYgc2xpZGVyIHJlYWNoZWQgdGhlIGxhc3Qgc2xpZGUsIHdpdGggbmV4dCBjbGljayB0aGUgc2xpZGVyIGdvZXMgYmFjayB0byB0aGUgc3RhcnRpbmRleC5cbiAgICogdXNlIGluZmluaXRlIG9yIHJld2luZCwgbm90IGJvdGhcbiAgICogQHJld2luZCB7Qm9vbGVhbn1cbiAgICovXG4gIHJld2luZDogZmFsc2UsXG5cbiAgLyoqXG4gICAqIG51bWJlciBvZiB2aXNpYmxlIHNsaWRlcyBvciBmYWxzZVxuICAgKiB1c2UgaW5maW5pdGUgb3IgcmV3aW5kLCBub3QgYm90aFxuICAgKiBAaW5maW5pdGUge251bWJlcn1cbiAgICovXG4gIGluZmluaXRlOiBmYWxzZSxcblxuICAvKipcbiAgICogdGhlIHNsaWRlIGluZGV4IHRvIHNob3cgd2hlbiB0aGUgc2xpZGVyIGlzIGluaXRpYWxpemVkLlxuICAgKiBAaW5pdGlhbEluZGV4IHtudW1iZXJ9XG4gICAqL1xuICBpbml0aWFsSW5kZXg6IDAsXG5cbiAgLyoqXG4gICAqIGNsYXNzIG5hbWUgZm9yIHNsaWRlciBmcmFtZVxuICAgKiBAY2xhc3NOYW1lRnJhbWUge3N0cmluZ31cbiAgICovXG4gIGNsYXNzTmFtZUZyYW1lOiAnanNfZnJhbWUnLFxuXG4gIC8qKlxuICAgKiBjbGFzcyBuYW1lIGZvciBzbGlkZXMgY29udGFpbmVyXG4gICAqIEBjbGFzc05hbWVTbGlkZUNvbnRhaW5lciB7c3RyaW5nfVxuICAgKi9cbiAgY2xhc3NOYW1lU2xpZGVDb250YWluZXI6ICdqc19zbGlkZXMnLFxuXG4gIC8qKlxuICAgKiBjbGFzcyBuYW1lIGZvciBzbGlkZXIgcHJldiBjb250cm9sXG4gICAqIEBjbGFzc05hbWVQcmV2Q3RybCB7c3RyaW5nfVxuICAgKi9cbiAgY2xhc3NOYW1lUHJldkN0cmw6ICdqc19wcmV2JyxcblxuICAvKipcbiAgICogY2xhc3MgbmFtZSBmb3Igc2xpZGVyIG5leHQgY29udHJvbFxuICAgKiBAY2xhc3NOYW1lTmV4dEN0cmwge3N0cmluZ31cbiAgICovXG4gIGNsYXNzTmFtZU5leHRDdHJsOiAnanNfbmV4dCcsXG5cbiAgLyoqXG4gICAqIGNsYXNzIG5hbWUgZm9yIGN1cnJlbnQgYWN0aXZlIHNsaWRlXG4gICAqIGlmIGVtcHR5U3RyaW5nIHRoZW4gbm8gY2xhc3MgaXMgc2V0XG4gICAqIEBjbGFzc05hbWVBY3RpdmVTbGlkZSB7c3RyaW5nfVxuICAgKi9cbiAgY2xhc3NOYW1lQWN0aXZlU2xpZGU6ICdhY3RpdmUnLFxuXG4gIC8qKlxuICAgKiBlbmFibGVzIG1vdXNlIGV2ZW50cyBmb3Igc3dpcGluZyBvbiBkZXNrdG9wIGRldmljZXNcbiAgICogQGVuYWJsZU1vdXNlRXZlbnRzIHtib29sZWFufVxuICAgKi9cbiAgZW5hYmxlTW91c2VFdmVudHM6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiB3aW5kb3cgaW5zdGFuY2VcbiAgICogQHdpbmRvdyB7b2JqZWN0fVxuICAgKi9cbiAgd2luZG93OiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IG51bGwsXG5cbiAgLyoqXG4gICAqIElmIGZhbHNlLCBzbGlkZXMgbG9yeSB0byB0aGUgZmlyc3Qgc2xpZGUgb24gd2luZG93IHJlc2l6ZS5cbiAgICogQHJld2luZE9uUmVzaXplIHtib29sZWFufVxuICAgKi9cbiAgcmV3aW5kT25SZXNpemU6IHRydWVcbn07XG5cbi8qKiovIH0pLFxuLyogNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5tb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqKi8gfSlcbi8qKioqKiovIF0pO1xufSk7Il19
