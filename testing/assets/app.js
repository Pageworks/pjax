/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./testing/App.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/events/link-events.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar on_1 = __webpack_require__(\"./lib/events/on.js\");\nvar attrState = 'data-pjax-state';\nvar isDefaultPrevented = function (el, e, options) {\n    var isPrevented = false;\n    if (e.defaultPrevented) {\n        isPrevented = true;\n    }\n    else if (el.getAttribute('prevent-pjax') !== null) {\n        isPrevented = true;\n    }\n    else if (el.classList.contains('no-transition')) {\n        isPrevented = true;\n    }\n    else if (el.getAttribute('download') !== null) {\n        isPrevented = true;\n    }\n    else if (el.getAttribute('target') === '_blank') {\n        isPrevented = true;\n    }\n    if (options.length > 0) {\n        for (var i = 0; i < options.length; i++) {\n            if (el.getAttribute(options[i]) !== null) {\n                isPrevented = true;\n            }\n        }\n    }\n    return isPrevented;\n};\nvar checkForAbort = function (el, e) {\n    if (el instanceof HTMLAnchorElement) {\n        if (el.protocol !== window.location.protocol || el.host !== window.location.host) {\n            return 'external';\n        }\n        if (el.hash && el.href.replace(el.hash, '') === window.location.href.replace(location.hash, '')) {\n            return 'anchor';\n        }\n        if (el.href === window.location.href.split('#')[0] + \", '#'\") {\n            return 'anchor-empty';\n        }\n    }\n    return null;\n};\nvar handleClick = function (el, e, pjax) {\n    if (isDefaultPrevented(el, e, pjax.options.customPreventionAttributes)) {\n        return;\n    }\n    var attrValue = checkForAbort(el, e);\n    if (attrValue !== null) {\n        el.setAttribute(attrState, attrValue);\n        return;\n    }\n    e.preventDefault();\n    var elementLink = el.getAttribute('href');\n    if (elementLink === window.location.href.split('#')[0]) {\n        el.setAttribute(attrState, 'reload');\n    }\n    else {\n        el.setAttribute(attrState, 'load');\n    }\n    pjax.handleLoad(elementLink, el.getAttribute(attrState), el);\n};\nvar handleHover = function (el, e, pjax) {\n    if (isDefaultPrevented(el, e, pjax.options.customPreventionAttributes)) {\n        return;\n    }\n    if (e.type === 'mouseleave') {\n        pjax.clearPrefetch();\n        return;\n    }\n    var attrValue = checkForAbort(el, e);\n    if (attrValue !== null) {\n        el.setAttribute(attrState, attrValue);\n        return;\n    }\n    var elementLink = el.getAttribute('href');\n    if (elementLink !== window.location.href.split('#')[0]) {\n        el.setAttribute(attrState, 'prefetch');\n    }\n    else {\n        return;\n    }\n    pjax.handlePrefetch(elementLink);\n};\nexports.default = (function (el, pjax) {\n    el.setAttribute(attrState, '');\n    on_1.default(el, 'click', function (e) { handleClick(el, e, pjax); });\n    on_1.default(el, 'mouseenter', function (e) { handleHover(el, e, pjax); });\n    on_1.default(el, 'mouseleave', function (e) { handleHover(el, e, pjax); });\n    on_1.default(el, 'keyup', function (e) {\n        if (e.key === 'enter' || e.keyCode === 13)\n            handleClick(el, e, pjax);\n    });\n});\n//# sourceMappingURL=link-events.js.map\n\n//# sourceURL=webpack:///./lib/events/link-events.js?");

/***/ }),

/***/ "./lib/events/on.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = (function (el, event, listener) {\n    el.addEventListener(event, listener);\n});\n//# sourceMappingURL=on.js.map\n\n//# sourceURL=webpack:///./lib/events/on.js?");

/***/ }),

/***/ "./lib/events/trigger.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = (function (el, events, target) {\n    if (target === void 0) { target = null; }\n    events.forEach(function (e) {\n        if (target !== null) {\n            var customEvent = new CustomEvent(e, {\n                detail: {\n                    el: target\n                }\n            });\n            el.dispatchEvent(customEvent);\n        }\n        else {\n            var event_1 = new Event(e);\n            el.dispatchEvent(event_1);\n        }\n    });\n});\n//# sourceMappingURL=trigger.js.map\n\n//# sourceURL=webpack:///./lib/events/trigger.js?");

/***/ }),

/***/ "./lib/parse-dom.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar get_elements_1 = __webpack_require__(\"./lib/util/get-elements.js\");\nvar check_element_1 = __webpack_require__(\"./lib/util/check-element.js\");\nexports.default = (function (el, pjax) {\n    var elements = get_elements_1.default(el, pjax);\n    if (pjax.options.debug && elements.length === 0) {\n        console.log('%c[Pjax] ' + \"%cno elements could be found, check what selectors you're providing Pjax\", 'color:#f3ff35', 'color:#eee');\n        return;\n    }\n    for (var i = 0; i < elements.length; i++) {\n        check_element_1.default(elements[i], pjax);\n    }\n});\n//# sourceMappingURL=parse-dom.js.map\n\n//# sourceURL=webpack:///./lib/parse-dom.js?");

/***/ }),

/***/ "./lib/parse-options.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = (function (options) {\n    if (options === void 0) { options = null; }\n    var parsedOptions = (options !== null) ? options : {};\n    parsedOptions.elements = (options !== null && options.elements !== undefined) ? options.elements : 'a[href]';\n    parsedOptions.selectors = (options !== null && options.selectors !== undefined) ? options.selectors : ['.js-pjax'];\n    parsedOptions.history = (options !== null && options.history !== undefined) ? options.history : true;\n    parsedOptions.cacheBust = (options !== null && options.cacheBust !== undefined) ? options.cacheBust : false;\n    parsedOptions.debug = (options !== null && options.debug !== undefined) ? options.debug : false;\n    parsedOptions.timeout = (options !== null && options.timeout !== undefined) ? options.timeout : 0;\n    parsedOptions.titleSwitch = (options !== null && options.titleSwitch !== undefined) ? options.titleSwitch : true;\n    parsedOptions.customTransitions = (options !== null && options.customTransitions !== undefined) ? options.customTransitions : false;\n    parsedOptions.customPreventionAttributes = (options !== null && options.customPreventionAttributes !== undefined) ? options.customPreventionAttributes : [];\n    return parsedOptions;\n});\n//# sourceMappingURL=parse-options.js.map\n\n//# sourceURL=webpack:///./lib/parse-options.js?");

/***/ }),

/***/ "./lib/util/check-element.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar link_events_1 = __webpack_require__(\"./lib/events/link-events.js\");\nexports.default = (function (el, pjax) {\n    if (el.getAttribute('href')) {\n        link_events_1.default(el, pjax);\n    }\n    else {\n        if (pjax.options.debug) {\n            console.log('%c[Pjax] ' + (\"%c\" + el + \" is missing a href attribute, Pjax couldn't assign the event listener\"), 'color:#f3ff35', 'color:#eee');\n        }\n    }\n});\n//# sourceMappingURL=check-element.js.map\n\n//# sourceURL=webpack:///./lib/util/check-element.js?");

/***/ }),

/***/ "./lib/util/clear-active.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = (function () {\n    if (document.activeElement) {\n        try {\n            document.activeElement.blur();\n        }\n        catch (e) {\n            console.log(e);\n        }\n    }\n});\n//# sourceMappingURL=clear-active.js.map\n\n//# sourceURL=webpack:///./lib/util/clear-active.js?");

/***/ }),

/***/ "./lib/util/get-elements.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = (function (el, pjax) {\n    var elements = Array.from(el.querySelectorAll(pjax.options.elements));\n    return elements;\n});\n//# sourceMappingURL=get-elements.js.map\n\n//# sourceURL=webpack:///./lib/util/get-elements.js?");

/***/ }),

/***/ "./lib/util/scroll.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = (function (scrollTo) {\n    window.scrollTo(scrollTo.x, scrollTo.y);\n});\n//# sourceMappingURL=scroll.js.map\n\n//# sourceURL=webpack:///./lib/util/scroll.js?");

/***/ }),

/***/ "./node_modules/fuel-device-manager/DeviceManager.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar _this = this;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar DeviceManager = (function () {\n    function DeviceManager(debug, setStatusClasses) {\n        var _this = this;\n        this.handleMouseEvent = function (e) {\n            _this._body.removeEventListener('mouseover', _this.handleMouseEvent);\n            _this._html.classList.add('is-pointer-device');\n            _this._html.classList.remove('is-not-pointer-device');\n            if (_this._isDebug) {\n                console.log('%c[Device Manager] ' + \"%cUser is using a pointer device\", 'color:#35ffb8', 'color:#eee');\n            }\n        };\n        this.handleTouchEvent = function (e) {\n            _this._body.removeEventListener('touchstart', _this.handleTouchEvent);\n            _this._html.classList.add('has-touched');\n            if (_this._isDebug) {\n                console.log('%c[Device Manager] ' + \"%cUser has touched their device\", 'color:#35ffb8', 'color:#eee');\n            }\n        };\n        this._isDebug = (debug) ? debug : false;\n        this._html = document.documentElement;\n        this._body = document.body;\n        if (setStatusClasses) {\n            this.setStatusClasses();\n        }\n    }\n    DeviceManager.prototype.setStatusClasses = function () {\n        this._html.classList.add('has-js');\n        this._html.classList.remove('has-no-js');\n        if (this._isDebug) {\n            console.log('%c[Device Manager] ' + \"%cSetting status classes\", 'color:#35ffb8', 'color:#eee');\n        }\n        this._body.addEventListener('mouseover', this.handleMouseEvent);\n        this._body.addEventListener('touchstart', this.handleTouchEvent);\n        if (DeviceManager.supportsTouch) {\n            this._html.classList.add('is-touch-device');\n            this._html.classList.remove('is-not-touch-device');\n            if (this._isDebug) {\n                console.log('%c[Device Manager] ' + (\"%cSupports Touch: %c\" + DeviceManager.supportsTouch), 'color:#35ffb8', 'color:#eee', 'color:#68e5ff');\n            }\n        }\n        if (DeviceManager.isBlinkEngine) {\n            this._html.classList.add('is-blink');\n            if (this._isDebug) {\n                console.log('%c[Device Manager] ' + (\"%cUsing Blink Engine: %c\" + DeviceManager.isBlinkEngine), 'color:#35ffb8', 'color:#eee', 'color:#68e5ff');\n            }\n        }\n        if (DeviceManager.isChrome) {\n            this._html.classList.add('is-chrome');\n            if (this._isDebug) {\n                console.log('%c[Device Manager] ' + (\"%cChrome: %c\" + DeviceManager.isChrome), 'color:#35ffb8', 'color:#eee', 'color:#68e5ff');\n            }\n        }\n        if (DeviceManager.isIE) {\n            this._html.classList.add('is-ie');\n            if (this._isDebug) {\n                console.log('%c[Device Manager] ' + (\"%cInternet Explorer: %c\" + DeviceManager.isIE), 'color:#35ffb8', 'color:#eee', 'color:#68e5ff');\n            }\n        }\n        if (DeviceManager.isEdge) {\n            this._html.classList.add('is-edge');\n            if (this._isDebug) {\n                console.log('%c[Device Manager] ' + (\"%cEdge: %c\" + DeviceManager.isEdge), 'color:#35ffb8', 'color:#eee', 'color:#68e5ff');\n            }\n        }\n        if (DeviceManager.isFirefox) {\n            this._html.classList.add('is-firefox');\n            if (this._isDebug) {\n                console.log('%c[Device Manager] ' + (\"%cFirefox: %c\" + DeviceManager.isFirefox), 'color:#35ffb8', 'color:#eee', 'color:#68e5ff');\n            }\n        }\n        if (DeviceManager.isSafari) {\n            this._html.classList.add('is-safari');\n            if (this._isDebug) {\n                console.log('%c[Device Manager] ' + (\"%cSafari: %c\" + DeviceManager.isSafari), 'color:#35ffb8', 'color:#eee', 'color:#68e5ff');\n            }\n        }\n        if (DeviceManager.isOpera) {\n            this._html.classList.add('is-opera');\n            if (this._isDebug) {\n                console.log('%c[Device Manager] ' + (\"%cOpera: %c\" + DeviceManager.isOpera), 'color:#35ffb8', 'color:#eee', 'color:#68e5ff');\n            }\n        }\n    };\n    DeviceManager.isChrome = (function () {\n        var isChrome = false;\n        if (!!window.chrome) {\n            isChrome = true;\n        }\n        return isChrome;\n    })();\n    DeviceManager.isEdge = (function () {\n        var isEdge = false;\n        if (!_this.isIE && !!window.StyleMedia) {\n            isEdge = true;\n        }\n        return isEdge;\n    })();\n    DeviceManager.isIE = (function () {\n        var isIE = false;\n        if ( false || !!document.documentMode) {\n            isIE = true;\n        }\n        return isIE;\n    })();\n    DeviceManager.isFirefox = (function () {\n        var isFirefox = false;\n        if (typeof InstallTrigger !== 'undefined') {\n            isFirefox = true;\n        }\n        return isFirefox;\n    })();\n    DeviceManager.isSafari = (function () {\n        var isSafari = false;\n        if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === \"[object SafariRemoteNotification]\"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))) {\n            isSafari = true;\n        }\n        return isSafari;\n    })();\n    DeviceManager.isOpera = (function () {\n        var isOpera = false;\n        if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {\n            isOpera = true;\n        }\n        return isOpera;\n    })();\n    DeviceManager.isBlinkEngine = (function () {\n        var isBlink = false;\n        if ((DeviceManager.isChrome || DeviceManager.isOpera) && !!window.CSS) {\n            isBlink = true;\n        }\n        return isBlink;\n    })();\n    DeviceManager.supportsTouch = (function () {\n        var isTouchSupported = false;\n        if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {\n            isTouchSupported = true;\n        }\n        return isTouchSupported;\n    })();\n    return DeviceManager;\n}());\nexports.default = DeviceManager;\n//# sourceMappingURL=DeviceManager.js.map\n\n//# sourceURL=webpack:///./node_modules/fuel-device-manager/DeviceManager.js?");

/***/ }),

/***/ "./node_modules/fuel-state-manager/lib/util/timestamp.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = (function () {\n    return Date.now();\n});\n//# sourceMappingURL=timestamp.js.map\n\n//# sourceURL=webpack:///./node_modules/fuel-state-manager/lib/util/timestamp.js?");

/***/ }),

/***/ "./node_modules/fuel-state-manager/manager.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar timestamp_1 = __webpack_require__(\"./node_modules/fuel-state-manager/lib/util/timestamp.js\");\nvar StateManager = (function () {\n    function StateManager(debug, initialpushState) {\n        this._doInitialPushState = (initialpushState) ? initialpushState : false;\n        this._isDebug = (debug) ? debug : false;\n        if (this._doInitialPushState) {\n            this.doReplace(window.location.href);\n        }\n    }\n    StateManager.prototype.handleReplaceState = function (stateObject) {\n        if (this._isDebug) {\n            console.log('Replacing History State: ', stateObject);\n        }\n        window.history.replaceState(stateObject, stateObject.title, stateObject.uri);\n    };\n    StateManager.prototype.handlePushState = function (stateObject) {\n        if (this._isDebug) {\n            console.log('Pushing History State: ', stateObject);\n        }\n        window.history.pushState(stateObject, stateObject.title, stateObject.uri);\n    };\n    StateManager.prototype.buildStateObject = function (pageURI, isPushstate, pageTitle, scrollOffset) {\n        var stateObject = {\n            uri: pageURI,\n            timestamp: timestamp_1.default(),\n            history: isPushstate,\n            scrollPos: {\n                x: (window.scrollX + scrollOffset.x),\n                y: (window.scrollY + scrollOffset.y)\n            }\n        };\n        this._previousState = stateObject;\n        stateObject.title = (pageTitle !== null && pageTitle !== undefined) ? pageTitle : document.title;\n        if (isPushstate) {\n            this.handlePushState(stateObject);\n        }\n        else {\n            this.handleReplaceState(stateObject);\n        }\n    };\n    StateManager.prototype.doPush = function (uri, title, scrollOffset) {\n        if (title === void 0) { title = document.title; }\n        if (scrollOffset === void 0) { scrollOffset = { x: 0, y: 0 }; }\n        this.buildStateObject(uri, true, title, scrollOffset);\n    };\n    StateManager.prototype.doReplace = function (uri, title, scrollOffset) {\n        if (title === void 0) { title = document.title; }\n        if (scrollOffset === void 0) { scrollOffset = { x: 0, y: 0 }; }\n        this.buildStateObject(uri, false, title, scrollOffset);\n    };\n    return StateManager;\n}());\nexports.default = StateManager;\n//# sourceMappingURL=manager.js.map\n\n//# sourceURL=webpack:///./node_modules/fuel-state-manager/manager.js?");

/***/ }),

/***/ "./pjax.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar parse_options_1 = __webpack_require__(\"./lib/parse-options.js\");\nvar trigger_1 = __webpack_require__(\"./lib/events/trigger.js\");\nvar parse_dom_1 = __webpack_require__(\"./lib/parse-dom.js\");\nvar scroll_1 = __webpack_require__(\"./lib/util/scroll.js\");\nvar clear_active_1 = __webpack_require__(\"./lib/util/clear-active.js\");\nvar fuel_state_manager_1 = __webpack_require__(\"./node_modules/fuel-state-manager/manager.js\");\nvar fuel_device_manager_1 = __webpack_require__(\"./node_modules/fuel-device-manager/DeviceManager.js\");\nvar Pjax = (function () {\n    function Pjax(options) {\n        var _this = this;\n        this.handlePopstate = function (e) {\n            if (e.state) {\n                if (_this.options.debug) {\n                    console.log('%c[Pjax] ' + \"%chijacking popstate event\", 'color:#f3ff35', 'color:#eee');\n                }\n                _this.scrollTo = e.state.scrollPos;\n                _this.loadUrl(e.state.uri, 'popstate');\n            }\n        };\n        this.handleContinue = function (e) {\n            if (_this.cachedSwitch !== null) {\n                if (_this.options.titleSwitch) {\n                    document.title = _this.cachedSwitch.title;\n                }\n                _this.handleSwitches(_this.cachedSwitch.queue);\n            }\n            else {\n                if (_this.options.debug) {\n                    console.log('%c[Pjax] ' + \"%cswitch queue was empty. You might be sending pjax:continue early\", 'color:#f3ff35', 'color:#eee');\n                }\n                trigger_1.default(document, ['pjax:error']);\n            }\n        };\n        if (fuel_device_manager_1.default.isIE) {\n            console.log('%c[Pjax] ' + \"%cIE 11 detected - Pjax aborted\", 'color:#f3ff35', 'color:#eee');\n            return;\n        }\n        this.cache = null;\n        this.options = parse_options_1.default(options);\n        this.stateManager = new fuel_state_manager_1.default(this.options.debug, true);\n        this.request = null;\n        this.confirmed = false;\n        this.cachedSwitch = null;\n        this.scrollTo = { x: 0, y: 0 };\n        this.isPushstate = true;\n        this.init();\n    }\n    Pjax.prototype.init = function () {\n        if (this.options.debug) {\n            console.log('%c[Pjax] ' + (\"%cinitializing Pjax version \" + Pjax.VERSION), 'color:#f3ff35', 'color:#eee');\n            console.log('%c[Pjax] ' + \"%cview Pjax documentation at http://papertrain.io/pjax\", 'color:#f3ff35', 'color:#eee');\n            console.log('%c[Pjax] ' + \"%cloaded with the following options: \", 'color:#f3ff35', 'color:#eee');\n            console.log(this.options);\n        }\n        window.addEventListener('popstate', this.handlePopstate);\n        if (this.options.customTransitions) {\n            document.addEventListener('pjax:continue', this.handleContinue);\n        }\n        parse_dom_1.default(document.body, this);\n    };\n    Pjax.prototype.loadUrl = function (href, loadType) {\n        this.abortRequest();\n        this.cache = null;\n        this.handleLoad(href, loadType);\n    };\n    Pjax.prototype.abortRequest = function () {\n        if (this.request === null) {\n            return;\n        }\n        if (this.request.readyState !== 4) {\n            this.request.abort();\n        }\n        this.request = null;\n    };\n    Pjax.prototype.finalize = function () {\n        if (this.options.debug) {\n            console.log('%c[Pjax] ' + \"%cpage transition completed\", 'color:#f3ff35', 'color:#eee');\n        }\n        scroll_1.default(this.scrollTo);\n        if (this.options.history) {\n            if (this.isPushstate) {\n                this.stateManager.doPush(this.request.responseURL, document.title);\n            }\n            else {\n                this.stateManager.doReplace(this.request.responseURL, document.title);\n            }\n        }\n        this.cache = null;\n        this.request = null;\n        this.confirmed = false;\n        this.cachedSwitch = null;\n        this.isPushstate = true;\n        this.scrollTo = { x: 0, y: 0 };\n        trigger_1.default(document, ['pjax:complete']);\n    };\n    Pjax.prototype.handleSwitches = function (switchQueue) {\n        for (var i = 0; i < switchQueue.length; i++) {\n            switchQueue[i].current.innerHTML = switchQueue[i].new.innerHTML;\n            parse_dom_1.default(switchQueue[i].current, this);\n        }\n        this.finalize();\n    };\n    Pjax.prototype.switchSelectors = function (selectors, tempDocument, currentDocument) {\n        if (tempDocument === null) {\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + (\"%ctemporary document was null, telling the browser to load \" + ((this.cache !== null) ? this.cache.url : this.request.responseURL)), 'color:#f3ff35', 'color:#eee');\n            }\n            if (this.cache !== null) {\n                this.lastChance(this.cache.url);\n            }\n            else {\n                this.lastChance(this.request.responseURL);\n            }\n        }\n        var switchQueue = [];\n        var contiansScripts = false;\n        for (var i = 0; i < selectors.length; i++) {\n            var newContainers = Array.from(tempDocument.querySelectorAll(selectors[i]));\n            var currentContainers = Array.from(currentDocument.querySelectorAll(selectors[i]));\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + (\"%cswapping content from \" + selectors[i]), 'color:#f3ff35', 'color:#eee');\n            }\n            if (newContainers.length !== currentContainers.length) {\n                if (this.options.debug) {\n                    console.log('%c[Pjax] ' + \"%cthe dom doesn't look the same\", 'color:#f3ff35', 'color:#eee');\n                }\n                this.lastChance(this.request.responseURL);\n                return;\n            }\n            for (var k = 0; k < newContainers.length; k++) {\n                var scripts = Array.from(newContainers[k].querySelectorAll('script'));\n                if (scripts.length > 0) {\n                    contiansScripts = true;\n                }\n                var newContainer = newContainers[k];\n                var currentContainer = currentContainers[k];\n                var switchObject = {\n                    new: newContainer,\n                    current: currentContainer\n                };\n                switchQueue.push(switchObject);\n            }\n        }\n        if (switchQueue.length === 0) {\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + \"%ccouldn't find anything to switch\", 'color:#f3ff35', 'color:#eee');\n            }\n            this.lastChance(this.request.responseURL);\n            return;\n        }\n        if (contiansScripts) {\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + \"%cthe new page contains scripts\", 'color:#f3ff35', 'color:#eee');\n            }\n            this.lastChance(this.request.responseURL);\n            return;\n        }\n        if (!this.options.customTransitions) {\n            if (this.options.titleSwitch) {\n                document.title = tempDocument.title;\n            }\n            this.handleSwitches(switchQueue);\n        }\n        else {\n            this.cachedSwitch = {\n                queue: switchQueue,\n                title: tempDocument.title\n            };\n        }\n    };\n    Pjax.prototype.lastChance = function (uri) {\n        if (this.options.debug) {\n            console.log('%c[Pjax] ' + (\"%csomething caused Pjax to break, native loading \" + uri), 'color:#f3ff35', 'color:#eee');\n        }\n        window.location.href = uri;\n    };\n    Pjax.prototype.statusCheck = function () {\n        for (var status_1 = 200; status_1 <= 206; status_1++) {\n            if (this.cache.status === status_1) {\n                return true;\n            }\n        }\n        return false;\n    };\n    Pjax.prototype.loadCachedContent = function () {\n        if (!this.statusCheck()) {\n            this.lastChance(this.cache.url);\n            return;\n        }\n        clear_active_1.default();\n        this.stateManager.doReplace(window.location.href, document.title);\n        this.switchSelectors(this.options.selectors, this.cache.document, document);\n    };\n    Pjax.prototype.parseContent = function (responseText) {\n        var tempDocument = document.implementation.createHTMLDocument('pjax-temp-document');\n        var htmlRegex = /<html[^>]+>/gi;\n        var matches = responseText.match(htmlRegex);\n        if (matches !== null) {\n            tempDocument.documentElement.innerHTML = responseText;\n            return tempDocument;\n        }\n        return null;\n    };\n    Pjax.prototype.cacheContent = function (responseText, responseStatus, uri) {\n        var tempDocument = this.parseContent(responseText);\n        this.cache = {\n            status: responseStatus,\n            document: tempDocument,\n            url: uri\n        };\n        if (tempDocument instanceof HTMLDocument) {\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + \"%ccaching content\", 'color:#f3ff35', 'color:#eee');\n            }\n        }\n        else {\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + \"%cresponse wan't an HTML document\", 'color:#f3ff35', 'color:#eee');\n            }\n            trigger_1.default(document, ['pjax:error']);\n        }\n    };\n    Pjax.prototype.loadContent = function (responseText) {\n        var tempDocument = this.parseContent(responseText);\n        if (tempDocument instanceof HTMLDocument) {\n            clear_active_1.default();\n            this.stateManager.doReplace(window.location.href, document.title);\n            this.switchSelectors(this.options.selectors, tempDocument, document);\n        }\n        else {\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + \"%cresponse wasn't an HTML document\", 'color:#f3ff35', 'color:#eee');\n            }\n            trigger_1.default(document, ['pjax:error']);\n            this.lastChance(this.request.responseURL);\n            return;\n        }\n    };\n    Pjax.prototype.handleResponse = function (e, loadType) {\n        if (this.options.debug) {\n            console.log('%c[Pjax] ' + (\"%cXML Http Request status: \" + this.request.status), 'color:#f3ff35', 'color:#eee');\n        }\n        if (this.request.responseText === null) {\n            trigger_1.default(document, ['pjax:error']);\n            return;\n        }\n        switch (loadType) {\n            case 'prefetch':\n                if (this.confirmed) {\n                    this.loadContent(this.request.responseText);\n                }\n                else {\n                    this.cacheContent(this.request.responseText, this.request.status, this.request.responseURL);\n                }\n                break;\n            case 'popstate':\n                this.isPushstate = false;\n                this.loadContent(this.request.responseText);\n                break;\n            case 'reload':\n                this.isPushstate = false;\n                this.loadContent(this.request.responseText);\n                break;\n            default:\n                this.loadContent(this.request.responseText);\n                break;\n        }\n    };\n    Pjax.prototype.doRequest = function (href) {\n        var _this = this;\n        var reqeustMethod = 'GET';\n        var timeout = this.options.timeout || 0;\n        var request = new XMLHttpRequest();\n        var uri = href;\n        var queryString = href.split('?')[1];\n        if (this.options.cacheBust) {\n            uri += (queryString === undefined) ? (\"?cb=\" + Date.now()) : (\"&cb=\" + Date.now());\n        }\n        return new Promise(function (resolve, reject) {\n            request.open(reqeustMethod, uri, true);\n            request.timeout = timeout;\n            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');\n            request.setRequestHeader('X-PJAX', 'true');\n            request.setRequestHeader('X-PJAX-Selectors', JSON.stringify(_this.options.selectors));\n            request.onload = resolve;\n            request.onerror = reject;\n            request.send();\n            _this.request = request;\n        });\n    };\n    Pjax.prototype.handlePrefetch = function (href) {\n        var _this = this;\n        if (this.confirmed) {\n            return;\n        }\n        if (this.options.debug) {\n            console.log('%c[Pjax] ' + (\"%cprefetching \" + href), 'color:#f3ff35', 'color:#eee');\n        }\n        this.abortRequest();\n        trigger_1.default(document, ['pjax:prefetch']);\n        this.doRequest(href).then(function (e) {\n            _this.handleResponse(e, 'prefetch');\n        }).catch(function (e) {\n            if (_this.options.debug) {\n                console.log('%c[Pjax] ' + \"%cXHR error:\", 'color:#f3ff35', 'color:#eee');\n                console.log(e);\n            }\n        });\n    };\n    Pjax.prototype.handleLoad = function (href, loadType, el) {\n        var _this = this;\n        if (el === void 0) { el = null; }\n        if (this.confirmed) {\n            return;\n        }\n        trigger_1.default(document, ['pjax:send'], el);\n        this.confirmed = true;\n        if (this.cache !== null) {\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + (\"%cloading cached content from \" + href), 'color:#f3ff35', 'color:#eee');\n            }\n            this.loadCachedContent();\n        }\n        else if (this.request !== null) {\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + (\"%cconfirming prefetch for \" + href), 'color:#f3ff35', 'color:#eee');\n            }\n            this.confirmed = true;\n        }\n        else {\n            if (this.options.debug) {\n                console.log('%c[Pjax] ' + (\"%cloading \" + href), 'color:#f3ff35', 'color:#eee');\n            }\n            this.doRequest(href).then(function (e) {\n                _this.handleResponse(e, loadType);\n            }).catch(function (e) {\n                if (_this.options.debug) {\n                    console.log('%c[Pjax] ' + \"%cXHR error:\", 'color:#f3ff35', 'color:#eee');\n                    console.log(e);\n                }\n            });\n        }\n    };\n    Pjax.prototype.clearPrefetch = function () {\n        if (!this.confirmed) {\n            this.cache = null;\n            this.abortRequest();\n            trigger_1.default(document, ['pjax:cancel']);\n        }\n    };\n    Pjax.VERSION = '1.2.2';\n    return Pjax;\n}());\nexports.default = Pjax;\n//# sourceMappingURL=pjax.js.map\n\n//# sourceURL=webpack:///./pjax.js?");

