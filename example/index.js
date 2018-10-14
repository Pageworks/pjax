(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Pjax = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var on_1 = require("./on");
var isDefaultPrevented = function (el, e) {
    var isPrevented = false;
    if (e.defaultPrevented)
        isPrevented = true;
    else if (el.getAttribute('prevent-default') !== null)
        isPrevented = true;
    else if (el.classList.contains('no-transition'))
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
        el.setAttribute(pjax.options.attrState, attrValue);
        return;
    }
    e.preventDefault();
    if (el.href === window.location.href.split('#')[0])
        el.setAttribute(pjax.options.attrState, 'reload');
    else
        el.setAttribute(pjax.options.attrState, 'load');
    pjax.handleLoad(el.href, el.getAttribute(pjax.options.attrState));
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
        el.setAttribute(pjax.options.attrState, attrValue);
        return;
    }
    if (el.href !== window.location.href.split('#')[0])
        el.setAttribute(pjax.options.attrState, 'prefetch');
    else
        return;
    pjax.handlePrefetch(el.href, eventOptions);
};
exports.default = (function (el, pjax) {
    el.setAttribute(pjax.options.attrState, '');
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
exports.default = (function (el, events) {
    events.forEach(function (e) {
        var event = new Event(e);
        el.dispatchEvent(event);
    });
});

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (options) {
    if (options === void 0) { options = null; }
    var parsedOptions = (options !== null) ? options : {};
    parsedOptions.elements = (options !== null && options.elements !== undefined) ? options.elements : 'a[href]';
    parsedOptions.selectors = (options !== null && options.selectors !== undefined) ? options.selectors : ['title', '.js-pjax'];
    parsedOptions.switches = (options !== null && options.switches !== undefined) ? options.switches : {};
    parsedOptions.history = (options !== null && options.history !== undefined) ? options.history : true;
    parsedOptions.scrollTo = (options !== null && options.scrollTo !== undefined) ? options.scrollTo : 0;
    parsedOptions.cacheBust = (options !== null && options.cacheBust !== undefined) ? options.cacheBust : false;
    parsedOptions.debug = (options !== null && options.debug !== undefined) ? options.debug : false;
    parsedOptions.timeout = (options !== null && options.timeout !== undefined) ? options.timeout : 0;
    parsedOptions.attrState = (options !== null && options.attrState !== undefined) ? options.attrState : 'data-pjax-state';
    parsedOptions.titleSwitch = (options !== null && options.titleSwitch !== undefined) ? options.titleSwitch : true;
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
        if (this.options.debug)
            console.log('Pjax Options:', this.options);
        this.init();
    }
    Pjax.prototype.init = function () {
        var _this = this;
        window.addEventListener('popstate', function (e) { return _this.handlePopstate(e); });
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
        trigger_1.default(document, ['pjax:complete', 'pjax:success']);
    };
    Pjax.prototype.handleSwitches = function (switchQueue) {
        var _this = this;
        switchQueue.map(function (switchObj) {
            switchObj.oldEl.innerHTML = switchObj.newEl.innerHTML;
            _this.parseDOM(switchObj.oldEl);
        });
        this.finalize();
    };
    Pjax.prototype.switchSelectors = function (selectors, toEl, fromEl) {
        var _this = this;
        var switchQueue = [];
        selectors.forEach(function (selector) {
            var newEls = toEl.querySelectorAll(selector);
            var oldEls = fromEl.querySelectorAll(selector);
            if (_this.options.debug)
                console.log('Pjax Switch: ', selector, newEls, oldEls);
            if (newEls.length !== oldEls.length) {
                if (_this.options.debug)
                    console.log('DOM doesn\'t look the same on the new page');
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
        if (this.options.titleSwitch)
            document.title = toEl.title;
        this.handleSwitches(switchQueue);
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
        var requestOptions = this.options.requestOptions || {};
        var reqeustMethod = (requestOptions.requestMethod || 'GET').toUpperCase();
        var requestParams = requestOptions.requestParams || null;
        var timeout = this.options.timeout || 0;
        var request = new XMLHttpRequest();
        var requestPayload = null;
        var queryString;
        var final = href;
        if (requestParams && requestParams.length) {
            queryString = (requestParams.map(function (param) { return "" + (param.name, '=', param.value); })).join('&');
            switch (reqeustMethod) {
                case 'GET':
                    final = href.split('?')[0];
                    final += '?';
                    final += queryString;
                    break;
                case 'POST':
                    requestPayload = queryString;
                    break;
            }
        }
        if (this.options.cacheBust)
            final += (queryString.length) ? ("&t=" + Date.now()) : ("t=" + Date.now());
        return new Promise(function (resolve, reject) {
            request.open(reqeustMethod, final, true);
            request.timeout = timeout;
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.setRequestHeader('X-PJAX', 'true');
            request.setRequestHeader('X-PJAX-Selectors', JSON.stringify(_this.options.selectors));
            request.onload = resolve;
            request.onerror = reject;
            request.send(requestPayload);
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
    Pjax.prototype.handleLoad = function (href, loadType) {
        var _this = this;
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
            trigger_1.default(document, ['pjax:send']);
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
module.exports = Pjax;

},{"./lib/events/link-events":1,"./lib/events/trigger":3,"./lib/parse-options":4,"./lib/util/check-element":5,"./lib/util/contains":6,"./lib/uuid":7}]},{},[8])(8)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIG9uXzEgPSByZXF1aXJlKFwiLi9vblwiKTtcclxudmFyIGlzRGVmYXVsdFByZXZlbnRlZCA9IGZ1bmN0aW9uIChlbCwgZSkge1xyXG4gICAgdmFyIGlzUHJldmVudGVkID0gZmFsc2U7XHJcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKVxyXG4gICAgICAgIGlzUHJldmVudGVkID0gdHJ1ZTtcclxuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgncHJldmVudC1kZWZhdWx0JykgIT09IG51bGwpXHJcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xyXG4gICAgZWxzZSBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCduby10cmFuc2l0aW9uJykpXHJcbiAgICAgICAgaXNQcmV2ZW50ZWQgPSB0cnVlO1xyXG4gICAgcmV0dXJuIGlzUHJldmVudGVkO1xyXG59O1xyXG52YXIgY2hlY2tGb3JBYm9ydCA9IGZ1bmN0aW9uIChlbCwgZSkge1xyXG4gICAgaWYgKGVsLnByb3RvY29sICE9PSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfHwgZWwuaG9zdCAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3QpXHJcbiAgICAgICAgcmV0dXJuICdleHRlcm5hbCc7XHJcbiAgICBpZiAoZWwuaGFzaCAmJiBlbC5ocmVmLnJlcGxhY2UoZWwuaGFzaCwgJycpID09PSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKGxvY2F0aW9uLmhhc2gsICcnKSlcclxuICAgICAgICByZXR1cm4gJ2FuY2hvcic7XHJcbiAgICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSArIFwiLCAnIydcIilcclxuICAgICAgICByZXR1cm4gJ2FuY2hvci1lbXB0eSc7XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxudmFyIGhhbmRsZUNsaWNrID0gZnVuY3Rpb24gKGVsLCBlLCBwamF4KSB7XHJcbiAgICBpZiAoaXNEZWZhdWx0UHJldmVudGVkKGVsLCBlKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgZXZlbnRPcHRpb25zID0ge1xyXG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxyXG4gICAgfTtcclxuICAgIHZhciBhdHRyVmFsdWUgPSBjaGVja0ZvckFib3J0KGVsLCBlKTtcclxuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSlcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJ3JlbG9hZCcpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlLCAnbG9hZCcpO1xyXG4gICAgcGpheC5oYW5kbGVMb2FkKGVsLmhyZWYsIGVsLmdldEF0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlKSk7XHJcbn07XHJcbnZhciBoYW5kbGVIb3ZlciA9IGZ1bmN0aW9uIChlbCwgZSwgcGpheCkge1xyXG4gICAgaWYgKGlzRGVmYXVsdFByZXZlbnRlZChlbCwgZSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgaWYgKGUudHlwZSA9PT0gJ21vdXNlb3V0Jykge1xyXG4gICAgICAgIHBqYXguY2xlYXJQcmVmZXRjaCgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciBldmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgdHJpZ2dlckVsZW1lbnQ6IGVsXHJcbiAgICB9O1xyXG4gICAgdmFyIGF0dHJWYWx1ZSA9IGNoZWNrRm9yQWJvcnQoZWwsIGUpO1xyXG4gICAgaWYgKGF0dHJWYWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlLCBhdHRyVmFsdWUpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChlbC5ocmVmICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdKVxyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlLCAncHJlZmV0Y2gnKTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm47XHJcbiAgICBwamF4LmhhbmRsZVByZWZldGNoKGVsLmhyZWYsIGV2ZW50T3B0aW9ucyk7XHJcbn07XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIHBqYXgpIHtcclxuICAgIGVsLnNldEF0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlLCAnJyk7XHJcbiAgICBvbl8xLmRlZmF1bHQoZWwsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7IGhhbmRsZUNsaWNrKGVsLCBlLCBwamF4KTsgfSk7XHJcbiAgICBvbl8xLmRlZmF1bHQoZWwsICdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVIb3ZlcihlbCwgZSwgcGpheCk7IH0pO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnbW91c2VvdXQnLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVIb3ZlcihlbCwgZSwgcGpheCk7IH0pO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChlLmtleSA9PT0gJ2VudGVyJyB8fCBlLmtleUNvZGUgPT09IDEzKVxyXG4gICAgICAgICAgICBoYW5kbGVDbGljayhlbCwgZSwgcGpheCk7XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmstZXZlbnRzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIGV2ZW50LCBsaXN0ZW5lcikge1xyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgZXZlbnRzKSB7XHJcbiAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBldmVudCA9IG5ldyBFdmVudChlKTtcclxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH0pO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJpZ2dlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IG51bGw7IH1cclxuICAgIHZhciBwYXJzZWRPcHRpb25zID0gKG9wdGlvbnMgIT09IG51bGwpID8gb3B0aW9ucyA6IHt9O1xyXG4gICAgcGFyc2VkT3B0aW9ucy5lbGVtZW50cyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuZWxlbWVudHMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmVsZW1lbnRzIDogJ2FbaHJlZl0nO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5zZWxlY3RvcnMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnNlbGVjdG9ycyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuc2VsZWN0b3JzIDogWyd0aXRsZScsICcuanMtcGpheCddO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5zd2l0Y2hlcyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuc3dpdGNoZXMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnN3aXRjaGVzIDoge307XHJcbiAgICBwYXJzZWRPcHRpb25zLmhpc3RvcnkgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmhpc3RvcnkgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmhpc3RvcnkgOiB0cnVlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5zY3JvbGxUbyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuc2Nyb2xsVG8gIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnNjcm9sbFRvIDogMDtcclxuICAgIHBhcnNlZE9wdGlvbnMuY2FjaGVCdXN0ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5jYWNoZUJ1c3QgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmNhY2hlQnVzdCA6IGZhbHNlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5kZWJ1ZyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuZGVidWcgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmRlYnVnIDogZmFsc2U7XHJcbiAgICBwYXJzZWRPcHRpb25zLnRpbWVvdXQgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnRpbWVvdXQgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnRpbWVvdXQgOiAwO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5hdHRyU3RhdGUgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmF0dHJTdGF0ZSAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuYXR0clN0YXRlIDogJ2RhdGEtcGpheC1zdGF0ZSc7XHJcbiAgICBwYXJzZWRPcHRpb25zLnRpdGxlU3dpdGNoID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy50aXRsZVN3aXRjaCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMudGl0bGVTd2l0Y2ggOiB0cnVlO1xyXG4gICAgcmV0dXJuIHBhcnNlZE9wdGlvbnM7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1vcHRpb25zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIHBqYXgpIHtcclxuICAgIHN3aXRjaCAoZWwudGFnTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgY2FzZSAnYSc6XHJcbiAgICAgICAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUpKVxyXG4gICAgICAgICAgICAgICAgcGpheC5zZXRMaW5rTGlzdGVuZXJzKGVsKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgJ1BqYXggY2FuIG9ubHkgYmUgYXBwbGllZCBvbiA8YT4gZWxlbWVudHMnO1xyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2hlY2stZWxlbWVudC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGRvYywgc2VsZWN0b3JzLCBlbGVtZW50KSB7XHJcbiAgICBzZWxlY3RvcnMubWFwKGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBzZWxlY3RvckVscyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICBzZWxlY3RvckVscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICBpZiAoZWwuY29udGFpbnMoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBmYWxzZTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnRhaW5zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gRGF0ZS5ub3coKS50b1N0cmluZygpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXVpZC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgcGFyc2Vfb3B0aW9uc18xID0gcmVxdWlyZShcIi4vbGliL3BhcnNlLW9wdGlvbnNcIik7XHJcbnZhciB1dWlkXzEgPSByZXF1aXJlKFwiLi9saWIvdXVpZFwiKTtcclxudmFyIHRyaWdnZXJfMSA9IHJlcXVpcmUoXCIuL2xpYi9ldmVudHMvdHJpZ2dlclwiKTtcclxudmFyIGNvbnRhaW5zXzEgPSByZXF1aXJlKFwiLi9saWIvdXRpbC9jb250YWluc1wiKTtcclxudmFyIGxpbmtfZXZlbnRzXzEgPSByZXF1aXJlKFwiLi9saWIvZXZlbnRzL2xpbmstZXZlbnRzXCIpO1xyXG52YXIgY2hlY2tfZWxlbWVudF8xID0gcmVxdWlyZShcIi4vbGliL3V0aWwvY2hlY2stZWxlbWVudFwiKTtcclxudmFyIFBqYXggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUGpheChvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcclxuICAgICAgICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxyXG4gICAgICAgICAgICBoaXN0b3J5OiB0cnVlLFxyXG4gICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gcGFyc2Vfb3B0aW9uc18xLmRlZmF1bHQob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQamF4IE9wdGlvbnM6JywgdGhpcy5vcHRpb25zKTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuICAgIFBqYXgucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMuaGFuZGxlUG9wc3RhdGUoZSk7IH0pO1xyXG4gICAgICAgIHRoaXMucGFyc2VET00oZG9jdW1lbnQuYm9keSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUmVsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5zZXRMaW5rTGlzdGVuZXJzID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgbGlua19ldmVudHNfMS5kZWZhdWx0KGVsLCB0aGlzKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5lbGVtZW50cyk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUucGFyc2VET00gPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbGVtZW50cyA9IHRoaXMuZ2V0RWxlbWVudHMoZWwpO1xyXG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIGNoZWNrX2VsZW1lbnRfMS5kZWZhdWx0KGVsLCBfdGhpcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUG9wc3RhdGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChlLnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSGlqYWNraW5nIFBvcHN0YXRlIEV2ZW50Jyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFVybChlLnN0YXRlLnVybCwgJ3BvcHN0YXRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmFib3J0UmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0ID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkVXJsID0gZnVuY3Rpb24gKGhyZWYsIGxvYWRUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxvYWQoaHJlZiwgbG9hZFR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQdXNoU3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IHt9KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmhpc3RvcnkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1B1c2hpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnN0YXRlLnRpdGxlLCB0aGlzLnN0YXRlLnVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXBsYWNpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgICAgICAgICB9LCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlU2Nyb2xsUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGlzdG9yeSkge1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgdGVtcC5ocmVmID0gdGhpcy5zdGF0ZS51cmw7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wLmhhc2gpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lXzEgPSB0ZW1wLmhhc2guc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICBuYW1lXzEgPSBkZWNvZGVVUklDb21wb25lbnQobmFtZV8xKTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyVG9wID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lXzEpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKG5hbWVfMSlbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5vZmZzZXRQYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclRvcCArPSB0YXJnZXQub2Zmc2V0VG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lm9mZnNldFBhcmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAodGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgY3VyclRvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHRoaXMub3B0aW9ucy5zY3JvbGxUbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsUG9zKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh0aGlzLnN0YXRlLnNjcm9sbFBvc1swXSwgdGhpcy5zdGF0ZS5zY3JvbGxQb3NbMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmluaXNoaW5nIFBqYXgnKTtcclxuICAgICAgICB0aGlzLnN0YXRlLnVybCA9IHRoaXMucmVxdWVzdC5yZXNwb25zZVVSTDtcclxuICAgICAgICB0aGlzLnN0YXRlLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY3JvbGxQb3MgPSBbMCwgd2luZG93LnNjcm9sbFldO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUHVzaFN0YXRlKCk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTY3JvbGxQb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gZmFsc2U7XHJcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpjb21wbGV0ZScsICdwamF4OnN1Y2Nlc3MnXSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlU3dpdGNoZXMgPSBmdW5jdGlvbiAoc3dpdGNoUXVldWUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHN3aXRjaFF1ZXVlLm1hcChmdW5jdGlvbiAoc3dpdGNoT2JqKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaE9iai5vbGRFbC5pbm5lckhUTUwgPSBzd2l0Y2hPYmoubmV3RWwuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICBfdGhpcy5wYXJzZURPTShzd2l0Y2hPYmoub2xkRWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmluYWxpemUoKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5zd2l0Y2hTZWxlY3RvcnMgPSBmdW5jdGlvbiAoc2VsZWN0b3JzLCB0b0VsLCBmcm9tRWwpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzd2l0Y2hRdWV1ZSA9IFtdO1xyXG4gICAgICAgIHNlbGVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICB2YXIgbmV3RWxzID0gdG9FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgdmFyIG9sZEVscyA9IGZyb21FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUGpheCBTd2l0Y2g6ICcsIHNlbGVjdG9yLCBuZXdFbHMsIG9sZEVscyk7XHJcbiAgICAgICAgICAgIGlmIChuZXdFbHMubGVuZ3RoICE9PSBvbGRFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRE9NIGRvZXNuXFwndCBsb29rIHRoZSBzYW1lIG9uIHRoZSBuZXcgcGFnZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld0Vscy5mb3JFYWNoKGZ1bmN0aW9uIChuZXdFbGVtZW50LCBpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkRWxlbWVudCA9IG9sZEVsc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBlbFN3aXRjaCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdFbDogbmV3RWxlbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBvbGRFbDogb2xkRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaFF1ZXVlLnB1c2goZWxTd2l0Y2gpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoc3dpdGNoUXVldWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ291bGRuXFwndCBmaW5kIGFueXRoaW5nIHRvIHN3aXRjaCcpO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RDaGFuY2UodGhpcy5yZXF1ZXN0LnJlc3BvbnNlVVJMKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlU3dpdGNoKVxyXG4gICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRvRWwudGl0bGU7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hlcyhzd2l0Y2hRdWV1ZSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubGFzdENoYW5jZSA9IGZ1bmN0aW9uICh1cmkpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FjaGVkIGNvbnRlbnQgaGFzIGEgcmVzcG9uc2Ugb2YgJywgdGhpcy5jYWNoZS5zdGF0dXMsICcgYnV0IHdlIHJlcXVpcmUgYSBzdWNjZXNzIHJlc3BvbnNlLCBmYWxsYmFjayBsb2FkaW5nIHVyaSAnLCB1cmkpO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnN0YXR1c0NoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZvciAodmFyIHN0YXR1c18xID0gMjAwOyBzdGF0dXNfMSA8PSAyMDY7IHN0YXR1c18xKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGUuc3RhdHVzID09PSBzdGF0dXNfMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubG9hZENhY2hlZENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXR1c0NoZWNrKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0Q2hhbmNlKHRoaXMuY2FjaGUudXJsKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBjb250YWluc18xLmRlZmF1bHQoZG9jdW1lbnQsIHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zd2l0Y2hTZWxlY3RvcnModGhpcy5vcHRpb25zLnNlbGVjdG9ycywgdGhpcy5jYWNoZS5odG1sLCBkb2N1bWVudCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUucGFyc2VDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJ2dsb2JhbHMnKTtcclxuICAgICAgICB2YXIgaHRtbFJlZ2V4ID0gL1xccz9bYS16Ol0rKD89KD86XFwnfFxcXCIpW15cXCdcXFwiPl0rKD86XFwnfFxcXCIpKSovZ2k7XHJcbiAgICAgICAgdmFyIG1hdGNoZXMgPSByZXNwb25zZVRleHQubWF0Y2goaHRtbFJlZ2V4KTtcclxuICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRlbXBFbDtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5jYWNoZUNvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0LCByZXNwb25zZVN0YXR1cywgdXJpKSB7XHJcbiAgICAgICAgdmFyIHRlbXBFbCA9IHRoaXMucGFyc2VDb250ZW50KHJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgaWYgKHRlbXBFbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBFbC5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MID0gcmVzcG9uc2VUZXh0O1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2VTdGF0dXMsXHJcbiAgICAgICAgICAgIGh0bWw6IHRlbXBFbCxcclxuICAgICAgICAgICAgdXJsOiB1cmlcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYWNoZWQgQ29udGVudDogJywgdGhpcy5jYWNoZSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubG9hZENvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0KSB7XHJcbiAgICAgICAgdmFyIHRlbXBFbCA9IHRoaXMucGFyc2VDb250ZW50KHJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgaWYgKHRlbXBFbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RDaGFuY2UodGhpcy5yZXF1ZXN0LnJlc3BvbnNlVVJMKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wRWwuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTCA9IHJlc3BvbnNlVGV4dDtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBjb250YWluc18xLmRlZmF1bHQoZG9jdW1lbnQsIHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zd2l0Y2hTZWxlY3RvcnModGhpcy5vcHRpb25zLnNlbGVjdG9ycywgdGVtcEVsLCBkb2N1bWVudCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbiAoZSwgbG9hZFR5cGUpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnWE1MIEh0dHAgUmVxdWVzdCBTdGF0dXM6ICcsIHRoaXMucmVxdWVzdC5zdGF0dXMpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0O1xyXG4gICAgICAgIGlmIChyZXF1ZXN0LnJlc3BvbnNlVGV4dCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAobG9hZFR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAncHJlZmV0Y2gnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpcm1lZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCwgcmVxdWVzdC5zdGF0dXMsIHJlcXVlc3QucmVzcG9uc2VVUkwpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3BvcHN0YXRlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmVsb2FkJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5kb1JlcXVlc3QgPSBmdW5jdGlvbiAoaHJlZikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RPcHRpb25zID0gdGhpcy5vcHRpb25zLnJlcXVlc3RPcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHZhciByZXFldXN0TWV0aG9kID0gKHJlcXVlc3RPcHRpb25zLnJlcXVlc3RNZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RQYXJhbXMgPSByZXF1ZXN0T3B0aW9ucy5yZXF1ZXN0UGFyYW1zIHx8IG51bGw7XHJcbiAgICAgICAgdmFyIHRpbWVvdXQgPSB0aGlzLm9wdGlvbnMudGltZW91dCB8fCAwO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RQYXlsb2FkID0gbnVsbDtcclxuICAgICAgICB2YXIgcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgdmFyIGZpbmFsID0gaHJlZjtcclxuICAgICAgICBpZiAocmVxdWVzdFBhcmFtcyAmJiByZXF1ZXN0UGFyYW1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBxdWVyeVN0cmluZyA9IChyZXF1ZXN0UGFyYW1zLm1hcChmdW5jdGlvbiAocGFyYW0pIHsgcmV0dXJuIFwiXCIgKyAocGFyYW0ubmFtZSwgJz0nLCBwYXJhbS52YWx1ZSk7IH0pKS5qb2luKCcmJyk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocmVxZXVzdE1ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnR0VUJzpcclxuICAgICAgICAgICAgICAgICAgICBmaW5hbCA9IGhyZWYuc3BsaXQoJz8nKVswXTtcclxuICAgICAgICAgICAgICAgICAgICBmaW5hbCArPSAnPyc7XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWwgKz0gcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdQT1NUJzpcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0UGF5bG9hZCA9IHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FjaGVCdXN0KVxyXG4gICAgICAgICAgICBmaW5hbCArPSAocXVlcnlTdHJpbmcubGVuZ3RoKSA/IChcIiZ0PVwiICsgRGF0ZS5ub3coKSkgOiAoXCJ0PVwiICsgRGF0ZS5ub3coKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKHJlcWV1c3RNZXRob2QsIGZpbmFsLCB0cnVlKTtcclxuICAgICAgICAgICAgcmVxdWVzdC50aW1lb3V0ID0gdGltZW91dDtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1QSkFYJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVBKQVgtU2VsZWN0b3JzJywgSlNPTi5zdHJpbmdpZnkoX3RoaXMub3B0aW9ucy5zZWxlY3RvcnMpKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSByZWplY3Q7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0UGF5bG9hZCk7XHJcbiAgICAgICAgICAgIF90aGlzLnJlcXVlc3QgPSByZXF1ZXN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVByZWZldGNoID0gZnVuY3Rpb24gKGhyZWYpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQcmVmZXRjaGluZzogJywgaHJlZik7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OnByZWZldGNoJ10pO1xyXG4gICAgICAgIHRoaXMuZG9SZXF1ZXN0KGhyZWYpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsICdwcmVmZXRjaCcpOyB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWEhSIFJlcXVlc3QgRXJyb3I6ICcsIGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZUxvYWQgPSBmdW5jdGlvbiAoaHJlZiwgbG9hZFR5cGUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBDYWNoZWQ6ICcsIGhyZWYpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRDYWNoZWRDb250ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMucmVxdWVzdCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgUHJlZmV0Y2g6ICcsIGhyZWYpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmc6ICcsIGhyZWYpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OnNlbmQnXSk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9SZXF1ZXN0KGhyZWYpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkgeyBfdGhpcy5oYW5kbGVSZXNwb25zZShlLCBsb2FkVHlwZSk7IH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYSFIgUmVxdWVzdCBFcnJvcjogJywgZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5jbGVhclByZWZldGNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmNhbmNlbCddKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGpheDtcclxufSgpKTtcclxubW9kdWxlLmV4cG9ydHMgPSBQamF4O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wamF4LmpzLm1hcCJdfQ==
