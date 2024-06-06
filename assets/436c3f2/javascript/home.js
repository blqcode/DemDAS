(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

require('./home/sector-treeview.js')();

require('./home/carousel.js')();

require('./utils/tabs')(document.querySelector('#old-categories .tabset'), {
  hideable: true
});

require('./utils/gotop')();

require('./utils/events').trackEvents();

require('./utils/searchBar.js')();

require('./utils/banners/common.js');

},{"./home/carousel.js":2,"./home/sector-treeview.js":3,"./utils/banners/common.js":5,"./utils/events":10,"./utils/gotop":11,"./utils/searchBar.js":12,"./utils/tabs":13}],2:[function(require,module,exports){
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

},{"../utils/carousel-animation":7,"../utils/carousel-dots.js":8,"lory.js":78}],3:[function(require,module,exports){
"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.some");

require("core-js/modules/web.dom-collections.for-each");

module.exports = init;

function init() {
  var carets = document.getElementsByClassName('sector-caret');
  var sectorSnippets = document.getElementsByClassName('sector-snippet');
  var sectorNames = document.getElementsByClassName('sector-name');
  var sectorChildren = document.getElementsByClassName('sector-children');
  Array.prototype.forEach.call(sectorSnippets, function (element) {
    element.onclick = function () {
      return clickSector(element.dataset.index);
    };
  });
  /**
   * Hide sector children when clicking outside sector treeview elements
   */

  document.addEventListener('click', function (event) {
    if (!isClickInsideSectorTreeview(event)) {
      hideAllSectors();
    }
  });
  /**
   * Toggle display of sector children element
   * @param {integer} index
   */

  function clickSector(index) {
    // Use getComputedStyle for checking display
    // Do not use element.style.display, it only check style on tag
    if (window.getComputedStyle(sectorChildren[index]).display === 'block') {
      hideSector(index);
    } else {
      showSector(index);
    }
  }

  function hideSector(index) {
    sectorNames[index].classList.add('sector-name-unselected');
    sectorNames[index].classList.remove('sector-name-selected');
    carets[index].classList.add('caret-down');
    carets[index].classList.remove('caret-up');
    hide(sectorChildren[index]);
  }

  function showSector(index) {
    sectorNames[index].classList.add('sector-name-selected');
    sectorNames[index].classList.remove('sector-name-unselected');
    carets[index].classList.add('caret-up');
    carets[index].classList.remove('caret-down');
    showSectorChildren(index);
  }
  /**
   * Hide all sectors
   */


  function hideAllSectors() {
    Array.prototype.forEach.call(sectorSnippets, function (element) {
      return hideSector(element.dataset.index);
    });
  }
  /**
   * Hide element
   * @param {node} element
   */


  function hide(element) {
    element.style.display = 'none';
  }
  /**
   * Show displayedIndex sector children element and hide all others
   * @param {string|integer} displayedIndex
   */


  function showSectorChildren(displayedIndex) {
    displayedIndex = +displayedIndex;

    for (var i = 0; i < sectorChildren.length; i++) {
      if (i === displayedIndex) {
        sectorChildren[i].style.display = 'block';
      } else {
        hideSector(i);
      }
    }
  }
  /**
   * Tell if the click is inside one the sector treeview elements
   * @param {event} event
   */


  function isClickInsideSectorTreeview(event) {
    return Array.prototype.some.call(sectorSnippets, function (element) {
      return element.contains(event.target);
    });
  }
}

},{"core-js/modules/es.array.for-each":73,"core-js/modules/es.array.some":75,"core-js/modules/web.dom-collections.for-each":77}],4:[function(require,module,exports){
'use strict';

if (typeof window.Element.prototype.matches !== 'function') {
  window.Element.prototype.matches = window.Element.prototype.msMatchesSelector || window.Element.prototype.webkitMatchesSelector;
}

},{}],5:[function(require,module,exports){
'use strict';

var createIframeBanner = require('./generator.js');

if (window.nmx.banner) {
  var banner = createIframeBanner(window.nmx.banner.url);
  banner.open();
}

},{"./generator.js":6}],6:[function(require,module,exports){
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

},{"../events.js":10}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"core-js/modules/es.array.index-of":74}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"../polyfills/element-matches.js":4,"core-js/modules/es.array.for-each":73,"core-js/modules/es.array.index-of":74,"core-js/modules/es.string.trim":76,"core-js/modules/web.dom-collections.for-each":77}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./debounce.js":9,"./events":10,"core-js/modules/es.array.for-each":73,"core-js/modules/web.dom-collections.for-each":77}],13:[function(require,module,exports){
'use strict';
/**
 * @param {Element} tabset
 * @param {Object} [options]
 * @param {Boolean} [options.hideable] when **false**, there is always 1 displayed tab. Otherwise, all tabs can be hidden at the same time.
 * @returns {void}
 */

require("core-js/modules/es.array.for-each");

require("core-js/modules/web.dom-collections.for-each");

module.exports = function initializeTabs(tabset) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      hideable = _ref.hideable;

  var CLASS_ACTIVE = 'active';
  Array.prototype.forEach.call(tabset.querySelectorAll('.tabs > .tab'), function (tab) {
    return tab.addEventListener('click', onTabClick);
  });

  if (hideable) {
    document.addEventListener('click', onClickOutside);
  }
  /**
   * Displays the selected tab pane.
   * @this {Element}
   * @returns {void}
   */


  function onTabClick() {
    var _this = this;

    var tabIndex;

    if (!this.classList.contains(CLASS_ACTIVE)) {
      Array.prototype.forEach.call(tabset.querySelectorAll('.tabs > .tab'), function (tab, i) {
        if (tab === _this) {
          tab.classList.add(CLASS_ACTIVE);
          tabIndex = i;
        } else {
          tab.classList.remove(CLASS_ACTIVE);
        }
      });
      Array.prototype.forEach.call(tabset.querySelectorAll('.tab-pane'), function (pane, i) {
        return i === tabIndex ? pane.classList.add(CLASS_ACTIVE) : pane.classList.remove(CLASS_ACTIVE);
      });
    } else if (hideable) {
      hideAll();
    }
  }
  /**
   * Hides all panes if the clicked element is outside the tabset. Otherwise, does nothing.
   * @param {Event} event
   * @returns {void}
   */


  function onClickOutside(event) {
    if (!tabset.contains(event.target)) {
      hideAll();
    }
  }
  /**
   * Hides all tabs and panes.
   * @returns {void}
   */


  function hideAll() {
    Array.prototype.forEach.call(tabset.querySelectorAll('.tabs > .tab.active, .tab-pane.active'), function (pane) {
      return pane.classList.remove(CLASS_ACTIVE);
    });
  }
};

},{"core-js/modules/es.array.for-each":73,"core-js/modules/web.dom-collections.for-each":77}],14:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

},{}],15:[function(require,module,exports){
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

},{"../internals/is-object":43}],16:[function(require,module,exports){
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

},{"../internals/array-iteration":18,"../internals/array-method-is-strict":19,"../internals/array-method-uses-to-length":20}],17:[function(require,module,exports){
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

},{"../internals/to-absolute-index":63,"../internals/to-indexed-object":64,"../internals/to-length":66}],18:[function(require,module,exports){
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

},{"../internals/array-species-create":21,"../internals/function-bind-context":32,"../internals/indexed-object":38,"../internals/to-length":66,"../internals/to-object":67}],19:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

},{"../internals/fails":31}],20:[function(require,module,exports){
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

},{"../internals/descriptors":26,"../internals/fails":31,"../internals/has":35}],21:[function(require,module,exports){
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

},{"../internals/is-array":41,"../internals/is-object":43,"../internals/well-known-symbol":71}],22:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],23:[function(require,module,exports){
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

},{"../internals/has":35,"../internals/object-define-property":47,"../internals/object-get-own-property-descriptor":48,"../internals/own-keys":53}],24:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":25,"../internals/descriptors":26,"../internals/object-define-property":47}],25:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],26:[function(require,module,exports){
var fails = require('../internals/fails');

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

},{"../internals/fails":31}],27:[function(require,module,exports){
var global = require('../internals/global');
var isObject = require('../internals/is-object');

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

},{"../internals/global":34,"../internals/is-object":43}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"../internals/copy-constructor-properties":23,"../internals/create-non-enumerable-property":24,"../internals/global":34,"../internals/is-forced":42,"../internals/object-get-own-property-descriptor":48,"../internals/redefine":55,"../internals/set-global":57}],31:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],32:[function(require,module,exports){
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

},{"../internals/a-function":14}],33:[function(require,module,exports){
var path = require('../internals/path');
var global = require('../internals/global');

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};

},{"../internals/global":34,"../internals/path":54}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],36:[function(require,module,exports){
module.exports = {};

},{}],37:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var createElement = require('../internals/document-create-element');

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":26,"../internals/document-create-element":27,"../internals/fails":31}],38:[function(require,module,exports){
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

},{"../internals/classof-raw":22,"../internals/fails":31}],39:[function(require,module,exports){
var store = require('../internals/shared-store');

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;

},{"../internals/shared-store":59}],40:[function(require,module,exports){
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

},{"../internals/create-non-enumerable-property":24,"../internals/global":34,"../internals/has":35,"../internals/hidden-keys":36,"../internals/is-object":43,"../internals/native-weak-map":46,"../internals/shared-key":58}],41:[function(require,module,exports){
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};

},{"../internals/classof-raw":22}],42:[function(require,module,exports){
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

},{"../internals/fails":31}],43:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],44:[function(require,module,exports){
module.exports = false;

},{}],45:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

},{"../internals/fails":31}],46:[function(require,module,exports){
var global = require('../internals/global');
var inspectSource = require('../internals/inspect-source');

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

},{"../internals/global":34,"../internals/inspect-source":39}],47:[function(require,module,exports){
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

},{"../internals/an-object":15,"../internals/descriptors":26,"../internals/ie8-dom-define":37,"../internals/to-primitive":68}],48:[function(require,module,exports){
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

},{"../internals/create-property-descriptor":25,"../internals/descriptors":26,"../internals/has":35,"../internals/ie8-dom-define":37,"../internals/object-property-is-enumerable":52,"../internals/to-indexed-object":64,"../internals/to-primitive":68}],49:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/enum-bug-keys":29,"../internals/object-keys-internal":51}],50:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],51:[function(require,module,exports){
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

},{"../internals/array-includes":17,"../internals/has":35,"../internals/hidden-keys":36,"../internals/to-indexed-object":64}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
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

},{"../internals/an-object":15,"../internals/get-built-in":33,"../internals/object-get-own-property-names":49,"../internals/object-get-own-property-symbols":50}],54:[function(require,module,exports){
var global = require('../internals/global');

module.exports = global;

},{"../internals/global":34}],55:[function(require,module,exports){
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

},{"../internals/create-non-enumerable-property":24,"../internals/global":34,"../internals/has":35,"../internals/inspect-source":39,"../internals/internal-state":40,"../internals/set-global":57}],56:[function(require,module,exports){
// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

},{}],57:[function(require,module,exports){
var global = require('../internals/global');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/create-non-enumerable-property":24,"../internals/global":34}],58:[function(require,module,exports){
var shared = require('../internals/shared');
var uid = require('../internals/uid');

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":60,"../internals/uid":69}],59:[function(require,module,exports){
var global = require('../internals/global');
var setGlobal = require('../internals/set-global');

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;

},{"../internals/global":34,"../internals/set-global":57}],60:[function(require,module,exports){
var IS_PURE = require('../internals/is-pure');
var store = require('../internals/shared-store');

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.5',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});

},{"../internals/is-pure":44,"../internals/shared-store":59}],61:[function(require,module,exports){
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

},{"../internals/fails":31,"../internals/whitespaces":72}],62:[function(require,module,exports){
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

},{"../internals/require-object-coercible":56,"../internals/whitespaces":72}],63:[function(require,module,exports){
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

},{"../internals/to-integer":65}],64:[function(require,module,exports){
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":38,"../internals/require-object-coercible":56}],65:[function(require,module,exports){
var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

},{}],66:[function(require,module,exports){
var toInteger = require('../internals/to-integer');

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer":65}],67:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

},{"../internals/require-object-coercible":56}],68:[function(require,module,exports){
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

},{"../internals/is-object":43}],69:[function(require,module,exports){
var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

},{}],70:[function(require,module,exports){
var NATIVE_SYMBOL = require('../internals/native-symbol');

module.exports = NATIVE_SYMBOL
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';

},{"../internals/native-symbol":45}],71:[function(require,module,exports){
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

},{"../internals/global":34,"../internals/has":35,"../internals/native-symbol":45,"../internals/shared":60,"../internals/uid":69,"../internals/use-symbol-as-uid":70}],72:[function(require,module,exports){
// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],73:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var forEach = require('../internals/array-for-each');

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});

},{"../internals/array-for-each":16,"../internals/export":30}],74:[function(require,module,exports){
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

},{"../internals/array-includes":17,"../internals/array-method-is-strict":19,"../internals/array-method-uses-to-length":20,"../internals/export":30}],75:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $some = require('../internals/array-iteration').some;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var arrayMethodUsesToLength = require('../internals/array-method-uses-to-length');

var STRICT_METHOD = arrayMethodIsStrict('some');
var USES_TO_LENGTH = arrayMethodUsesToLength('some');

// `Array.prototype.some` method
// https://tc39.github.io/ecma262/#sec-array.prototype.some
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":18,"../internals/array-method-is-strict":19,"../internals/array-method-uses-to-length":20,"../internals/export":30}],76:[function(require,module,exports){
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

},{"../internals/export":30,"../internals/string-trim":62,"../internals/string-trim-forced":61}],77:[function(require,module,exports){
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

},{"../internals/array-for-each":16,"../internals/create-non-enumerable-property":24,"../internals/dom-iterables":28,"../internals/global":34}],78:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvY2xpZW50L2hvbWUuanMiLCJhcHAvY2xpZW50L2hvbWUvY2Fyb3VzZWwuanMiLCJhcHAvY2xpZW50L2hvbWUvc2VjdG9yLXRyZWV2aWV3LmpzIiwiYXBwL2NsaWVudC9wb2x5ZmlsbHMvZWxlbWVudC1tYXRjaGVzLmpzIiwiYXBwL2NsaWVudC91dGlscy9iYW5uZXJzL2NvbW1vbi5qcyIsImFwcC9jbGllbnQvdXRpbHMvYmFubmVycy9nZW5lcmF0b3IuanMiLCJhcHAvY2xpZW50L3V0aWxzL2Nhcm91c2VsLWFuaW1hdGlvbi5qcyIsImFwcC9jbGllbnQvdXRpbHMvY2Fyb3VzZWwtZG90cy5qcyIsImFwcC9jbGllbnQvdXRpbHMvZGVib3VuY2UuanMiLCJhcHAvY2xpZW50L3V0aWxzL2V2ZW50cy5qcyIsImFwcC9jbGllbnQvdXRpbHMvZ290b3AuanMiLCJhcHAvY2xpZW50L3V0aWxzL3NlYXJjaEJhci5qcyIsImFwcC9jbGllbnQvdXRpbHMvdGFicy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1mb3ItZWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1pdGVyYXRpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1tZXRob2QtdXNlcy10by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi1yYXcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb20taXRlcmFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VudW0tYnVnLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtY29udGV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nZXQtYnVpbHQtaW4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hhcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRkZW4ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbmRleGVkLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1mb3JjZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXB1cmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9uYXRpdmUtd2Vhay1tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LWdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC1zdG9yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc3RyaW5nLXRyaW0tZm9yY2VkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N0cmluZy10cmltLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3doaXRlc3BhY2VzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5mb3ItZWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuaW5kZXgtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LnNvbWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN0cmluZy50cmltLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLWNvbGxlY3Rpb25zLmZvci1lYWNoLmpzIiwibm9kZV9tb2R1bGVzL2xvcnkuanMvZGlzdC9sb3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBRUEsT0FBTyxDQUFDLDJCQUFELENBQVA7O0FBQ0EsT0FBTyxDQUFDLG9CQUFELENBQVA7O0FBQ0EsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QixRQUFRLENBQUMsYUFBVCxDQUF1Qix5QkFBdkIsQ0FBeEIsRUFBMkU7QUFBRSxFQUFBLFFBQVEsRUFBRTtBQUFaLENBQTNFOztBQUNBLE9BQU8sQ0FBQyxlQUFELENBQVA7O0FBQ0EsT0FBTyxDQUFDLGdCQUFELENBQVAsQ0FBMEIsV0FBMUI7O0FBQ0EsT0FBTyxDQUFDLHNCQUFELENBQVA7O0FBQ0EsT0FBTyxDQUFDLDJCQUFELENBQVA7OztBQ1JBOztlQUVpQixPQUFPLENBQUMsU0FBRCxDO0lBQWhCLEksWUFBQSxJOztBQUNSLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLDZCQUFELENBQWpDOztBQUNBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQywyQkFBRCxDQUE1QjtBQUVBOzs7Ozs7QUFJQSxNQUFNLENBQUMsT0FBUCxHQUFpQixZQUFNO0FBQ3JCLE1BQU0sT0FBTyxHQUFHO0FBQ2QsSUFBQSxRQUFRLEVBQUUsQ0FESTtBQUVkLElBQUEsaUJBQWlCLEVBQUUsSUFGTDtBQUdkLElBQUEsVUFBVSxFQUFFO0FBSEUsR0FBaEI7QUFNQSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsc0JBQVQsQ0FBZ0MsVUFBaEMsQ0FBbEI7O0FBRUEsT0FBSSxJQUFJ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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9ob21lL3NlY3Rvci10cmVldmlldy5qcycpKCk7XG5yZXF1aXJlKCcuL2hvbWUvY2Fyb3VzZWwuanMnKSgpO1xucmVxdWlyZSgnLi91dGlscy90YWJzJykoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29sZC1jYXRlZ29yaWVzIC50YWJzZXQnKSwgeyBoaWRlYWJsZTogdHJ1ZSB9KTtcbnJlcXVpcmUoJy4vdXRpbHMvZ290b3AnKSgpO1xucmVxdWlyZSgnLi91dGlscy9ldmVudHMnKS50cmFja0V2ZW50cygpO1xucmVxdWlyZSgnLi91dGlscy9zZWFyY2hCYXIuanMnKSgpO1xucmVxdWlyZSgnLi91dGlscy9iYW5uZXJzL2NvbW1vbi5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7IGxvcnkgfSA9IHJlcXVpcmUoJ2xvcnkuanMnKTtcbmNvbnN0IGNhcm91c2VsQW5pbWF0aW9uID0gcmVxdWlyZSgnLi4vdXRpbHMvY2Fyb3VzZWwtYW5pbWF0aW9uJyk7XG5jb25zdCBjYXJvdXNlbERvdHMgPSByZXF1aXJlKCcuLi91dGlscy9jYXJvdXNlbC1kb3RzLmpzJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgSG9tZSBQYWdlIGNhcm91c2Vscy5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpbmZpbml0ZTogMSxcbiAgICBlbmFibGVNb3VzZUV2ZW50czogdHJ1ZSxcbiAgICBzbGlkZVNwZWVkOiA1MDAsXG4gIH07XG5cbiAgY29uc3QgY2Fyb3VzZWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2Fyb3VzZWwnKTtcblxuICBmb3IobGV0IGkgPSAwOyBpIDwgY2Fyb3VzZWxzLmxlbmd0aDsgaSsrKXtcbiAgICBjb25zdCBlbGVtZW50ID0gY2Fyb3VzZWxzW2ldO1xuICAgIGNvbnN0IGFuaW1hdGUgPSBjYXJvdXNlbEFuaW1hdGlvbihlbGVtZW50KTtcbiAgICBjb25zdCBkb3RzID0gY2Fyb3VzZWxEb3RzKGVsZW1lbnQsIG9wdGlvbnMpO1xuICAgIGNvbnN0IGNhcm91c2VsID0gbG9yeShlbGVtZW50LCBvcHRpb25zKTtcbiAgICBhbmltYXRlKGRvdHMoY2Fyb3VzZWwpKTtcbiAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXQ7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgY29uc3QgY2FyZXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VjdG9yLWNhcmV0Jyk7XG4gIGNvbnN0IHNlY3RvclNuaXBwZXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VjdG9yLXNuaXBwZXQnKTtcbiAgY29uc3Qgc2VjdG9yTmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWN0b3ItbmFtZScpO1xuICBjb25zdCBzZWN0b3JDaGlsZHJlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlY3Rvci1jaGlsZHJlbicpO1xuXG4gIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgc2VjdG9yU25pcHBldHMsXG4gICAgZWxlbWVudCA9PiB7IGVsZW1lbnQub25jbGljayA9ICgpID0+IGNsaWNrU2VjdG9yKGVsZW1lbnQuZGF0YXNldC5pbmRleCk7IH1cbiAgKTtcblxuICAvKipcbiAgICogSGlkZSBzZWN0b3IgY2hpbGRyZW4gd2hlbiBjbGlja2luZyBvdXRzaWRlIHNlY3RvciB0cmVldmlldyBlbGVtZW50c1xuICAgKi9cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgaWYgKCFpc0NsaWNrSW5zaWRlU2VjdG9yVHJlZXZpZXcoZXZlbnQpKSB7XG4gICAgICBoaWRlQWxsU2VjdG9ycygpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBkaXNwbGF5IG9mIHNlY3RvciBjaGlsZHJlbiBlbGVtZW50XG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gaW5kZXhcbiAgICovXG4gIGZ1bmN0aW9uIGNsaWNrU2VjdG9yKGluZGV4KSB7XG4gICAgLy8gVXNlIGdldENvbXB1dGVkU3R5bGUgZm9yIGNoZWNraW5nIGRpc3BsYXlcbiAgICAvLyBEbyBub3QgdXNlIGVsZW1lbnQuc3R5bGUuZGlzcGxheSwgaXQgb25seSBjaGVjayBzdHlsZSBvbiB0YWdcbiAgICBpZiggd2luZG93LmdldENvbXB1dGVkU3R5bGUoc2VjdG9yQ2hpbGRyZW5baW5kZXhdKS5kaXNwbGF5ID09PSAnYmxvY2snKSB7XG4gICAgICBoaWRlU2VjdG9yKGluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvd1NlY3RvcihpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGlkZVNlY3RvcihpbmRleCkge1xuICAgIHNlY3Rvck5hbWVzW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdzZWN0b3ItbmFtZS11bnNlbGVjdGVkJyk7XG4gICAgc2VjdG9yTmFtZXNbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoJ3NlY3Rvci1uYW1lLXNlbGVjdGVkJyk7XG4gICAgY2FyZXRzW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdjYXJldC1kb3duJyk7XG4gICAgY2FyZXRzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdjYXJldC11cCcpO1xuICAgIGhpZGUoc2VjdG9yQ2hpbGRyZW5baW5kZXhdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dTZWN0b3IoaW5kZXgpIHtcbiAgICBzZWN0b3JOYW1lc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnc2VjdG9yLW5hbWUtc2VsZWN0ZWQnKTtcbiAgICBzZWN0b3JOYW1lc1tpbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnc2VjdG9yLW5hbWUtdW5zZWxlY3RlZCcpO1xuICAgIGNhcmV0c1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnY2FyZXQtdXAnKTtcbiAgICBjYXJldHNbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoJ2NhcmV0LWRvd24nKTtcbiAgICBzaG93U2VjdG9yQ2hpbGRyZW4oaW5kZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgYWxsIHNlY3RvcnNcbiAgICovXG4gIGZ1bmN0aW9uIGhpZGVBbGxTZWN0b3JzKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoc2VjdG9yU25pcHBldHMsIGVsZW1lbnQgPT4gaGlkZVNlY3RvcihlbGVtZW50LmRhdGFzZXQuaW5kZXgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIGVsZW1lbnRcbiAgICogQHBhcmFtIHtub2RlfSBlbGVtZW50XG4gICAqL1xuICBmdW5jdGlvbiBoaWRlKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICAvKipcbiAgICogU2hvdyBkaXNwbGF5ZWRJbmRleCBzZWN0b3IgY2hpbGRyZW4gZWxlbWVudCBhbmQgaGlkZSBhbGwgb3RoZXJzXG4gICAqIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGRpc3BsYXllZEluZGV4XG4gICAqL1xuICBmdW5jdGlvbiBzaG93U2VjdG9yQ2hpbGRyZW4oZGlzcGxheWVkSW5kZXgpIHtcbiAgICBkaXNwbGF5ZWRJbmRleCA9ICtkaXNwbGF5ZWRJbmRleDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlY3RvckNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZihpID09PSBkaXNwbGF5ZWRJbmRleCkge1xuICAgICAgICBzZWN0b3JDaGlsZHJlbltpXS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhpZGVTZWN0b3IoaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRlbGwgaWYgdGhlIGNsaWNrIGlzIGluc2lkZSBvbmUgdGhlIHNlY3RvciB0cmVldmlldyBlbGVtZW50c1xuICAgKiBAcGFyYW0ge2V2ZW50fSBldmVudFxuICAgKi9cbiAgZnVuY3Rpb24gaXNDbGlja0luc2lkZVNlY3RvclRyZWV2aWV3KGV2ZW50KSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zb21lLmNhbGwoc2VjdG9yU25pcHBldHMsIGVsZW1lbnQgPT4gZWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZih0eXBlb2Ygd2luZG93LkVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgIT09ICdmdW5jdGlvbicpe1xuICB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fCB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjcmVhdGVJZnJhbWVCYW5uZXIgPSByZXF1aXJlKCcuL2dlbmVyYXRvci5qcycpO1xuXG5pZih3aW5kb3cubm14LmJhbm5lcil7XG4gIGNvbnN0IGJhbm5lciA9IGNyZWF0ZUlmcmFtZUJhbm5lcih3aW5kb3cubm14LmJhbm5lci51cmwpO1xuICBiYW5uZXIub3BlbigpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB0cmFja2luZyA9IHJlcXVpcmUoJy4uL2V2ZW50cy5qcycpO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzcmNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJZnJhbWVCYW5uZXIoc3JjKSB7XG4gIGNvbnN0IGxvY2FsU3RvcmFnZUtleSA9IGBiYW5uZXItd3JhcHBlci1pZnJhbWVfXyR7IHNyYyB9YDtcblxuICAvKiogQHR5cGUge0hUTUxJRnJhbWVFbGVtZW50fHVuZGVmaW5lZH0gKi9cbiAgbGV0IGlmcmFtZTtcblxuICByZXR1cm4ge1xuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIGB0cnVlYCBpZiB0aGUgaWZyYW1lIGNvdWxkIGJlIG9wZW4sIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBpZighaWZyYW1lICYmICF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlS2V5KSl7XG4gICAgICBpZnJhbWUgPSBjcmVhdGVJZnJhbWUoKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGlmcmFtZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0obG9jYWxTdG9yYWdlS2V5LCAndHJ1ZScpO1xuICAgIGlmcmFtZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUlmcmFtZSgpe1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZnJhbWVib3JkZXInLCAnMCcpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzY3JvbGxpbmcnLCAnbm8nKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjKTtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9ICdiYW5uZXItd3JhcHBlci1pZnJhbWUnO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsIGNsb3NlKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYWNraW5nJywgb25UcmFja2luZyk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0N1c3RvbUV2ZW50fSBldmVudFxuICAgKi9cbiAgZnVuY3Rpb24gb25UcmFja2luZyhldmVudCl7XG4gICAgaWYoZXZlbnQuZGV0YWlsICYmIGV2ZW50LmRldGFpbC5hY3Rpb24pe1xuICAgICAgdHJhY2tpbmcudHJhY2soZXZlbnQuZGV0YWlsKTtcbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQW5pbWF0ZXMgYSBjYXJvdXNlbC5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtDYXJvdXNlbC5EeW5hbWljQ2Fyb3VzZWxPcHRpb25zfSBbb3B0aW9uc11cbiAqIEByZXR1cm5zIHtDYXJvdXNlbC5iaW5kQ2Fyb3VzZWx9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2Fyb3VzZWxBbmltYXRpb24oZWxlbWVudCwgeyBjbGFzc05hbWVTbGlkZUNvbnRhaW5lciA9ICdqc19zbGlkZXMnLCBzbGlkZVBhdXNlID0gMTAwMDAgfSA9IHt9KXtcbiAgLyoqIEB0eXBlIHtpbXBvcnQoJ2xvcnkuanMnKS5Mb3J5U3RhdGljfSAqL1xuICBsZXQgY2Fyb3VzZWw7XG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICBsZXQgdGltZW91dElkO1xuICBjb25zdCBzbGlkZUNvbnRhaW5lciA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgLiR7IGNsYXNzTmFtZVNsaWRlQ29udGFpbmVyIH1gKTtcbiAgY29uc3Qgc2xpZGVDb3VudCA9IHNsaWRlQ29udGFpbmVyID8gc2xpZGVDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoIDogMDtcblxuICBpZihzbGlkZVBhdXNlID4gMCAmJiBzbGlkZUNvdW50ID4gMSl7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdhZnRlci5sb3J5LmluaXQnLCBtb3ZlRm9yd2FyZCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmUubG9yeS5zbGlkZScsICgpID0+IGNsZWFyVGltZW91dCh0aW1lb3V0SWQpKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2FmdGVyLmxvcnkuc2xpZGUnLCBtb3ZlRm9yd2FyZCk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdvbi5sb3J5LnJlc2l6ZScsIHJlc2V0VGltZXIpO1xuICB9XG5cbiAgcmV0dXJuIGxvcnkgPT4gKGNhcm91c2VsID0gbG9yeSk7XG5cbiAgLyoqXG4gICAqIFByZXBhcmVzIG5leHQgc2xpZGUgdG8gc2hvdy5cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBmdW5jdGlvbiBtb3ZlRm9yd2FyZCgpe1xuICAgIGNvbnN0IHRpbWUgPSBNYXRoLmFicygrZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAuJHsgY2xhc3NOYW1lU2xpZGVDb250YWluZXIgfSA+IC5hY3RpdmVgKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGltZScpKTtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IGNhcm91c2VsLm5leHQoKSwgdGltZSB8fCBzbGlkZVBhdXNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGltZXIgdG8gdGhlIHRyaWdnZXIgdGhlIG5leHQgc2xpZGUgYWZ0ZXIgdGhlIHJpZ2h0IHRpZW0uXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gcmVzZXRUaW1lcigpe1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIG1vdmVGb3J3YXJkKCk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQWRkcyBjbGlja2FibGUgZG90cyB0byB0aGUgZ2l2ZW4gY2Fyb3VzZWwuXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7Q2Fyb3VzZWwuRG90c0Nhcm91c2VsT3B0aW9uc30gW29wdGlvbnNdXG4gKiBAcmV0dXJucyB7Q2Fyb3VzZWwuYmluZENhcm91c2VsfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhcm91c2VsRG90cyhlbGVtZW50LCB7IGNsYXNzTmFtZURvdENvbnRhaW5lciA9ICdqc19kb3RzJywgY2xhc3NOYW1lU2xpZGVDb250YWluZXIgPSAnanNfc2xpZGVzJywgaW5maW5pdGUgfSA9IHt9KXtcbiAgLyoqIEB0eXBlIHtpbXBvcnQoJ2xvcnkuanMnKS5Mb3J5U3RhdGljfSAqL1xuICBsZXQgY2Fyb3VzZWw7XG4gIGNvbnN0IENMQVNTX0FDVElWRSA9ICdhY3RpdmUnO1xuICBjb25zdCBkb3RDb250YWluZXIgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC4keyBjbGFzc05hbWVEb3RDb250YWluZXIgfWApO1xuICBjb25zdCBzbGlkZUNvbnRhaW5lciA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgLiR7IGNsYXNzTmFtZVNsaWRlQ29udGFpbmVyIH1gKTtcbiAgY29uc3QgZG90Q291bnQgPSBzbGlkZUNvbnRhaW5lciA/IHNsaWRlQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA6IDA7XG5cbiAgaWYoZG90Q29udGFpbmVyICYmIGRvdENvdW50ID4gMSl7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmUubG9yeS5pbml0JywgY3JlYXRlRG90cyk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdhZnRlci5sb3J5LmluaXQnLCBiaW5kRG90cyk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdhZnRlci5sb3J5LnNsaWRlJywgc2VsZWN0QWN0aXZlRG90KTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ29uLmxvcnkucmVzaXplJywgKCkgPT4gc2VsZWN0RG90KDApKTtcbiAgfVxuXG4gIHJldHVybiBsb3J5ID0+IChjYXJvdXNlbCA9IGxvcnkpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFzIG1hbnkgZG90cyBhcyBzbGlkZXMgaW4gdGhlIGNhcm91c2VsLlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZURvdHMoKXtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZG90Q291bnQ7IGkrKyl7XG4gICAgICBkb3RDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XG4gICAgfVxuXG4gICAgZG90Q29udGFpbmVyLmNoaWxkcmVuWzBdLmNsYXNzTGlzdC5hZGQoQ0xBU1NfQUNUSVZFKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBkb3RzIGV2ZW50IGhhbmRsZXJzLlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIGJpbmREb3RzKCl7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGRvdENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICBkb3RDb250YWluZXIuY2hpbGRyZW5baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkRvdENsaWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyB0aGUgbmV3IGFjdGl2ZSBkb3QgYW5kIHVuc2VsZWN0IHRoZSBwcmV2aW91cyBhY3RpdmUgb25lLlxuICAgKiBAcGFyYW0ge0N1c3RvbUV2ZW50fSBldmVudFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIHNlbGVjdEFjdGl2ZURvdChldmVudCl7XG4gICAgc2VsZWN0RG90KGluZmluaXRlID8gZXZlbnQuZGV0YWlsLmN1cnJlbnRTbGlkZSAtIDEgOiBldmVudC5kZXRhaWwuY3VycmVudFNsaWRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyB0aGUgc2xpZGUgYXNzb2NpYXRlZCB0byB0aGUgY2xpY2tlZCBkb3QuXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gb25Eb3RDbGljayhldmVudCl7XG4gICAgY29uc3QgaW5kZXggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGRvdENvbnRhaW5lci5jaGlsZHJlbiwgZXZlbnQudGFyZ2V0KTtcbiAgICBjYXJvdXNlbC5zbGlkZVRvKGluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIHRoZSBkb3QgYXQgdGhlIGdpdmVuIGluZGV4IGFuZCB1bnNlbGVjdCBhbGwgdGhlIG90aGVycy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gc2VsZWN0RG90KGluZGV4KXtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZG90Q29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgIGRvdENvbnRhaW5lci5jaGlsZHJlbltpXS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX0FDVElWRSk7XG4gICAgfVxuXG4gICAgZG90Q29udGFpbmVyLmNoaWxkcmVuW2luZGV4XS5jbGFzc0xpc3QuYWRkKENMQVNTX0FDVElWRSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGVsYXlzIGZ1bmN0aW9uIGBmdW5jYCBpbnZvY2F0aW9uIGZvciBgd2FpdGAgbWlsbGlzZWNvbmRzLCB1c2luZyBgc2V0VGltZW91dCgpYCwgc28gdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIGxvc3QuXG4gKiBJZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIGlzIGludm9rZWQgbXVsdGlwbGUgdGltZXMgd2l0aGluIHRoZSBgd2FpdGAgcGVyaW9kLFxuICogb25seSB0aGUgbGFzdCBpbnZvY2F0aW9uIHdpbGwgYWN0dWFsbHkgY2FsbCB0aGUgZnVuY3Rpb24gYGZ1bmNgLCBjYW5jZWxpbmcgdGhlIHByZWNlZGluZyBpbnZvY2F0aW9ucy5cbiAqIEZvciBhIG1vcmUgYWR2YW5jZWQgaW1wbGVtZW50YXRpb24sIHNlZSBbbG9kYXNoLmRlYm91bmNlXShodHRwczovL2xvZGFzaC5jb20vZG9jcy80LjE3LjE1I2RlYm91bmNlKS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmNcbiAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IHRpbWUgaW4gbWlsbGlzZWNvbmRzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCA9IDApe1xuICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgbGV0IHRpbWVvdXRJZDtcblxuICAvKiogQHRoaXMgYW55ICovXG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQoLi4uYXJncyl7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpLCB3YWl0KTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL3BvbHlmaWxscy9lbGVtZW50LW1hdGNoZXMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRyYWNrRXZlbnRzLFxuICB0cmFja0V2ZW50c0luQ29udGFpbmVyLFxuICBvblRyYWNrZWRBY3Rpb24sXG4gIHRyYWNrLFxuICBnZXREYXRhRXZlbnQsXG4gIGdldFBhZ2VOYW1lLFxufTtcblxuY29uc3QgU0VMRUNUT1JfRk9MRCA9ICcuZm9sZGFibGUtdG9nZ2xlcic7XG5jb25zdCBTRUxFQ1RPUl9BTkFMWVRJQ1NfRk9STSA9ICdmb3JtLnNlYXJjaFtkYXRhLWV2ZW50LWFjdGlvbl0nO1xuY29uc3QgU0VMRUNUT1JfQU5BTFlUSUNTID0gJ1tkYXRhLWV2ZW50LWFjdGlvbl06bm90KGZvcm0pJztcblxuZnVuY3Rpb24gdHJhY2tFdmVudHMoKSB7XG4gIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUl9GT0xEKSxcbiAgICBmb2xkYWJsZUVsZW1lbnQgPT4geyBmb2xkYWJsZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG9nZ2xlJywgb25Gb2xkQWN0aW9uKTsgfVxuICApO1xuXG4gIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUl9BTkFMWVRJQ1NfRk9STSksXG4gICAgZm9ybUVsZW1lbnQgPT4geyBmb3JtRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBvblNlYXJjaEFjdGlvbik7IH1cbiAgKTtcblxuICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1JfQU5BTFlUSUNTKSxcbiAgICBlbGVtZW50ID0+IHsgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVHJhY2tlZEFjdGlvbik7IH1cbiAgKTtcbn1cblxuLyoqXG4gKiBMaWtlIGB0cmFja0V2ZW50cygpYCwgYnV0IHVzZXMgZXZlbnQgZGVsZWdhdGlvbiB0byB0cmFjayBhY3Rpb25zIGluIGEgbGl2ZSBjb250YWluZXIgKHdoaWNoIGRlbGV0ZXMgb3IgY3JlYXRlcyBuZXcgY2hpbGRyZW4pLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gKi9cbmZ1bmN0aW9uIHRyYWNrRXZlbnRzSW5Db250YWluZXIoY29udGFpbmVyKXtcbiAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvZ2dsZScsIGV2ZW50ID0+IHtcbiAgICBpZihldmVudC50YXJnZXQubWF0Y2hlcyhTRUxFQ1RPUl9GT0xEKSl7XG4gICAgICB0cmFrRm9sZEFjdGlvbihldmVudC50YXJnZXQsIGV2ZW50LmRldGFpbCk7XG4gICAgfVxuICB9KTtcblxuICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgaWYoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoU0VMRUNUT1JfQU5BTFlUSUNTKSl7XG4gICAgICB0cmFja0FjdGlvbihldmVudC50YXJnZXQpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGV2ZW50ID0+IHtcbiAgICBpZihldmVudC50YXJnZXQubWF0Y2hlcyhTRUxFQ1RPUl9BTkFMWVRJQ1NfRk9STSkpe1xuICAgICAgdHJhY2tTZWFyY2hBY3Rpb24oZXZlbnQudGFyZ2V0KTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKiogQHBhcmFtIHtDdXN0b21FdmVudDxib29sZWFuPn0gZXZlbnQgKi9cbmZ1bmN0aW9uIG9uRm9sZEFjdGlvbihldmVudCl7XG4gIHRyYWtGb2xkQWN0aW9uKGV2ZW50LmN1cnJlbnRUYXJnZXQsIGV2ZW50LmRldGFpbCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtib29sZWFufSBpc0ZvbGRlZCB0b2dnbGVyIG5ldyBzdGF0ZVxuICovXG5mdW5jdGlvbiB0cmFrRm9sZEFjdGlvbihlbGVtZW50LCBpc0ZvbGRlZCl7XG4gIC8qIFdlIHdhbnQgdG8gdHJhY2sgdGhlIGNsaWNrIG9uIHRoZSB0b2dnbGVyIGJlZm9yZSBpdCBjaGFuZ2VzIGl0cyBzdGF0ZS5cbiAgICogQnV0IGF0IHRoaXMgcG9pbnQsIGl0IGhhcyBjaGFuZ2VkIGFscmVhZHkuXG4gICAqIFNvIHdlIGdldCB0aGUgZGF0YSBjb3JyZXNwb25kaW5nIHRvIGl0cyBwcmV2aW91cyBzdGF0ZSwgd2hlbiB0aGUgY2xpY2sgb2NjdXJyZWQuXG4gICAqL1xuICBjb25zdCBkYXRhID0gZ2V0Rm9sZERhdGFFdmVudChlbGVtZW50LCAhaXNGb2xkZWQpO1xuICBpZihkYXRhICYmIGRhdGEuYWN0aW9uKXtcbiAgICB0cmFjayhkYXRhKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNGb2xkZWQgdG9nZ2xlciBuZXcgc3RhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0Rm9sZERhdGFFdmVudChlbGVtZW50LCBpc0ZvbGRlZCl7XG4gIGlmKGVsZW1lbnQpe1xuICAgIGNvbnN0IHN0YXRlID0gaXNGb2xkZWQgPyAnZm9sZGVkJyA6ICd1bmZvbGRlZCc7XG4gICAgcmV0dXJuIGdldERhdGFFdmVudChlbGVtZW50LCB7XG4gICAgICBldmVudEFjdGlvbkNsYXNzOiBgZGF0YS1ldmVudC1hY3Rpb24tJHsgc3RhdGUgfWAsXG4gICAgICBldmVudExhYmVsQ2xhc3M6IGBkYXRhLWV2ZW50LWxhYmVsLSR7IHN0YXRlIH1gLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVHJhY2sgc3VibWl0IGZvcm0gd2l0aCBwYWdlIGFzIGNhdGVnb3J5IGFuZCBhY3Rpb24gYXMgZGF0YS1ldmVudC1hY3Rpb24gb24gZm9ybSBlbGVtZW50XG4gKiBUaGUgZm9ybSBtdXN0IGNvbnRhaW4gYW4gaW5wdXRbdHlwZT1cInNlYXJjaFwiXSB0byBnZXQgYSBsYWJlbCB0cmFja2luZ1xuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqL1xuZnVuY3Rpb24gb25TZWFyY2hBY3Rpb24oZXZlbnQpIHtcbiAgdHJhY2tTZWFyY2hBY3Rpb24oZXZlbnQuY3VycmVudFRhcmdldCk7XG59XG5cbi8qKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50ICovXG5mdW5jdGlvbiB0cmFja1NlYXJjaEFjdGlvbihlbGVtZW50KXtcbiAgY29uc3Qgc2VhcmNoSW5wdXRFbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwic2VhcmNoXCJdJyk7XG4gIHRyYWNrKHtcbiAgICBjYXRlZ29yeTogZ2V0UGFnZU5hbWUoKSxcbiAgICBhY3Rpb246IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWV2ZW50LWFjdGlvbicpLFxuICAgIGxhYmVsOiBzZWFyY2hJbnB1dEVsZW1lbnQgJiYgc2VhcmNoSW5wdXRFbGVtZW50LnZhbHVlIHx8ICcnLFxuICB9KTtcbn1cblxuLyoqIEBwYXJhbSB7RXZlbnR9IGV2ZW50ICovXG5mdW5jdGlvbiBvblRyYWNrZWRBY3Rpb24oZXZlbnQpe1xuICB0cmFja0FjdGlvbihldmVudC5jdXJyZW50VGFyZ2V0KTtcbn1cblxuLyoqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgKi9cbmZ1bmN0aW9uIHRyYWNrQWN0aW9uKGVsZW1lbnQpe1xuICBjb25zdCBkYXRhID0gZ2V0RGF0YUV2ZW50KGVsZW1lbnQpO1xuICBpZihkYXRhICYmIGRhdGEuYWN0aW9uKXtcbiAgICB0cmFjayhkYXRhKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHt7IGV2ZW50QWN0aW9uQ2xhc3M/OiBzdHJpbmcsIGV2ZW50TGFiZWxDbGFzcz86IHN0cmluZyB9fSBbb3B0aW9uc11cbiAqIEByZXR1cm5zIHt7IGNhdGVnb3J5OiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nfG51bGwsIGxhYmVsOiBzdHJpbmcgfSB8IHVuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gZ2V0RGF0YUV2ZW50KGVsZW1lbnQsIHsgZXZlbnRBY3Rpb25DbGFzcz0nZGF0YS1ldmVudC1hY3Rpb24nLCBldmVudExhYmVsQ2xhc3M9J2RhdGEtZXZlbnQtbGFiZWwnfSA9IHt9KXtcbiAgaWYoZWxlbWVudCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNhdGVnb3J5OiBnZXRQYWdlTmFtZSgpLFxuICAgICAgYWN0aW9uOiBlbGVtZW50LmdldEF0dHJpYnV0ZShldmVudEFjdGlvbkNsYXNzKSxcbiAgICAgIGxhYmVsOiBlbGVtZW50LmdldEF0dHJpYnV0ZShldmVudExhYmVsQ2xhc3MpIHx8IGVsZW1lbnQudGV4dENvbnRlbnQudHJpbSgpLFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhY2soeyBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCB9KSB7XG4gIGNvbnN0IHsgZ3RhZyB9ID0gd2luZG93O1xuXG4gIGlmKGd0YWcpe1xuICAgIGd0YWcoJ2V2ZW50JywgYWN0aW9uLCB7XG4gICAgICBldmVudF9jYXRlZ29yeTogY2F0ZWdvcnksXG4gICAgICBldmVudF9sYWJlbDogbGFiZWwsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge1dpbmRvd30gY29udGV4dFxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gZ2V0UGFnZU5hbWUoY29udGV4dCA9IHdpbmRvdyl7XG4gIGNvbnN0IHsgdXJsUHJlZml4IH0gPSBjb250ZXh0O1xuICBsZXQgcGFnZU5hbWUgPSBjb250ZXh0LmRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lO1xuICBpZihwYWdlTmFtZSA9PT0gXCIvXCIpIHtcbiAgICBwYWdlTmFtZSA9IFwiSG9tZSBQYWdlXCI7XG4gIH0gZWxzZSBpZihwYWdlTmFtZS5pbmRleE9mKGAke3VybFByZWZpeH0vc2VjdG9yL2ApID09PSAwKSB7XG4gICAgcGFnZU5hbWUgPSBcIlNlY3RvciBQYWdlXCI7XG4gIH0gZWxzZSBpZiAocGFnZU5hbWUuaW5kZXhPZihgJHt1cmxQcmVmaXh9L3JhbmtpbmcvYCkgPT09IDApIHtcbiAgICBwYWdlTmFtZSA9IFwiUmFua2luZyBQYWdlXCI7XG4gIH0gZWxzZSBpZiAocGFnZU5hbWUuaW5kZXhPZignL3NlYXJjaCcpID09PSAwKSB7XG4gICAgcGFnZU5hbWUgPSAnU2VhcmNoIFBhZ2UnO1xuICB9IGVsc2UgaWYgKHBhZ2VOYW1lLmluZGV4T2YoYCR7dXJsUHJlZml4fS90aW1lc2VyaWVzL2ApID09PSAwKSB7XG4gICAgcGFnZU5hbWUgPSBcIkRhdGEgUGFnZVwiO1xuICB9XG4gIHJldHVybiBwYWdlTmFtZTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgR28gVG9wIGJ1dHRvbi5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaXRpYWxpemVHb3RvcCgpe1xuICBjb25zdCBDTEFTU19BQ1RJVkUgPSAnZ290b3AtYWN0aXZlJztcbiAgY29uc3QgU0NST0xMX0xJTUlUID0gODA7IC8vIGNvcnJlc3BvbmRzIHRvIHRoZSBoZWFkZXIncyBoZWlnaHQgKHB4KVxuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ290b3AnKTtcblxuICBidXR0b24ub25jbGljayA9IGdvQmFja1RvVG9wO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0b2dnbGVHb1RvcEJ1dHRvbik7XG4gIHRvZ2dsZUdvVG9wQnV0dG9uKCk7XG5cbiAgZnVuY3Rpb24gdG9nZ2xlR29Ub3BCdXR0b24oKXtcbiAgICBpZihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID49IFNDUk9MTF9MSU1JVCl7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChDTEFTU19BQ1RJVkUpO1xuICAgIH1lbHNle1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfQUNUSVZFKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBmdW5jdGlvbiBnb0JhY2tUb1RvcChldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgTUlOX1NVR0dFU1RJT05fU0laRSA9IDM7XG5jb25zdCBJTlBVVF9ERUxUQSA9IDEwMDtcbmNvbnN0IEVTQ0FQRV9LRVkgPSAyNztcbmNvbnN0IEhUVFBfU1RBVFVTX0NPREVfT0sgPSAyMDA7XG5jb25zdCBTVUdHRVNUX1BBVEggPSAnL3NlYXJjaC9zdWdnZXN0JztcbmNvbnN0IGV2ZW50c1NlcnZpY2UgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xuY29uc3QgZGVib3VuY2UgPSByZXF1aXJlKCcuL2RlYm91bmNlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2VhcmNoKCkge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlci1zZWFyY2gtYmFyJyk7XG4gIGNvbnN0IHN1Z2dlc3Rpb25zQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlci1zZWFyY2gtc3VnZ2VzdGlvbnMtcmVzdWx0cycpO1xuICBjb25zdCBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgbGV0IGhhc0NvbnRlbnQgPSBmYWxzZTtcblxuICBmb3JtLmFwcGVuZENoaWxkKHN1Z2dlc3Rpb25zQ29udGFpbmVyKTtcblxuICBpbnB1dC5vbmlucHV0ID0gZGVib3VuY2UocHJvY2Vzc05ld0lucHV0RXZlbnQsIElOUFVUX0RFTFRBKTtcblxuICBpbnB1dC5vbmJsdXIgPSBoaWRlU3VnZ2VzdGlvbnNDb250YWluZXI7XG5cbiAgaW5wdXQub25mb2N1cyA9IHNob3dTdWdnZXN0aW9uc0NvbnRhaW5lcjtcblxuICBpbnB1dC5vbmtleXVwID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFX0tFWSkge1xuICAgICAgaGlkZVN1Z2dlc3Rpb25zQ29udGFpbmVyKCk7XG4gICAgICBpbnB1dC5ibHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHByb2Nlc3NOZXdJbnB1dEV2ZW50KGV2ZW50KSB7XG4gICAgY29uc3QgdGV4dCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgIGlmICh0ZXh0Lmxlbmd0aCA+PSBNSU5fU1VHR0VTVElPTl9TSVpFKSB7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBgJHtTVUdHRVNUX1BBVEh9P3RleHQ9JHt0ZXh0fWApO1xuXG4gICAgICByZXF1ZXN0Lm9ubG9hZCA9IGhhbmRsZVNlYXJjaFN1Z2dlc3Rpb25zO1xuXG4gICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xlYXJTZWFyY2hTdWdnZXN0aW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVNlYXJjaFN1Z2dlc3Rpb25zKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5zdGF0dXMgPT09IEhUVFBfU1RBVFVTX0NPREVfT0spIHtcblxuICAgICAgc3VnZ2VzdGlvbnNDb250YWluZXIuaW5uZXJIVE1MID0gZXZlbnQudGFyZ2V0LnJlc3BvbnNlVGV4dDtcblxuICAgICAgLy8gcHJldmVudHMgdGhlIG1vdXNlIGNsaWNrIGZyb20gdHJpZ2dlciB0aGUgaW5wdXQgb25ibHVyIGV2ZW50XG4gICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKFxuICAgICAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdhLCAjc3VnZ2VzdGlvbi1kaWQteW91LW1lYW4nKSxcbiAgICAgICAgbGluayA9PiB7IGxpbmsub25tb3VzZWRvd24gPSBsaW5rRXZlbnQgPT4gbGlua0V2ZW50LnByZXZlbnREZWZhdWx0KCk7IH1cbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGRpZFlvdU1lYW4gPSBzdWdnZXN0aW9uc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjc3VnZ2VzdGlvbi1kaWQteW91LW1lYW4nKTtcblxuICAgICAgaWYgKGRpZFlvdU1lYW4pIHtcbiAgICAgICAgZGlkWW91TWVhbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICBpbnB1dC52YWx1ZSA9IGRpZFlvdU1lYW4udGV4dENvbnRlbnQ7XG4gICAgICAgICAgZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGhhc0NvbnRlbnQgPSB0cnVlO1xuICAgICAgc2hvd1N1Z2dlc3Rpb25zQ29udGFpbmVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsZWFyU2VhcmNoU3VnZ2VzdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhclNlYXJjaFN1Z2dlc3Rpb25zKCkge1xuICAgIGhpZGVTdWdnZXN0aW9uc0NvbnRhaW5lcigpO1xuICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGhhc0NvbnRlbnQgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dTdWdnZXN0aW9uc0NvbnRhaW5lcigpIHtcbiAgICBpZiAoaGFzQ29udGVudCkge1xuICAgICAgc3VnZ2VzdGlvbnNDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cbiAgICAgIC8vbW9uaXRvciBjbGlja3Mgb24gc3VnZ2VzdGlvbnNcbiAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNoZWFkZXItc2VhcmNoLXN1Z2dlc3Rpb25zLXJlc3VsdHMgKltkYXRhLWV2ZW50LWFjdGlvbl0nKSxcbiAgICAgICAgZWxlbWVudCA9PiB7IGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudHNTZXJ2aWNlLm9uVHJhY2tlZEFjdGlvbik7IH1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGlkZVN1Z2dlc3Rpb25zQ29udGFpbmVyKCkge1xuICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFic2V0XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhpZGVhYmxlXSB3aGVuICoqZmFsc2UqKiwgdGhlcmUgaXMgYWx3YXlzIDEgZGlzcGxheWVkIHRhYi4gT3RoZXJ3aXNlLCBhbGwgdGFicyBjYW4gYmUgaGlkZGVuIGF0IHRoZSBzYW1lIHRpbWUuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbml0aWFsaXplVGFicyh0YWJzZXQsIHsgaGlkZWFibGUgfSA9IHt9KXtcbiAgY29uc3QgQ0xBU1NfQUNUSVZFID0gJ2FjdGl2ZSc7XG5cbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChcbiAgICB0YWJzZXQucXVlcnlTZWxlY3RvckFsbCgnLnRhYnMgPiAudGFiJyksXG4gICAgdGFiID0+IHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVGFiQ2xpY2spXG4gICk7XG5cbiAgaWYoaGlkZWFibGUpe1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja091dHNpZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXlzIHRoZSBzZWxlY3RlZCB0YWIgcGFuZS5cbiAgICogQHRoaXMge0VsZW1lbnR9XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gb25UYWJDbGljaygpe1xuICAgIGxldCB0YWJJbmRleDtcblxuICAgIGlmKCF0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19BQ1RJVkUpKXtcbiAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgICAgIHRhYnNldC5xdWVyeVNlbGVjdG9yQWxsKCcudGFicyA+IC50YWInKSxcbiAgICAgICAgKHRhYiwgaSkgPT4ge1xuICAgICAgICAgIGlmKHRhYiA9PT0gdGhpcyl7XG4gICAgICAgICAgICB0YWIuY2xhc3NMaXN0LmFkZChDTEFTU19BQ1RJVkUpO1xuICAgICAgICAgICAgdGFiSW5kZXggPSBpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfQUNUSVZFKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgICAgIHRhYnNldC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiLXBhbmUnKSxcbiAgICAgICAgKHBhbmUsIGkpID0+IGkgPT09IHRhYkluZGV4ID8gcGFuZS5jbGFzc0xpc3QuYWRkKENMQVNTX0FDVElWRSkgOiBwYW5lLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfQUNUSVZFKVxuICAgICAgKTtcbiAgICB9ZWxzZSBpZihoaWRlYWJsZSl7XG4gICAgICBoaWRlQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhpZGVzIGFsbCBwYW5lcyBpZiB0aGUgY2xpY2tlZCBlbGVtZW50IGlzIG91dHNpZGUgdGhlIHRhYnNldC4gT3RoZXJ3aXNlLCBkb2VzIG5vdGhpbmcuXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gb25DbGlja091dHNpZGUoZXZlbnQpe1xuICAgIGlmKCF0YWJzZXQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSl7XG4gICAgICBoaWRlQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhpZGVzIGFsbCB0YWJzIGFuZCBwYW5lcy5cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBmdW5jdGlvbiBoaWRlQWxsKCl7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChcbiAgICAgIHRhYnNldC5xdWVyeVNlbGVjdG9yQWxsKCcudGFicyA+IC50YWIuYWN0aXZlLCAudGFiLXBhbmUuYWN0aXZlJyksXG4gICAgICBwYW5lID0+IHBhbmUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19BQ1RJVkUpXG4gICAgKTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IFR5cGVFcnJvcihTdHJpbmcoaXQpICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhpdCkgKyAnIGlzIG5vdCBhbiBvYmplY3QnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLmZvckVhY2g7XG52YXIgYXJyYXlNZXRob2RJc1N0cmljdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaXMtc3RyaWN0Jyk7XG52YXIgYXJyYXlNZXRob2RVc2VzVG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLXVzZXMtdG8tbGVuZ3RoJyk7XG5cbnZhciBTVFJJQ1RfTUVUSE9EID0gYXJyYXlNZXRob2RJc1N0cmljdCgnZm9yRWFjaCcpO1xudmFyIFVTRVNfVE9fTEVOR1RIID0gYXJyYXlNZXRob2RVc2VzVG9MZW5ndGgoJ2ZvckVhY2gnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG5tb2R1bGUuZXhwb3J0cyA9ICghU1RSSUNUX01FVEhPRCB8fCAhVVNFU19UT19MRU5HVEgpID8gZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICByZXR1cm4gJGZvckVhY2godGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xufSA6IFtdLmZvckVhY2g7XG4iLCJ2YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4Jyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBpbmRleE9mLCBpbmNsdWRlcyB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgIGlmICgoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykgJiYgT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5pbmNsdWRlc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xuICBpbmNsdWRlczogY3JlYXRlTWV0aG9kKHRydWUpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuICBpbmRleE9mOiBjcmVhdGVNZXRob2QoZmFsc2UpXG59O1xuIiwidmFyIGJpbmQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1jb250ZXh0Jyk7XG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWxlbmd0aCcpO1xudmFyIGFycmF5U3BlY2llc0NyZWF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xuXG52YXIgcHVzaCA9IFtdLnB1c2g7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBmb3JFYWNoLCBtYXAsIGZpbHRlciwgc29tZSwgZXZlcnksIGZpbmQsIGZpbmRJbmRleCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgdmFyIElTX01BUCA9IFRZUEUgPT0gMTtcbiAgdmFyIElTX0ZJTFRFUiA9IFRZUEUgPT0gMjtcbiAgdmFyIElTX1NPTUUgPSBUWVBFID09IDM7XG4gIHZhciBJU19FVkVSWSA9IFRZUEUgPT0gNDtcbiAgdmFyIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDY7XG4gIHZhciBOT19IT0xFUyA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYO1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0LCBzcGVjaWZpY0NyZWF0ZSkge1xuICAgIHZhciBPID0gdG9PYmplY3QoJHRoaXMpO1xuICAgIHZhciBzZWxmID0gSW5kZXhlZE9iamVjdChPKTtcbiAgICB2YXIgYm91bmRGdW5jdGlvbiA9IGJpbmQoY2FsbGJhY2tmbiwgdGhhdCwgMyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjcmVhdGUgPSBzcGVjaWZpY0NyZWF0ZSB8fCBhcnJheVNwZWNpZXNDcmVhdGU7XG4gICAgdmFyIHRhcmdldCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHZhbHVlLCByZXN1bHQ7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKSB7XG4gICAgICB2YWx1ZSA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzdWx0ID0gYm91bmRGdW5jdGlvbih2YWx1ZSwgaW5kZXgsIE8pO1xuICAgICAgaWYgKFRZUEUpIHtcbiAgICAgICAgaWYgKElTX01BUCkgdGFyZ2V0W2luZGV4XSA9IHJlc3VsdDsgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYgKHJlc3VsdCkgc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWx1ZTsgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHB1c2guY2FsbCh0YXJnZXQsIHZhbHVlKTsgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZiAoSVNfRVZFUlkpIHJldHVybiBmYWxzZTsgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiB0YXJnZXQ7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbiAgZm9yRWFjaDogY3JlYXRlTWV0aG9kKDApLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLm1hcGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5tYXBcbiAgbWFwOiBjcmVhdGVNZXRob2QoMSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmlsdGVyYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbHRlclxuICBmaWx0ZXI6IGNyZWF0ZU1ldGhvZCgyKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5zb21lYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnNvbWVcbiAgc29tZTogY3JlYXRlTWV0aG9kKDMpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmV2ZXJ5YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmV2ZXJ5XG4gIGV2ZXJ5OiBjcmVhdGVNZXRob2QoNCksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmluZGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maW5kXG4gIGZpbmQ6IGNyZWF0ZU1ldGhvZCg1KSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXhgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZEluZGV4XG4gIGZpbmRJbmRleDogY3JlYXRlTWV0aG9kKDYpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBhcmd1bWVudCkge1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICByZXR1cm4gISFtZXRob2QgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGwsbm8tdGhyb3ctbGl0ZXJhbFxuICAgIG1ldGhvZC5jYWxsKG51bGwsIGFyZ3VtZW50IHx8IGZ1bmN0aW9uICgpIHsgdGhyb3cgMTsgfSwgMSk7XG4gIH0pO1xufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgY2FjaGUgPSB7fTtcblxudmFyIHRocm93ZXIgPSBmdW5jdGlvbiAoaXQpIHsgdGhyb3cgaXQ7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBvcHRpb25zKSB7XG4gIGlmIChoYXMoY2FjaGUsIE1FVEhPRF9OQU1FKSkgcmV0dXJuIGNhY2hlW01FVEhPRF9OQU1FXTtcbiAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gIHZhciBtZXRob2QgPSBbXVtNRVRIT0RfTkFNRV07XG4gIHZhciBBQ0NFU1NPUlMgPSBoYXMob3B0aW9ucywgJ0FDQ0VTU09SUycpID8gb3B0aW9ucy5BQ0NFU1NPUlMgOiBmYWxzZTtcbiAgdmFyIGFyZ3VtZW50MCA9IGhhcyhvcHRpb25zLCAwKSA/IG9wdGlvbnNbMF0gOiB0aHJvd2VyO1xuICB2YXIgYXJndW1lbnQxID0gaGFzKG9wdGlvbnMsIDEpID8gb3B0aW9uc1sxXSA6IHVuZGVmaW5lZDtcblxuICByZXR1cm4gY2FjaGVbTUVUSE9EX05BTUVdID0gISFtZXRob2QgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoQUNDRVNTT1JTICYmICFERVNDUklQVE9SUykgcmV0dXJuIHRydWU7XG4gICAgdmFyIE8gPSB7IGxlbmd0aDogLTEgfTtcblxuICAgIGlmIChBQ0NFU1NPUlMpIGRlZmluZVByb3BlcnR5KE8sIDEsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiB0aHJvd2VyIH0pO1xuICAgIGVsc2UgT1sxXSA9IDE7XG5cbiAgICBtZXRob2QuY2FsbChPLCBhcmd1bWVudDAsIGFyZ3VtZW50MSk7XG4gIH0pO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbi8vIGBBcnJheVNwZWNpZXNDcmVhdGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXlzcGVjaWVzY3JlYXRlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbEFycmF5LCBsZW5ndGgpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsQXJyYXkpKSB7XG4gICAgQyA9IG9yaWdpbmFsQXJyYXkuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGVsc2UgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gbmV3IChDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEMpKGxlbmd0aCA9PT0gMCA/IDAgOiBsZW5ndGgpO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgb3duS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vd24ta2V5cycpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuICB2YXIga2V5cyA9IG93bktleXMoc291cmNlKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHlNb2R1bGUuZjtcbiAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZS5mO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoIWhhcyh0YXJnZXQsIGtleSkpIGRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTtcbiAgfVxufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBrZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgMSwgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSlbMV0gIT0gNztcbn0pO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxudmFyIGRvY3VtZW50ID0gZ2xvYmFsLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgRVhJU1RTID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gRVhJU1RTID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBpdGVyYWJsZSBET00gY29sbGVjdGlvbnNcbi8vIGZsYWcgLSBgaXRlcmFibGVgIGludGVyZmFjZSAtICdlbnRyaWVzJywgJ2tleXMnLCAndmFsdWVzJywgJ2ZvckVhY2gnIG1ldGhvZHNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBDU1NSdWxlTGlzdDogMCxcbiAgQ1NTU3R5bGVEZWNsYXJhdGlvbjogMCxcbiAgQ1NTVmFsdWVMaXN0OiAwLFxuICBDbGllbnRSZWN0TGlzdDogMCxcbiAgRE9NUmVjdExpc3Q6IDAsXG4gIERPTVN0cmluZ0xpc3Q6IDAsXG4gIERPTVRva2VuTGlzdDogMSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IDAsXG4gIEZpbGVMaXN0OiAwLFxuICBIVE1MQWxsQ29sbGVjdGlvbjogMCxcbiAgSFRNTENvbGxlY3Rpb246IDAsXG4gIEhUTUxGb3JtRWxlbWVudDogMCxcbiAgSFRNTFNlbGVjdEVsZW1lbnQ6IDAsXG4gIE1lZGlhTGlzdDogMCxcbiAgTWltZVR5cGVBcnJheTogMCxcbiAgTmFtZWROb2RlTWFwOiAwLFxuICBOb2RlTGlzdDogMSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogMCxcbiAgUGx1Z2luOiAwLFxuICBQbHVnaW5BcnJheTogMCxcbiAgU1ZHTGVuZ3RoTGlzdDogMCxcbiAgU1ZHTnVtYmVyTGlzdDogMCxcbiAgU1ZHUGF0aFNlZ0xpc3Q6IDAsXG4gIFNWR1BvaW50TGlzdDogMCxcbiAgU1ZHU3RyaW5nTGlzdDogMCxcbiAgU1ZHVHJhbnNmb3JtTGlzdDogMCxcbiAgU291cmNlQnVmZmVyTGlzdDogMCxcbiAgU3R5bGVTaGVldExpc3Q6IDAsXG4gIFRleHRUcmFja0N1ZUxpc3Q6IDAsXG4gIFRleHRUcmFja0xpc3Q6IDAsXG4gIFRvdWNoTGlzdDogMFxufTtcbiIsIi8vIElFOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdjb25zdHJ1Y3RvcicsXG4gICdoYXNPd25Qcm9wZXJ0eScsXG4gICdpc1Byb3RvdHlwZU9mJyxcbiAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgJ3RvU3RyaW5nJyxcbiAgJ3ZhbHVlT2YnXG5dO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpLmY7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgc2V0R2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwnKTtcbnZhciBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcycpO1xudmFyIGlzRm9yY2VkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCcpO1xuXG4vKlxuICBvcHRpb25zLnRhcmdldCAgICAgIC0gbmFtZSBvZiB0aGUgdGFyZ2V0IG9iamVjdFxuICBvcHRpb25zLmdsb2JhbCAgICAgIC0gdGFyZ2V0IGlzIHRoZSBnbG9iYWwgb2JqZWN0XG4gIG9wdGlvbnMuc3RhdCAgICAgICAgLSBleHBvcnQgYXMgc3RhdGljIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucHJvdG8gICAgICAgLSBleHBvcnQgYXMgcHJvdG90eXBlIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucmVhbCAgICAgICAgLSByZWFsIHByb3RvdHlwZSBtZXRob2QgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLmZvcmNlZCAgICAgIC0gZXhwb3J0IGV2ZW4gaWYgdGhlIG5hdGl2ZSBmZWF0dXJlIGlzIGF2YWlsYWJsZVxuICBvcHRpb25zLmJpbmQgICAgICAgIC0gYmluZCBtZXRob2RzIHRvIHRoZSB0YXJnZXQsIHJlcXVpcmVkIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy53cmFwICAgICAgICAtIHdyYXAgY29uc3RydWN0b3JzIHRvIHByZXZlbnRpbmcgZ2xvYmFsIHBvbGx1dGlvbiwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLnVuc2FmZSAgICAgIC0gdXNlIHRoZSBzaW1wbGUgYXNzaWdubWVudCBvZiBwcm9wZXJ0eSBpbnN0ZWFkIG9mIGRlbGV0ZSArIGRlZmluZVByb3BlcnR5XG4gIG9wdGlvbnMuc2hhbSAgICAgICAgLSBhZGQgYSBmbGFnIHRvIG5vdCBjb21wbGV0ZWx5IGZ1bGwgcG9seWZpbGxzXG4gIG9wdGlvbnMuZW51bWVyYWJsZSAgLSBleHBvcnQgYXMgZW51bWVyYWJsZSBwcm9wZXJ0eVxuICBvcHRpb25zLm5vVGFyZ2V0R2V0IC0gcHJldmVudCBjYWxsaW5nIGEgZ2V0dGVyIG9uIHRhcmdldFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMsIHNvdXJjZSkge1xuICB2YXIgVEFSR0VUID0gb3B0aW9ucy50YXJnZXQ7XG4gIHZhciBHTE9CQUwgPSBvcHRpb25zLmdsb2JhbDtcbiAgdmFyIFNUQVRJQyA9IG9wdGlvbnMuc3RhdDtcbiAgdmFyIEZPUkNFRCwgdGFyZ2V0LCBrZXksIHRhcmdldFByb3BlcnR5LCBzb3VyY2VQcm9wZXJ0eSwgZGVzY3JpcHRvcjtcbiAgaWYgKEdMT0JBTCkge1xuICAgIHRhcmdldCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmIChTVEFUSUMpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWxbVEFSR0VUXSB8fCBzZXRHbG9iYWwoVEFSR0VULCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0ID0gKGdsb2JhbFtUQVJHRVRdIHx8IHt9KS5wcm90b3R5cGU7XG4gIH1cbiAgaWYgKHRhcmdldCkgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgc291cmNlUHJvcGVydHkgPSBzb3VyY2Vba2V5XTtcbiAgICBpZiAob3B0aW9ucy5ub1RhcmdldEdldCkge1xuICAgICAgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gICAgICB0YXJnZXRQcm9wZXJ0eSA9IGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci52YWx1ZTtcbiAgICB9IGVsc2UgdGFyZ2V0UHJvcGVydHkgPSB0YXJnZXRba2V5XTtcbiAgICBGT1JDRUQgPSBpc0ZvcmNlZChHTE9CQUwgPyBrZXkgOiBUQVJHRVQgKyAoU1RBVElDID8gJy4nIDogJyMnKSArIGtleSwgb3B0aW9ucy5mb3JjZWQpO1xuICAgIC8vIGNvbnRhaW5lZCBpbiB0YXJnZXRcbiAgICBpZiAoIUZPUkNFRCAmJiB0YXJnZXRQcm9wZXJ0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodHlwZW9mIHNvdXJjZVByb3BlcnR5ID09PSB0eXBlb2YgdGFyZ2V0UHJvcGVydHkpIGNvbnRpbnVlO1xuICAgICAgY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyhzb3VyY2VQcm9wZXJ0eSwgdGFyZ2V0UHJvcGVydHkpO1xuICAgIH1cbiAgICAvLyBhZGQgYSBmbGFnIHRvIG5vdCBjb21wbGV0ZWx5IGZ1bGwgcG9seWZpbGxzXG4gICAgaWYgKG9wdGlvbnMuc2hhbSB8fCAodGFyZ2V0UHJvcGVydHkgJiYgdGFyZ2V0UHJvcGVydHkuc2hhbSkpIHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShzb3VyY2VQcm9wZXJ0eSwgJ3NoYW0nLCB0cnVlKTtcbiAgICB9XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzb3VyY2VQcm9wZXJ0eSwgb3B0aW9ucyk7XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwidmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWZ1bmN0aW9uJyk7XG5cbi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCk7XG4gICAgfTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJ2YXIgcGF0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9wYXRoJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG52YXIgYUZ1bmN0aW9uID0gZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFyaWFibGUgPT0gJ2Z1bmN0aW9uJyA/IHZhcmlhYmxlIDogdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBtZXRob2QpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAyID8gYUZ1bmN0aW9uKHBhdGhbbmFtZXNwYWNlXSkgfHwgYUZ1bmN0aW9uKGdsb2JhbFtuYW1lc3BhY2VdKVxuICAgIDogcGF0aFtuYW1lc3BhY2VdICYmIHBhdGhbbmFtZXNwYWNlXVttZXRob2RdIHx8IGdsb2JhbFtuYW1lc3BhY2VdICYmIGdsb2JhbFtuYW1lc3BhY2VdW21ldGhvZF07XG59O1xuIiwidmFyIGNoZWNrID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAmJiBpdC5NYXRoID09IE1hdGggJiYgaXQ7XG59O1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxubW9kdWxlLmV4cG9ydHMgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgY2hlY2sodHlwZW9mIGdsb2JhbFRoaXMgPT0gJ29iamVjdCcgJiYgZ2xvYmFsVGhpcykgfHxcbiAgY2hlY2sodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cpIHx8XG4gIGNoZWNrKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYpIHx8XG4gIGNoZWNrKHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKSB8fFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQnKTtcblxuLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhREVTQ1JJUFRPUlMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjcmVhdGVFbGVtZW50KCdkaXYnKSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9XG4gIH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xuXG52YXIgc3BsaXQgPSAnJy5zcGxpdDtcblxuLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3Ncbm1vZHVsZS5leHBvcnRzID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyB0aHJvd3MgYW4gZXJyb3IgaW4gcmhpbm8sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9yaGluby9pc3N1ZXMvMzQ2XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgcmV0dXJuICFPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKTtcbn0pID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjbGFzc29mKGl0KSA9PSAnU3RyaW5nJyA/IHNwbGl0LmNhbGwoaXQsICcnKSA6IE9iamVjdChpdCk7XG59IDogT2JqZWN0O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xuXG52YXIgZnVuY3Rpb25Ub1N0cmluZyA9IEZ1bmN0aW9uLnRvU3RyaW5nO1xuXG4vLyB0aGlzIGhlbHBlciBicm9rZW4gaW4gYDMuNC4xLTMuNC40YCwgc28gd2UgY2FuJ3QgdXNlIGBzaGFyZWRgIGhlbHBlclxuaWYgKHR5cGVvZiBzdG9yZS5pbnNwZWN0U291cmNlICE9ICdmdW5jdGlvbicpIHtcbiAgc3RvcmUuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBmdW5jdGlvblRvU3RyaW5nLmNhbGwoaXQpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlLmluc3BlY3RTb3VyY2U7XG4iLCJ2YXIgTkFUSVZFX1dFQUtfTUFQID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL25hdGl2ZS13ZWFrLW1hcCcpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgb2JqZWN0SGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHNoYXJlZEtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQta2V5Jyk7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xudmFyIHNldCwgZ2V0LCBoYXM7XG5cbnZhciBlbmZvcmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBoYXMoaXQpID8gZ2V0KGl0KSA6IHNldChpdCwge30pO1xufTtcblxudmFyIGdldHRlckZvciA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXQpIHtcbiAgICB2YXIgc3RhdGU7XG4gICAgaWYgKCFpc09iamVjdChpdCkgfHwgKHN0YXRlID0gZ2V0KGl0KSkudHlwZSAhPT0gVFlQRSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCcpO1xuICAgIH0gcmV0dXJuIHN0YXRlO1xuICB9O1xufTtcblxuaWYgKE5BVElWRV9XRUFLX01BUCkge1xuICB2YXIgc3RvcmUgPSBuZXcgV2Vha01hcCgpO1xuICB2YXIgd21nZXQgPSBzdG9yZS5nZXQ7XG4gIHZhciB3bWhhcyA9IHN0b3JlLmhhcztcbiAgdmFyIHdtc2V0ID0gc3RvcmUuc2V0O1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgd21zZXQuY2FsbChzdG9yZSwgaXQsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWdldC5jYWxsKHN0b3JlLCBpdCkgfHwge307XG4gIH07XG4gIGhhcyA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWhhcy5jYWxsKHN0b3JlLCBpdCk7XG4gIH07XG59IGVsc2Uge1xuICB2YXIgU1RBVEUgPSBzaGFyZWRLZXkoJ3N0YXRlJyk7XG4gIGhpZGRlbktleXNbU1RBVEVdID0gdHJ1ZTtcbiAgc2V0ID0gZnVuY3Rpb24gKGl0LCBtZXRhZGF0YSkge1xuICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShpdCwgU1RBVEUsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBvYmplY3RIYXMoaXQsIFNUQVRFKSA/IGl0W1NUQVRFXSA6IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gb2JqZWN0SGFzKGl0LCBTVEFURSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldCxcbiAgZ2V0OiBnZXQsXG4gIGhhczogaGFzLFxuICBlbmZvcmNlOiBlbmZvcmNlLFxuICBnZXR0ZXJGb3I6IGdldHRlckZvclxufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbi8vIGBJc0FycmF5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzYXJyYXlcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY2xhc3NvZihhcmcpID09ICdBcnJheSc7XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbnZhciByZXBsYWNlbWVudCA9IC8jfFxcLnByb3RvdHlwZVxcLi87XG5cbnZhciBpc0ZvcmNlZCA9IGZ1bmN0aW9uIChmZWF0dXJlLCBkZXRlY3Rpb24pIHtcbiAgdmFyIHZhbHVlID0gZGF0YVtub3JtYWxpemUoZmVhdHVyZSldO1xuICByZXR1cm4gdmFsdWUgPT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PSBOQVRJVkUgPyBmYWxzZVxuICAgIDogdHlwZW9mIGRldGVjdGlvbiA9PSAnZnVuY3Rpb24nID8gZmFpbHMoZGV0ZWN0aW9uKVxuICAgIDogISFkZXRlY3Rpb247XG59O1xuXG52YXIgbm9ybWFsaXplID0gaXNGb3JjZWQubm9ybWFsaXplID0gZnVuY3Rpb24gKHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZShyZXBsYWNlbWVudCwgJy4nKS50b0xvd2VyQ2FzZSgpO1xufTtcblxudmFyIGRhdGEgPSBpc0ZvcmNlZC5kYXRhID0ge307XG52YXIgTkFUSVZFID0gaXNGb3JjZWQuTkFUSVZFID0gJ04nO1xudmFyIFBPTFlGSUxMID0gaXNGb3JjZWQuUE9MWUZJTEwgPSAnUCc7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGb3JjZWQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gQ2hyb21lIDM4IFN5bWJvbCBoYXMgaW5jb3JyZWN0IHRvU3RyaW5nIGNvbnZlcnNpb25cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHJldHVybiAhU3RyaW5nKFN5bWJvbCgpKTtcbn0pO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpbnNwZWN0U291cmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlJyk7XG5cbnZhciBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIFdlYWtNYXAgPT09ICdmdW5jdGlvbicgJiYgL25hdGl2ZSBjb2RlLy50ZXN0KGluc3BlY3RTb3VyY2UoV2Vha01hcCkpO1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcblxudmFyIG5hdGl2ZURlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyBuYXRpdmVEZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcblxudmFyIG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApIHtcbiAgTyA9IHRvSW5kZXhlZE9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoaGFzKE8sIFApKSByZXR1cm4gY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKCFwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsInZhciBpbnRlcm5hbE9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzJyk7XG5cbnZhciBoaWRkZW5LZXlzID0gZW51bUJ1Z0tleXMuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHluYW1lc1xuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgaW5kZXhPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pbmNsdWRlcycpLmluZGV4T2Y7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSAhaGFzKGhpZGRlbktleXMsIGtleSkgJiYgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5pbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIG5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gTmFzaG9ybiB+IEpESzggYnVnXG52YXIgTkFTSE9STl9CVUcgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgIW5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoeyAxOiAyIH0sIDEpO1xuXG4vLyBgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZWAgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QucHJvdG90eXBlLnByb3BlcnR5aXNlbnVtZXJhYmxlXG5leHBvcnRzLmYgPSBOQVNIT1JOX0JVRyA/IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKFYpIHtcbiAgdmFyIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcywgVik7XG4gIHJldHVybiAhIWRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5lbnVtZXJhYmxlO1xufSA6IG5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwidmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcycpO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbi8vIGFsbCBvYmplY3Qga2V5cywgaW5jbHVkZXMgbm9uLWVudW1lcmFibGUgYW5kIHN5bWJvbHNcbm1vZHVsZS5leHBvcnRzID0gZ2V0QnVpbHRJbignUmVmbGVjdCcsICdvd25LZXlzJykgfHwgZnVuY3Rpb24gb3duS2V5cyhpdCkge1xuICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUuZihhbk9iamVjdChpdCkpO1xuICB2YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlLmY7XG4gIHJldHVybiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPyBrZXlzLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpKSA6IGtleXM7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgc2V0R2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwnKTtcbnZhciBpbnNwZWN0U291cmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xuXG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyIGVuZm9yY2VJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5lbmZvcmNlO1xudmFyIFRFTVBMQVRFID0gU3RyaW5nKFN0cmluZykuc3BsaXQoJ1N0cmluZycpO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgdW5zYWZlID0gb3B0aW9ucyA/ICEhb3B0aW9ucy51bnNhZmUgOiBmYWxzZTtcbiAgdmFyIHNpbXBsZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMuZW51bWVyYWJsZSA6IGZhbHNlO1xuICB2YXIgbm9UYXJnZXRHZXQgPSBvcHRpb25zID8gISFvcHRpb25zLm5vVGFyZ2V0R2V0IDogZmFsc2U7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICh0eXBlb2Yga2V5ID09ICdzdHJpbmcnICYmICFoYXModmFsdWUsICduYW1lJykpIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSh2YWx1ZSwgJ25hbWUnLCBrZXkpO1xuICAgIGVuZm9yY2VJbnRlcm5hbFN0YXRlKHZhbHVlKS5zb3VyY2UgPSBURU1QTEFURS5qb2luKHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBrZXkgOiAnJyk7XG4gIH1cbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICAgIGVsc2Ugc2V0R2xvYmFsKGtleSwgdmFsdWUpO1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmICghdW5zYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgfSBlbHNlIGlmICghbm9UYXJnZXRHZXQgJiYgT1trZXldKSB7XG4gICAgc2ltcGxlID0gdHJ1ZTtcbiAgfVxuICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgZWxzZSBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoTywga2V5LCB2YWx1ZSk7XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIGdldEludGVybmFsU3RhdGUodGhpcykuc291cmNlIHx8IGluc3BlY3RTb3VyY2UodGhpcyk7XG59KTtcbiIsIi8vIGBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlcXVpcmVvYmplY3Rjb2VyY2libGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdHJ5IHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoZ2xvYmFsLCBrZXksIHZhbHVlKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBnbG9iYWxba2V5XSA9IHZhbHVlO1xuICB9IHJldHVybiB2YWx1ZTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZCcpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcblxudmFyIGtleXMgPSBzaGFyZWQoJ2tleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBrZXlzW2tleV0gfHwgKGtleXNba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHNldEdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtZ2xvYmFsJyk7XG5cbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IHNldEdsb2JhbChTSEFSRUQsIHt9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZTtcbiIsInZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246ICczLjYuNScsXG4gIG1vZGU6IElTX1BVUkUgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAyMCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgd2hpdGVzcGFjZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2hpdGVzcGFjZXMnKTtcblxudmFyIG5vbiA9ICdcXHUyMDBCXFx1MDA4NVxcdTE4MEUnO1xuXG4vLyBjaGVjayB0aGF0IGEgbWV0aG9kIHdvcmtzIHdpdGggdGhlIGNvcnJlY3QgbGlzdFxuLy8gb2Ygd2hpdGVzcGFjZXMgYW5kIGhhcyBhIGNvcnJlY3QgbmFtZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgcmV0dXJuIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gISF3aGl0ZXNwYWNlc1tNRVRIT0RfTkFNRV0oKSB8fCBub25bTUVUSE9EX05BTUVdKCkgIT0gbm9uIHx8IHdoaXRlc3BhY2VzW01FVEhPRF9OQU1FXS5uYW1lICE9PSBNRVRIT0RfTkFNRTtcbiAgfSk7XG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG52YXIgd2hpdGVzcGFjZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2hpdGVzcGFjZXMnKTtcblxudmFyIHdoaXRlc3BhY2UgPSAnWycgKyB3aGl0ZXNwYWNlcyArICddJztcbnZhciBsdHJpbSA9IFJlZ0V4cCgnXicgKyB3aGl0ZXNwYWNlICsgd2hpdGVzcGFjZSArICcqJyk7XG52YXIgcnRyaW0gPSBSZWdFeHAod2hpdGVzcGFjZSArIHdoaXRlc3BhY2UgKyAnKiQnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUueyB0cmltLCB0cmltU3RhcnQsIHRyaW1FbmQsIHRyaW1MZWZ0LCB0cmltUmlnaHQgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUoJHRoaXMpKTtcbiAgICBpZiAoVFlQRSAmIDEpIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKGx0cmltLCAnJyk7XG4gICAgaWYgKFRZUEUgJiAyKSBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShydHJpbSwgJycpO1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUueyB0cmltTGVmdCwgdHJpbVN0YXJ0IH1gIG1ldGhvZHNcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS50cmltc3RhcnRcbiAgc3RhcnQ6IGNyZWF0ZU1ldGhvZCgxKSxcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUueyB0cmltUmlnaHQsIHRyaW1FbmQgfWAgbWV0aG9kc1xuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1lbmRcbiAgZW5kOiBjcmVhdGVNZXRob2QoMiksXG4gIC8vIGBTdHJpbmcucHJvdG90eXBlLnRyaW1gIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1cbiAgdHJpbTogY3JlYXRlTWV0aG9kKDMpXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyJyk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gSGVscGVyIGZvciBhIHBvcHVsYXIgcmVwZWF0aW5nIGNhc2Ugb2YgdGhlIHNwZWM6XG4vLyBMZXQgaW50ZWdlciBiZSA/IFRvSW50ZWdlcihpbmRleCkuXG4vLyBJZiBpbnRlZ2VyIDwgMCwgbGV0IHJlc3VsdCBiZSBtYXgoKGxlbmd0aCArIGludGVnZXIpLCAwKTsgZWxzZSBsZXQgcmVzdWx0IGJlIG1pbihpbnRlZ2VyLCBsZW5ndGgpLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICB2YXIgaW50ZWdlciA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbnRlZ2VyIDwgMCA/IG1heChpbnRlZ2VyICsgbGVuZ3RoLCAwKSA6IG1pbihpbnRlZ2VyLCBsZW5ndGgpO1xufTtcbiIsIi8vIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJbmRleGVkT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoaXQpKTtcbn07XG4iLCJ2YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBUb0ludGVnZXJgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9pbnRlZ2VyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gaXNOYU4oYXJndW1lbnQgPSArYXJndW1lbnQpID8gMCA6IChhcmd1bWVudCA+IDAgPyBmbG9vciA6IGNlaWwpKGFyZ3VtZW50KTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcblxudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBgVG9MZW5ndGhgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBhcmd1bWVudCA+IDAgPyBtaW4odG9JbnRlZ2VyKGFyZ3VtZW50KSwgMHgxRkZGRkZGRkZGRkZGRikgOiAwOyAvLyAyICoqIDUzIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbi8vIGBUb09iamVjdGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b29iamVjdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIE9iamVjdChyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KSk7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG4vLyBgVG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9wcmltaXRpdmVcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5wdXQsIFBSRUZFUlJFRF9TVFJJTkcpIHtcbiAgaWYgKCFpc09iamVjdChpbnB1dCkpIHJldHVybiBpbnB1dDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChQUkVGRVJSRURfU1RSSU5HICYmIHR5cGVvZiAoZm4gPSBpbnB1dC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGlucHV0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFQUkVGRVJSRURfU1RSSU5HICYmIHR5cGVvZiAoZm4gPSBpbnB1dC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcgKyBTdHJpbmcoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSkgKyAnKV8nICsgKCsraWQgKyBwb3N0Zml4KS50b1N0cmluZygzNik7XG59O1xuIiwidmFyIE5BVElWRV9TWU1CT0wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5BVElWRV9TWU1CT0xcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICYmICFTeW1ib2wuc2hhbVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJztcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG52YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtc3ltYm9sJyk7XG52YXIgVVNFX1NZTUJPTF9BU19VSUQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdXNlLXN5bWJvbC1hcy11aWQnKTtcblxudmFyIFdlbGxLbm93blN5bWJvbHNTdG9yZSA9IHNoYXJlZCgnd2tzJyk7XG52YXIgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbnZhciBjcmVhdGVXZWxsS25vd25TeW1ib2wgPSBVU0VfU1lNQk9MX0FTX1VJRCA/IFN5bWJvbCA6IFN5bWJvbCAmJiBTeW1ib2wud2l0aG91dFNldHRlciB8fCB1aWQ7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgaWYgKCFoYXMoV2VsbEtub3duU3ltYm9sc1N0b3JlLCBuYW1lKSkge1xuICAgIGlmIChOQVRJVkVfU1lNQk9MICYmIGhhcyhTeW1ib2wsIG5hbWUpKSBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPSBTeW1ib2xbbmFtZV07XG4gICAgZWxzZSBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPSBjcmVhdGVXZWxsS25vd25TeW1ib2woJ1N5bWJvbC4nICsgbmFtZSk7XG4gIH0gcmV0dXJuIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXTtcbn07XG4iLCIvLyBhIHN0cmluZyBvZiBhbGwgdmFsaWQgdW5pY29kZSB3aGl0ZXNwYWNlc1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbm1vZHVsZS5leHBvcnRzID0gJ1xcdTAwMDlcXHUwMDBBXFx1MDAwQlxcdTAwMENcXHUwMDBEXFx1MDAyMFxcdTAwQTBcXHUxNjgwXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4XFx1MjAyOVxcdUZFRkYnO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1mb3ItZWFjaCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IFtdLmZvckVhY2ggIT0gZm9yRWFjaCB9LCB7XG4gIGZvckVhY2g6IGZvckVhY2hcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgJGluZGV4T2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMnKS5pbmRleE9mO1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xudmFyIGFycmF5TWV0aG9kVXNlc1RvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LW1ldGhvZC11c2VzLXRvLWxlbmd0aCcpO1xuXG52YXIgbmF0aXZlSW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbnZhciBORUdBVElWRV9aRVJPID0gISFuYXRpdmVJbmRleE9mICYmIDEgLyBbMV0uaW5kZXhPZigxLCAtMCkgPCAwO1xudmFyIFNUUklDVF9NRVRIT0QgPSBhcnJheU1ldGhvZElzU3RyaWN0KCdpbmRleE9mJyk7XG52YXIgVVNFU19UT19MRU5HVEggPSBhcnJheU1ldGhvZFVzZXNUb0xlbmd0aCgnaW5kZXhPZicsIHsgQUNDRVNTT1JTOiB0cnVlLCAxOiAwIH0pO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluZGV4b2ZcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IE5FR0FUSVZFX1pFUk8gfHwgIVNUUklDVF9NRVRIT0QgfHwgIVVTRVNfVE9fTEVOR1RIIH0sIHtcbiAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50IC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiBORUdBVElWRV9aRVJPXG4gICAgICAvLyBjb252ZXJ0IC0wIHRvICswXG4gICAgICA/IG5hdGl2ZUluZGV4T2YuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCAwXG4gICAgICA6ICRpbmRleE9mKHRoaXMsIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkc29tZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pdGVyYXRpb24nKS5zb21lO1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xudmFyIGFycmF5TWV0aG9kVXNlc1RvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LW1ldGhvZC11c2VzLXRvLWxlbmd0aCcpO1xuXG52YXIgU1RSSUNUX01FVEhPRCA9IGFycmF5TWV0aG9kSXNTdHJpY3QoJ3NvbWUnKTtcbnZhciBVU0VTX1RPX0xFTkdUSCA9IGFycmF5TWV0aG9kVXNlc1RvTGVuZ3RoKCdzb21lJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuc29tZWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuc29tZVxuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIVNUUklDVF9NRVRIT0QgfHwgIVVTRVNfVE9fTEVOR1RIIH0sIHtcbiAgc29tZTogZnVuY3Rpb24gc29tZShjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgIHJldHVybiAkc29tZSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgJHRyaW0gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc3RyaW5nLXRyaW0nKS50cmltO1xudmFyIGZvcmNlZFN0cmluZ1RyaW1NZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc3RyaW5nLXRyaW0tZm9yY2VkJyk7XG5cbi8vIGBTdHJpbmcucHJvdG90eXBlLnRyaW1gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS50cmltXG4kKHsgdGFyZ2V0OiAnU3RyaW5nJywgcHJvdG86IHRydWUsIGZvcmNlZDogZm9yY2VkU3RyaW5nVHJpbU1ldGhvZCgndHJpbScpIH0sIHtcbiAgdHJpbTogZnVuY3Rpb24gdHJpbSgpIHtcbiAgICByZXR1cm4gJHRyaW0odGhpcyk7XG4gIH1cbn0pO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBET01JdGVyYWJsZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9tLWl0ZXJhYmxlcycpO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktZm9yLWVhY2gnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG5cbmZvciAodmFyIENPTExFQ1RJT05fTkFNRSBpbiBET01JdGVyYWJsZXMpIHtcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxbQ09MTEVDVElPTl9OQU1FXTtcbiAgdmFyIENvbGxlY3Rpb25Qcm90b3R5cGUgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICAvLyBzb21lIENocm9tZSB2ZXJzaW9ucyBoYXZlIG5vbi1jb25maWd1cmFibGUgbWV0aG9kcyBvbiBET01Ub2tlbkxpc3RcbiAgaWYgKENvbGxlY3Rpb25Qcm90b3R5cGUgJiYgQ29sbGVjdGlvblByb3RvdHlwZS5mb3JFYWNoICE9PSBmb3JFYWNoKSB0cnkge1xuICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDb2xsZWN0aW9uUHJvdG90eXBlLCAnZm9yRWFjaCcsIGZvckVhY2gpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENvbGxlY3Rpb25Qcm90b3R5cGUuZm9yRWFjaCA9IGZvckVhY2g7XG4gIH1cbn1cbiIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRpOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGw6IGZhbHNlLFxuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge31cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbi8qKioqKiovIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4vKioqKioqLyBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuLyoqKioqKi8gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuLyoqKioqKi8gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuLyoqKioqKi8gXHRcdFx0XHRnZXQ6IGdldHRlclxuLyoqKioqKi8gXHRcdFx0fSk7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4vKioqKioqLyBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4vKioqKioqLyBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuLyoqKioqKi8gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4vKioqKioqLyBcdFx0cmV0dXJuIGdldHRlcjtcbi8qKioqKiovIFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDcpO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IC8qIGdsb2JhbHMgalF1ZXJ5ICovXG5cbmV4cG9ydHMubG9yeSA9IGxvcnk7XG5cbnZhciBfZGV0ZWN0UHJlZml4ZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXG52YXIgX2RldGVjdFByZWZpeGVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RldGVjdFByZWZpeGVzKTtcblxudmFyIF9kZXRlY3RTdXBwb3J0c1Bhc3NpdmUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuXG52YXIgX2RldGVjdFN1cHBvcnRzUGFzc2l2ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZXRlY3RTdXBwb3J0c1Bhc3NpdmUpO1xuXG52YXIgX2Rpc3BhdGNoRXZlbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpO1xuXG52YXIgX2Rpc3BhdGNoRXZlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGlzcGF0Y2hFdmVudCk7XG5cbnZhciBfZGVmYXVsdHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG52YXIgX2RlZmF1bHRzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmF1bHRzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBsb3J5KHNsaWRlciwgb3B0cykge1xuICAgIHZhciBwb3NpdGlvbiA9IHZvaWQgMDtcbiAgICB2YXIgc2xpZGVzV2lkdGggPSB2b2lkIDA7XG4gICAgdmFyIGZyYW1lV2lkdGggPSB2b2lkIDA7XG4gICAgdmFyIHNsaWRlcyA9IHZvaWQgMDtcblxuICAgIC8qKlxuICAgICAqIHNsaWRlciBET00gZWxlbWVudHNcbiAgICAgKi9cbiAgICB2YXIgZnJhbWUgPSB2b2lkIDA7XG4gICAgdmFyIHNsaWRlQ29udGFpbmVyID0gdm9pZCAwO1xuICAgIHZhciBwcmV2Q3RybCA9IHZvaWQgMDtcbiAgICB2YXIgbmV4dEN0cmwgPSB2b2lkIDA7XG4gICAgdmFyIHByZWZpeGVzID0gdm9pZCAwO1xuICAgIHZhciB0cmFuc2l0aW9uRW5kQ2FsbGJhY2sgPSB2b2lkIDA7XG5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHRvdWNoRXZlbnRQYXJhbXMgPSAoMCwgX2RldGVjdFN1cHBvcnRzUGFzc2l2ZTIuZGVmYXVsdCkoKSA/IHsgcGFzc2l2ZTogdHJ1ZSB9IDogZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBpZiBvYmplY3QgaXMgalF1ZXJ5IGNvbnZlcnQgdG8gbmF0aXZlIERPTSBlbGVtZW50XG4gICAgICovXG4gICAgaWYgKHR5cGVvZiBqUXVlcnkgIT09ICd1bmRlZmluZWQnICYmIHNsaWRlciBpbnN0YW5jZW9mIGpRdWVyeSkge1xuICAgICAgICBzbGlkZXIgPSBzbGlkZXJbMF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcHJpdmF0ZVxuICAgICAqIHNldCBhY3RpdmUgY2xhc3MgdG8gZWxlbWVudCB3aGljaCBpcyB0aGUgY3VycmVudCBzbGlkZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldEFjdGl2ZUVsZW1lbnQoc2xpZGVzLCBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgICAgICAgIGNsYXNzTmFtZUFjdGl2ZVNsaWRlID0gX29wdGlvbnMuY2xhc3NOYW1lQWN0aXZlU2xpZGU7XG5cblxuICAgICAgICBzbGlkZXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWVBY3RpdmVTbGlkZSkpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lQWN0aXZlU2xpZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzbGlkZXNbY3VycmVudEluZGV4XS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZUFjdGl2ZVNsaWRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwcml2YXRlXG4gICAgICogc2V0dXBJbmZpbml0ZTogZnVuY3Rpb24gdG8gc2V0dXAgaWYgaW5maW5pdGUgaXMgc2V0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHthcnJheX0gc2xpZGVBcnJheVxuICAgICAqIEByZXR1cm4ge2FycmF5fSBhcnJheSBvZiB1cGRhdGVkIHNsaWRlQ29udGFpbmVyIGVsZW1lbnRzXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0dXBJbmZpbml0ZShzbGlkZUFycmF5KSB7XG4gICAgICAgIHZhciBfb3B0aW9uczIgPSBvcHRpb25zLFxuICAgICAgICAgICAgaW5maW5pdGUgPSBfb3B0aW9uczIuaW5maW5pdGU7XG5cblxuICAgICAgICB2YXIgZnJvbnQgPSBzbGlkZUFycmF5LnNsaWNlKDAsIGluZmluaXRlKTtcbiAgICAgICAgdmFyIGJhY2sgPSBzbGlkZUFycmF5LnNsaWNlKHNsaWRlQXJyYXkubGVuZ3RoIC0gaW5maW5pdGUsIHNsaWRlQXJyYXkubGVuZ3RoKTtcblxuICAgICAgICBmcm9udC5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgY2xvbmVkID0gZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgICAgIHNsaWRlQ29udGFpbmVyLmFwcGVuZENoaWxkKGNsb25lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJhY2sucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZWQgPSBlbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICAgICAgc2xpZGVDb250YWluZXIuaW5zZXJ0QmVmb3JlKGNsb25lZCwgc2xpZGVDb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNsaWRlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIocHJlZml4ZXMudHJhbnNpdGlvbkVuZCwgb25UcmFuc2l0aW9uRW5kKTtcblxuICAgICAgICByZXR1cm4gc2xpY2UuY2FsbChzbGlkZUNvbnRhaW5lci5jaGlsZHJlbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogW2Rpc3BhdGNoU2xpZGVyRXZlbnQgZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGlzcGF0Y2hTbGlkZXJFdmVudChwaGFzZSwgdHlwZSwgZGV0YWlsKSB7XG4gICAgICAgICgwLCBfZGlzcGF0Y2hFdmVudDIuZGVmYXVsdCkoc2xpZGVyLCBwaGFzZSArICcubG9yeS4nICsgdHlwZSwgZGV0YWlsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0cmFuc2xhdGVzIHRvIGEgZ2l2ZW4gcG9zaXRpb24gaW4gYSBnaXZlbiB0aW1lIGluIG1pbGxpc2Vjb25kc1xuICAgICAqXG4gICAgICogQHRvICAgICAgICB7bnVtYmVyfSBudW1iZXIgaW4gcGl4ZWxzIHdoZXJlIHRvIHRyYW5zbGF0ZSB0b1xuICAgICAqIEBkdXJhdGlvbiAge251bWJlcn0gdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSB0cmFuc2lzdGlvblxuICAgICAqIEBlYXNlICAgICAge3N0cmluZ30gZWFzaW5nIGNzcyBwcm9wZXJ0eVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSh0bywgZHVyYXRpb24sIGVhc2UpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gc2xpZGVDb250YWluZXIgJiYgc2xpZGVDb250YWluZXIuc3R5bGU7XG5cbiAgICAgICAgaWYgKHN0eWxlKSB7XG4gICAgICAgICAgICBzdHlsZVtwcmVmaXhlcy50cmFuc2l0aW9uICsgJ1RpbWluZ0Z1bmN0aW9uJ10gPSBlYXNlO1xuICAgICAgICAgICAgc3R5bGVbcHJlZml4ZXMudHJhbnNpdGlvbiArICdEdXJhdGlvbiddID0gZHVyYXRpb24gKyAnbXMnO1xuICAgICAgICAgICAgc3R5bGVbcHJlZml4ZXMudHJhbnNmb3JtXSA9ICd0cmFuc2xhdGVYKCcgKyB0byArICdweCknO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhbiBlbGVtZW50J3Mgd2lkdGhcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbGVtZW50V2lkdGgoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCB8fCBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNsaWRlZnVuY3Rpb24gY2FsbGVkIGJ5IHByZXYsIG5leHQgJiB0b3VjaGVuZFxuICAgICAqXG4gICAgICogZGV0ZXJtaW5lIG5leHRJbmRleCBhbmQgc2xpZGUgdG8gbmV4dCBwb3N0aW9uXG4gICAgICogdW5kZXIgcmVzdHJpY3Rpb25zIG9mIHRoZSBkZWZpbmVkIG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEBkaXJlY3Rpb24gIHtib29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNsaWRlKG5leHRJbmRleCwgZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBfb3B0aW9uczMgPSBvcHRpb25zLFxuICAgICAgICAgICAgc2xpZGVTcGVlZCA9IF9vcHRpb25zMy5zbGlkZVNwZWVkLFxuICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGwgPSBfb3B0aW9uczMuc2xpZGVzVG9TY3JvbGwsXG4gICAgICAgICAgICBpbmZpbml0ZSA9IF9vcHRpb25zMy5pbmZpbml0ZSxcbiAgICAgICAgICAgIHJld2luZCA9IF9vcHRpb25zMy5yZXdpbmQsXG4gICAgICAgICAgICByZXdpbmRQcmV2ID0gX29wdGlvbnMzLnJld2luZFByZXYsXG4gICAgICAgICAgICByZXdpbmRTcGVlZCA9IF9vcHRpb25zMy5yZXdpbmRTcGVlZCxcbiAgICAgICAgICAgIGVhc2UgPSBfb3B0aW9uczMuZWFzZSxcbiAgICAgICAgICAgIGNsYXNzTmFtZUFjdGl2ZVNsaWRlID0gX29wdGlvbnMzLmNsYXNzTmFtZUFjdGl2ZVNsaWRlLFxuICAgICAgICAgICAgX29wdGlvbnMzJGNsYXNzTmFtZURpID0gX29wdGlvbnMzLmNsYXNzTmFtZURpc2FibGVkTmV4dEN0cmwsXG4gICAgICAgICAgICBjbGFzc05hbWVEaXNhYmxlZE5leHRDdHJsID0gX29wdGlvbnMzJGNsYXNzTmFtZURpID09PSB1bmRlZmluZWQgPyAnZGlzYWJsZWQnIDogX29wdGlvbnMzJGNsYXNzTmFtZURpLFxuICAgICAgICAgICAgX29wdGlvbnMzJGNsYXNzTmFtZURpMiA9IF9vcHRpb25zMy5jbGFzc05hbWVEaXNhYmxlZFByZXZDdHJsLFxuICAgICAgICAgICAgY2xhc3NOYW1lRGlzYWJsZWRQcmV2Q3RybCA9IF9vcHRpb25zMyRjbGFzc05hbWVEaTIgPT09IHVuZGVmaW5lZCA/ICdkaXNhYmxlZCcgOiBfb3B0aW9uczMkY2xhc3NOYW1lRGkyO1xuXG5cbiAgICAgICAgdmFyIGR1cmF0aW9uID0gc2xpZGVTcGVlZDtcblxuICAgICAgICB2YXIgbmV4dFNsaWRlID0gZGlyZWN0aW9uID8gaW5kZXggKyAxIDogaW5kZXggLSAxO1xuICAgICAgICB2YXIgbWF4T2Zmc2V0ID0gTWF0aC5yb3VuZChzbGlkZXNXaWR0aCAtIGZyYW1lV2lkdGgpO1xuXG4gICAgICAgIGRpc3BhdGNoU2xpZGVyRXZlbnQoJ2JlZm9yZScsICdzbGlkZScsIHtcbiAgICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICAgIG5leHRTbGlkZTogbmV4dFNsaWRlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldCBjb250cm9sIGNsYXNzZXNcbiAgICAgICAgICovXG4gICAgICAgIGlmIChwcmV2Q3RybCkge1xuICAgICAgICAgICAgcHJldkN0cmwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWVEaXNhYmxlZFByZXZDdHJsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV4dEN0cmwpIHtcbiAgICAgICAgICAgIG5leHRDdHJsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lRGlzYWJsZWROZXh0Q3RybCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG5leHRJbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5maW5pdGUgJiYgaW5kZXggKyBpbmZpbml0ZSAqIDIgIT09IHNsaWRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEluZGV4ID0gaW5kZXggKyAoaW5maW5pdGUgLSBpbmRleCAlIGluZmluaXRlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXh0SW5kZXggPSBpbmRleCArIHNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZmluaXRlICYmIGluZGV4ICUgaW5maW5pdGUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEluZGV4ID0gaW5kZXggLSBpbmRleCAlIGluZmluaXRlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJbmRleCA9IGluZGV4IC0gc2xpZGVzVG9TY3JvbGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dEluZGV4ID0gTWF0aC5taW4oTWF0aC5tYXgobmV4dEluZGV4LCAwKSwgc2xpZGVzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIGlmIChpbmZpbml0ZSAmJiBkaXJlY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbmV4dEluZGV4ICs9IGluZmluaXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJld2luZFByZXYgJiYgTWF0aC5hYnMocG9zaXRpb24ueCkgPT09IDAgJiYgZGlyZWN0aW9uID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbmV4dEluZGV4ID0gc2xpZGVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHJld2luZFNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5leHRPZmZzZXQgPSBNYXRoLm1pbihNYXRoLm1heChzbGlkZXNbbmV4dEluZGV4XS5vZmZzZXRMZWZ0ICogLTEsIG1heE9mZnNldCAqIC0xKSwgMCk7XG5cbiAgICAgICAgaWYgKHJld2luZCAmJiBNYXRoLmFicyhwb3NpdGlvbi54KSA9PT0gbWF4T2Zmc2V0ICYmIGRpcmVjdGlvbikge1xuICAgICAgICAgICAgbmV4dE9mZnNldCA9IDA7XG4gICAgICAgICAgICBuZXh0SW5kZXggPSAwO1xuICAgICAgICAgICAgZHVyYXRpb24gPSByZXdpbmRTcGVlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0cmFuc2xhdGUgdG8gdGhlIG5leHRPZmZzZXQgYnkgYSBkZWZpbmVkIGR1cmF0aW9uIGFuZCBlYXNlIGZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB0cmFuc2xhdGUobmV4dE9mZnNldCwgZHVyYXRpb24sIGVhc2UpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB1cGRhdGUgdGhlIHBvc2l0aW9uIHdpdGggdGhlIG5leHQgcG9zaXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHBvc2l0aW9uLnggPSBuZXh0T2Zmc2V0O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB1cGRhdGUgdGhlIGluZGV4IHdpdGggdGhlIG5leHRJbmRleCBvbmx5IGlmXG4gICAgICAgICAqIHRoZSBvZmZzZXQgb2YgdGhlIG5leHRJbmRleCBpcyBpbiB0aGUgcmFuZ2Ugb2YgdGhlIG1heE9mZnNldFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHNsaWRlc1tuZXh0SW5kZXhdLm9mZnNldExlZnQgPD0gbWF4T2Zmc2V0KSB7XG4gICAgICAgICAgICBpbmRleCA9IG5leHRJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmZpbml0ZSAmJiAobmV4dEluZGV4ID09PSBzbGlkZXMubGVuZ3RoIC0gaW5maW5pdGUgfHwgbmV4dEluZGV4ID09PSBzbGlkZXMubGVuZ3RoIC0gc2xpZGVzLmxlbmd0aCAlIGluZmluaXRlIHx8IG5leHRJbmRleCA9PT0gMCkpIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZmluaXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gc2xpZGVzLmxlbmd0aCAtIGluZmluaXRlICogMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcG9zaXRpb24ueCA9IHNsaWRlc1tpbmRleF0ub2Zmc2V0TGVmdCAqIC0xO1xuXG4gICAgICAgICAgICB0cmFuc2l0aW9uRW5kQ2FsbGJhY2sgPSBmdW5jdGlvbiB0cmFuc2l0aW9uRW5kQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKHNsaWRlc1tpbmRleF0ub2Zmc2V0TGVmdCAqIC0xLCAwLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGFzc05hbWVBY3RpdmVTbGlkZSkge1xuICAgICAgICAgICAgc2V0QWN0aXZlRWxlbWVudChzbGljZS5jYWxsKHNsaWRlcyksIGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB1cGRhdGUgY2xhc3NlcyBmb3IgbmV4dCBhbmQgcHJldiBhcnJvd3NcbiAgICAgICAgICogYmFzZWQgb24gdXNlciBzZXR0aW5nc1xuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHByZXZDdHJsICYmICFpbmZpbml0ZSAmJiAhcmV3aW5kUHJldiAmJiBuZXh0SW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHByZXZDdHJsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lRGlzYWJsZWRQcmV2Q3RybCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dEN0cmwgJiYgIWluZmluaXRlICYmICFyZXdpbmQgJiYgbmV4dEluZGV4ICsgMSA9PT0gc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV4dEN0cmwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWVEaXNhYmxlZE5leHRDdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpc3BhdGNoU2xpZGVyRXZlbnQoJ2FmdGVyJywgJ3NsaWRlJywge1xuICAgICAgICAgICAgY3VycmVudFNsaWRlOiBpbmRleFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwdWJsaWNcbiAgICAgKiBzZXR1cCBmdW5jdGlvblxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgICBkaXNwYXRjaFNsaWRlckV2ZW50KCdiZWZvcmUnLCAnaW5pdCcpO1xuXG4gICAgICAgIHByZWZpeGVzID0gKDAsIF9kZXRlY3RQcmVmaXhlczIuZGVmYXVsdCkoKTtcbiAgICAgICAgb3B0aW9ucyA9IF9leHRlbmRzKHt9LCBfZGVmYXVsdHMyLmRlZmF1bHQsIG9wdHMpO1xuXG4gICAgICAgIHZhciBfb3B0aW9uczQgPSBvcHRpb25zLFxuICAgICAgICAgICAgY2xhc3NOYW1lRnJhbWUgPSBfb3B0aW9uczQuY2xhc3NOYW1lRnJhbWUsXG4gICAgICAgICAgICBjbGFzc05hbWVTbGlkZUNvbnRhaW5lciA9IF9vcHRpb25zNC5jbGFzc05hbWVTbGlkZUNvbnRhaW5lcixcbiAgICAgICAgICAgIGNsYXNzTmFtZVByZXZDdHJsID0gX29wdGlvbnM0LmNsYXNzTmFtZVByZXZDdHJsLFxuICAgICAgICAgICAgY2xhc3NOYW1lTmV4dEN0cmwgPSBfb3B0aW9uczQuY2xhc3NOYW1lTmV4dEN0cmwsXG4gICAgICAgICAgICBfb3B0aW9uczQkY2xhc3NOYW1lRGkgPSBfb3B0aW9uczQuY2xhc3NOYW1lRGlzYWJsZWROZXh0Q3RybCxcbiAgICAgICAgICAgIGNsYXNzTmFtZURpc2FibGVkTmV4dEN0cmwgPSBfb3B0aW9uczQkY2xhc3NOYW1lRGkgPT09IHVuZGVmaW5lZCA/ICdkaXNhYmxlZCcgOiBfb3B0aW9uczQkY2xhc3NOYW1lRGksXG4gICAgICAgICAgICBfb3B0aW9uczQkY2xhc3NOYW1lRGkyID0gX29wdGlvbnM0LmNsYXNzTmFtZURpc2FibGVkUHJldkN0cmwsXG4gICAgICAgICAgICBjbGFzc05hbWVEaXNhYmxlZFByZXZDdHJsID0gX29wdGlvbnM0JGNsYXNzTmFtZURpMiA9PT0gdW5kZWZpbmVkID8gJ2Rpc2FibGVkJyA6IF9vcHRpb25zNCRjbGFzc05hbWVEaTIsXG4gICAgICAgICAgICBlbmFibGVNb3VzZUV2ZW50cyA9IF9vcHRpb25zNC5lbmFibGVNb3VzZUV2ZW50cyxcbiAgICAgICAgICAgIGNsYXNzTmFtZUFjdGl2ZVNsaWRlID0gX29wdGlvbnM0LmNsYXNzTmFtZUFjdGl2ZVNsaWRlLFxuICAgICAgICAgICAgaW5pdGlhbEluZGV4ID0gX29wdGlvbnM0LmluaXRpYWxJbmRleDtcblxuXG4gICAgICAgIGluZGV4ID0gaW5pdGlhbEluZGV4O1xuICAgICAgICBmcmFtZSA9IHNsaWRlci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZUZyYW1lKVswXTtcbiAgICAgICAgc2xpZGVDb250YWluZXIgPSBmcmFtZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZVNsaWRlQ29udGFpbmVyKVswXTtcbiAgICAgICAgcHJldkN0cmwgPSBzbGlkZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWVQcmV2Q3RybClbMF07XG4gICAgICAgIG5leHRDdHJsID0gc2xpZGVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lTmV4dEN0cmwpWzBdO1xuXG4gICAgICAgIHBvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogc2xpZGVDb250YWluZXIub2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHk6IHNsaWRlQ29udGFpbmVyLm9mZnNldFRvcFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChvcHRpb25zLmluZmluaXRlKSB7XG4gICAgICAgICAgICBzbGlkZXMgPSBzZXR1cEluZmluaXRlKHNsaWNlLmNhbGwoc2xpZGVDb250YWluZXIuY2hpbGRyZW4pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlcyA9IHNsaWNlLmNhbGwoc2xpZGVDb250YWluZXIuY2hpbGRyZW4pO1xuXG4gICAgICAgICAgICBpZiAocHJldkN0cmwgJiYgIW9wdGlvbnMucmV3aW5kUHJldikge1xuICAgICAgICAgICAgICAgIHByZXZDdHJsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lRGlzYWJsZWRQcmV2Q3RybCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuZXh0Q3RybCAmJiBzbGlkZXMubGVuZ3RoID09PSAxICYmICFvcHRpb25zLnJld2luZCkge1xuICAgICAgICAgICAgICAgIG5leHRDdHJsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lRGlzYWJsZWROZXh0Q3RybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpO1xuXG4gICAgICAgIGlmIChjbGFzc05hbWVBY3RpdmVTbGlkZSkge1xuICAgICAgICAgICAgc2V0QWN0aXZlRWxlbWVudChzbGlkZXMsIGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcmV2Q3RybCAmJiBuZXh0Q3RybCkge1xuICAgICAgICAgICAgcHJldkN0cmwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwcmV2KTtcbiAgICAgICAgICAgIG5leHRDdHJsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbmV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmcmFtZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaHN0YXJ0LCB0b3VjaEV2ZW50UGFyYW1zKTtcblxuICAgICAgICBpZiAoZW5hYmxlTW91c2VFdmVudHMpIHtcbiAgICAgICAgICAgIGZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uVG91Y2hzdGFydCk7XG4gICAgICAgICAgICBmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucy53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25SZXNpemUpO1xuXG4gICAgICAgIGRpc3BhdGNoU2xpZGVyRXZlbnQoJ2FmdGVyJywgJ2luaXQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwdWJsaWNcbiAgICAgKiByZXNldCBmdW5jdGlvbjogY2FsbGVkIG9uIHJlc2l6ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB2YXIgX29wdGlvbnM1ID0gb3B0aW9ucyxcbiAgICAgICAgICAgIGluZmluaXRlID0gX29wdGlvbnM1LmluZmluaXRlLFxuICAgICAgICAgICAgZWFzZSA9IF9vcHRpb25zNS5lYXNlLFxuICAgICAgICAgICAgcmV3aW5kU3BlZWQgPSBfb3B0aW9uczUucmV3aW5kU3BlZWQsXG4gICAgICAgICAgICByZXdpbmRPblJlc2l6ZSA9IF9vcHRpb25zNS5yZXdpbmRPblJlc2l6ZSxcbiAgICAgICAgICAgIGNsYXNzTmFtZUFjdGl2ZVNsaWRlID0gX29wdGlvbnM1LmNsYXNzTmFtZUFjdGl2ZVNsaWRlLFxuICAgICAgICAgICAgaW5pdGlhbEluZGV4ID0gX29wdGlvbnM1LmluaXRpYWxJbmRleDtcblxuXG4gICAgICAgIHNsaWRlc1dpZHRoID0gZWxlbWVudFdpZHRoKHNsaWRlQ29udGFpbmVyKTtcbiAgICAgICAgZnJhbWVXaWR0aCA9IGVsZW1lbnRXaWR0aChmcmFtZSk7XG5cbiAgICAgICAgaWYgKGZyYW1lV2lkdGggPT09IHNsaWRlc1dpZHRoKSB7XG4gICAgICAgICAgICBzbGlkZXNXaWR0aCA9IHNsaWRlcy5yZWR1Y2UoZnVuY3Rpb24gKHByZXZpb3VzVmFsdWUsIHNsaWRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXZpb3VzVmFsdWUgKyBlbGVtZW50V2lkdGgoc2xpZGUpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV3aW5kT25SZXNpemUpIHtcbiAgICAgICAgICAgIGluZGV4ID0gaW5pdGlhbEluZGV4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWFzZSA9IG51bGw7XG4gICAgICAgICAgICByZXdpbmRTcGVlZCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5maW5pdGUpIHtcbiAgICAgICAgICAgIHRyYW5zbGF0ZShzbGlkZXNbaW5kZXggKyBpbmZpbml0ZV0ub2Zmc2V0TGVmdCAqIC0xLCAwLCBudWxsKTtcblxuICAgICAgICAgICAgaW5kZXggPSBpbmRleCArIGluZmluaXRlO1xuICAgICAgICAgICAgcG9zaXRpb24ueCA9IHNsaWRlc1tpbmRleF0ub2Zmc2V0TGVmdCAqIC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhbnNsYXRlKHNsaWRlc1tpbmRleF0ub2Zmc2V0TGVmdCAqIC0xLCByZXdpbmRTcGVlZCwgZWFzZSk7XG4gICAgICAgICAgICBwb3NpdGlvbi54ID0gc2xpZGVzW2luZGV4XS5vZmZzZXRMZWZ0ICogLTE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xhc3NOYW1lQWN0aXZlU2xpZGUpIHtcbiAgICAgICAgICAgIHNldEFjdGl2ZUVsZW1lbnQoc2xpY2UuY2FsbChzbGlkZXMpLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwdWJsaWNcbiAgICAgKiBzbGlkZVRvOiBjYWxsZWQgb24gY2xpY2toYW5kbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2xpZGVUbyhpbmRleCkge1xuICAgICAgICBzbGlkZShpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcHVibGljXG4gICAgICogcmV0dXJuSW5kZXggZnVuY3Rpb246IGNhbGxlZCBvbiBjbGlja2hhbmRsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXR1cm5JbmRleCgpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4IC0gb3B0aW9ucy5pbmZpbml0ZSB8fCAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHB1YmxpY1xuICAgICAqIHByZXYgZnVuY3Rpb246IGNhbGxlZCBvbiBjbGlja2hhbmRsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwcmV2KCkge1xuICAgICAgICBzbGlkZShmYWxzZSwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHB1YmxpY1xuICAgICAqIG5leHQgZnVuY3Rpb246IGNhbGxlZCBvbiBjbGlja2hhbmRsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICBzbGlkZShmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcHVibGljXG4gICAgICogZGVzdHJveSBmdW5jdGlvbjogY2FsbGVkIHRvIGdyYWNlZnVsbHkgZGVzdHJveSB0aGUgbG9yeSBpbnN0YW5jZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIGRpc3BhdGNoU2xpZGVyRXZlbnQoJ2JlZm9yZScsICdkZXN0cm95Jyk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICBmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKHByZWZpeGVzLnRyYW5zaXRpb25FbmQsIG9uVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblRvdWNoc3RhcnQsIHRvdWNoRXZlbnRQYXJhbXMpO1xuICAgICAgICBmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNobW92ZSwgdG91Y2hFdmVudFBhcmFtcyk7XG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaGVuZCk7XG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uVG91Y2htb3ZlKTtcbiAgICAgICAgZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Ub3VjaHN0YXJ0KTtcbiAgICAgICAgZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uVG91Y2hlbmQpO1xuICAgICAgICBmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgb25Ub3VjaGVuZCk7XG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayk7XG5cbiAgICAgICAgb3B0aW9ucy53aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25SZXNpemUpO1xuXG4gICAgICAgIGlmIChwcmV2Q3RybCkge1xuICAgICAgICAgICAgcHJldkN0cmwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwcmV2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0Q3RybCkge1xuICAgICAgICAgICAgbmV4dEN0cmwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbW92ZSBjbG9uZWQgc2xpZGVzIGlmIGluZmluaXRlIGlzIHNldFxuICAgICAgICBpZiAob3B0aW9ucy5pbmZpbml0ZSkge1xuICAgICAgICAgICAgQXJyYXkuYXBwbHkobnVsbCwgQXJyYXkob3B0aW9ucy5pbmZpbml0ZSkpLmZvckVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNsaWRlQ29udGFpbmVyLnJlbW92ZUNoaWxkKHNsaWRlQ29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIHNsaWRlQ29udGFpbmVyLnJlbW92ZUNoaWxkKHNsaWRlQ29udGFpbmVyLmxhc3RDaGlsZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpc3BhdGNoU2xpZGVyRXZlbnQoJ2FmdGVyJywgJ2Rlc3Ryb3knKTtcbiAgICB9XG5cbiAgICAvLyBldmVudCBoYW5kbGluZ1xuXG4gICAgdmFyIHRvdWNoT2Zmc2V0ID0gdm9pZCAwO1xuICAgIHZhciBkZWx0YSA9IHZvaWQgMDtcbiAgICB2YXIgaXNTY3JvbGxpbmcgPSB2b2lkIDA7XG5cbiAgICBmdW5jdGlvbiBvblRyYW5zaXRpb25FbmQoKSB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uRW5kQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb25FbmRDYWxsYmFjaygpO1xuXG4gICAgICAgICAgICB0cmFuc2l0aW9uRW5kQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblRvdWNoc3RhcnQoZXZlbnQpIHtcbiAgICAgICAgdmFyIF9vcHRpb25zNiA9IG9wdGlvbnMsXG4gICAgICAgICAgICBlbmFibGVNb3VzZUV2ZW50cyA9IF9vcHRpb25zNi5lbmFibGVNb3VzZUV2ZW50cztcblxuICAgICAgICB2YXIgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXMgPyBldmVudC50b3VjaGVzWzBdIDogZXZlbnQ7XG5cbiAgICAgICAgaWYgKGVuYWJsZU1vdXNlRXZlbnRzKSB7XG4gICAgICAgICAgICBmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvblRvdWNobW92ZSk7XG4gICAgICAgICAgICBmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Ub3VjaGVuZCk7XG4gICAgICAgICAgICBmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgb25Ub3VjaGVuZCk7XG4gICAgICAgIH1cblxuICAgICAgICBmcmFtZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNobW92ZSwgdG91Y2hFdmVudFBhcmFtcyk7XG4gICAgICAgIGZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaGVuZCk7XG5cbiAgICAgICAgdmFyIHBhZ2VYID0gdG91Y2hlcy5wYWdlWCxcbiAgICAgICAgICAgIHBhZ2VZID0gdG91Y2hlcy5wYWdlWTtcblxuXG4gICAgICAgIHRvdWNoT2Zmc2V0ID0ge1xuICAgICAgICAgICAgeDogcGFnZVgsXG4gICAgICAgICAgICB5OiBwYWdlWSxcbiAgICAgICAgICAgIHRpbWU6IERhdGUubm93KClcbiAgICAgICAgfTtcblxuICAgICAgICBpc1Njcm9sbGluZyA9IHVuZGVmaW5lZDtcblxuICAgICAgICBkZWx0YSA9IHt9O1xuXG4gICAgICAgIGRpc3BhdGNoU2xpZGVyRXZlbnQoJ29uJywgJ3RvdWNoc3RhcnQnLCB7XG4gICAgICAgICAgICBldmVudDogZXZlbnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Ub3VjaG1vdmUoZXZlbnQpIHtcbiAgICAgICAgdmFyIHRvdWNoZXMgPSBldmVudC50b3VjaGVzID8gZXZlbnQudG91Y2hlc1swXSA6IGV2ZW50O1xuICAgICAgICB2YXIgcGFnZVggPSB0b3VjaGVzLnBhZ2VYLFxuICAgICAgICAgICAgcGFnZVkgPSB0b3VjaGVzLnBhZ2VZO1xuXG5cbiAgICAgICAgZGVsdGEgPSB7XG4gICAgICAgICAgICB4OiBwYWdlWCAtIHRvdWNoT2Zmc2V0LngsXG4gICAgICAgICAgICB5OiBwYWdlWSAtIHRvdWNoT2Zmc2V0LnlcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZW9mIGlzU2Nyb2xsaW5nID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaXNTY3JvbGxpbmcgPSAhIShpc1Njcm9sbGluZyB8fCBNYXRoLmFicyhkZWx0YS54KSA8IE1hdGguYWJzKGRlbHRhLnkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNTY3JvbGxpbmcgJiYgdG91Y2hPZmZzZXQpIHtcbiAgICAgICAgICAgIHRyYW5zbGF0ZShwb3NpdGlvbi54ICsgZGVsdGEueCwgMCwgbnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYXkgYmVcbiAgICAgICAgZGlzcGF0Y2hTbGlkZXJFdmVudCgnb24nLCAndG91Y2htb3ZlJywge1xuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uVG91Y2hlbmQoZXZlbnQpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRpbWUgYmV0d2VlbiB0b3VjaHN0YXJ0IGFuZCB0b3VjaGVuZCBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgICogQGR1cmF0aW9uIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgZHVyYXRpb24gPSB0b3VjaE9mZnNldCA/IERhdGUubm93KCkgLSB0b3VjaE9mZnNldC50aW1lIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBpcyB2YWxpZCBpZjpcbiAgICAgICAgICpcbiAgICAgICAgICogLT4gc3dpcGUgYXR0ZW1wdCB0aW1lIGlzIG92ZXIgMzAwIG1zXG4gICAgICAgICAqIGFuZFxuICAgICAgICAgKiAtPiBzd2lwZSBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gMjVweFxuICAgICAgICAgKiBvclxuICAgICAgICAgKiAtPiBzd2lwZSBkaXN0YW5jZSBpcyBtb3JlIHRoZW4gYSB0aGlyZCBvZiB0aGUgc3dpcGUgYXJlYVxuICAgICAgICAgKlxuICAgICAgICAgKiBAaXNWYWxpZFNsaWRlIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGlzVmFsaWQgPSBOdW1iZXIoZHVyYXRpb24pIDwgMzAwICYmIE1hdGguYWJzKGRlbHRhLngpID4gMjUgfHwgTWF0aC5hYnMoZGVsdGEueCkgPiBmcmFtZVdpZHRoIC8gMztcblxuICAgICAgICAvKipcbiAgICAgICAgICogaXMgb3V0IG9mIGJvdW5kcyBpZjpcbiAgICAgICAgICpcbiAgICAgICAgICogLT4gaW5kZXggaXMgMCBhbmQgZGVsdGEgeCBpcyBncmVhdGVyIHRoYW4gMFxuICAgICAgICAgKiBvclxuICAgICAgICAgKiAtPiBpbmRleCBpcyB0aGUgbGFzdCBzbGlkZSBhbmQgZGVsdGEgaXMgc21hbGxlciB0aGFuIDBcbiAgICAgICAgICpcbiAgICAgICAgICogQGlzT3V0T2ZCb3VuZHMge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgaXNPdXRPZkJvdW5kcyA9ICFpbmRleCAmJiBkZWx0YS54ID4gMCB8fCBpbmRleCA9PT0gc2xpZGVzLmxlbmd0aCAtIDEgJiYgZGVsdGEueCA8IDA7XG5cbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGRlbHRhLnggPCAwO1xuXG4gICAgICAgIGlmICghaXNTY3JvbGxpbmcpIHtcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkICYmICFpc091dE9mQm91bmRzKSB7XG4gICAgICAgICAgICAgICAgc2xpZGUoZmFsc2UsIGRpcmVjdGlvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZShwb3NpdGlvbi54LCBvcHRpb25zLnNuYXBCYWNrU3BlZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdG91Y2hPZmZzZXQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHJlbW92ZSBldmVudGxpc3RlbmVycyBhZnRlciBzd2lwZSBhdHRlbXB0XG4gICAgICAgICAqL1xuICAgICAgICBmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNobW92ZSk7XG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaGVuZCk7XG4gICAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uVG91Y2htb3ZlKTtcbiAgICAgICAgZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uVG91Y2hlbmQpO1xuICAgICAgICBmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgb25Ub3VjaGVuZCk7XG5cbiAgICAgICAgZGlzcGF0Y2hTbGlkZXJFdmVudCgnb24nLCAndG91Y2hlbmQnLCB7XG4gICAgICAgICAgICBldmVudDogZXZlbnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25DbGljayhldmVudCkge1xuICAgICAgICBpZiAoZGVsdGEueCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uUmVzaXplKGV2ZW50KSB7XG4gICAgICAgIGlmIChmcmFtZVdpZHRoICE9PSBlbGVtZW50V2lkdGgoZnJhbWUpKSB7XG4gICAgICAgICAgICByZXNldCgpO1xuXG4gICAgICAgICAgICBkaXNwYXRjaFNsaWRlckV2ZW50KCdvbicsICdyZXNpemUnLCB7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRyaWdnZXIgaW5pdGlhbCBzZXR1cFxuICAgIHNldHVwKCk7XG5cbiAgICAvLyBleHBvc2UgcHVibGljIGFwaVxuICAgIHJldHVybiB7XG4gICAgICAgIHNldHVwOiBzZXR1cCxcbiAgICAgICAgcmVzZXQ6IHJlc2V0LFxuICAgICAgICBzbGlkZVRvOiBzbGlkZVRvLFxuICAgICAgICByZXR1cm5JbmRleDogcmV0dXJuSW5kZXgsXG4gICAgICAgIHByZXY6IHByZXYsXG4gICAgICAgIG5leHQ6IG5leHQsXG4gICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcbiAgICB9O1xufVxuXG4vKioqLyB9KSxcbi8qIDEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZGV0ZWN0UHJlZml4ZXM7XG4vKipcbiAqIERldGVjdGluZyBwcmVmaXhlcyBmb3Igc2F2aW5nIHRpbWUgYW5kIGJ5dGVzXG4gKi9cbmZ1bmN0aW9uIGRldGVjdFByZWZpeGVzKCkge1xuICAgIHZhciB0cmFuc2Zvcm0gPSB2b2lkIDA7XG4gICAgdmFyIHRyYW5zaXRpb24gPSB2b2lkIDA7XG4gICAgdmFyIHRyYW5zaXRpb25FbmQgPSB2b2lkIDA7XG5cbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdfJyk7XG4gICAgICAgIHZhciBzdHlsZSA9IGVsLnN0eWxlO1xuXG4gICAgICAgIHZhciBwcm9wID0gdm9pZCAwO1xuXG4gICAgICAgIGlmIChzdHlsZVtwcm9wID0gJ3dlYmtpdFRyYW5zaXRpb24nXSA9PT0gJycpIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb25FbmQgPSAnd2Via2l0VHJhbnNpdGlvbkVuZCc7XG4gICAgICAgICAgICB0cmFuc2l0aW9uID0gcHJvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHlsZVtwcm9wID0gJ3RyYW5zaXRpb24nXSA9PT0gJycpIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb25FbmQgPSAndHJhbnNpdGlvbmVuZCc7XG4gICAgICAgICAgICB0cmFuc2l0aW9uID0gcHJvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHlsZVtwcm9wID0gJ3dlYmtpdFRyYW5zZm9ybSddID09PSAnJykge1xuICAgICAgICAgICAgdHJhbnNmb3JtID0gcHJvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHlsZVtwcm9wID0gJ21zVHJhbnNmb3JtJ10gPT09ICcnKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm0gPSBwcm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0eWxlW3Byb3AgPSAndHJhbnNmb3JtJ10gPT09ICcnKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm0gPSBwcm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoZWwsIG51bGwpO1xuICAgICAgICBzdHlsZVt0cmFuc2Zvcm1dID0gJ3RyYW5zbGF0ZVgoMCknO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9KSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm0sXG4gICAgICAgIHRyYW5zaXRpb246IHRyYW5zaXRpb24sXG4gICAgICAgIHRyYW5zaXRpb25FbmQ6IHRyYW5zaXRpb25FbmRcbiAgICB9O1xufVxuXG4vKioqLyB9KSxcbi8qIDIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZGV0ZWN0U3VwcG9ydHNQYXNzaXZlO1xuZnVuY3Rpb24gZGV0ZWN0U3VwcG9ydHNQYXNzaXZlKCkge1xuICAgIHZhciBzdXBwb3J0c1Bhc3NpdmUgPSBmYWxzZTtcblxuICAgIHRyeSB7XG4gICAgICAgIHZhciBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHN1cHBvcnRzUGFzc2l2ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0UGFzc2l2ZScsIG51bGwsIG9wdHMpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndGVzdFBhc3NpdmUnLCBudWxsLCBvcHRzKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgcmV0dXJuIHN1cHBvcnRzUGFzc2l2ZTtcbn1cblxuLyoqKi8gfSksXG4vKiAzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGRpc3BhdGNoRXZlbnQ7XG5cbnZhciBfY3VzdG9tRXZlbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQpO1xuXG52YXIgX2N1c3RvbUV2ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2N1c3RvbUV2ZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBkaXNwYXRjaCBjdXN0b20gZXZlbnRzXG4gKlxuICogQHBhcmFtICB7ZWxlbWVudH0gZWwgICAgICAgICBzbGlkZXNob3cgZWxlbWVudFxuICogQHBhcmFtICB7c3RyaW5nfSAgdHlwZSAgICAgICBjdXN0b20gZXZlbnQgbmFtZVxuICogQHBhcmFtICB7b2JqZWN0fSAgZGV0YWlsICAgICBjdXN0b20gZGV0YWlsIGluZm9ybWF0aW9uXG4gKi9cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQodGFyZ2V0LCB0eXBlLCBkZXRhaWwpIHtcbiAgICB2YXIgZXZlbnQgPSBuZXcgX2N1c3RvbUV2ZW50Mi5kZWZhdWx0KHR5cGUsIHtcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgZGV0YWlsOiBkZXRhaWxcbiAgICB9KTtcblxuICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuLyoqKi8gfSksXG4vKiA0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cbi8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihnbG9iYWwpIHtcbnZhciBOYXRpdmVDdXN0b21FdmVudCA9IGdsb2JhbC5DdXN0b21FdmVudDtcblxuZnVuY3Rpb24gdXNlTmF0aXZlICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgcCA9IG5ldyBOYXRpdmVDdXN0b21FdmVudCgnY2F0JywgeyBkZXRhaWw6IHsgZm9vOiAnYmFyJyB9IH0pO1xuICAgIHJldHVybiAgJ2NhdCcgPT09IHAudHlwZSAmJiAnYmFyJyA9PT0gcC5kZXRhaWwuZm9vO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENyb3NzLWJyb3dzZXIgYEN1c3RvbUV2ZW50YCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ3VzdG9tRXZlbnQuQ3VzdG9tRXZlbnRcbiAqXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1c2VOYXRpdmUoKSA/IE5hdGl2ZUN1c3RvbUV2ZW50IDpcblxuLy8gSUUgPj0gOVxuJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBkb2N1bWVudCAmJiAnZnVuY3Rpb24nID09PSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRXZlbnQgPyBmdW5jdGlvbiBDdXN0b21FdmVudCAodHlwZSwgcGFyYW1zKSB7XG4gIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gIGlmIChwYXJhbXMpIHtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICB9IGVsc2Uge1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSwgdm9pZCAwKTtcbiAgfVxuICByZXR1cm4gZTtcbn0gOlxuXG4vLyBJRSA8PSA4XG5mdW5jdGlvbiBDdXN0b21FdmVudCAodHlwZSwgcGFyYW1zKSB7XG4gIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgZS50eXBlID0gdHlwZTtcbiAgaWYgKHBhcmFtcykge1xuICAgIGUuYnViYmxlcyA9IEJvb2xlYW4ocGFyYW1zLmJ1YmJsZXMpO1xuICAgIGUuY2FuY2VsYWJsZSA9IEJvb2xlYW4ocGFyYW1zLmNhbmNlbGFibGUpO1xuICAgIGUuZGV0YWlsID0gcGFyYW1zLmRldGFpbDtcbiAgfSBlbHNlIHtcbiAgICBlLmJ1YmJsZXMgPSBmYWxzZTtcbiAgICBlLmNhbmNlbGFibGUgPSBmYWxzZTtcbiAgICBlLmRldGFpbCA9IHZvaWQgMDtcbiAgfVxuICByZXR1cm4gZTtcbn1cblxuLyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oNSkpKVxuXG4vKioqLyB9KSxcbi8qIDUgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxudmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cbi8qKiovIH0pLFxuLyogNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICAvKipcbiAgICogc2xpZGVzIHNjcm9sbGVkIGF0IG9uY2VcbiAgICogQHNsaWRlc1RvU2Nyb2xsIHtOdW1iZXJ9XG4gICAqL1xuICBzbGlkZXNUb1Njcm9sbDogMSxcblxuICAvKipcbiAgICogdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSBhbmltYXRpb24gb2YgYSB2YWxpZCBzbGlkZSBhdHRlbXB0XG4gICAqIEBzbGlkZVNwZWVkIHtOdW1iZXJ9XG4gICAqL1xuICBzbGlkZVNwZWVkOiAzMDAsXG5cbiAgLyoqXG4gICAqIHRpbWUgaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgYW5pbWF0aW9uIG9mIHRoZSByZXdpbmQgYWZ0ZXIgdGhlIGxhc3Qgc2xpZGVcbiAgICogQHJld2luZFNwZWVkIHtOdW1iZXJ9XG4gICAqL1xuICByZXdpbmRTcGVlZDogNjAwLFxuXG4gIC8qKlxuICAgKiB0aW1lIGZvciB0aGUgc25hcEJhY2sgb2YgdGhlIHNsaWRlciBpZiB0aGUgc2xpZGUgYXR0ZW1wdCB3YXMgbm90IHZhbGlkXG4gICAqIEBzbmFwQmFja1NwZWVkIHtOdW1iZXJ9XG4gICAqL1xuICBzbmFwQmFja1NwZWVkOiAyMDAsXG5cbiAgLyoqXG4gICAqIEJhc2ljIGVhc2luZyBmdW5jdGlvbnM6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RlL2RvY3MvV2ViL0NTUy90cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvblxuICAgKiBjdWJpYyBiZXppZXIgZWFzaW5nIGZ1bmN0aW9uczogaHR0cDovL2Vhc2luZ3MubmV0L2RlXG4gICAqIEBlYXNlIHtTdHJpbmd9XG4gICAqL1xuICBlYXNlOiAnZWFzZScsXG5cbiAgLyoqXG4gICAqIGlmIHNsaWRlciByZWFjaGVkIHRoZSBsYXN0IHNsaWRlLCB3aXRoIG5leHQgY2xpY2sgdGhlIHNsaWRlciBnb2VzIGJhY2sgdG8gdGhlIHN0YXJ0aW5kZXguXG4gICAqIHVzZSBpbmZpbml0ZSBvciByZXdpbmQsIG5vdCBib3RoXG4gICAqIEByZXdpbmQge0Jvb2xlYW59XG4gICAqL1xuICByZXdpbmQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBudW1iZXIgb2YgdmlzaWJsZSBzbGlkZXMgb3IgZmFsc2VcbiAgICogdXNlIGluZmluaXRlIG9yIHJld2luZCwgbm90IGJvdGhcbiAgICogQGluZmluaXRlIHtudW1iZXJ9XG4gICAqL1xuICBpbmZpbml0ZTogZmFsc2UsXG5cbiAgLyoqXG4gICAqIHRoZSBzbGlkZSBpbmRleCB0byBzaG93IHdoZW4gdGhlIHNsaWRlciBpcyBpbml0aWFsaXplZC5cbiAgICogQGluaXRpYWxJbmRleCB7bnVtYmVyfVxuICAgKi9cbiAgaW5pdGlhbEluZGV4OiAwLFxuXG4gIC8qKlxuICAgKiBjbGFzcyBuYW1lIGZvciBzbGlkZXIgZnJhbWVcbiAgICogQGNsYXNzTmFtZUZyYW1lIHtzdHJpbmd9XG4gICAqL1xuICBjbGFzc05hbWVGcmFtZTogJ2pzX2ZyYW1lJyxcblxuICAvKipcbiAgICogY2xhc3MgbmFtZSBmb3Igc2xpZGVzIGNvbnRhaW5lclxuICAgKiBAY2xhc3NOYW1lU2xpZGVDb250YWluZXIge3N0cmluZ31cbiAgICovXG4gIGNsYXNzTmFtZVNsaWRlQ29udGFpbmVyOiAnanNfc2xpZGVzJyxcblxuICAvKipcbiAgICogY2xhc3MgbmFtZSBmb3Igc2xpZGVyIHByZXYgY29udHJvbFxuICAgKiBAY2xhc3NOYW1lUHJldkN0cmwge3N0cmluZ31cbiAgICovXG4gIGNsYXNzTmFtZVByZXZDdHJsOiAnanNfcHJldicsXG5cbiAgLyoqXG4gICAqIGNsYXNzIG5hbWUgZm9yIHNsaWRlciBuZXh0IGNvbnRyb2xcbiAgICogQGNsYXNzTmFtZU5leHRDdHJsIHtzdHJpbmd9XG4gICAqL1xuICBjbGFzc05hbWVOZXh0Q3RybDogJ2pzX25leHQnLFxuXG4gIC8qKlxuICAgKiBjbGFzcyBuYW1lIGZvciBjdXJyZW50IGFjdGl2ZSBzbGlkZVxuICAgKiBpZiBlbXB0eVN0cmluZyB0aGVuIG5vIGNsYXNzIGlzIHNldFxuICAgKiBAY2xhc3NOYW1lQWN0aXZlU2xpZGUge3N0cmluZ31cbiAgICovXG4gIGNsYXNzTmFtZUFjdGl2ZVNsaWRlOiAnYWN0aXZlJyxcblxuICAvKipcbiAgICogZW5hYmxlcyBtb3VzZSBldmVudHMgZm9yIHN3aXBpbmcgb24gZGVza3RvcCBkZXZpY2VzXG4gICAqIEBlbmFibGVNb3VzZUV2ZW50cyB7Ym9vbGVhbn1cbiAgICovXG4gIGVuYWJsZU1vdXNlRXZlbnRzOiBmYWxzZSxcblxuICAvKipcbiAgICogd2luZG93IGluc3RhbmNlXG4gICAqIEB3aW5kb3cge29iamVjdH1cbiAgICovXG4gIHdpbmRvdzogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJZiBmYWxzZSwgc2xpZGVzIGxvcnkgdG8gdGhlIGZpcnN0IHNsaWRlIG9uIHdpbmRvdyByZXNpemUuXG4gICAqIEByZXdpbmRPblJlc2l6ZSB7Ym9vbGVhbn1cbiAgICovXG4gIHJld2luZE9uUmVzaXplOiB0cnVlXG59O1xuXG4vKioqLyB9KSxcbi8qIDcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxubW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiovIH0pXG4vKioqKioqLyBdKTtcbn0pOyJdfQ==
