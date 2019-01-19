(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Pjax = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var on_1 = require("./on");
var attrState = 'data-pjax-state';
var isDefaultPrevented = function (el, e) {
    var isPrevented = false;
    if (e.defaultPrevented)
        isPrevented = true;
    else if (el.getAttribute('prevent-pjax') !== null)
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
        if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
            console.log('IE 11 detected - fuel-pjax aborted!');
            return;
        }
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
        var pjaxWrappers = document.body.querySelectorAll("" + this.options.selectors);
        var newPageContainsScripts = false;
        pjaxWrappers.forEach(function (el) {
            var scripts = el.querySelectorAll('script');
            if (scripts.length > 0) {
                newPageContainsScripts = true;
            }
        });
        if (newPageContainsScripts) {
            window.location.reload();
        }
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

},{"./lib/events/link-events":1,"./lib/events/trigger":3,"./lib/parse-options":4,"./lib/util/check-element":5,"./lib/util/contains":6,"./lib/uuid":7}]},{},[8])(8)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIG9uXzEgPSByZXF1aXJlKFwiLi9vblwiKTtcclxudmFyIGF0dHJTdGF0ZSA9ICdkYXRhLXBqYXgtc3RhdGUnO1xyXG52YXIgaXNEZWZhdWx0UHJldmVudGVkID0gZnVuY3Rpb24gKGVsLCBlKSB7XHJcbiAgICB2YXIgaXNQcmV2ZW50ZWQgPSBmYWxzZTtcclxuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpXHJcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xyXG4gICAgZWxzZSBpZiAoZWwuZ2V0QXR0cmlidXRlKCdwcmV2ZW50LXBqYXgnKSAhPT0gbnVsbClcclxuICAgICAgICBpc1ByZXZlbnRlZCA9IHRydWU7XHJcbiAgICBlbHNlIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ25vLXRyYW5zaXRpb24nKSlcclxuICAgICAgICBpc1ByZXZlbnRlZCA9IHRydWU7XHJcbiAgICBlbHNlIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgIT09IG51bGwpXHJcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xyXG4gICAgZWxzZSBpZiAoZWwuZ2V0QXR0cmlidXRlKCd0YXJnZXQnKSA9PT0gJ19ibGFuaycpXHJcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xyXG4gICAgcmV0dXJuIGlzUHJldmVudGVkO1xyXG59O1xyXG52YXIgY2hlY2tGb3JBYm9ydCA9IGZ1bmN0aW9uIChlbCwgZSkge1xyXG4gICAgaWYgKGVsLnByb3RvY29sICE9PSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfHwgZWwuaG9zdCAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3QpXHJcbiAgICAgICAgcmV0dXJuICdleHRlcm5hbCc7XHJcbiAgICBpZiAoZWwuaGFzaCAmJiBlbC5ocmVmLnJlcGxhY2UoZWwuaGFzaCwgJycpID09PSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKGxvY2F0aW9uLmhhc2gsICcnKSlcclxuICAgICAgICByZXR1cm4gJ2FuY2hvcic7XHJcbiAgICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSArIFwiLCAnIydcIilcclxuICAgICAgICByZXR1cm4gJ2FuY2hvci1lbXB0eSc7XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxudmFyIGhhbmRsZUNsaWNrID0gZnVuY3Rpb24gKGVsLCBlLCBwamF4KSB7XHJcbiAgICBpZiAoaXNEZWZhdWx0UHJldmVudGVkKGVsLCBlKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgZXZlbnRPcHRpb25zID0ge1xyXG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxyXG4gICAgfTtcclxuICAgIHZhciBhdHRyVmFsdWUgPSBjaGVja0ZvckFib3J0KGVsLCBlKTtcclxuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCBhdHRyVmFsdWUpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmIChlbC5ocmVmID09PSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdKVxyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsICdyZWxvYWQnKTtcclxuICAgIGVsc2VcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCAnbG9hZCcpO1xyXG4gICAgcGpheC5oYW5kbGVMb2FkKGVsLmhyZWYsIGVsLmdldEF0dHJpYnV0ZShhdHRyU3RhdGUpLCBlbCk7XHJcbn07XHJcbnZhciBoYW5kbGVIb3ZlciA9IGZ1bmN0aW9uIChlbCwgZSwgcGpheCkge1xyXG4gICAgaWYgKGlzRGVmYXVsdFByZXZlbnRlZChlbCwgZSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgaWYgKGUudHlwZSA9PT0gJ21vdXNlb3V0Jykge1xyXG4gICAgICAgIHBqYXguY2xlYXJQcmVmZXRjaCgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciBldmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgdHJpZ2dlckVsZW1lbnQ6IGVsXHJcbiAgICB9O1xyXG4gICAgdmFyIGF0dHJWYWx1ZSA9IGNoZWNrRm9yQWJvcnQoZWwsIGUpO1xyXG4gICAgaWYgKGF0dHJWYWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsIGF0dHJWYWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKGVsLmhyZWYgIT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0pXHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgJ3ByZWZldGNoJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgcGpheC5oYW5kbGVQcmVmZXRjaChlbC5ocmVmLCBldmVudE9wdGlvbnMpO1xyXG59O1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBwamF4KSB7XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCAnJyk7XHJcbiAgICBvbl8xLmRlZmF1bHQoZWwsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7IGhhbmRsZUNsaWNrKGVsLCBlLCBwamF4KTsgfSk7XHJcbiAgICBvbl8xLmRlZmF1bHQoZWwsICdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUsIHBqYXgpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVIb3ZlcihlbCwgZSwgcGpheCk7IH0pO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChlLmtleSA9PT0gJ2VudGVyJyB8fCBlLmtleUNvZGUgPT09IDEzKVxyXG4gICAgICAgICAgICBoYW5kbGVDbGljayhlbCwgZSwgcGpheCk7XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmstZXZlbnRzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIGV2ZW50LCBsaXN0ZW5lcikge1xyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgZXZlbnRzLCB0YXJnZXQpIHtcclxuICAgIGlmICh0YXJnZXQgPT09IHZvaWQgMCkgeyB0YXJnZXQgPSBudWxsOyB9XHJcbiAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGUsIHtcclxuICAgICAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsOiB0YXJnZXRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQoY3VzdG9tRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGV2ZW50XzEgPSBuZXcgRXZlbnQoZSk7XHJcbiAgICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQoZXZlbnRfMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmlnZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0gbnVsbDsgfVxyXG4gICAgdmFyIHBhcnNlZE9wdGlvbnMgPSAob3B0aW9ucyAhPT0gbnVsbCkgPyBvcHRpb25zIDoge307XHJcbiAgICBwYXJzZWRPcHRpb25zLmVsZW1lbnRzID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5lbGVtZW50cyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuZWxlbWVudHMgOiAnYVtocmVmXSc7XHJcbiAgICBwYXJzZWRPcHRpb25zLnNlbGVjdG9ycyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuc2VsZWN0b3JzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zZWxlY3RvcnMgOiBbJy5qcy1wamF4J107XHJcbiAgICBwYXJzZWRPcHRpb25zLmhpc3RvcnkgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmhpc3RvcnkgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmhpc3RvcnkgOiB0cnVlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5zY3JvbGxUbyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuc2Nyb2xsVG8gIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnNjcm9sbFRvIDogMDtcclxuICAgIHBhcnNlZE9wdGlvbnMuY2FjaGVCdXN0ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5jYWNoZUJ1c3QgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmNhY2hlQnVzdCA6IGZhbHNlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5kZWJ1ZyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuZGVidWcgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmRlYnVnIDogZmFsc2U7XHJcbiAgICBwYXJzZWRPcHRpb25zLnRpbWVvdXQgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnRpbWVvdXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnRpbWVvdXQgOiAwO1xyXG4gICAgcGFyc2VkT3B0aW9ucy50aXRsZVN3aXRjaCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMudGl0bGVTd2l0Y2ggIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnRpdGxlU3dpdGNoIDogdHJ1ZTtcclxuICAgIHBhcnNlZE9wdGlvbnMuY3VzdG9tVHJhbnNpdGlvbnMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmN1c3RvbVRyYW5zaXRpb25zICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jdXN0b21UcmFuc2l0aW9ucyA6IGZhbHNlO1xyXG4gICAgcmV0dXJuIHBhcnNlZE9wdGlvbnM7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1vcHRpb25zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIHBqYXgpIHtcclxuICAgIHN3aXRjaCAoZWwudGFnTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgY2FzZSAnYSc6XHJcbiAgICAgICAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUpKVxyXG4gICAgICAgICAgICAgICAgcGpheC5zZXRMaW5rTGlzdGVuZXJzKGVsKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgJ1BqYXggY2FuIG9ubHkgYmUgYXBwbGllZCBvbiA8YT4gZWxlbWVudHMnO1xyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2hlY2stZWxlbWVudC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGRvYywgc2VsZWN0b3JzLCBlbGVtZW50KSB7XHJcbiAgICBzZWxlY3RvcnMubWFwKGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBzZWxlY3RvckVscyA9IEFycmF5LmZyb20oZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcclxuICAgICAgICBzZWxlY3RvckVscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICBpZiAoZWwuY29udGFpbnMoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBmYWxzZTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnRhaW5zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gRGF0ZS5ub3coKS50b1N0cmluZygpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXVpZC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgcGFyc2Vfb3B0aW9uc18xID0gcmVxdWlyZShcIi4vbGliL3BhcnNlLW9wdGlvbnNcIik7XHJcbnZhciB1dWlkXzEgPSByZXF1aXJlKFwiLi9saWIvdXVpZFwiKTtcclxudmFyIHRyaWdnZXJfMSA9IHJlcXVpcmUoXCIuL2xpYi9ldmVudHMvdHJpZ2dlclwiKTtcclxudmFyIGNvbnRhaW5zXzEgPSByZXF1aXJlKFwiLi9saWIvdXRpbC9jb250YWluc1wiKTtcclxudmFyIGxpbmtfZXZlbnRzXzEgPSByZXF1aXJlKFwiLi9saWIvZXZlbnRzL2xpbmstZXZlbnRzXCIpO1xyXG52YXIgY2hlY2tfZWxlbWVudF8xID0gcmVxdWlyZShcIi4vbGliL3V0aWwvY2hlY2stZWxlbWVudFwiKTtcclxudmFyIFBqYXggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUGpheChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKCctbXMtc2Nyb2xsLWxpbWl0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUgJiYgJy1tcy1pbWUtYWxpZ24nIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSUUgMTEgZGV0ZWN0ZWQgLSBmdWVsLXBqYXggYWJvcnRlZCEnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgICAgICB0aXRsZTogZG9jdW1lbnQudGl0bGUsXHJcbiAgICAgICAgICAgIGhpc3Rvcnk6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gcGFyc2Vfb3B0aW9uc18xLmRlZmF1bHQob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2FjaGVkU3dpdGNoID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGpheCBPcHRpb25zOicsIHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbiAgICBQamF4LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIF90aGlzLmhhbmRsZVBvcHN0YXRlKGUpOyB9KTtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmN1c3RvbVRyYW5zaXRpb25zKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwamF4OmNvbnRpbnVlJywgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIF90aGlzLmhhbmRsZUNvbnRpbnVlKGUpOyB9KTtcclxuICAgICAgICB0aGlzLnBhcnNlRE9NKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUHVzaFN0YXRlKCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUmVsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5zZXRMaW5rTGlzdGVuZXJzID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgbGlua19ldmVudHNfMS5kZWZhdWx0KGVsLCB0aGlzKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGVsLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5vcHRpb25zLmVsZW1lbnRzKSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUucGFyc2VET00gPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbGVtZW50cyA9IHRoaXMuZ2V0RWxlbWVudHMoZWwpO1xyXG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIGNoZWNrX2VsZW1lbnRfMS5kZWZhdWx0KGVsLCBfdGhpcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUG9wc3RhdGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChlLnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSGlqYWNraW5nIFBvcHN0YXRlIEV2ZW50Jyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFVybChlLnN0YXRlLnVybCwgJ3BvcHN0YXRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmFib3J0UmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0ID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkVXJsID0gZnVuY3Rpb24gKGhyZWYsIGxvYWRUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxvYWQoaHJlZiwgbG9hZFR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQdXNoU3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IHt9KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmhpc3RvcnkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1B1c2hpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnN0YXRlLnRpdGxlLCB0aGlzLnN0YXRlLnVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXBsYWNpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgICAgICAgICB9LCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlU2Nyb2xsUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGlzdG9yeSkge1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgdGVtcC5ocmVmID0gdGhpcy5zdGF0ZS51cmw7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wLmhhc2gpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lXzEgPSB0ZW1wLmhhc2guc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICBuYW1lXzEgPSBkZWNvZGVVUklDb21wb25lbnQobmFtZV8xKTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyVG9wID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lXzEpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKG5hbWVfMSlbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5vZmZzZXRQYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclRvcCArPSB0YXJnZXQub2Zmc2V0VG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lm9mZnNldFBhcmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAodGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgY3VyclRvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHRoaXMub3B0aW9ucy5zY3JvbGxUbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsUG9zKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh0aGlzLnN0YXRlLnNjcm9sbFBvc1swXSwgdGhpcy5zdGF0ZS5zY3JvbGxQb3NbMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmluaXNoaW5nIFBqYXgnKTtcclxuICAgICAgICB0aGlzLnN0YXRlLnVybCA9IHRoaXMucmVxdWVzdC5yZXNwb25zZVVSTDtcclxuICAgICAgICB0aGlzLnN0YXRlLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY3JvbGxQb3MgPSBbMCwgd2luZG93LnNjcm9sbFldO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUHVzaFN0YXRlKCk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTY3JvbGxQb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jYWNoZWRTd2l0Y2ggPSBudWxsO1xyXG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6Y29tcGxldGUnXSk7XHJcbiAgICAgICAgdmFyIHBqYXhXcmFwcGVycyA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvckFsbChcIlwiICsgdGhpcy5vcHRpb25zLnNlbGVjdG9ycyk7XHJcbiAgICAgICAgdmFyIG5ld1BhZ2VDb250YWluc1NjcmlwdHMgPSBmYWxzZTtcclxuICAgICAgICBwamF4V3JhcHBlcnMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgdmFyIHNjcmlwdHMgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgaWYgKHNjcmlwdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UGFnZUNvbnRhaW5zU2NyaXB0cyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAobmV3UGFnZUNvbnRhaW5zU2NyaXB0cykge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVN3aXRjaGVzID0gZnVuY3Rpb24gKHN3aXRjaFF1ZXVlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBzd2l0Y2hRdWV1ZS5tYXAoZnVuY3Rpb24gKHN3aXRjaE9iaikge1xyXG4gICAgICAgICAgICBzd2l0Y2hPYmoub2xkRWwuaW5uZXJIVE1MID0gc3dpdGNoT2JqLm5ld0VsLmlubmVySFRNTDtcclxuICAgICAgICAgICAgX3RoaXMucGFyc2VET00oc3dpdGNoT2JqLm9sZEVsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpbmFsaXplKCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlQ29udGludWUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlZFN3aXRjaCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlU3dpdGNoKVxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLmNhY2hlZFN3aXRjaC50aXRsZTtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hlcyh0aGlzLmNhY2hlZFN3aXRjaC5xdWV1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1N3aXRjaCBxdWV1ZSB3YXMgZW1wdHkuIFlvdSBtaWdodCBiZSBzZW5kaW5nIGBwamF4OmNvbnRpbnVlYCB0b28gZmFzdC4nKTtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuc3dpdGNoU2VsZWN0b3JzID0gZnVuY3Rpb24gKHNlbGVjdG9ycywgdG9FbCwgZnJvbUVsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgc3dpdGNoUXVldWUgPSBbXTtcclxuICAgICAgICBzZWxlY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIG5ld0VscyA9IEFycmF5LmZyb20odG9FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XHJcbiAgICAgICAgICAgIHZhciBvbGRFbHMgPSBBcnJheS5mcm9tKGZyb21FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BqYXggU3dpdGNoIFNlbGVjdG9yOiAnLCBzZWxlY3RvciwgbmV3RWxzLCBvbGRFbHMpO1xyXG4gICAgICAgICAgICBpZiAobmV3RWxzLmxlbmd0aCAhPT0gb2xkRWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RPTSBkb2VzblxcJ3QgbG9vayB0aGUgc2FtZSBvbiB0aGUgbmV3IHBhZ2UnKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmxhc3RDaGFuY2UoX3RoaXMucmVxdWVzdC5yZXNwb25zZVVSTCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV3RWxzLmZvckVhY2goZnVuY3Rpb24gKG5ld0VsZW1lbnQsIGkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRFbGVtZW50ID0gb2xkRWxzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsU3dpdGNoID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0VsOiBuZXdFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIG9sZEVsOiBvbGRFbGVtZW50XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoUXVldWUucHVzaChlbFN3aXRjaCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzd2l0Y2hRdWV1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZG5cXCd0IGZpbmQgYW55dGhpbmcgdG8gc3dpdGNoJyk7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdENoYW5jZSh0aGlzLnJlcXVlc3QucmVzcG9uc2VVUkwpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmN1c3RvbVRyYW5zaXRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMudGl0bGVTd2l0Y2gpXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRvRWwudGl0bGU7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU3dpdGNoZXMoc3dpdGNoUXVldWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZWRTd2l0Y2ggPSB7XHJcbiAgICAgICAgICAgICAgICBxdWV1ZTogc3dpdGNoUXVldWUsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogdG9FbC50aXRsZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sYXN0Q2hhbmNlID0gZnVuY3Rpb24gKHVyaSkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhY2hlZCBjb250ZW50IGhhcyBhIG5vbi0yMDAgcmVzcG9uc2UgYnV0IHdlIHJlcXVpcmUgYSBzdWNjZXNzIHJlc3BvbnNlLCBmYWxsYmFjayBsb2FkaW5nIHVyaSAnLCB1cmkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVyaTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5zdGF0dXNDaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBzdGF0dXNfMSA9IDIwMDsgc3RhdHVzXzEgPD0gMjA2OyBzdGF0dXNfMSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlLnN0YXR1cyA9PT0gc3RhdHVzXzEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmxvYWRDYWNoZWRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0dXNDaGVjaygpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdENoYW5jZSh0aGlzLmNhY2hlLnVybCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgY29udGFpbnNfMS5kZWZhdWx0KGRvY3VtZW50LCB0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3dpdGNoU2VsZWN0b3JzKHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIHRoaXMuY2FjaGUuaHRtbCwgZG9jdW1lbnQpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnBhcnNlQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcclxuICAgICAgICB2YXIgdGVtcEVsID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCdnbG9iYWxzJyk7XHJcbiAgICAgICAgdmFyIGh0bWxSZWdleCA9IC9cXHM/W2EtejpdKyg/PSg/OlxcJ3xcXFwiKVteXFwnXFxcIj5dKyg/OlxcJ3xcXFwiKSkqL2dpO1xyXG4gICAgICAgIHZhciBtYXRjaGVzID0gcmVzcG9uc2VUZXh0Lm1hdGNoKGh0bWxSZWdleCk7XHJcbiAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wRWw7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuY2FjaGVDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCwgcmVzcG9uc2VTdGF0dXMsIHVyaSkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSB0aGlzLnBhcnNlQ29udGVudChyZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGlmICh0ZW1wRWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wRWwuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTCA9IHJlc3BvbnNlVGV4dDtcclxuICAgICAgICB0aGlzLmNhY2hlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlU3RhdHVzLFxyXG4gICAgICAgICAgICBodG1sOiB0ZW1wRWwsXHJcbiAgICAgICAgICAgIHVybDogdXJpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FjaGVkIENvbnRlbnQ6ICcsIHRoaXMuY2FjaGUpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmxvYWRDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSB0aGlzLnBhcnNlQ29udGVudChyZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGlmICh0ZW1wRWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0Q2hhbmNlKHRoaXMucmVxdWVzdC5yZXNwb25zZVVSTCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcEVsLmRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwgPSByZXNwb25zZVRleHQ7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgY29udGFpbnNfMS5kZWZhdWx0KGRvY3VtZW50LCB0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3dpdGNoU2VsZWN0b3JzKHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIHRlbXBFbCwgZG9jdW1lbnQpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24gKGUsIGxvYWRUeXBlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1hNTCBIdHRwIFJlcXVlc3QgU3RhdHVzOiAnLCB0aGlzLnJlcXVlc3Quc3RhdHVzKTtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHRoaXMucmVxdWVzdDtcclxuICAgICAgICBpZiAocmVxdWVzdC5yZXNwb25zZVRleHQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGxvYWRUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3ByZWZldGNoJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maXJtZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZUNvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQsIHJlcXVlc3Quc3RhdHVzLCByZXF1ZXN0LnJlc3BvbnNlVVJMKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdwb3BzdGF0ZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JlbG9hZCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuZG9SZXF1ZXN0ID0gZnVuY3Rpb24gKGhyZWYpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZXFldXN0TWV0aG9kID0gJ0dFVCc7XHJcbiAgICAgICAgdmFyIHRpbWVvdXQgPSB0aGlzLm9wdGlvbnMudGltZW91dCB8fCAwO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgdmFyIHVyaSA9IGhyZWY7XHJcbiAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gaHJlZi5zcGxpdCgnPycpWzFdO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FjaGVCdXN0KVxyXG4gICAgICAgICAgICB1cmkgKz0gKHF1ZXJ5U3RyaW5nID09PSB1bmRlZmluZWQpID8gKFwiP2NiPVwiICsgRGF0ZS5ub3coKSkgOiAoXCImY2I9XCIgKyBEYXRlLm5vdygpKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4ocmVxZXVzdE1ldGhvZCwgdXJpLCB0cnVlKTtcclxuICAgICAgICAgICAgcmVxdWVzdC50aW1lb3V0ID0gdGltZW91dDtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1QSkFYJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVBKQVgtU2VsZWN0b3JzJywgSlNPTi5zdHJpbmdpZnkoX3RoaXMub3B0aW9ucy5zZWxlY3RvcnMpKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSByZWplY3Q7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQcmVmZXRjaCA9IGZ1bmN0aW9uIChocmVmKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUHJlZmV0Y2hpbmc6ICcsIGhyZWYpO1xyXG4gICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KCk7XHJcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpwcmVmZXRjaCddKTtcclxuICAgICAgICB0aGlzLmRvUmVxdWVzdChocmVmKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkgeyBfdGhpcy5oYW5kbGVSZXNwb25zZShlLCAncHJlZmV0Y2gnKTsgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVMb2FkID0gZnVuY3Rpb24gKGhyZWYsIGxvYWRUeXBlLCBlbCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKGVsID09PSB2b2lkIDApIHsgZWwgPSBudWxsOyB9XHJcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpzZW5kJ10sIGVsKTtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgQ2FjaGVkOiAnLCBocmVmKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnJlcXVlc3QgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIFByZWZldGNoOiAnLCBocmVmKTtcclxuICAgICAgICAgICAgdGhpcy5jb25maXJtZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nOiAnLCBocmVmKTtcclxuICAgICAgICAgICAgdGhpcy5kb1JlcXVlc3QoaHJlZilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsIGxvYWRUeXBlKTsgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmNsZWFyUHJlZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFib3J0UmVxdWVzdCgpO1xyXG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6Y2FuY2VsJ10pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQamF4O1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBQamF4O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wamF4LmpzLm1hcCJdfQ==
