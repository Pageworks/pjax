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
    on_1.default(el, 'mouseover', function (e) { handleHover(el, e, pjax); });
    on_1.default(el, 'mouseout', function (e) { handleHover(el, e, pjax); });
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
            history: true,
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
        if (this.options.debug)
            console.log('Cached content has a response of ', this.cache.status, ' but we require a success response, fallback loading uri ', uri);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBvbl8xID0gcmVxdWlyZShcIi4vb25cIik7XG52YXIgYXR0clN0YXRlID0gJ2RhdGEtcGpheC1zdGF0ZSc7XG52YXIgaXNEZWZhdWx0UHJldmVudGVkID0gZnVuY3Rpb24gKGVsLCBlKSB7XG4gICAgdmFyIGlzUHJldmVudGVkID0gZmFsc2U7XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZClcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgncHJldmVudC1kZWZhdWx0JykgIT09IG51bGwpXG4gICAgICAgIGlzUHJldmVudGVkID0gdHJ1ZTtcbiAgICBlbHNlIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ25vLXRyYW5zaXRpb24nKSlcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgnZG93bmxvYWQnKSAhPT0gbnVsbClcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgndGFyZ2V0JykgIT09IG51bGwpXG4gICAgICAgIGlzUHJldmVudGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gaXNQcmV2ZW50ZWQ7XG59O1xudmFyIGNoZWNrRm9yQWJvcnQgPSBmdW5jdGlvbiAoZWwsIGUpIHtcbiAgICBpZiAoZWwucHJvdG9jb2wgIT09IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB8fCBlbC5ob3N0ICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdClcbiAgICAgICAgcmV0dXJuICdleHRlcm5hbCc7XG4gICAgaWYgKGVsLmhhc2ggJiYgZWwuaHJlZi5yZXBsYWNlKGVsLmhhc2gsICcnKSA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShsb2NhdGlvbi5oYXNoLCAnJykpXG4gICAgICAgIHJldHVybiAnYW5jaG9yJztcbiAgICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSArIFwiLCAnIydcIilcbiAgICAgICAgcmV0dXJuICdhbmNob3ItZW1wdHknO1xuICAgIHJldHVybiBudWxsO1xufTtcbnZhciBoYW5kbGVDbGljayA9IGZ1bmN0aW9uIChlbCwgZSwgcGpheCkge1xuICAgIGlmIChpc0RlZmF1bHRQcmV2ZW50ZWQoZWwsIGUpKVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIGV2ZW50T3B0aW9ucyA9IHtcbiAgICAgICAgdHJpZ2dlckVsZW1lbnQ6IGVsXG4gICAgfTtcbiAgICB2YXIgYXR0clZhbHVlID0gY2hlY2tGb3JBYm9ydChlbCwgZSk7XG4gICAgaWYgKGF0dHJWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCBhdHRyVmFsdWUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSlcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgJ3JlbG9hZCcpO1xuICAgIGVsc2VcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgJ2xvYWQnKTtcbiAgICBwamF4LmhhbmRsZUxvYWQoZWwuaHJlZiwgZWwuZ2V0QXR0cmlidXRlKGF0dHJTdGF0ZSksIGVsKTtcbn07XG52YXIgaGFuZGxlSG92ZXIgPSBmdW5jdGlvbiAoZWwsIGUsIHBqYXgpIHtcbiAgICBpZiAoaXNEZWZhdWx0UHJldmVudGVkKGVsLCBlKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZW91dCcpIHtcbiAgICAgICAgcGpheC5jbGVhclByZWZldGNoKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGV2ZW50T3B0aW9ucyA9IHtcbiAgICAgICAgdHJpZ2dlckVsZW1lbnQ6IGVsXG4gICAgfTtcbiAgICB2YXIgYXR0clZhbHVlID0gY2hlY2tGb3JBYm9ydChlbCwgZSk7XG4gICAgaWYgKGF0dHJWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCBhdHRyVmFsdWUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChlbC5ocmVmICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdKVxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCAncHJlZmV0Y2gnKTtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybjtcbiAgICBwamF4LmhhbmRsZVByZWZldGNoKGVsLmhyZWYsIGV2ZW50T3B0aW9ucyk7XG59O1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgcGpheCkge1xuICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsICcnKTtcbiAgICBvbl8xLmRlZmF1bHQoZWwsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7IGhhbmRsZUNsaWNrKGVsLCBlLCBwamF4KTsgfSk7XG4gICAgb25fMS5kZWZhdWx0KGVsLCAnbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUsIHBqYXgpOyB9KTtcbiAgICBvbl8xLmRlZmF1bHQoZWwsICdtb3VzZW91dCcsIGZ1bmN0aW9uIChlKSB7IGhhbmRsZUhvdmVyKGVsLCBlLCBwamF4KTsgfSk7XG4gICAgb25fMS5kZWZhdWx0KGVsLCAna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5rZXkgPT09ICdlbnRlcicgfHwgZS5rZXlDb2RlID09PSAxMylcbiAgICAgICAgICAgIGhhbmRsZUNsaWNrKGVsLCBlLCBwamF4KTtcbiAgICB9KTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGluay1ldmVudHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBldmVudCwgbGlzdGVuZXIpIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgZXZlbnRzLCB0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsgdGFyZ2V0ID0gbnVsbDsgfVxuICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0YXJnZXQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBjdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudChlLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgIGVsOiB0YXJnZXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQoY3VzdG9tRXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGV2ZW50XzEgPSBuZXcgRXZlbnQoZSk7XG4gICAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KGV2ZW50XzEpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyaWdnZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSBudWxsOyB9XG4gICAgdmFyIHBhcnNlZE9wdGlvbnMgPSAob3B0aW9ucyAhPT0gbnVsbCkgPyBvcHRpb25zIDoge307XG4gICAgcGFyc2VkT3B0aW9ucy5lbGVtZW50cyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuZWxlbWVudHMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmVsZW1lbnRzIDogJ2FbaHJlZl0nO1xuICAgIHBhcnNlZE9wdGlvbnMuc2VsZWN0b3JzID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zZWxlY3RvcnMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnNlbGVjdG9ycyA6IFsnLmpzLXBqYXgnXTtcbiAgICBwYXJzZWRPcHRpb25zLmhpc3RvcnkgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmhpc3RvcnkgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmhpc3RvcnkgOiB0cnVlO1xuICAgIHBhcnNlZE9wdGlvbnMuc2Nyb2xsVG8gPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnNjcm9sbFRvICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zY3JvbGxUbyA6IDA7XG4gICAgcGFyc2VkT3B0aW9ucy5jYWNoZUJ1c3QgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmNhY2hlQnVzdCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY2FjaGVCdXN0IDogZmFsc2U7XG4gICAgcGFyc2VkT3B0aW9ucy5kZWJ1ZyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuZGVidWcgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmRlYnVnIDogZmFsc2U7XG4gICAgcGFyc2VkT3B0aW9ucy50aW1lb3V0ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy50aW1lb3V0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy50aW1lb3V0IDogMDtcbiAgICBwYXJzZWRPcHRpb25zLnRpdGxlU3dpdGNoID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy50aXRsZVN3aXRjaCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMudGl0bGVTd2l0Y2ggOiB0cnVlO1xuICAgIHBhcnNlZE9wdGlvbnMuY3VzdG9tVHJhbnNpdGlvbnMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmN1c3RvbVRyYW5zaXRpb25zICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jdXN0b21UcmFuc2l0aW9ucyA6IGZhbHNlO1xuICAgIHJldHVybiBwYXJzZWRPcHRpb25zO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1vcHRpb25zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgcGpheCkge1xuICAgIHN3aXRjaCAoZWwudGFnTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgICAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSkpXG4gICAgICAgICAgICAgICAgcGpheC5zZXRMaW5rTGlzdGVuZXJzKGVsKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgJ1BqYXggY2FuIG9ubHkgYmUgYXBwbGllZCBvbiA8YT4gZWxlbWVudHMnO1xuICAgIH1cbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2hlY2stZWxlbWVudC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZG9jLCBzZWxlY3RvcnMsIGVsZW1lbnQpIHtcbiAgICBzZWxlY3RvcnMubWFwKGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICB2YXIgc2VsZWN0b3JFbHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgIHNlbGVjdG9yRWxzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBpZiAoZWwuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZhbHNlO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb250YWlucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoKTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXVpZC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBwYXJzZV9vcHRpb25zXzEgPSByZXF1aXJlKFwiLi9saWIvcGFyc2Utb3B0aW9uc1wiKTtcbnZhciB1dWlkXzEgPSByZXF1aXJlKFwiLi9saWIvdXVpZFwiKTtcbnZhciB0cmlnZ2VyXzEgPSByZXF1aXJlKFwiLi9saWIvZXZlbnRzL3RyaWdnZXJcIik7XG52YXIgY29udGFpbnNfMSA9IHJlcXVpcmUoXCIuL2xpYi91dGlsL2NvbnRhaW5zXCIpO1xudmFyIGxpbmtfZXZlbnRzXzEgPSByZXF1aXJlKFwiLi9saWIvZXZlbnRzL2xpbmstZXZlbnRzXCIpO1xudmFyIGNoZWNrX2VsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2xpYi91dGlsL2NoZWNrLWVsZW1lbnRcIik7XG52YXIgUGpheCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGpheChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgICAgaGlzdG9yeTogdHJ1ZSxcbiAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBwYXJzZV9vcHRpb25zXzEuZGVmYXVsdChvcHRpb25zKTtcbiAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG51bGw7XG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2FjaGVkU3dpdGNoID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQamF4IE9wdGlvbnM6JywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIFBqYXgucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uIChlKSB7IHJldHVybiBfdGhpcy5oYW5kbGVQb3BzdGF0ZShlKTsgfSk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3VzdG9tVHJhbnNpdGlvbnMpXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwamF4OmNvbnRpbnVlJywgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIF90aGlzLmhhbmRsZUNvbnRpbnVlKGUpOyB9KTtcbiAgICAgICAgdGhpcy5wYXJzZURPTShkb2N1bWVudC5ib2R5KTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuc2V0TGlua0xpc3RlbmVycyA9IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBsaW5rX2V2ZW50c18xLmRlZmF1bHQoZWwsIHRoaXMpO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuZ2V0RWxlbWVudHMgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5vcHRpb25zLmVsZW1lbnRzKTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLnBhcnNlRE9NID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IHRoaXMuZ2V0RWxlbWVudHMoZWwpO1xuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgY2hlY2tfZWxlbWVudF8xLmRlZmF1bHQoZWwsIF90aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQb3BzdGF0ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnN0YXRlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdIaWphY2tpbmcgUG9wc3RhdGUgRXZlbnQnKTtcbiAgICAgICAgICAgIHRoaXMubG9hZFVybChlLnN0YXRlLnVybCwgJ3BvcHN0YXRlJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmFib3J0UmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdCA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmxvYWRVcmwgPSBmdW5jdGlvbiAoaHJlZiwgbG9hZFR5cGUpIHtcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTG9hZChocmVmLCBsb2FkVHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRDYWNoZWRDb250ZW50KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVB1c2hTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IHt9KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1B1c2hpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuc3RhdGUudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IHRoaXMubGFzdFVVSUQsXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zdGF0ZS50aXRsZSwgdGhpcy5zdGF0ZS51cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlcGxhY2luZyBIaXN0b3J5IFN0YXRlOiAnLCB0aGlzLnN0YXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMuc3RhdGUudXJsLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogdGhpcy5sYXN0VVVJRCxcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zOiBbMCwgMF1cbiAgICAgICAgICAgICAgICB9LCBkb2N1bWVudC50aXRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVNjcm9sbFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5oaXN0b3J5KSB7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIHRlbXAuaHJlZiA9IHRoaXMuc3RhdGUudXJsO1xuICAgICAgICAgICAgaWYgKHRlbXAuaGFzaCkge1xuICAgICAgICAgICAgICAgIHZhciBuYW1lXzEgPSB0ZW1wLmhhc2guc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgbmFtZV8xID0gZGVjb2RlVVJJQ29tcG9uZW50KG5hbWVfMSk7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJUb3AgPSAwO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lXzEpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKG5hbWVfMSlbMF07XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJUb3AgKz0gdGFyZ2V0Lm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQub2Zmc2V0UGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgY3VyclRvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHRoaXMub3B0aW9ucy5zY3JvbGxUbyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxQb3MpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh0aGlzLnN0YXRlLnNjcm9sbFBvc1swXSwgdGhpcy5zdGF0ZS5zY3JvbGxQb3NbMV0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGaW5pc2hpbmcgUGpheCcpO1xuICAgICAgICB0aGlzLnN0YXRlLnVybCA9IHRoaXMucmVxdWVzdC5yZXNwb25zZVVSTDtcbiAgICAgICAgdGhpcy5zdGF0ZS50aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xuICAgICAgICB0aGlzLnN0YXRlLnNjcm9sbFBvcyA9IFswLCB3aW5kb3cuc2Nyb2xsWV07XG4gICAgICAgIHRoaXMuaGFuZGxlUHVzaFN0YXRlKCk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2Nyb2xsUG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jYWNoZWRTd2l0Y2ggPSBudWxsO1xuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmNvbXBsZXRlJ10pO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlU3dpdGNoZXMgPSBmdW5jdGlvbiAoc3dpdGNoUXVldWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgc3dpdGNoUXVldWUubWFwKGZ1bmN0aW9uIChzd2l0Y2hPYmopIHtcbiAgICAgICAgICAgIHN3aXRjaE9iai5vbGRFbC5pbm5lckhUTUwgPSBzd2l0Y2hPYmoubmV3RWwuaW5uZXJIVE1MO1xuICAgICAgICAgICAgX3RoaXMucGFyc2VET00oc3dpdGNoT2JqLm9sZEVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZUNvbnRpbnVlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FjaGVkU3dpdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlU3dpdGNoKVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5jYWNoZWRTd2l0Y2gudGl0bGU7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVN3aXRjaGVzKHRoaXMuY2FjaGVkU3dpdGNoLnF1ZXVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1N3aXRjaCBxdWV1ZSB3YXMgZW1wdHkuIFlvdSBtaWdodCBiZSBzZW5kaW5nIGBwamF4OmNvbnRpbnVlYCB0b28gZmFzdC4nKTtcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6ZXJyb3InXSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLnN3aXRjaFNlbGVjdG9ycyA9IGZ1bmN0aW9uIChzZWxlY3RvcnMsIHRvRWwsIGZyb21FbCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc3dpdGNoUXVldWUgPSBbXTtcbiAgICAgICAgc2VsZWN0b3JzLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICB2YXIgbmV3RWxzID0gdG9FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIHZhciBvbGRFbHMgPSBmcm9tRWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5kZWJ1ZylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUGpheCBTd2l0Y2ggU2VsZWN0b3I6ICcsIHNlbGVjdG9yLCBuZXdFbHMsIG9sZEVscyk7XG4gICAgICAgICAgICBpZiAobmV3RWxzLmxlbmd0aCAhPT0gb2xkRWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRE9NIGRvZXNuXFwndCBsb29rIHRoZSBzYW1lIG9uIHRoZSBuZXcgcGFnZScpO1xuICAgICAgICAgICAgICAgIF90aGlzLmxhc3RDaGFuY2UoX3RoaXMucmVxdWVzdC5yZXNwb25zZVVSTCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3RWxzLmZvckVhY2goZnVuY3Rpb24gKG5ld0VsZW1lbnQsIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2xkRWxlbWVudCA9IG9sZEVsc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZWxTd2l0Y2ggPSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0VsOiBuZXdFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBvbGRFbDogb2xkRWxlbWVudFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc3dpdGNoUXVldWUucHVzaChlbFN3aXRjaCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzd2l0Y2hRdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkblxcJ3QgZmluZCBhbnl0aGluZyB0byBzd2l0Y2gnKTtcbiAgICAgICAgICAgIHRoaXMubGFzdENoYW5jZSh0aGlzLnJlcXVlc3QucmVzcG9uc2VVUkwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmN1c3RvbVRyYW5zaXRpb25zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlU3dpdGNoKVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gdG9FbC50aXRsZTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU3dpdGNoZXMoc3dpdGNoUXVldWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYWNoZWRTd2l0Y2ggPSB7XG4gICAgICAgICAgICAgICAgcXVldWU6IHN3aXRjaFF1ZXVlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB0b0VsLnRpdGxlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5sYXN0Q2hhbmNlID0gZnVuY3Rpb24gKHVyaSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhY2hlZCBjb250ZW50IGhhcyBhIHJlc3BvbnNlIG9mICcsIHRoaXMuY2FjaGUuc3RhdHVzLCAnIGJ1dCB3ZSByZXF1aXJlIGEgc3VjY2VzcyByZXNwb25zZSwgZmFsbGJhY2sgbG9hZGluZyB1cmkgJywgdXJpKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5zdGF0dXNDaGVjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgc3RhdHVzXzEgPSAyMDA7IHN0YXR1c18xIDw9IDIwNjsgc3RhdHVzXzErKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGUuc3RhdHVzID09PSBzdGF0dXNfMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkQ2FjaGVkQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXR1c0NoZWNrKCkpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdENoYW5jZSh0aGlzLmNhY2hlLnVybCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgY29udGFpbnNfMS5kZWZhdWx0KGRvY3VtZW50LCB0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zd2l0Y2hTZWxlY3RvcnModGhpcy5vcHRpb25zLnNlbGVjdG9ycywgdGhpcy5jYWNoZS5odG1sLCBkb2N1bWVudCk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5wYXJzZUNvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0KSB7XG4gICAgICAgIHZhciB0ZW1wRWwgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJ2dsb2JhbHMnKTtcbiAgICAgICAgdmFyIGh0bWxSZWdleCA9IC9cXHM/W2EtejpdKyg/PSg/OlxcJ3xcXFwiKVteXFwnXFxcIj5dKyg/OlxcJ3xcXFwiKSkqL2dpO1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IHJlc3BvbnNlVGV4dC5tYXRjaChodG1sUmVnZXgpO1xuICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB0ZW1wRWw7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuY2FjaGVDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCwgcmVzcG9uc2VTdGF0dXMsIHVyaSkge1xuICAgICAgICB2YXIgdGVtcEVsID0gdGhpcy5wYXJzZUNvbnRlbnQocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgaWYgKHRlbXBFbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wRWwuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTCA9IHJlc3BvbnNlVGV4dDtcbiAgICAgICAgdGhpcy5jYWNoZSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2VTdGF0dXMsXG4gICAgICAgICAgICBodG1sOiB0ZW1wRWwsXG4gICAgICAgICAgICB1cmw6IHVyaVxuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhY2hlZCBDb250ZW50OiAnLCB0aGlzLmNhY2hlKTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmxvYWRDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xuICAgICAgICB2YXIgdGVtcEVsID0gdGhpcy5wYXJzZUNvbnRlbnQocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgaWYgKHRlbXBFbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcbiAgICAgICAgICAgIHRoaXMubGFzdENoYW5jZSh0aGlzLnJlcXVlc3QucmVzcG9uc2VVUkwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRlbXBFbC5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MID0gcmVzcG9uc2VUZXh0O1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBjb250YWluc18xLmRlZmF1bHQoZG9jdW1lbnQsIHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN3aXRjaFNlbGVjdG9ycyh0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCB0ZW1wRWwsIGRvY3VtZW50KTtcbiAgICB9O1xuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24gKGUsIGxvYWRUeXBlKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnWE1MIEh0dHAgUmVxdWVzdCBTdGF0dXM6ICcsIHRoaXMucmVxdWVzdC5zdGF0dXMpO1xuICAgICAgICB2YXIgcmVxdWVzdCA9IHRoaXMucmVxdWVzdDtcbiAgICAgICAgaWYgKHJlcXVlc3QucmVzcG9uc2VUZXh0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAobG9hZFR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ByZWZldGNoJzpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpcm1lZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCwgcmVxdWVzdC5zdGF0dXMsIHJlcXVlc3QucmVzcG9uc2VVUkwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncG9wc3RhdGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmVsb2FkJzpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuZG9SZXF1ZXN0ID0gZnVuY3Rpb24gKGhyZWYpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHJlcWV1c3RNZXRob2QgPSAnR0VUJztcbiAgICAgICAgdmFyIHRpbWVvdXQgPSB0aGlzLm9wdGlvbnMudGltZW91dCB8fCAwO1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgdXJpID0gaHJlZjtcbiAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gaHJlZi5zcGxpdCgnPycpWzFdO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNhY2hlQnVzdClcbiAgICAgICAgICAgIHVyaSArPSAocXVlcnlTdHJpbmcgPT09IHVuZGVmaW5lZCkgPyAoXCI/Y2I9XCIgKyBEYXRlLm5vdygpKSA6IChcIiZjYj1cIiArIERhdGUubm93KCkpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKHJlcWV1c3RNZXRob2QsIHVyaSwgdHJ1ZSk7XG4gICAgICAgICAgICByZXF1ZXN0LnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUEpBWCcsICd0cnVlJyk7XG4gICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUEpBWC1TZWxlY3RvcnMnLCBKU09OLnN0cmluZ2lmeShfdGhpcy5vcHRpb25zLnNlbGVjdG9ycykpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSByZXNvbHZlO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gcmVqZWN0O1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgICAgICBfdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQcmVmZXRjaCA9IGZ1bmN0aW9uIChocmVmKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUHJlZmV0Y2hpbmc6ICcsIGhyZWYpO1xuICAgICAgICB0aGlzLmFib3J0UmVxdWVzdCgpO1xuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OnByZWZldGNoJ10pO1xuICAgICAgICB0aGlzLmRvUmVxdWVzdChocmVmKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGUpIHsgX3RoaXMuaGFuZGxlUmVzcG9uc2UoZSwgJ3ByZWZldGNoJyk7IH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYSFIgUmVxdWVzdCBFcnJvcjogJywgZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlTG9hZCA9IGZ1bmN0aW9uIChocmVmLCBsb2FkVHlwZSwgZWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKGVsID09PSB2b2lkIDApIHsgZWwgPSBudWxsOyB9XG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6c2VuZCddLCBlbCk7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIENhY2hlZDogJywgaHJlZik7XG4gICAgICAgICAgICB0aGlzLmxvYWRDYWNoZWRDb250ZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5yZXF1ZXN0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIFByZWZldGNoOiAnLCBocmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlybWVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmc6ICcsIGhyZWYpO1xuICAgICAgICAgICAgdGhpcy5kb1JlcXVlc3QoaHJlZilcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkgeyBfdGhpcy5oYW5kbGVSZXNwb25zZShlLCBsb2FkVHlwZSk7IH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYSFIgUmVxdWVzdCBFcnJvcjogJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGpheC5wcm90b3R5cGUuY2xlYXJQcmVmZXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KCk7XG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6Y2FuY2VsJ10pO1xuICAgIH07XG4gICAgcmV0dXJuIFBqYXg7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUGpheDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBqYXguanMubWFwIl19
