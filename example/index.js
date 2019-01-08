(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Pjax = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var on_1 = require("./on");
var attrState = 'data-pjax-state';
var isDefaultPrevented = function (el, e) {
    var isPrevented = false;
    if (e.defaultPrevented)
        isPrevented = true;
    else if (el.getAttribute('prevent-default') !== null)
        isPrevented = true;
    else if (el.classList.contains('no-transition'))
        isPrevented = true;
    else if (el.getAttribute('download') !== null)
        isPrevented = true;
    else if (el.getAttribute('target') === '_blank')
        isPrevented = true;
    return isPrevented;
};
var checkForAbort = function (el, e) {
    if (el.protocol !== window.location.protocol || el.host !== window.location.host)
        return 'external';
    if (el.hash && el.href.replace(el.hash, '') === window.location.href.replace(location.hash, ''))
        return 'anchor';
    if (el.href === window.location.href.split('#')[0] + ", '#'")
        return 'anchor-empty';
    return null;
};
var handleClick = function (el, e, pjax) {
    if (isDefaultPrevented(el, e))
        return;
    var eventOptions = {
        triggerElement: el
    };
    var attrValue = checkForAbort(el, e);
    if (attrValue !== null) {
        el.setAttribute(attrState, attrValue);
        return;
    }
    e.preventDefault();
    if (el.href === window.location.href.split('#')[0])
        el.setAttribute(attrState, 'reload');
    else
        el.setAttribute(attrState, 'load');
    pjax.handleLoad(el.href, el.getAttribute(attrState), el);
};
var handleHover = function (el, e, pjax) {
    if (isDefaultPrevented(el, e))
        return;
    if (e.type === 'mouseout') {
        pjax.clearPrefetch();
        return;
    }
    var eventOptions = {
        triggerElement: el
    };
    var attrValue = checkForAbort(el, e);
    if (attrValue !== null) {
        el.setAttribute(attrState, attrValue);
        return;
    }
    if (el.href !== window.location.href.split('#')[0])
        el.setAttribute(attrState, 'prefetch');
    else
        return;
    pjax.handlePrefetch(el.href, eventOptions);
};
exports.default = (function (el, pjax) {
    el.setAttribute(attrState, '');
    on_1.default(el, 'click', function (e) { handleClick(el, e, pjax); });
    on_1.default(el, 'mouseenter', function (e) { handleHover(el, e, pjax); });
    on_1.default(el, 'mouseleave', function (e) { handleHover(el, e, pjax); });
    on_1.default(el, 'keyup', function (e) {
        if (e.key === 'enter' || e.keyCode === 13)
            handleClick(el, e, pjax);
    });
});

},{"./on":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (el, event, listener) {
    el.addEventListener(event, listener);
});

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (el, events, target) {
    if (target === void 0) { target = null; }
    events.forEach(function (e) {
        if (target !== null) {
            var customEvent = new CustomEvent(e, {
                detail: {
                    el: target
                }
            });
            el.dispatchEvent(customEvent);
        }
        else {
            var event_1 = new Event(e);
            el.dispatchEvent(event_1);
        }
    });
});

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (options) {
    if (options === void 0) { options = null; }
    var parsedOptions = (options !== null) ? options : {};
    parsedOptions.elements = (options !== null && options.elements !== undefined) ? options.elements : 'a[href]';
    parsedOptions.selectors = (options !== null && options.selectors !== undefined) ? options.selectors : ['.js-pjax'];
    parsedOptions.history = (options !== null && options.history !== undefined) ? options.history : true;
    parsedOptions.scrollTo = (options !== null && options.scrollTo !== undefined) ? options.scrollTo : 0;
    parsedOptions.cacheBust = (options !== null && options.cacheBust !== undefined) ? options.cacheBust : false;
    parsedOptions.debug = (options !== null && options.debug !== undefined) ? options.debug : false;
    parsedOptions.timeout = (options !== null && options.timeout !== undefined) ? options.timeout : 0;
    parsedOptions.titleSwitch = (options !== null && options.titleSwitch !== undefined) ? options.titleSwitch : true;
    parsedOptions.customTransitions = (options !== null && options.customTransitions !== undefined) ? options.customTransitions : false;
    return parsedOptions;
});

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (el, pjax) {
    switch (el.tagName.toLocaleLowerCase()) {
        case 'a':
            if (!el.hasAttribute(pjax.options.attrState))
                pjax.setLinkListeners(el);
            break;
        default:
            throw 'Pjax can only be applied on <a> elements';
    }
});

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (doc, selectors, element) {
    selectors.map(function (selector) {
        var selectorEls = Array.from(doc.querySelectorAll(selector));
        selectorEls.forEach(function (el) {
            if (el.contains(element)) {
                return true;
            }
        });
    });
    return false;
});

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    if (!Array.from) {
        Array.from = (function () {
            var toStr = Object.prototype.toString;
            var isCallable = function (fn) {
                return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
            };
            var toInteger = function (value) {
                var num = Number(value);
                if (isNaN(num)) {
                    return 0;
                }
                if (num === 0 || !isFinite(num)) {
                    return num;
                }
                return (num > 0 ? 1 : -1) * Math.floor(Math.abs(num));
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;
            var toLength = function (value) {
                var len = toInteger(value);
                return Math.min(Math.max(len, 0), maxSafeInteger);
            };
            return function from(arrayLike) {
                var C = this;
                var items = Object(arrayLike);
                if (arrayLike == null) {
                    throw new TypeError('Array.from requires an array-like object - not null or undefined');
                }
                var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                var T;
                if (typeof mapFn !== 'undefined') {
                    if (!isCallable(mapFn)) {
                        throw new TypeError('Array.from: when provided, the second argument must be a function');
                    }
                    if (arguments.length > 2) {
                        T = arguments[2];
                    }
                }
                var len = toLength(items.length);
                var A = isCallable(C) ? Object(new C(len)) : [len];
                var k = 0;
                var kValue;
                while (k < len) {
                    kValue = items[k];
                    if (mapFn) {
                        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                    }
                    else {
                        A[k] = kValue;
                    }
                    k += 1;
                }
                A.length = len;
                return A;
            };
        }());
    }
});

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    return Date.now().toString();
});

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_options_1 = require("./lib/parse-options");
var uuid_1 = require("./lib/uuid");
var trigger_1 = require("./lib/events/trigger");
var contains_1 = require("./lib/util/contains");
var link_events_1 = require("./lib/events/link-events");
var check_element_1 = require("./lib/util/check-element");
var polyfill_1 = require("./lib/util/polyfill");
var Pjax = (function () {
    function Pjax(options) {
        this.state = {
            url: window.location.href,
            title: document.title,
            history: false,
            scrollPos: [0, 0]
        };
        this.cache = null;
        this.options = parse_options_1.default(options);
        this.lastUUID = uuid_1.default();
        this.request = null;
        this.confirmed = false;
        this.cachedSwitch = null;
        if (this.options.debug)
            console.log('Pjax Options:', this.options);
        this.init();
    }
    Pjax.prototype.init = function () {
        var _this = this;
        if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
            polyfill_1.default();
        }
        window.addEventListener('popstate', function (e) { return _this.handlePopstate(e); });
        if (this.options.customTransitions)
            document.addEventListener('pjax:continue', function (e) { return _this.handleContinue(e); });
        this.parseDOM(document.body);
        this.handlePushState();
    };
    Pjax.prototype.handleReload = function () {
        window.location.reload();
    };
    Pjax.prototype.setLinkListeners = function (el) {
        link_events_1.default(el, this);
    };
    Pjax.prototype.getElements = function (el) {
        return Array.from(el.querySelectorAll(this.options.elements));
    };
    Pjax.prototype.parseDOM = function (el) {
        var _this = this;
        var elements = this.getElements(el);
        elements.forEach(function (el) {
            check_element_1.default(el, _this);
        });
    };
    Pjax.prototype.handlePopstate = function (e) {
        if (e.state) {
            if (this.options.debug)
                console.log('Hijacking Popstate Event');
            this.loadUrl(e.state.url, 'popstate');
        }
    };
    Pjax.prototype.abortRequest = function () {
        if (this.request === null)
            return;
        if (this.request.readyState !== 4) {
            this.request.abort();
            this.request = null;
        }
    };
    Pjax.prototype.loadUrl = function (href, loadType) {
        this.abortRequest();
        if (this.cache === null) {
            this.handleLoad(href, loadType);
        }
        else {
            this.loadCachedContent();
        }
    };
    Pjax.prototype.handlePushState = function () {
        if (this.state !== {}) {
            if (this.state.history) {
                if (this.options.debug)
                    console.log('Pushing History State: ', this.state);
                this.lastUUID = uuid_1.default();
                window.history.pushState({
                    url: this.state.url,
                    title: this.state.title,
                    uuid: this.lastUUID,
                    scrollPos: [0, 0]
                }, this.state.title, this.state.url);
            }
            else {
                if (this.options.debug)
                    console.log('Replacing History State: ', this.state);
                this.lastUUID = uuid_1.default();
                window.history.replaceState({
                    url: this.state.url,
                    title: this.state.title,
                    uuid: this.lastUUID,
                    scrollPos: [0, 0]
                }, document.title);
            }
        }
    };
    Pjax.prototype.handleScrollPosition = function () {
        if (this.state.history) {
            var temp = document.createElement('a');
            temp.href = this.state.url;
            if (temp.hash) {
                var name_1 = temp.hash.slice(1);
                name_1 = decodeURIComponent(name_1);
                var currTop = 0;
                var target = document.getElementById(name_1) || document.getElementsByName(name_1)[0];
                if (target) {
                    if (target.offsetParent) {
                        do {
                            currTop += target.offsetTop;
                            target = target.offsetParent;
                        } while (target);
                    }
                }
                window.scrollTo(0, currTop);
            }
            else
                window.scrollTo(0, this.options.scrollTo);
        }
        else if (this.state.scrollPos) {
            window.scrollTo(this.state.scrollPos[0], this.state.scrollPos[1]);
        }
    };
    Pjax.prototype.finalize = function () {
        if (this.options.debug)
            console.log('Finishing Pjax');
        this.state.url = this.request.responseURL;
        this.state.title = document.title;
        this.state.scrollPos = [0, window.scrollY];
        this.handlePushState();
        this.handleScrollPosition();
        this.cache = null;
        this.state = {};
        this.request = null;
        this.confirmed = false;
        this.cachedSwitch = null;
        trigger_1.default(document, ['pjax:complete']);
    };
    Pjax.prototype.handleSwitches = function (switchQueue) {
        var _this = this;
        switchQueue.map(function (switchObj) {
            switchObj.oldEl.innerHTML = switchObj.newEl.innerHTML;
            _this.parseDOM(switchObj.oldEl);
        });
        this.finalize();
    };
    Pjax.prototype.handleContinue = function (e) {
        if (this.cachedSwitch !== null) {
            if (this.options.titleSwitch)
                document.title = this.cachedSwitch.title;
            this.handleSwitches(this.cachedSwitch.queue);
        }
        else {
            if (this.options.debug)
                console.log('Switch queue was empty. You might be sending `pjax:continue` too fast.');
            trigger_1.default(document, ['pjax:error']);
        }
    };
    Pjax.prototype.switchSelectors = function (selectors, toEl, fromEl) {
        var _this = this;
        var switchQueue = [];
        selectors.forEach(function (selector) {
            var newEls = Array.from(toEl.querySelectorAll(selector));
            var oldEls = Array.from(fromEl.querySelectorAll(selector));
            if (_this.options.debug)
                console.log('Pjax Switch Selector: ', selector, newEls, oldEls);
            if (newEls.length !== oldEls.length) {
                if (_this.options.debug)
                    console.log('DOM doesn\'t look the same on the new page');
                _this.lastChance(_this.request.responseURL);
                return;
            }
            newEls.forEach(function (newElement, i) {
                var oldElement = oldEls[i];
                var elSwitch = {
                    newEl: newElement,
                    oldEl: oldElement
                };
                switchQueue.push(elSwitch);
            });
        });
        if (switchQueue.length === 0) {
            if (this.options.debug)
                console.log('Couldn\'t find anything to switch');
            this.lastChance(this.request.responseURL);
            return;
        }
        if (!this.options.customTransitions) {
            if (this.options.titleSwitch)
                document.title = toEl.title;
            this.handleSwitches(switchQueue);
        }
        else {
            this.cachedSwitch = {
                queue: switchQueue,
                title: toEl.title
            };
        }
    };
    Pjax.prototype.lastChance = function (uri) {
        if (this.options.debug) {
            console.log('Cached content has a non-200 response but we require a success response, fallback loading uri ', uri);
        }
        window.location.href = uri;
    };
    Pjax.prototype.statusCheck = function () {
        for (var status_1 = 200; status_1 <= 206; status_1++) {
            if (this.cache.status === status_1)
                return true;
        }
        return false;
    };
    Pjax.prototype.loadCachedContent = function () {
        if (!this.statusCheck()) {
            this.lastChance(this.cache.url);
            return;
        }
        if (document.activeElement && contains_1.default(document, this.options.selectors, document.activeElement)) {
            try {
                document.activeElement.blur();
            }
            catch (e) {
                console.log(e);
            }
        }
        this.switchSelectors(this.options.selectors, this.cache.html, document);
    };
    Pjax.prototype.parseContent = function (responseText) {
        var tempEl = document.implementation.createHTMLDocument('globals');
        var htmlRegex = /\s?[a-z:]+(?=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi;
        var matches = responseText.match(htmlRegex);
        if (matches && matches.length)
            return tempEl;
        return null;
    };
    Pjax.prototype.cacheContent = function (responseText, responseStatus, uri) {
        var tempEl = this.parseContent(responseText);
        if (tempEl === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        tempEl.documentElement.innerHTML = responseText;
        this.cache = {
            status: responseStatus,
            html: tempEl,
            url: uri
        };
        if (this.options.debug)
            console.log('Cached Content: ', this.cache);
    };
    Pjax.prototype.loadContent = function (responseText) {
        var tempEl = this.parseContent(responseText);
        if (tempEl === null) {
            trigger_1.default(document, ['pjax:error']);
            this.lastChance(this.request.responseURL);
            return;
        }
        tempEl.documentElement.innerHTML = responseText;
        if (document.activeElement && contains_1.default(document, this.options.selectors, document.activeElement)) {
            try {
                document.activeElement.blur();
            }
            catch (e) {
                console.log(e);
            }
        }
        this.switchSelectors(this.options.selectors, tempEl, document);
    };
    Pjax.prototype.handleResponse = function (e, loadType) {
        if (this.options.debug)
            console.log('XML Http Request Status: ', this.request.status);
        var request = this.request;
        if (request.responseText === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        switch (loadType) {
            case 'prefetch':
                this.state.history = true;
                if (this.confirmed)
                    this.loadContent(request.responseText);
                else
                    this.cacheContent(request.responseText, request.status, request.responseURL);
                break;
            case 'popstate':
                this.state.history = false;
                this.loadContent(request.responseText);
                break;
            case 'reload':
                this.state.history = false;
                this.loadContent(request.responseText);
                break;
            default:
                this.state.history = true;
                this.loadContent(request.responseText);
                break;
        }
    };
    Pjax.prototype.doRequest = function (href) {
        var _this = this;
        var reqeustMethod = 'GET';
        var timeout = this.options.timeout || 0;
        var request = new XMLHttpRequest();
        var uri = href;
        var queryString = href.split('?')[1];
        if (this.options.cacheBust)
            uri += (queryString === undefined) ? ("?cb=" + Date.now()) : ("&cb=" + Date.now());
        return new Promise(function (resolve, reject) {
            request.open(reqeustMethod, uri, true);
            request.timeout = timeout;
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.setRequestHeader('X-PJAX', 'true');
            request.setRequestHeader('X-PJAX-Selectors', JSON.stringify(_this.options.selectors));
            request.onload = resolve;
            request.onerror = reject;
            request.send();
            _this.request = request;
        });
    };
    Pjax.prototype.handlePrefetch = function (href) {
        var _this = this;
        if (this.options.debug)
            console.log('Prefetching: ', href);
        this.abortRequest();
        trigger_1.default(document, ['pjax:prefetch']);
        this.doRequest(href)
            .then(function (e) { _this.handleResponse(e, 'prefetch'); })
            .catch(function (e) {
            if (_this.options.debug)
                console.log('XHR Request Error: ', e);
        });
    };
    Pjax.prototype.handleLoad = function (href, loadType, el) {
        var _this = this;
        if (el === void 0) { el = null; }
        trigger_1.default(document, ['pjax:send'], el);
        if (this.cache !== null) {
            if (this.options.debug)
                console.log('Loading Cached: ', href);
            this.loadCachedContent();
        }
        else if (this.request !== null) {
            if (this.options.debug)
                console.log('Loading Prefetch: ', href);
            this.confirmed = true;
        }
        else {
            if (this.options.debug)
                console.log('Loading: ', href);
            this.doRequest(href)
                .then(function (e) { _this.handleResponse(e, loadType); })
                .catch(function (e) {
                if (_this.options.debug)
                    console.log('XHR Request Error: ', e);
            });
        }
    };
    Pjax.prototype.clearPrefetch = function () {
        this.cache = null;
        this.confirmed = false;
        this.abortRequest();
        trigger_1.default(document, ['pjax:cancel']);
    };
    return Pjax;
}());
exports.default = Pjax;

},{"./lib/events/link-events":1,"./lib/events/trigger":3,"./lib/parse-options":4,"./lib/util/check-element":5,"./lib/util/contains":6,"./lib/util/polyfill":7,"./lib/uuid":8}]},{},[9])(9)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V0aWwvcG9seWZpbGwuanMiLCJsaWIvdXVpZC5qcyIsInBqYXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBvbl8xID0gcmVxdWlyZShcIi4vb25cIik7XG52YXIgYXR0clN0YXRlID0gJ2RhdGEtcGpheC1zdGF0ZSc7XG52YXIgaXNEZWZhdWx0UHJldmVudGVkID0gZnVuY3Rpb24gKGVsLCBlKSB7XG4gICAgdmFyIGlzUHJldmVudGVkID0gZmFsc2U7XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZClcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgncHJldmVudC1kZWZhdWx0JykgIT09IG51bGwpXG4gICAgICAgIGlzUHJldmVudGVkID0gdHJ1ZTtcbiAgICBlbHNlIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ25vLXRyYW5zaXRpb24nKSlcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgnZG93bmxvYWQnKSAhPT0gbnVsbClcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgndGFyZ2V0JykgPT09ICdfYmxhbmsnKVxuICAgICAgICBpc1ByZXZlbnRlZCA9IHRydWU7XG4gICAgcmV0dXJuIGlzUHJldmVudGVkO1xufTtcbnZhciBjaGVja0ZvckFib3J0ID0gZnVuY3Rpb24gKGVsLCBlKSB7XG4gICAgaWYgKGVsLnByb3RvY29sICE9PSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfHwgZWwuaG9zdCAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3QpXG4gICAgICAgIHJldHVybiAnZXh0ZXJuYWwnO1xuICAgIGlmIChlbC5oYXNoICYmIGVsLmhyZWYucmVwbGFjZShlbC5oYXNoLCAnJykgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgJycpKVxuICAgICAgICByZXR1cm4gJ2FuY2hvcic7XG4gICAgaWYgKGVsLmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0gKyBcIiwgJyMnXCIpXG4gICAgICAgIHJldHVybiAnYW5jaG9yLWVtcHR5JztcbiAgICByZXR1cm4gbnVsbDtcbn07XG52YXIgaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZWwsIGUsIHBqYXgpIHtcbiAgICBpZiAoaXNEZWZhdWx0UHJldmVudGVkKGVsLCBlKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHZhciBldmVudE9wdGlvbnMgPSB7XG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxuICAgIH07XG4gICAgdmFyIGF0dHJWYWx1ZSA9IGNoZWNrRm9yQWJvcnQoZWwsIGUpO1xuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGVsLmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0pXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsICdyZWxvYWQnKTtcbiAgICBlbHNlXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsICdsb2FkJyk7XG4gICAgcGpheC5oYW5kbGVMb2FkKGVsLmhyZWYsIGVsLmdldEF0dHJpYnV0ZShhdHRyU3RhdGUpLCBlbCk7XG59O1xudmFyIGhhbmRsZUhvdmVyID0gZnVuY3Rpb24gKGVsLCBlLCBwamF4KSB7XG4gICAgaWYgKGlzRGVmYXVsdFByZXZlbnRlZChlbCwgZSkpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAoZS50eXBlID09PSAnbW91c2VvdXQnKSB7XG4gICAgICAgIHBqYXguY2xlYXJQcmVmZXRjaCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBldmVudE9wdGlvbnMgPSB7XG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxuICAgIH07XG4gICAgdmFyIGF0dHJWYWx1ZSA9IGNoZWNrRm9yQWJvcnQoZWwsIGUpO1xuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZWwuaHJlZiAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSlcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgJ3ByZWZldGNoJyk7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm47XG4gICAgcGpheC5oYW5kbGVQcmVmZXRjaChlbC5ocmVmLCBldmVudE9wdGlvbnMpO1xufTtcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIHBqYXgpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCAnJyk7XG4gICAgb25fMS5kZWZhdWx0KGVsLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVDbGljayhlbCwgZSwgcGpheCk7IH0pO1xuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVIb3ZlcihlbCwgZSwgcGpheCk7IH0pO1xuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVIb3ZlcihlbCwgZSwgcGpheCk7IH0pO1xuICAgIG9uXzEuZGVmYXVsdChlbCwgJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUua2V5ID09PSAnZW50ZXInIHx8IGUua2V5Q29kZSA9PT0gMTMpXG4gICAgICAgICAgICBoYW5kbGVDbGljayhlbCwgZSwgcGpheCk7XG4gICAgfSk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmstZXZlbnRzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIpO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIGV2ZW50cywgdGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7IHRhcmdldCA9IG51bGw7IH1cbiAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGFyZ2V0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgY3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZSwge1xuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICBlbDogdGFyZ2V0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KGN1c3RvbUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBldmVudF8xID0gbmV3IEV2ZW50KGUpO1xuICAgICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChldmVudF8xKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmlnZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0gbnVsbDsgfVxuICAgIHZhciBwYXJzZWRPcHRpb25zID0gKG9wdGlvbnMgIT09IG51bGwpID8gb3B0aW9ucyA6IHt9O1xuICAgIHBhcnNlZE9wdGlvbnMuZWxlbWVudHMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmVsZW1lbnRzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5lbGVtZW50cyA6ICdhW2hyZWZdJztcbiAgICBwYXJzZWRPcHRpb25zLnNlbGVjdG9ycyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuc2VsZWN0b3JzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zZWxlY3RvcnMgOiBbJy5qcy1wamF4J107XG4gICAgcGFyc2VkT3B0aW9ucy5oaXN0b3J5ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5oaXN0b3J5ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5oaXN0b3J5IDogdHJ1ZTtcbiAgICBwYXJzZWRPcHRpb25zLnNjcm9sbFRvID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zY3JvbGxUbyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuc2Nyb2xsVG8gOiAwO1xuICAgIHBhcnNlZE9wdGlvbnMuY2FjaGVCdXN0ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5jYWNoZUJ1c3QgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmNhY2hlQnVzdCA6IGZhbHNlO1xuICAgIHBhcnNlZE9wdGlvbnMuZGVidWcgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmRlYnVnICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5kZWJ1ZyA6IGZhbHNlO1xuICAgIHBhcnNlZE9wdGlvbnMudGltZW91dCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMudGltZW91dCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMudGltZW91dCA6IDA7XG4gICAgcGFyc2VkT3B0aW9ucy50aXRsZVN3aXRjaCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMudGl0bGVTd2l0Y2ggIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnRpdGxlU3dpdGNoIDogdHJ1ZTtcbiAgICBwYXJzZWRPcHRpb25zLmN1c3RvbVRyYW5zaXRpb25zID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5jdXN0b21UcmFuc2l0aW9ucyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY3VzdG9tVHJhbnNpdGlvbnMgOiBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VkT3B0aW9ucztcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2Utb3B0aW9ucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIHBqYXgpIHtcbiAgICBzd2l0Y2ggKGVsLnRhZ05hbWUudG9Mb2NhbGVMb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUpKVxuICAgICAgICAgICAgICAgIHBqYXguc2V0TGlua0xpc3RlbmVycyhlbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93ICdQamF4IGNhbiBvbmx5IGJlIGFwcGxpZWQgb24gPGE+IGVsZW1lbnRzJztcbiAgICB9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZWNrLWVsZW1lbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGRvYywgc2VsZWN0b3JzLCBlbGVtZW50KSB7XG4gICAgc2VsZWN0b3JzLm1hcChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHNlbGVjdG9yRWxzID0gQXJyYXkuZnJvbShkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICAgICAgICBzZWxlY3RvckVscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgaWYgKGVsLmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBmYWxzZTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29udGFpbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGlmICghQXJyYXkuZnJvbSkge1xuICAgICAgICBBcnJheS5mcm9tID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gICAgICAgICAgICB2YXIgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgfHwgdG9TdHIuY2FsbChmbikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHRvSW50ZWdlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBudW0gPSBOdW1iZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChpc05hTihudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobnVtID09PSAwIHx8ICFpc0Zpbml0ZShudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAobnVtID4gMCA/IDEgOiAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKG51bSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBtYXhTYWZlSW50ZWdlciA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gICAgICAgICAgICB2YXIgdG9MZW5ndGggPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVuID0gdG9JbnRlZ2VyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuLCAwKSwgbWF4U2FmZUludGVnZXIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSkge1xuICAgICAgICAgICAgICAgIHZhciBDID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBPYmplY3QoYXJyYXlMaWtlKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlMaWtlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkuZnJvbSByZXF1aXJlcyBhbiBhcnJheS1saWtlIG9iamVjdCAtIG5vdCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbWFwRm4gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHZvaWQgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBUO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWFwRm4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShtYXBGbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LmZyb206IHdoZW4gcHJvdmlkZWQsIHRoZSBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUID0gYXJndW1lbnRzWzJdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBsZW4gPSB0b0xlbmd0aChpdGVtcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHZhciBBID0gaXNDYWxsYWJsZShDKSA/IE9iamVjdChuZXcgQyhsZW4pKSA6IFtsZW5dO1xuICAgICAgICAgICAgICAgIHZhciBrID0gMDtcbiAgICAgICAgICAgICAgICB2YXIga1ZhbHVlO1xuICAgICAgICAgICAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGtWYWx1ZSA9IGl0ZW1zW2tdO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWFwRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFba10gPSB0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcgPyBtYXBGbihrVmFsdWUsIGspIDogbWFwRm4uY2FsbChULCBrVmFsdWUsIGspO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgQVtrXSA9IGtWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBrICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEEubGVuZ3RoID0gbGVuO1xuICAgICAgICAgICAgICAgIHJldHVybiBBO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSgpKTtcbiAgICB9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBvbHlmaWxsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKS50b1N0cmluZygpO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dWlkLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHBhcnNlX29wdGlvbnNfMSA9IHJlcXVpcmUoXCIuL2xpYi9wYXJzZS1vcHRpb25zXCIpO1xudmFyIHV1aWRfMSA9IHJlcXVpcmUoXCIuL2xpYi91dWlkXCIpO1xudmFyIHRyaWdnZXJfMSA9IHJlcXVpcmUoXCIuL2xpYi9ldmVudHMvdHJpZ2dlclwiKTtcbnZhciBjb250YWluc18xID0gcmVxdWlyZShcIi4vbGliL3V0aWwvY29udGFpbnNcIik7XG52YXIgbGlua19ldmVudHNfMSA9IHJlcXVpcmUoXCIuL2xpYi9ldmVudHMvbGluay1ldmVudHNcIik7XG52YXIgY2hlY2tfZWxlbWVudF8xID0gcmVxdWlyZShcIi4vbGliL3V0aWwvY2hlY2stZWxlbWVudFwiKTtcbnZhciBwb2x5ZmlsbF8xID0gcmVxdWlyZShcIi4vbGliL3V0aWwvcG9seWZpbGxcIik7XG52YXIgUGpheCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGpheChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgICAgaGlzdG9yeTogZmFsc2UsXG4gICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gcGFyc2Vfb3B0aW9uc18xLmRlZmF1bHQob3B0aW9ucyk7XG4gICAgICAgIHRoaXMubGFzdFVVSUQgPSB1dWlkXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhY2hlZFN3aXRjaCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGpheCBPcHRpb25zOicsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBQamF4LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoJy1tcy1zY3JvbGwtbGltaXQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiAnLW1zLWltZS1hbGlnbicgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlKSB7XG4gICAgICAgICAgICBwb2x5ZmlsbF8xLmRlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMuaGFuZGxlUG9wc3RhdGUoZSk7IH0pO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmN1c3RvbVRyYW5zaXRpb25zKVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGpheDpjb250aW51ZScsIGZ1bmN0aW9uIChlKSB7IHJldHVybiBfdGhpcy5oYW5kbGVDb250aW51ZShlKTsgfSk7XG4gICAgICAgIHRoaXMucGFyc2VET00oZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIHRoaXMuaGFuZGxlUHVzaFN0YXRlKCk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVSZWxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLnNldExpbmtMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgbGlua19ldmVudHNfMS5kZWZhdWx0KGVsLCB0aGlzKTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmdldEVsZW1lbnRzID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGVsLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5vcHRpb25zLmVsZW1lbnRzKSk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5wYXJzZURPTSA9IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgZWxlbWVudHMgPSB0aGlzLmdldEVsZW1lbnRzKGVsKTtcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIGNoZWNrX2VsZW1lbnRfMS5kZWZhdWx0KGVsLCBfdGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUG9wc3RhdGUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5zdGF0ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSGlqYWNraW5nIFBvcHN0YXRlIEV2ZW50Jyk7XG4gICAgICAgICAgICB0aGlzLmxvYWRVcmwoZS5zdGF0ZS51cmwsICdwb3BzdGF0ZScpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5hYm9ydFJlcXVlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3QgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkVXJsID0gZnVuY3Rpb24gKGhyZWYsIGxvYWRUeXBlKSB7XG4gICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KCk7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxvYWQoaHJlZiwgbG9hZFR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQdXNoU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSB7fSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQdXNoaW5nIEhpc3RvcnkgU3RhdGU6ICcsIHRoaXMuc3RhdGUpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFVVSUQgPSB1dWlkXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5zdGF0ZS51cmwsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLnN0YXRlLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxuICAgICAgICAgICAgICAgIH0sIHRoaXMuc3RhdGUudGl0bGUsIHRoaXMuc3RhdGUudXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXBsYWNpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuc3RhdGUudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IHRoaXMubGFzdFVVSUQsXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXG4gICAgICAgICAgICAgICAgfSwgZG9jdW1lbnQudGl0bGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVTY3JvbGxQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGlzdG9yeSkge1xuICAgICAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICB0ZW1wLmhyZWYgPSB0aGlzLnN0YXRlLnVybDtcbiAgICAgICAgICAgIGlmICh0ZW1wLmhhc2gpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZV8xID0gdGVtcC5oYXNoLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIG5hbWVfMSA9IGRlY29kZVVSSUNvbXBvbmVudChuYW1lXzEpO1xuICAgICAgICAgICAgICAgIHZhciBjdXJyVG9wID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZV8xKSB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShuYW1lXzEpWzBdO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyVG9wICs9IHRhcmdldC5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lm9mZnNldFBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGN1cnJUb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB0aGlzLm9wdGlvbnMuc2Nyb2xsVG8pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsUG9zKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8odGhpcy5zdGF0ZS5zY3JvbGxQb3NbMF0sIHRoaXMuc3RhdGUuc2Nyb2xsUG9zWzFdKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmluaXNoaW5nIFBqYXgnKTtcbiAgICAgICAgdGhpcy5zdGF0ZS51cmwgPSB0aGlzLnJlcXVlc3QucmVzcG9uc2VVUkw7XG4gICAgICAgIHRoaXMuc3RhdGUudGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICAgICAgdGhpcy5zdGF0ZS5zY3JvbGxQb3MgPSBbMCwgd2luZG93LnNjcm9sbFldO1xuICAgICAgICB0aGlzLmhhbmRsZVB1c2hTdGF0ZSgpO1xuICAgICAgICB0aGlzLmhhbmRsZVNjcm9sbFBvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXRlID0ge307XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG51bGw7XG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2FjaGVkU3dpdGNoID0gbnVsbDtcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpjb21wbGV0ZSddKTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVN3aXRjaGVzID0gZnVuY3Rpb24gKHN3aXRjaFF1ZXVlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHN3aXRjaFF1ZXVlLm1hcChmdW5jdGlvbiAoc3dpdGNoT2JqKSB7XG4gICAgICAgICAgICBzd2l0Y2hPYmoub2xkRWwuaW5uZXJIVE1MID0gc3dpdGNoT2JqLm5ld0VsLmlubmVySFRNTDtcbiAgICAgICAgICAgIF90aGlzLnBhcnNlRE9NKHN3aXRjaE9iai5vbGRFbCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVDb250aW51ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlZFN3aXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50aXRsZVN3aXRjaClcbiAgICAgICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuY2FjaGVkU3dpdGNoLnRpdGxlO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hlcyh0aGlzLmNhY2hlZFN3aXRjaC5xdWV1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTd2l0Y2ggcXVldWUgd2FzIGVtcHR5LiBZb3UgbWlnaHQgYmUgc2VuZGluZyBgcGpheDpjb250aW51ZWAgdG9vIGZhc3QuJyk7XG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5zd2l0Y2hTZWxlY3RvcnMgPSBmdW5jdGlvbiAoc2VsZWN0b3JzLCB0b0VsLCBmcm9tRWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHN3aXRjaFF1ZXVlID0gW107XG4gICAgICAgIHNlbGVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgdmFyIG5ld0VscyA9IEFycmF5LmZyb20odG9FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG4gICAgICAgICAgICB2YXIgb2xkRWxzID0gQXJyYXkuZnJvbShmcm9tRWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BqYXggU3dpdGNoIFNlbGVjdG9yOiAnLCBzZWxlY3RvciwgbmV3RWxzLCBvbGRFbHMpO1xuICAgICAgICAgICAgaWYgKG5ld0Vscy5sZW5ndGggIT09IG9sZEVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RPTSBkb2VzblxcJ3QgbG9vayB0aGUgc2FtZSBvbiB0aGUgbmV3IHBhZ2UnKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sYXN0Q2hhbmNlKF90aGlzLnJlcXVlc3QucmVzcG9uc2VVUkwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0Vscy5mb3JFYWNoKGZ1bmN0aW9uIChuZXdFbGVtZW50LCBpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9sZEVsZW1lbnQgPSBvbGRFbHNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGVsU3dpdGNoID0ge1xuICAgICAgICAgICAgICAgICAgICBuZXdFbDogbmV3RWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgb2xkRWw6IG9sZEVsZW1lbnRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHN3aXRjaFF1ZXVlLnB1c2goZWxTd2l0Y2gpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3dpdGNoUXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZG5cXCd0IGZpbmQgYW55dGhpbmcgdG8gc3dpdGNoJyk7XG4gICAgICAgICAgICB0aGlzLmxhc3RDaGFuY2UodGhpcy5yZXF1ZXN0LnJlc3BvbnNlVVJMKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5jdXN0b21UcmFuc2l0aW9ucykge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50aXRsZVN3aXRjaClcbiAgICAgICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRvRWwudGl0bGU7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVN3aXRjaGVzKHN3aXRjaFF1ZXVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkU3dpdGNoID0ge1xuICAgICAgICAgICAgICAgIHF1ZXVlOiBzd2l0Y2hRdWV1ZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogdG9FbC50aXRsZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUubGFzdENoYW5jZSA9IGZ1bmN0aW9uICh1cmkpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhY2hlZCBjb250ZW50IGhhcyBhIG5vbi0yMDAgcmVzcG9uc2UgYnV0IHdlIHJlcXVpcmUgYSBzdWNjZXNzIHJlc3BvbnNlLCBmYWxsYmFjayBsb2FkaW5nIHVyaSAnLCB1cmkpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJpO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuc3RhdHVzQ2hlY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIHN0YXR1c18xID0gMjAwOyBzdGF0dXNfMSA8PSAyMDY7IHN0YXR1c18xKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlLnN0YXR1cyA9PT0gc3RhdHVzXzEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUubG9hZENhY2hlZENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0dXNDaGVjaygpKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RDaGFuY2UodGhpcy5jYWNoZS51cmwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGNvbnRhaW5zXzEuZGVmYXVsdChkb2N1bWVudCwgdGhpcy5vcHRpb25zLnNlbGVjdG9ycywgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3dpdGNoU2VsZWN0b3JzKHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIHRoaXMuY2FjaGUuaHRtbCwgZG9jdW1lbnQpO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUucGFyc2VDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xuICAgICAgICB2YXIgdGVtcEVsID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCdnbG9iYWxzJyk7XG4gICAgICAgIHZhciBodG1sUmVnZXggPSAvXFxzP1thLXo6XSsoPz0oPzpcXCd8XFxcIilbXlxcJ1xcXCI+XSsoPzpcXCd8XFxcIikpKi9naTtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSByZXNwb25zZVRleHQubWF0Y2goaHRtbFJlZ2V4KTtcbiAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gdGVtcEVsO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmNhY2hlQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQsIHJlc3BvbnNlU3RhdHVzLCB1cmkpIHtcbiAgICAgICAgdmFyIHRlbXBFbCA9IHRoaXMucGFyc2VDb250ZW50KHJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGlmICh0ZW1wRWwgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6ZXJyb3InXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEVsLmRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwgPSByZXNwb25zZVRleHQ7XG4gICAgICAgIHRoaXMuY2FjaGUgPSB7XG4gICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlU3RhdHVzLFxuICAgICAgICAgICAgaHRtbDogdGVtcEVsLFxuICAgICAgICAgICAgdXJsOiB1cmlcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYWNoZWQgQ29udGVudDogJywgdGhpcy5jYWNoZSk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcbiAgICAgICAgdmFyIHRlbXBFbCA9IHRoaXMucGFyc2VDb250ZW50KHJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGlmICh0ZW1wRWwgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6ZXJyb3InXSk7XG4gICAgICAgICAgICB0aGlzLmxhc3RDaGFuY2UodGhpcy5yZXF1ZXN0LnJlc3BvbnNlVVJMKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wRWwuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTCA9IHJlc3BvbnNlVGV4dDtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgY29udGFpbnNfMS5kZWZhdWx0KGRvY3VtZW50LCB0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zd2l0Y2hTZWxlY3RvcnModGhpcy5vcHRpb25zLnNlbGVjdG9ycywgdGVtcEVsLCBkb2N1bWVudCk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uIChlLCBsb2FkVHlwZSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1hNTCBIdHRwIFJlcXVlc3QgU3RhdHVzOiAnLCB0aGlzLnJlcXVlc3Quc3RhdHVzKTtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB0aGlzLnJlcXVlc3Q7XG4gICAgICAgIGlmIChyZXF1ZXN0LnJlc3BvbnNlVGV4dCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGxvYWRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdwcmVmZXRjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maXJtZWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZUNvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQsIHJlcXVlc3Quc3RhdHVzLCByZXF1ZXN0LnJlc3BvbnNlVVJMKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3BvcHN0YXRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3JlbG9hZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmRvUmVxdWVzdCA9IGZ1bmN0aW9uIChocmVmKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciByZXFldXN0TWV0aG9kID0gJ0dFVCc7XG4gICAgICAgIHZhciB0aW1lb3V0ID0gdGhpcy5vcHRpb25zLnRpbWVvdXQgfHwgMDtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHVyaSA9IGhyZWY7XG4gICAgICAgIHZhciBxdWVyeVN0cmluZyA9IGhyZWYuc3BsaXQoJz8nKVsxXTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYWNoZUJ1c3QpXG4gICAgICAgICAgICB1cmkgKz0gKHF1ZXJ5U3RyaW5nID09PSB1bmRlZmluZWQpID8gKFwiP2NiPVwiICsgRGF0ZS5ub3coKSkgOiAoXCImY2I9XCIgKyBEYXRlLm5vdygpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHJlcXVlc3Qub3BlbihyZXFldXN0TWV0aG9kLCB1cmksIHRydWUpO1xuICAgICAgICAgICAgcmVxdWVzdC50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVBKQVgnLCAndHJ1ZScpO1xuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVBKQVgtU2VsZWN0b3JzJywgSlNPTi5zdHJpbmdpZnkoX3RoaXMub3B0aW9ucy5zZWxlY3RvcnMpKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25sb2FkID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IHJlamVjdDtcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICAgICAgX3RoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUHJlZmV0Y2ggPSBmdW5jdGlvbiAoaHJlZikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1ByZWZldGNoaW5nOiAnLCBocmVmKTtcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpwcmVmZXRjaCddKTtcbiAgICAgICAgdGhpcy5kb1JlcXVlc3QoaHJlZilcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsICdwcmVmZXRjaCcpOyB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWEhSIFJlcXVlc3QgRXJyb3I6ICcsIGUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZUxvYWQgPSBmdW5jdGlvbiAoaHJlZiwgbG9hZFR5cGUsIGVsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChlbCA9PT0gdm9pZCAwKSB7IGVsID0gbnVsbDsgfVxuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OnNlbmQnXSwgZWwpO1xuICAgICAgICBpZiAodGhpcy5jYWNoZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBDYWNoZWQ6ICcsIGhyZWYpO1xuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucmVxdWVzdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBQcmVmZXRjaDogJywgaHJlZik7XG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nOiAnLCBocmVmKTtcbiAgICAgICAgICAgIHRoaXMuZG9SZXF1ZXN0KGhyZWYpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGUpIHsgX3RoaXMuaGFuZGxlUmVzcG9uc2UoZSwgbG9hZFR5cGUpOyB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWEhSIFJlcXVlc3QgRXJyb3I6ICcsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmNsZWFyUHJlZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFib3J0UmVxdWVzdCgpO1xuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmNhbmNlbCddKTtcbiAgICB9O1xuICAgIHJldHVybiBQamF4O1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBqYXg7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wamF4LmpzLm1hcCJdfQ==
