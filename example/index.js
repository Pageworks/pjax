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
    if (isDefaultPrevented(el, e)) {
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
    e.preventDefault();
    if (el.href === window.location.href.split('#')[0]) {
        el.setAttribute(attrState, 'reload');
    }
    else {
        el.setAttribute(attrState, 'load');
    }
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
        if (this.request === null) {
            return;
        }
        if (this.request.readyState !== 4) {
            this.request.abort();
        }
        this.request = null;
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
        if (this.options.debug) {
            console.log('Finishing Pjax');
        }
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
            if (_this.options.debug) {
                console.log('Pjax Switch Selector: ', selector, newEls, oldEls);
            }
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
            console.log("Something went wrong, failsafe loading " + uri);
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
        if (this.confirmed) {
            return;
        }
        if (this.options.debug) {
            console.log('Prefetching: ', href);
        }
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
        if (this.confirmed) {
            return;
        }
        trigger_1.default(document, ['pjax:send'], el);
        this.confirmed = true;
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
        if (!this.confirmed) {
            this.cache = null;
            this.abortRequest();
            trigger_1.default(document, ['pjax:cancel']);
        }
    };
    return Pjax;
}());
exports.default = Pjax;

},{"./lib/events/link-events":1,"./lib/events/trigger":3,"./lib/parse-options":4,"./lib/util/check-element":5,"./lib/util/contains":6,"./lib/uuid":7}]},{},[8])(8)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgb25fMSA9IHJlcXVpcmUoXCIuL29uXCIpO1xyXG52YXIgYXR0clN0YXRlID0gJ2RhdGEtcGpheC1zdGF0ZSc7XHJcbnZhciBpc0RlZmF1bHRQcmV2ZW50ZWQgPSBmdW5jdGlvbiAoZWwsIGUpIHtcclxuICAgIHZhciBpc1ByZXZlbnRlZCA9IGZhbHNlO1xyXG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZClcclxuICAgICAgICBpc1ByZXZlbnRlZCA9IHRydWU7XHJcbiAgICBlbHNlIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ3ByZXZlbnQtcGpheCcpICE9PSBudWxsKVxyXG4gICAgICAgIGlzUHJldmVudGVkID0gdHJ1ZTtcclxuICAgIGVsc2UgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucygnbm8tdHJhbnNpdGlvbicpKVxyXG4gICAgICAgIGlzUHJldmVudGVkID0gdHJ1ZTtcclxuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgnZG93bmxvYWQnKSAhPT0gbnVsbClcclxuICAgICAgICBpc1ByZXZlbnRlZCA9IHRydWU7XHJcbiAgICBlbHNlIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ3RhcmdldCcpID09PSAnX2JsYW5rJylcclxuICAgICAgICBpc1ByZXZlbnRlZCA9IHRydWU7XHJcbiAgICByZXR1cm4gaXNQcmV2ZW50ZWQ7XHJcbn07XHJcbnZhciBjaGVja0ZvckFib3J0ID0gZnVuY3Rpb24gKGVsLCBlKSB7XHJcbiAgICBpZiAoZWwucHJvdG9jb2wgIT09IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB8fCBlbC5ob3N0ICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdClcclxuICAgICAgICByZXR1cm4gJ2V4dGVybmFsJztcclxuICAgIGlmIChlbC5oYXNoICYmIGVsLmhyZWYucmVwbGFjZShlbC5oYXNoLCAnJykgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgJycpKVxyXG4gICAgICAgIHJldHVybiAnYW5jaG9yJztcclxuICAgIGlmIChlbC5ocmVmID09PSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdICsgXCIsICcjJ1wiKVxyXG4gICAgICAgIHJldHVybiAnYW5jaG9yLWVtcHR5JztcclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG52YXIgaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZWwsIGUsIHBqYXgpIHtcclxuICAgIGlmIChpc0RlZmF1bHRQcmV2ZW50ZWQoZWwsIGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdmFyIGV2ZW50T3B0aW9ucyA9IHtcclxuICAgICAgICB0cmlnZ2VyRWxlbWVudDogZWxcclxuICAgIH07XHJcbiAgICB2YXIgYXR0clZhbHVlID0gY2hlY2tGb3JBYm9ydChlbCwgZSk7XHJcbiAgICBpZiAoYXR0clZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsICdyZWxvYWQnKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsICdsb2FkJyk7XHJcbiAgICB9XHJcbiAgICBwamF4LmhhbmRsZUxvYWQoZWwuaHJlZiwgZWwuZ2V0QXR0cmlidXRlKGF0dHJTdGF0ZSksIGVsKTtcclxufTtcclxudmFyIGhhbmRsZUhvdmVyID0gZnVuY3Rpb24gKGVsLCBlLCBwamF4KSB7XHJcbiAgICBpZiAoaXNEZWZhdWx0UHJldmVudGVkKGVsLCBlKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICBpZiAoZS50eXBlID09PSAnbW91c2VvdXQnKSB7XHJcbiAgICAgICAgcGpheC5jbGVhclByZWZldGNoKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdmFyIGV2ZW50T3B0aW9ucyA9IHtcclxuICAgICAgICB0cmlnZ2VyRWxlbWVudDogZWxcclxuICAgIH07XHJcbiAgICB2YXIgYXR0clZhbHVlID0gY2hlY2tGb3JBYm9ydChlbCwgZSk7XHJcbiAgICBpZiAoYXR0clZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoZWwuaHJlZiAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSlcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCAncHJlZmV0Y2gnKTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm47XHJcbiAgICBwamF4LmhhbmRsZVByZWZldGNoKGVsLmhyZWYsIGV2ZW50T3B0aW9ucyk7XHJcbn07XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIHBqYXgpIHtcclxuICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsICcnKTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlQ2xpY2soZWwsIGUsIHBqYXgpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVIb3ZlcihlbCwgZSwgcGpheCk7IH0pO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnbW91c2VsZWF2ZScsIGZ1bmN0aW9uIChlKSB7IGhhbmRsZUhvdmVyKGVsLCBlLCBwamF4KTsgfSk7XHJcbiAgICBvbl8xLmRlZmF1bHQoZWwsICdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGUua2V5ID09PSAnZW50ZXInIHx8IGUua2V5Q29kZSA9PT0gMTMpXHJcbiAgICAgICAgICAgIGhhbmRsZUNsaWNrKGVsLCBlLCBwamF4KTtcclxuICAgIH0pO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGluay1ldmVudHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgZXZlbnQsIGxpc3RlbmVyKSB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBldmVudHMsIHRhcmdldCkge1xyXG4gICAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7IHRhcmdldCA9IG51bGw7IH1cclxuICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgY3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZSwge1xyXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWw6IHRhcmdldFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChjdXN0b21FdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgZXZlbnRfMSA9IG5ldyBFdmVudChlKTtcclxuICAgICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChldmVudF8xKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyaWdnZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSBudWxsOyB9XHJcbiAgICB2YXIgcGFyc2VkT3B0aW9ucyA9IChvcHRpb25zICE9PSBudWxsKSA/IG9wdGlvbnMgOiB7fTtcclxuICAgIHBhcnNlZE9wdGlvbnMuZWxlbWVudHMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmVsZW1lbnRzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5lbGVtZW50cyA6ICdhW2hyZWZdJztcclxuICAgIHBhcnNlZE9wdGlvbnMuc2VsZWN0b3JzID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zZWxlY3RvcnMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnNlbGVjdG9ycyA6IFsnLmpzLXBqYXgnXTtcclxuICAgIHBhcnNlZE9wdGlvbnMuaGlzdG9yeSA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuaGlzdG9yeSAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuaGlzdG9yeSA6IHRydWU7XHJcbiAgICBwYXJzZWRPcHRpb25zLnNjcm9sbFRvID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zY3JvbGxUbyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuc2Nyb2xsVG8gOiAwO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5jYWNoZUJ1c3QgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmNhY2hlQnVzdCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY2FjaGVCdXN0IDogZmFsc2U7XHJcbiAgICBwYXJzZWRPcHRpb25zLmRlYnVnID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5kZWJ1ZyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuZGVidWcgOiBmYWxzZTtcclxuICAgIHBhcnNlZE9wdGlvbnMudGltZW91dCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMudGltZW91dCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMudGltZW91dCA6IDA7XHJcbiAgICBwYXJzZWRPcHRpb25zLnRpdGxlU3dpdGNoID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy50aXRsZVN3aXRjaCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMudGl0bGVTd2l0Y2ggOiB0cnVlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5jdXN0b21UcmFuc2l0aW9ucyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuY3VzdG9tVHJhbnNpdGlvbnMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmN1c3RvbVRyYW5zaXRpb25zIDogZmFsc2U7XHJcbiAgICByZXR1cm4gcGFyc2VkT3B0aW9ucztcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLW9wdGlvbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgcGpheCkge1xyXG4gICAgc3dpdGNoIChlbC50YWdOYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICBjYXNlICdhJzpcclxuICAgICAgICAgICAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSkpXHJcbiAgICAgICAgICAgICAgICBwamF4LnNldExpbmtMaXN0ZW5lcnMoZWwpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyAnUGpheCBjYW4gb25seSBiZSBhcHBsaWVkIG9uIDxhPiBlbGVtZW50cyc7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jaGVjay1lbGVtZW50LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZG9jLCBzZWxlY3RvcnMsIGVsZW1lbnQpIHtcclxuICAgIHNlbGVjdG9ycy5tYXAoZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRWxzID0gQXJyYXkuZnJvbShkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xyXG4gICAgICAgIHNlbGVjdG9yRWxzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIGlmIChlbC5jb250YWlucyhlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29udGFpbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBEYXRlLm5vdygpLnRvU3RyaW5nKCk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD11dWlkLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBwYXJzZV9vcHRpb25zXzEgPSByZXF1aXJlKFwiLi9saWIvcGFyc2Utb3B0aW9uc1wiKTtcclxudmFyIHV1aWRfMSA9IHJlcXVpcmUoXCIuL2xpYi91dWlkXCIpO1xyXG52YXIgdHJpZ2dlcl8xID0gcmVxdWlyZShcIi4vbGliL2V2ZW50cy90cmlnZ2VyXCIpO1xyXG52YXIgY29udGFpbnNfMSA9IHJlcXVpcmUoXCIuL2xpYi91dGlsL2NvbnRhaW5zXCIpO1xyXG52YXIgbGlua19ldmVudHNfMSA9IHJlcXVpcmUoXCIuL2xpYi9ldmVudHMvbGluay1ldmVudHNcIik7XHJcbnZhciBjaGVja19lbGVtZW50XzEgPSByZXF1aXJlKFwiLi9saWIvdXRpbC9jaGVjay1lbGVtZW50XCIpO1xyXG52YXIgUGpheCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQamF4KG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoJy1tcy1zY3JvbGwtbGltaXQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiAnLW1zLWltZS1hbGlnbicgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJRSAxMSBkZXRlY3RlZCAtIGZ1ZWwtcGpheCBhYm9ydGVkIScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcclxuICAgICAgICAgICAgaGlzdG9yeTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBwYXJzZV9vcHRpb25zXzEuZGVmYXVsdChvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jYWNoZWRTd2l0Y2ggPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQamF4IE9wdGlvbnM6JywgdGhpcy5vcHRpb25zKTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuICAgIFBqYXgucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMuaGFuZGxlUG9wc3RhdGUoZSk7IH0pO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3VzdG9tVHJhbnNpdGlvbnMpXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BqYXg6Y29udGludWUnLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMuaGFuZGxlQ29udGludWUoZSk7IH0pO1xyXG4gICAgICAgIHRoaXMucGFyc2VET00oZG9jdW1lbnQuYm9keSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVQdXNoU3RhdGUoKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVSZWxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnNldExpbmtMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICBsaW5rX2V2ZW50c18xLmRlZmF1bHQoZWwsIHRoaXMpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmdldEVsZW1lbnRzID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZWwucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMuZWxlbWVudHMpKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5wYXJzZURPTSA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gdGhpcy5nZXRFbGVtZW50cyhlbCk7XHJcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgY2hlY2tfZWxlbWVudF8xLmRlZmF1bHQoZWwsIF90aGlzKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQb3BzdGF0ZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGUuc3RhdGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdIaWphY2tpbmcgUG9wc3RhdGUgRXZlbnQnKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkVXJsKGUuc3RhdGUudXJsLCAncG9wc3RhdGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuYWJvcnRSZXF1ZXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3QgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0LmFib3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG51bGw7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubG9hZFVybCA9IGZ1bmN0aW9uIChocmVmLCBsb2FkVHlwZSkge1xyXG4gICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVMb2FkKGhyZWYsIGxvYWRUeXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZENhY2hlZENvbnRlbnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUHVzaFN0YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSB7fSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQdXNoaW5nIEhpc3RvcnkgU3RhdGU6ICcsIHRoaXMuc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5zdGF0ZS51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuc3RhdGUudGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogdGhpcy5sYXN0VVVJRCxcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zdGF0ZS50aXRsZSwgdGhpcy5zdGF0ZS51cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVwbGFjaW5nIEhpc3RvcnkgU3RhdGU6ICcsIHRoaXMuc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5zdGF0ZS51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuc3RhdGUudGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogdGhpcy5sYXN0VVVJRCxcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxyXG4gICAgICAgICAgICAgICAgfSwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVNjcm9sbFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmhpc3RvcnkpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIHRlbXAuaHJlZiA9IHRoaXMuc3RhdGUudXJsO1xyXG4gICAgICAgICAgICBpZiAodGVtcC5oYXNoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZV8xID0gdGVtcC5oYXNoLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgbmFtZV8xID0gZGVjb2RlVVJJQ29tcG9uZW50KG5hbWVfMSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclRvcCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZV8xKSB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShuYW1lXzEpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQub2Zmc2V0UGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJUb3AgKz0gdGFyZ2V0Lm9mZnNldFRvcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5vZmZzZXRQYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGN1cnJUb3ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB0aGlzLm9wdGlvbnMuc2Nyb2xsVG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbFBvcykge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8odGhpcy5zdGF0ZS5zY3JvbGxQb3NbMF0sIHRoaXMuc3RhdGUuc2Nyb2xsUG9zWzFdKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1Zykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmluaXNoaW5nIFBqYXgnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZS51cmwgPSB0aGlzLnJlcXVlc3QucmVzcG9uc2VVUkw7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS50aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2Nyb2xsUG9zID0gWzAsIHdpbmRvdy5zY3JvbGxZXTtcclxuICAgICAgICB0aGlzLmhhbmRsZVB1c2hTdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU2Nyb2xsUG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge307XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2FjaGVkU3dpdGNoID0gbnVsbDtcclxuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmNvbXBsZXRlJ10pO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVN3aXRjaGVzID0gZnVuY3Rpb24gKHN3aXRjaFF1ZXVlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBzd2l0Y2hRdWV1ZS5tYXAoZnVuY3Rpb24gKHN3aXRjaE9iaikge1xyXG4gICAgICAgICAgICBzd2l0Y2hPYmoub2xkRWwuaW5uZXJIVE1MID0gc3dpdGNoT2JqLm5ld0VsLmlubmVySFRNTDtcclxuICAgICAgICAgICAgX3RoaXMucGFyc2VET00oc3dpdGNoT2JqLm9sZEVsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpbmFsaXplKCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlQ29udGludWUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlZFN3aXRjaCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlU3dpdGNoKVxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLmNhY2hlZFN3aXRjaC50aXRsZTtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hlcyh0aGlzLmNhY2hlZFN3aXRjaC5xdWV1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1N3aXRjaCBxdWV1ZSB3YXMgZW1wdHkuIFlvdSBtaWdodCBiZSBzZW5kaW5nIGBwamF4OmNvbnRpbnVlYCB0b28gZmFzdC4nKTtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuc3dpdGNoU2VsZWN0b3JzID0gZnVuY3Rpb24gKHNlbGVjdG9ycywgdG9FbCwgZnJvbUVsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgc3dpdGNoUXVldWUgPSBbXTtcclxuICAgICAgICBzZWxlY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIG5ld0VscyA9IEFycmF5LmZyb20odG9FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XHJcbiAgICAgICAgICAgIHZhciBvbGRFbHMgPSBBcnJheS5mcm9tKGZyb21FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUGpheCBTd2l0Y2ggU2VsZWN0b3I6ICcsIHNlbGVjdG9yLCBuZXdFbHMsIG9sZEVscyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5ld0Vscy5sZW5ndGggIT09IG9sZEVscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdET00gZG9lc25cXCd0IGxvb2sgdGhlIHNhbWUgb24gdGhlIG5ldyBwYWdlJyk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5sYXN0Q2hhbmNlKF90aGlzLnJlcXVlc3QucmVzcG9uc2VVUkwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld0Vscy5mb3JFYWNoKGZ1bmN0aW9uIChuZXdFbGVtZW50LCBpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkRWxlbWVudCA9IG9sZEVsc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBlbFN3aXRjaCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdFbDogbmV3RWxlbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBvbGRFbDogb2xkRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaFF1ZXVlLnB1c2goZWxTd2l0Y2gpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoc3dpdGNoUXVldWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ291bGRuXFwndCBmaW5kIGFueXRoaW5nIHRvIHN3aXRjaCcpO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RDaGFuY2UodGhpcy5yZXF1ZXN0LnJlc3BvbnNlVVJMKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5jdXN0b21UcmFuc2l0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlU3dpdGNoKVxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0b0VsLnRpdGxlO1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVN3aXRjaGVzKHN3aXRjaFF1ZXVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkU3dpdGNoID0ge1xyXG4gICAgICAgICAgICAgICAgcXVldWU6IHN3aXRjaFF1ZXVlLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRvRWwudGl0bGVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubGFzdENoYW5jZSA9IGZ1bmN0aW9uICh1cmkpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU29tZXRoaW5nIHdlbnQgd3JvbmcsIGZhaWxzYWZlIGxvYWRpbmcgXCIgKyB1cmkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVyaTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5zdGF0dXNDaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBzdGF0dXNfMSA9IDIwMDsgc3RhdHVzXzEgPD0gMjA2OyBzdGF0dXNfMSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlLnN0YXR1cyA9PT0gc3RhdHVzXzEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmxvYWRDYWNoZWRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0dXNDaGVjaygpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdENoYW5jZSh0aGlzLmNhY2hlLnVybCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgY29udGFpbnNfMS5kZWZhdWx0KGRvY3VtZW50LCB0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3dpdGNoU2VsZWN0b3JzKHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIHRoaXMuY2FjaGUuaHRtbCwgZG9jdW1lbnQpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnBhcnNlQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcclxuICAgICAgICB2YXIgdGVtcEVsID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCdnbG9iYWxzJyk7XHJcbiAgICAgICAgdmFyIGh0bWxSZWdleCA9IC9cXHM/W2EtejpdKyg/PSg/OlxcJ3xcXFwiKVteXFwnXFxcIj5dKyg/OlxcJ3xcXFwiKSkqL2dpO1xyXG4gICAgICAgIHZhciBtYXRjaGVzID0gcmVzcG9uc2VUZXh0Lm1hdGNoKGh0bWxSZWdleCk7XHJcbiAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wRWw7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuY2FjaGVDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCwgcmVzcG9uc2VTdGF0dXMsIHVyaSkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSB0aGlzLnBhcnNlQ29udGVudChyZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGlmICh0ZW1wRWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wRWwuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTCA9IHJlc3BvbnNlVGV4dDtcclxuICAgICAgICB0aGlzLmNhY2hlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlU3RhdHVzLFxyXG4gICAgICAgICAgICBodG1sOiB0ZW1wRWwsXHJcbiAgICAgICAgICAgIHVybDogdXJpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FjaGVkIENvbnRlbnQ6ICcsIHRoaXMuY2FjaGUpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmxvYWRDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSB0aGlzLnBhcnNlQ29udGVudChyZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGlmICh0ZW1wRWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0Q2hhbmNlKHRoaXMucmVxdWVzdC5yZXNwb25zZVVSTCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcEVsLmRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwgPSByZXNwb25zZVRleHQ7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgY29udGFpbnNfMS5kZWZhdWx0KGRvY3VtZW50LCB0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3dpdGNoU2VsZWN0b3JzKHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIHRlbXBFbCwgZG9jdW1lbnQpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24gKGUsIGxvYWRUeXBlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1hNTCBIdHRwIFJlcXVlc3QgU3RhdHVzOiAnLCB0aGlzLnJlcXVlc3Quc3RhdHVzKTtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHRoaXMucmVxdWVzdDtcclxuICAgICAgICBpZiAocmVxdWVzdC5yZXNwb25zZVRleHQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGxvYWRUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3ByZWZldGNoJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maXJtZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZUNvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQsIHJlcXVlc3Quc3RhdHVzLCByZXF1ZXN0LnJlc3BvbnNlVVJMKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdwb3BzdGF0ZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JlbG9hZCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuZG9SZXF1ZXN0ID0gZnVuY3Rpb24gKGhyZWYpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZXFldXN0TWV0aG9kID0gJ0dFVCc7XHJcbiAgICAgICAgdmFyIHRpbWVvdXQgPSB0aGlzLm9wdGlvbnMudGltZW91dCB8fCAwO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgdmFyIHVyaSA9IGhyZWY7XHJcbiAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gaHJlZi5zcGxpdCgnPycpWzFdO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FjaGVCdXN0KVxyXG4gICAgICAgICAgICB1cmkgKz0gKHF1ZXJ5U3RyaW5nID09PSB1bmRlZmluZWQpID8gKFwiP2NiPVwiICsgRGF0ZS5ub3coKSkgOiAoXCImY2I9XCIgKyBEYXRlLm5vdygpKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4ocmVxZXVzdE1ldGhvZCwgdXJpLCB0cnVlKTtcclxuICAgICAgICAgICAgcmVxdWVzdC50aW1lb3V0ID0gdGltZW91dDtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1QSkFYJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVBKQVgtU2VsZWN0b3JzJywgSlNPTi5zdHJpbmdpZnkoX3RoaXMub3B0aW9ucy5zZWxlY3RvcnMpKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSByZWplY3Q7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQcmVmZXRjaCA9IGZ1bmN0aW9uIChocmVmKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5jb25maXJtZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQcmVmZXRjaGluZzogJywgaHJlZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KCk7XHJcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpwcmVmZXRjaCddKTtcclxuICAgICAgICB0aGlzLmRvUmVxdWVzdChocmVmKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkgeyBfdGhpcy5oYW5kbGVSZXNwb25zZShlLCAncHJlZmV0Y2gnKTsgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVMb2FkID0gZnVuY3Rpb24gKGhyZWYsIGxvYWRUeXBlLCBlbCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKGVsID09PSB2b2lkIDApIHsgZWwgPSBudWxsOyB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlybWVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpzZW5kJ10sIGVsKTtcclxuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIENhY2hlZDogJywgaHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZENhY2hlZENvbnRlbnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5yZXF1ZXN0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBQcmVmZXRjaDogJywgaHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlybWVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZzogJywgaHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMuZG9SZXF1ZXN0KGhyZWYpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkgeyBfdGhpcy5oYW5kbGVSZXNwb25zZShlLCBsb2FkVHlwZSk7IH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYSFIgUmVxdWVzdCBFcnJvcjogJywgZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5jbGVhclByZWZldGNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25maXJtZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6Y2FuY2VsJ10pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gUGpheDtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUGpheDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGpheC5qcy5tYXAiXX0=
