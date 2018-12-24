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
    else if (el.getAttribute('target') !== null)
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
        var selectorEls = doc.querySelectorAll(selector);
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
    return Date.now().toString();
});

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_options_1 = require("./lib/parse-options");
var uuid_1 = require("./lib/uuid");
var trigger_1 = require("./lib/events/trigger");
var contains_1 = require("./lib/util/contains");
var link_events_1 = require("./lib/events/link-events");
var check_element_1 = require("./lib/util/check-element");
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
        return el.querySelectorAll(this.options.elements);
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
            var newEls = toEl.querySelectorAll(selector);
            var oldEls = fromEl.querySelectorAll(selector);
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

},{"./lib/events/link-events":1,"./lib/events/trigger":3,"./lib/parse-options":4,"./lib/util/check-element":5,"./lib/util/contains":6,"./lib/uuid":7}]},{},[8])(8)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgb25fMSA9IHJlcXVpcmUoXCIuL29uXCIpO1xudmFyIGF0dHJTdGF0ZSA9ICdkYXRhLXBqYXgtc3RhdGUnO1xudmFyIGlzRGVmYXVsdFByZXZlbnRlZCA9IGZ1bmN0aW9uIChlbCwgZSkge1xuICAgIHZhciBpc1ByZXZlbnRlZCA9IGZhbHNlO1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpXG4gICAgICAgIGlzUHJldmVudGVkID0gdHJ1ZTtcbiAgICBlbHNlIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ3ByZXZlbnQtZGVmYXVsdCcpICE9PSBudWxsKVxuICAgICAgICBpc1ByZXZlbnRlZCA9IHRydWU7XG4gICAgZWxzZSBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCduby10cmFuc2l0aW9uJykpXG4gICAgICAgIGlzUHJldmVudGVkID0gdHJ1ZTtcbiAgICBlbHNlIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgIT09IG51bGwpXG4gICAgICAgIGlzUHJldmVudGVkID0gdHJ1ZTtcbiAgICBlbHNlIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ3RhcmdldCcpICE9PSBudWxsKVxuICAgICAgICBpc1ByZXZlbnRlZCA9IHRydWU7XG4gICAgcmV0dXJuIGlzUHJldmVudGVkO1xufTtcbnZhciBjaGVja0ZvckFib3J0ID0gZnVuY3Rpb24gKGVsLCBlKSB7XG4gICAgaWYgKGVsLnByb3RvY29sICE9PSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfHwgZWwuaG9zdCAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3QpXG4gICAgICAgIHJldHVybiAnZXh0ZXJuYWwnO1xuICAgIGlmIChlbC5oYXNoICYmIGVsLmhyZWYucmVwbGFjZShlbC5oYXNoLCAnJykgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgJycpKVxuICAgICAgICByZXR1cm4gJ2FuY2hvcic7XG4gICAgaWYgKGVsLmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0gKyBcIiwgJyMnXCIpXG4gICAgICAgIHJldHVybiAnYW5jaG9yLWVtcHR5JztcbiAgICByZXR1cm4gbnVsbDtcbn07XG52YXIgaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZWwsIGUsIHBqYXgpIHtcbiAgICBpZiAoaXNEZWZhdWx0UHJldmVudGVkKGVsLCBlKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHZhciBldmVudE9wdGlvbnMgPSB7XG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxuICAgIH07XG4gICAgdmFyIGF0dHJWYWx1ZSA9IGNoZWNrRm9yQWJvcnQoZWwsIGUpO1xuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGVsLmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0pXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsICdyZWxvYWQnKTtcbiAgICBlbHNlXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsICdsb2FkJyk7XG4gICAgcGpheC5oYW5kbGVMb2FkKGVsLmhyZWYsIGVsLmdldEF0dHJpYnV0ZShhdHRyU3RhdGUpLCBlbCk7XG59O1xudmFyIGhhbmRsZUhvdmVyID0gZnVuY3Rpb24gKGVsLCBlLCBwamF4KSB7XG4gICAgaWYgKGlzRGVmYXVsdFByZXZlbnRlZChlbCwgZSkpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAoZS50eXBlID09PSAnbW91c2VvdXQnKSB7XG4gICAgICAgIHBqYXguY2xlYXJQcmVmZXRjaCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBldmVudE9wdGlvbnMgPSB7XG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxuICAgIH07XG4gICAgdmFyIGF0dHJWYWx1ZSA9IGNoZWNrRm9yQWJvcnQoZWwsIGUpO1xuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZWwuaHJlZiAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSlcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgJ3ByZWZldGNoJyk7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm47XG4gICAgcGpheC5oYW5kbGVQcmVmZXRjaChlbC5ocmVmLCBldmVudE9wdGlvbnMpO1xufTtcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIHBqYXgpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCAnJyk7XG4gICAgb25fMS5kZWZhdWx0KGVsLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVDbGljayhlbCwgZSwgcGpheCk7IH0pO1xuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVIb3ZlcihlbCwgZSwgcGpheCk7IH0pO1xuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVIb3ZlcihlbCwgZSwgcGpheCk7IH0pO1xuICAgIG9uXzEuZGVmYXVsdChlbCwgJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUua2V5ID09PSAnZW50ZXInIHx8IGUua2V5Q29kZSA9PT0gMTMpXG4gICAgICAgICAgICBoYW5kbGVDbGljayhlbCwgZSwgcGpheCk7XG4gICAgfSk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmstZXZlbnRzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIpO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIGV2ZW50cywgdGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7IHRhcmdldCA9IG51bGw7IH1cbiAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGFyZ2V0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgY3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZSwge1xuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICBlbDogdGFyZ2V0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KGN1c3RvbUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBldmVudF8xID0gbmV3IEV2ZW50KGUpO1xuICAgICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChldmVudF8xKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmlnZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0gbnVsbDsgfVxuICAgIHZhciBwYXJzZWRPcHRpb25zID0gKG9wdGlvbnMgIT09IG51bGwpID8gb3B0aW9ucyA6IHt9O1xuICAgIHBhcnNlZE9wdGlvbnMuZWxlbWVudHMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmVsZW1lbnRzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5lbGVtZW50cyA6ICdhW2hyZWZdJztcbiAgICBwYXJzZWRPcHRpb25zLnNlbGVjdG9ycyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuc2VsZWN0b3JzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zZWxlY3RvcnMgOiBbJy5qcy1wamF4J107XG4gICAgcGFyc2VkT3B0aW9ucy5oaXN0b3J5ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5oaXN0b3J5ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5oaXN0b3J5IDogdHJ1ZTtcbiAgICBwYXJzZWRPcHRpb25zLnNjcm9sbFRvID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zY3JvbGxUbyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuc2Nyb2xsVG8gOiAwO1xuICAgIHBhcnNlZE9wdGlvbnMuY2FjaGVCdXN0ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5jYWNoZUJ1c3QgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmNhY2hlQnVzdCA6IGZhbHNlO1xuICAgIHBhcnNlZE9wdGlvbnMuZGVidWcgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmRlYnVnICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5kZWJ1ZyA6IGZhbHNlO1xuICAgIHBhcnNlZE9wdGlvbnMudGltZW91dCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMudGltZW91dCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMudGltZW91dCA6IDA7XG4gICAgcGFyc2VkT3B0aW9ucy50aXRsZVN3aXRjaCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMudGl0bGVTd2l0Y2ggIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnRpdGxlU3dpdGNoIDogdHJ1ZTtcbiAgICBwYXJzZWRPcHRpb25zLmN1c3RvbVRyYW5zaXRpb25zID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5jdXN0b21UcmFuc2l0aW9ucyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY3VzdG9tVHJhbnNpdGlvbnMgOiBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VkT3B0aW9ucztcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2Utb3B0aW9ucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIHBqYXgpIHtcbiAgICBzd2l0Y2ggKGVsLnRhZ05hbWUudG9Mb2NhbGVMb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUpKVxuICAgICAgICAgICAgICAgIHBqYXguc2V0TGlua0xpc3RlbmVycyhlbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93ICdQamF4IGNhbiBvbmx5IGJlIGFwcGxpZWQgb24gPGE+IGVsZW1lbnRzJztcbiAgICB9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZWNrLWVsZW1lbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGRvYywgc2VsZWN0b3JzLCBlbGVtZW50KSB7XG4gICAgc2VsZWN0b3JzLm1hcChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHNlbGVjdG9yRWxzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgICAgICBzZWxlY3RvckVscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgaWYgKGVsLmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBmYWxzZTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29udGFpbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBEYXRlLm5vdygpLnRvU3RyaW5nKCk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV1aWQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgcGFyc2Vfb3B0aW9uc18xID0gcmVxdWlyZShcIi4vbGliL3BhcnNlLW9wdGlvbnNcIik7XG52YXIgdXVpZF8xID0gcmVxdWlyZShcIi4vbGliL3V1aWRcIik7XG52YXIgdHJpZ2dlcl8xID0gcmVxdWlyZShcIi4vbGliL2V2ZW50cy90cmlnZ2VyXCIpO1xudmFyIGNvbnRhaW5zXzEgPSByZXF1aXJlKFwiLi9saWIvdXRpbC9jb250YWluc1wiKTtcbnZhciBsaW5rX2V2ZW50c18xID0gcmVxdWlyZShcIi4vbGliL2V2ZW50cy9saW5rLWV2ZW50c1wiKTtcbnZhciBjaGVja19lbGVtZW50XzEgPSByZXF1aXJlKFwiLi9saWIvdXRpbC9jaGVjay1lbGVtZW50XCIpO1xudmFyIFBqYXggPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBqYXgob3B0aW9ucykge1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICAgIGhpc3Rvcnk6IGZhbHNlLFxuICAgICAgICAgICAgc2Nyb2xsUG9zOiBbMCwgMF1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHBhcnNlX29wdGlvbnNfMS5kZWZhdWx0KG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jYWNoZWRTd2l0Y2ggPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BqYXggT3B0aW9uczonLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgUGpheC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIF90aGlzLmhhbmRsZVBvcHN0YXRlKGUpOyB9KTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21UcmFuc2l0aW9ucylcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BqYXg6Y29udGludWUnLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMuaGFuZGxlQ29udGludWUoZSk7IH0pO1xuICAgICAgICB0aGlzLnBhcnNlRE9NKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICB0aGlzLmhhbmRsZVB1c2hTdGF0ZSgpO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUmVsb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5zZXRMaW5rTGlzdGVuZXJzID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGxpbmtfZXZlbnRzXzEuZGVmYXVsdChlbCwgdGhpcyk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMuZWxlbWVudHMpO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUucGFyc2VET00gPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gdGhpcy5nZXRFbGVtZW50cyhlbCk7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBjaGVja19lbGVtZW50XzEuZGVmYXVsdChlbCwgX3RoaXMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVBvcHN0YXRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUuc3RhdGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0hpamFja2luZyBQb3BzdGF0ZSBFdmVudCcpO1xuICAgICAgICAgICAgdGhpcy5sb2FkVXJsKGUuc3RhdGUudXJsLCAncG9wc3RhdGUnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuYWJvcnRSZXF1ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0ID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUubG9hZFVybCA9IGZ1bmN0aW9uIChocmVmLCBsb2FkVHlwZSkge1xuICAgICAgICB0aGlzLmFib3J0UmVxdWVzdCgpO1xuICAgICAgICBpZiAodGhpcy5jYWNoZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVMb2FkKGhyZWYsIGxvYWRUeXBlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9hZENhY2hlZENvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUHVzaFN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0ge30pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUHVzaGluZyBIaXN0b3J5IFN0YXRlOiAnLCB0aGlzLnN0YXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMuc3RhdGUudXJsLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogdGhpcy5sYXN0VVVJRCxcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zOiBbMCwgMF1cbiAgICAgICAgICAgICAgICB9LCB0aGlzLnN0YXRlLnRpdGxlLCB0aGlzLnN0YXRlLnVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVwbGFjaW5nIEhpc3RvcnkgU3RhdGU6ICcsIHRoaXMuc3RhdGUpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFVVSUQgPSB1dWlkXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5zdGF0ZS51cmwsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLnN0YXRlLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxuICAgICAgICAgICAgICAgIH0sIGRvY3VtZW50LnRpdGxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlU2Nyb2xsUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgdGVtcC5ocmVmID0gdGhpcy5zdGF0ZS51cmw7XG4gICAgICAgICAgICBpZiAodGVtcC5oYXNoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWVfMSA9IHRlbXAuaGFzaC5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICBuYW1lXzEgPSBkZWNvZGVVUklDb21wb25lbnQobmFtZV8xKTtcbiAgICAgICAgICAgICAgICB2YXIgY3VyclRvcCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWVfMSkgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUobmFtZV8xKVswXTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclRvcCArPSB0YXJnZXQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICh0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBjdXJyVG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgdGhpcy5vcHRpb25zLnNjcm9sbFRvKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbFBvcykge1xuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHRoaXMuc3RhdGUuc2Nyb2xsUG9zWzBdLCB0aGlzLnN0YXRlLnNjcm9sbFBvc1sxXSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZpbmlzaGluZyBQamF4Jyk7XG4gICAgICAgIHRoaXMuc3RhdGUudXJsID0gdGhpcy5yZXF1ZXN0LnJlc3BvbnNlVVJMO1xuICAgICAgICB0aGlzLnN0YXRlLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgICAgIHRoaXMuc3RhdGUuc2Nyb2xsUG9zID0gWzAsIHdpbmRvdy5zY3JvbGxZXTtcbiAgICAgICAgdGhpcy5oYW5kbGVQdXNoU3RhdGUoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTY3JvbGxQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhY2hlZFN3aXRjaCA9IG51bGw7XG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6Y29tcGxldGUnXSk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVTd2l0Y2hlcyA9IGZ1bmN0aW9uIChzd2l0Y2hRdWV1ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBzd2l0Y2hRdWV1ZS5tYXAoZnVuY3Rpb24gKHN3aXRjaE9iaikge1xuICAgICAgICAgICAgc3dpdGNoT2JqLm9sZEVsLmlubmVySFRNTCA9IHN3aXRjaE9iai5uZXdFbC5pbm5lckhUTUw7XG4gICAgICAgICAgICBfdGhpcy5wYXJzZURPTShzd2l0Y2hPYmoub2xkRWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlQ29udGludWUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy5jYWNoZWRTd2l0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMudGl0bGVTd2l0Y2gpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLmNhY2hlZFN3aXRjaC50aXRsZTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU3dpdGNoZXModGhpcy5jYWNoZWRTd2l0Y2gucXVldWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3dpdGNoIHF1ZXVlIHdhcyBlbXB0eS4gWW91IG1pZ2h0IGJlIHNlbmRpbmcgYHBqYXg6Y29udGludWVgIHRvbyBmYXN0LicpO1xuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuc3dpdGNoU2VsZWN0b3JzID0gZnVuY3Rpb24gKHNlbGVjdG9ycywgdG9FbCwgZnJvbUVsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBzd2l0Y2hRdWV1ZSA9IFtdO1xuICAgICAgICBzZWxlY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIHZhciBuZXdFbHMgPSB0b0VsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgICAgICAgICAgdmFyIG9sZEVscyA9IGZyb21FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQamF4IFN3aXRjaCBTZWxlY3RvcjogJywgc2VsZWN0b3IsIG5ld0Vscywgb2xkRWxzKTtcbiAgICAgICAgICAgIGlmIChuZXdFbHMubGVuZ3RoICE9PSBvbGRFbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdET00gZG9lc25cXCd0IGxvb2sgdGhlIHNhbWUgb24gdGhlIG5ldyBwYWdlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGFzdENoYW5jZShfdGhpcy5yZXF1ZXN0LnJlc3BvbnNlVVJMKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdFbHMuZm9yRWFjaChmdW5jdGlvbiAobmV3RWxlbWVudCwgaSkge1xuICAgICAgICAgICAgICAgIHZhciBvbGRFbGVtZW50ID0gb2xkRWxzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBlbFN3aXRjaCA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RWw6IG5ld0VsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIG9sZEVsOiBvbGRFbGVtZW50XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzd2l0Y2hRdWV1ZS5wdXNoKGVsU3dpdGNoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHN3aXRjaFF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ291bGRuXFwndCBmaW5kIGFueXRoaW5nIHRvIHN3aXRjaCcpO1xuICAgICAgICAgICAgdGhpcy5sYXN0Q2hhbmNlKHRoaXMucmVxdWVzdC5yZXNwb25zZVVSTCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuY3VzdG9tVHJhbnNpdGlvbnMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMudGl0bGVTd2l0Y2gpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0b0VsLnRpdGxlO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hlcyhzd2l0Y2hRdWV1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlZFN3aXRjaCA9IHtcbiAgICAgICAgICAgICAgICBxdWV1ZTogc3dpdGNoUXVldWUsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRvRWwudGl0bGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmxhc3RDaGFuY2UgPSBmdW5jdGlvbiAodXJpKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYWNoZWQgY29udGVudCBoYXMgYSBub24tMjAwIHJlc3BvbnNlIGJ1dCB3ZSByZXF1aXJlIGEgc3VjY2VzcyByZXNwb25zZSwgZmFsbGJhY2sgbG9hZGluZyB1cmkgJywgdXJpKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVyaTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLnN0YXR1c0NoZWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBzdGF0dXNfMSA9IDIwMDsgc3RhdHVzXzEgPD0gMjA2OyBzdGF0dXNfMSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jYWNoZS5zdGF0dXMgPT09IHN0YXR1c18xKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmxvYWRDYWNoZWRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdHVzQ2hlY2soKSkge1xuICAgICAgICAgICAgdGhpcy5sYXN0Q2hhbmNlKHRoaXMuY2FjaGUudXJsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBjb250YWluc18xLmRlZmF1bHQoZG9jdW1lbnQsIHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN3aXRjaFNlbGVjdG9ycyh0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCB0aGlzLmNhY2hlLmh0bWwsIGRvY3VtZW50KTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLnBhcnNlQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcbiAgICAgICAgdmFyIHRlbXBFbCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgnZ2xvYmFscycpO1xuICAgICAgICB2YXIgaHRtbFJlZ2V4ID0gL1xccz9bYS16Ol0rKD89KD86XFwnfFxcXCIpW15cXCdcXFwiPl0rKD86XFwnfFxcXCIpKSovZ2k7XG4gICAgICAgIHZhciBtYXRjaGVzID0gcmVzcG9uc2VUZXh0Lm1hdGNoKGh0bWxSZWdleCk7XG4gICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBFbDtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5jYWNoZUNvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0LCByZXNwb25zZVN0YXR1cywgdXJpKSB7XG4gICAgICAgIHZhciB0ZW1wRWwgPSB0aGlzLnBhcnNlQ29udGVudChyZXNwb25zZVRleHQpO1xuICAgICAgICBpZiAodGVtcEVsID09PSBudWxsKSB7XG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRlbXBFbC5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MID0gcmVzcG9uc2VUZXh0O1xuICAgICAgICB0aGlzLmNhY2hlID0ge1xuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cyxcbiAgICAgICAgICAgIGh0bWw6IHRlbXBFbCxcbiAgICAgICAgICAgIHVybDogdXJpXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FjaGVkIENvbnRlbnQ6ICcsIHRoaXMuY2FjaGUpO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUubG9hZENvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0KSB7XG4gICAgICAgIHZhciB0ZW1wRWwgPSB0aGlzLnBhcnNlQ29udGVudChyZXNwb25zZVRleHQpO1xuICAgICAgICBpZiAodGVtcEVsID09PSBudWxsKSB7XG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xuICAgICAgICAgICAgdGhpcy5sYXN0Q2hhbmNlKHRoaXMucmVxdWVzdC5yZXNwb25zZVVSTCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEVsLmRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwgPSByZXNwb25zZVRleHQ7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGNvbnRhaW5zXzEuZGVmYXVsdChkb2N1bWVudCwgdGhpcy5vcHRpb25zLnNlbGVjdG9ycywgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3dpdGNoU2VsZWN0b3JzKHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIHRlbXBFbCwgZG9jdW1lbnQpO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbiAoZSwgbG9hZFR5cGUpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYTUwgSHR0cCBSZXF1ZXN0IFN0YXR1czogJywgdGhpcy5yZXF1ZXN0LnN0YXR1cyk7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0O1xuICAgICAgICBpZiAocmVxdWVzdC5yZXNwb25zZVRleHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6ZXJyb3InXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChsb2FkVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAncHJlZmV0Y2gnOlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlybWVkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0LCByZXF1ZXN0LnN0YXR1cywgcmVxdWVzdC5yZXNwb25zZVVSTCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdwb3BzdGF0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyZWxvYWQnOlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5kb1JlcXVlc3QgPSBmdW5jdGlvbiAoaHJlZikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgcmVxZXVzdE1ldGhvZCA9ICdHRVQnO1xuICAgICAgICB2YXIgdGltZW91dCA9IHRoaXMub3B0aW9ucy50aW1lb3V0IHx8IDA7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciB1cmkgPSBocmVmO1xuICAgICAgICB2YXIgcXVlcnlTdHJpbmcgPSBocmVmLnNwbGl0KCc/JylbMV07XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FjaGVCdXN0KVxuICAgICAgICAgICAgdXJpICs9IChxdWVyeVN0cmluZyA9PT0gdW5kZWZpbmVkKSA/IChcIj9jYj1cIiArIERhdGUubm93KCkpIDogKFwiJmNiPVwiICsgRGF0ZS5ub3coKSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4ocmVxZXVzdE1ldGhvZCwgdXJpLCB0cnVlKTtcbiAgICAgICAgICAgIHJlcXVlc3QudGltZW91dCA9IHRpbWVvdXQ7XG4gICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1QSkFYJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1QSkFYLVNlbGVjdG9ycycsIEpTT04uc3RyaW5naWZ5KF90aGlzLm9wdGlvbnMuc2VsZWN0b3JzKSk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IHJlc29sdmU7XG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICAgICAgICAgIF90aGlzLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVByZWZldGNoID0gZnVuY3Rpb24gKGhyZWYpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQcmVmZXRjaGluZzogJywgaHJlZik7XG4gICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KCk7XG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6cHJlZmV0Y2gnXSk7XG4gICAgICAgIHRoaXMuZG9SZXF1ZXN0KGhyZWYpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkgeyBfdGhpcy5oYW5kbGVSZXNwb25zZShlLCAncHJlZmV0Y2gnKTsgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVMb2FkID0gZnVuY3Rpb24gKGhyZWYsIGxvYWRUeXBlLCBlbCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoZWwgPT09IHZvaWQgMCkgeyBlbCA9IG51bGw7IH1cbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpzZW5kJ10sIGVsKTtcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgQ2FjaGVkOiAnLCBocmVmKTtcbiAgICAgICAgICAgIHRoaXMubG9hZENhY2hlZENvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnJlcXVlc3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgUHJlZmV0Y2g6ICcsIGhyZWYpO1xuICAgICAgICAgICAgdGhpcy5jb25maXJtZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZzogJywgaHJlZik7XG4gICAgICAgICAgICB0aGlzLmRvUmVxdWVzdChocmVmKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsIGxvYWRUeXBlKTsgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5jbGVhclByZWZldGNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpjYW5jZWwnXSk7XG4gICAgfTtcbiAgICByZXR1cm4gUGpheDtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBQamF4O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGpheC5qcy5tYXAiXX0=