/***/ }),

/***/ "./testing/App.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pjax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"./pjax.js\");\n/* harmony import */ var _pjax__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_pjax__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/**\n * IIFE for starting Pjax on load\n */\n(function(){\n    var pjax = new _pjax__WEBPACK_IMPORTED_MODULE_0___default.a({ debug:true });\n\n    var prefetchLight = document.body.querySelector('.js-prefetch');\n    var loadLight = document.body.querySelector('.js-load');\n    var errorLight = document.body.querySelector('.js-error');\n    var cancelLight = document.body.querySelector('.js-cancel');\n    var completeLight = document.body.querySelector('.js-complete');\n\n    var clearEventsButton = document.body.querySelector('.js-clear');\n\n    function clearStatus(){\n        prefetchLight.classList.remove('is-lit');\n        loadLight.classList.remove('is-lit');\n        errorLight.classList.remove('is-lit');\n        cancelLight.classList.remove('is-lit');\n        completeLight.classList.remove('is-lit');\n    }\n\n    clearEventsButton.addEventListener('click', function(e){\n        clearStatus();\n    });\n\n    document.addEventListener('pjax:prefetch', function(e){\n        clearStatus();\n        prefetchLight.classList.add('is-lit');\n    });\n\n    document.addEventListener('pjax:send', function(e){\n        loadLight.classList.add('is-lit');\n    });\n\n    document.addEventListener('pjax:error', function(e){\n        errorLight.classList.add('is-lit');\n    });\n\n    document.addEventListener('pjax:cancel', function(e){\n        cancelLight.classList.add('is-lit');\n    });\n\n    document.addEventListener('pjax:complete', function(e){\n        completeLight.classList.add('is-lit');\n    });\n})();\n\n\n//# sourceURL=webpack:///./testing/App.js?");

/***/ })

/******/ });