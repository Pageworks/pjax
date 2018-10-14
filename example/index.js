(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Pjax = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var on_1 = require("./on");
var isDefaultPrevented = function (el, e) {
    if (e.defaultPrevented)
        return true;
    else if (el.getAttribute('prevent-default') !== null)
        return true;
    else if (el.classList.contains('no-transition'))
        return true;
    else
        return false;
};
var checkForAbort = function (el, e) {
    if (el.protocol !== window.location.protocol || el.host !== window.location.host)
        return 'external';
    if (el.hash && el.href.replace(el.hash, '') === window.location.href.replace(location.hash, ''))
        return 'anchor';
    if (el.href === window.location.href.split('#')[0] + '#')
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
            newEls.forEach(function (newEl, i) {
                var oldEl = oldEls[i];
                var elSwitch = {
                    newEl: newEl,
                    oldEl: oldEl
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
        else {
            if (this.options.titleSwitch)
                document.title = toEl.title;
            this.handleSwitches(switchQueue);
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
    Pjax.prototype.cacheContent = function (responseText, status, uri) {
        var tempEl = this.parseContent(responseText);
        if (tempEl === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        tempEl.documentElement.innerHTML = responseText;
        this.cache = {
            status: status,
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
        if (requestParams && requestParams.length) {
            queryString = (requestParams.map(function (param) { return param.name + '=' + param.value; })).join('&');
            switch (reqeustMethod) {
                case 'GET':
                    href = href.split('?')[0];
                    href += '?';
                    href += queryString;
                    break;
                case 'POST':
                    requestPayload = queryString;
                    break;
            }
        }
        if (this.options.cacheBust)
            href += (queryString.length) ? ('&t=' + Date.now()) : ('t=' + Date.now());
        return new Promise(function (resolve, reject) {
            request.open(reqeustMethod, href, true);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgb25fMSA9IHJlcXVpcmUoXCIuL29uXCIpO1xyXG52YXIgaXNEZWZhdWx0UHJldmVudGVkID0gZnVuY3Rpb24gKGVsLCBlKSB7XHJcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZWxzZSBpZiAoZWwuZ2V0QXR0cmlidXRlKCdwcmV2ZW50LWRlZmF1bHQnKSAhPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucygnbm8tdHJhbnNpdGlvbicpKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxufTtcclxudmFyIGNoZWNrRm9yQWJvcnQgPSBmdW5jdGlvbiAoZWwsIGUpIHtcclxuICAgIGlmIChlbC5wcm90b2NvbCAhPT0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIHx8IGVsLmhvc3QgIT09IHdpbmRvdy5sb2NhdGlvbi5ob3N0KVxyXG4gICAgICAgIHJldHVybiAnZXh0ZXJuYWwnO1xyXG4gICAgaWYgKGVsLmhhc2ggJiYgZWwuaHJlZi5yZXBsYWNlKGVsLmhhc2gsICcnKSA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShsb2NhdGlvbi5oYXNoLCAnJykpXHJcbiAgICAgICAgcmV0dXJuICdhbmNob3InO1xyXG4gICAgaWYgKGVsLmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0gKyAnIycpXHJcbiAgICAgICAgcmV0dXJuICdhbmNob3ItZW1wdHknO1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbnZhciBoYW5kbGVDbGljayA9IGZ1bmN0aW9uIChlbCwgZSwgcGpheCkge1xyXG4gICAgaWYgKGlzRGVmYXVsdFByZXZlbnRlZChlbCwgZSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgdmFyIGV2ZW50T3B0aW9ucyA9IHtcclxuICAgICAgICB0cmlnZ2VyRWxlbWVudDogZWxcclxuICAgIH07XHJcbiAgICB2YXIgYXR0clZhbHVlID0gY2hlY2tGb3JBYm9ydChlbCwgZSk7XHJcbiAgICBpZiAoYXR0clZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUsIGF0dHJWYWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKGVsLmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0pXHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUsICdyZWxvYWQnKTtcclxuICAgIGVsc2VcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJ2xvYWQnKTtcclxuICAgIHBqYXguaGFuZGxlTG9hZChlbC5ocmVmLCBlbC5nZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSkpO1xyXG59O1xyXG52YXIgaGFuZGxlSG92ZXIgPSBmdW5jdGlvbiAoZWwsIGUsIHBqYXgpIHtcclxuICAgIGlmIChpc0RlZmF1bHRQcmV2ZW50ZWQoZWwsIGUpKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZW91dCcpIHtcclxuICAgICAgICBwamF4LmNsZWFyUHJlZmV0Y2goKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgZXZlbnRPcHRpb25zID0ge1xyXG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxyXG4gICAgfTtcclxuICAgIHZhciBhdHRyVmFsdWUgPSBjaGVja0ZvckFib3J0KGVsLCBlKTtcclxuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoZWwuaHJlZiAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSlcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJ3ByZWZldGNoJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgcGpheC5oYW5kbGVQcmVmZXRjaChlbC5ocmVmLCBldmVudE9wdGlvbnMpO1xyXG59O1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBwamF4KSB7XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJycpO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVDbGljayhlbCwgZSwgcGpheCk7IH0pO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUsIHBqYXgpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlb3V0JywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUsIHBqYXgpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5rZXkgPT09ICdlbnRlcicgfHwgZS5rZXlDb2RlID09PSAxMylcclxuICAgICAgICAgICAgaGFuZGxlQ2xpY2soZWwsIGUsIHBqYXgpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5rLWV2ZW50cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBldmVudCwgbGlzdGVuZXIpIHtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIGV2ZW50cykge1xyXG4gICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoZSk7XHJcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyaWdnZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSBudWxsOyB9XHJcbiAgICB2YXIgcGFyc2VkT3B0aW9ucyA9IChvcHRpb25zICE9PSBudWxsKSA/IG9wdGlvbnMgOiB7fTtcclxuICAgIHBhcnNlZE9wdGlvbnMuZWxlbWVudHMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmVsZW1lbnRzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5lbGVtZW50cyA6ICdhW2hyZWZdJztcclxuICAgIHBhcnNlZE9wdGlvbnMuc2VsZWN0b3JzID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zZWxlY3RvcnMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnNlbGVjdG9ycyA6IFsndGl0bGUnLCAnLmpzLXBqYXgnXTtcclxuICAgIHBhcnNlZE9wdGlvbnMuc3dpdGNoZXMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnN3aXRjaGVzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zd2l0Y2hlcyA6IHt9O1xyXG4gICAgcGFyc2VkT3B0aW9ucy5oaXN0b3J5ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5oaXN0b3J5ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5oaXN0b3J5IDogdHJ1ZTtcclxuICAgIHBhcnNlZE9wdGlvbnMuc2Nyb2xsVG8gPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnNjcm9sbFRvICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zY3JvbGxUbyA6IDA7XHJcbiAgICBwYXJzZWRPcHRpb25zLmNhY2hlQnVzdCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuY2FjaGVCdXN0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jYWNoZUJ1c3QgOiBmYWxzZTtcclxuICAgIHBhcnNlZE9wdGlvbnMuZGVidWcgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmRlYnVnICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5kZWJ1ZyA6IGZhbHNlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy50aW1lb3V0ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy50aW1lb3V0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy50aW1lb3V0IDogMDtcclxuICAgIHBhcnNlZE9wdGlvbnMuYXR0clN0YXRlID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5hdHRyU3RhdGUgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmF0dHJTdGF0ZSA6ICdkYXRhLXBqYXgtc3RhdGUnO1xyXG4gICAgcGFyc2VkT3B0aW9ucy50aXRsZVN3aXRjaCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMudGl0bGVTd2l0Y2ggIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnRpdGxlU3dpdGNoIDogdHJ1ZTtcclxuICAgIHJldHVybiBwYXJzZWRPcHRpb25zO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2Utb3B0aW9ucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBwamF4KSB7XHJcbiAgICBzd2l0Y2ggKGVsLnRhZ05hbWUudG9Mb2NhbGVMb3dlckNhc2UoKSkge1xyXG4gICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgICBpZiAoIWVsLmhhc0F0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlKSlcclxuICAgICAgICAgICAgICAgIHBqYXguc2V0TGlua0xpc3RlbmVycyhlbCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93ICdQamF4IGNhbiBvbmx5IGJlIGFwcGxpZWQgb24gPGE+IGVsZW1lbnRzJztcclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZWNrLWVsZW1lbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChkb2MsIHNlbGVjdG9ycywgZWxlbWVudCkge1xyXG4gICAgc2VsZWN0b3JzLm1hcChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgc2VsZWN0b3JFbHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgc2VsZWN0b3JFbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgaWYgKGVsLmNvbnRhaW5zKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb250YWlucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV1aWQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHBhcnNlX29wdGlvbnNfMSA9IHJlcXVpcmUoXCIuL2xpYi9wYXJzZS1vcHRpb25zXCIpO1xyXG52YXIgdXVpZF8xID0gcmVxdWlyZShcIi4vbGliL3V1aWRcIik7XHJcbnZhciB0cmlnZ2VyXzEgPSByZXF1aXJlKFwiLi9saWIvZXZlbnRzL3RyaWdnZXJcIik7XHJcbnZhciBjb250YWluc18xID0gcmVxdWlyZShcIi4vbGliL3V0aWwvY29udGFpbnNcIik7XHJcbnZhciBsaW5rX2V2ZW50c18xID0gcmVxdWlyZShcIi4vbGliL2V2ZW50cy9saW5rLWV2ZW50c1wiKTtcclxudmFyIGNoZWNrX2VsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2xpYi91dGlsL2NoZWNrLWVsZW1lbnRcIik7XHJcbnZhciBQamF4ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBqYXgob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcclxuICAgICAgICAgICAgaGlzdG9yeTogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsUG9zOiBbMCwgMF1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHBhcnNlX29wdGlvbnNfMS5kZWZhdWx0KG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMubGFzdFVVSUQgPSB1dWlkXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGpheCBPcHRpb25zOicsIHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbiAgICBQamF4LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIF90aGlzLmhhbmRsZVBvcHN0YXRlKGUpOyB9KTtcclxuICAgICAgICB0aGlzLnBhcnNlRE9NKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuc2V0TGlua0xpc3RlbmVycyA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIGxpbmtfZXZlbnRzXzEuZGVmYXVsdChlbCwgdGhpcyk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuZ2V0RWxlbWVudHMgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMuZWxlbWVudHMpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnBhcnNlRE9NID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgZWxlbWVudHMgPSB0aGlzLmdldEVsZW1lbnRzKGVsKTtcclxuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICBjaGVja19lbGVtZW50XzEuZGVmYXVsdChlbCwgX3RoaXMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVBvcHN0YXRlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0hpamFja2luZyBQb3BzdGF0ZSBFdmVudCcpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRVcmwoZS5zdGF0ZS51cmwsICdwb3BzdGF0ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5hYm9ydFJlcXVlc3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdCA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKTtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubG9hZFVybCA9IGZ1bmN0aW9uIChocmVmLCBsb2FkVHlwZSkge1xyXG4gICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVMb2FkKGhyZWYsIGxvYWRUeXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZENhY2hlZENvbnRlbnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUHVzaFN0YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSB7fSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQdXNoaW5nIEhpc3RvcnkgU3RhdGU6ICcsIHRoaXMuc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5zdGF0ZS51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuc3RhdGUudGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogdGhpcy5sYXN0VVVJRCxcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zdGF0ZS50aXRsZSwgdGhpcy5zdGF0ZS51cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVwbGFjaW5nIEhpc3RvcnkgU3RhdGU6ICcsIHRoaXMuc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5zdGF0ZS51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuc3RhdGUudGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogdGhpcy5sYXN0VVVJRCxcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxyXG4gICAgICAgICAgICAgICAgfSwgZG9jdW1lbnQudGl0bGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVNjcm9sbFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmhpc3RvcnkpIHtcclxuICAgICAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIHRlbXAuaHJlZiA9IHRoaXMuc3RhdGUudXJsO1xyXG4gICAgICAgICAgICBpZiAodGVtcC5oYXNoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZV8xID0gdGVtcC5oYXNoLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgbmFtZV8xID0gZGVjb2RlVVJJQ29tcG9uZW50KG5hbWVfMSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclRvcCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZV8xKSB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShuYW1lXzEpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQub2Zmc2V0UGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJUb3AgKz0gdGFyZ2V0Lm9mZnNldFRvcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5vZmZzZXRQYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGN1cnJUb3ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCB0aGlzLm9wdGlvbnMuc2Nyb2xsVG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbFBvcykge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8odGhpcy5zdGF0ZS5zY3JvbGxQb3NbMF0sIHRoaXMuc3RhdGUuc2Nyb2xsUG9zWzFdKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZpbmlzaGluZyBQamF4Jyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS51cmwgPSB0aGlzLnJlcXVlc3QucmVzcG9uc2VVUkw7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS50aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2Nyb2xsUG9zID0gWzAsIHdpbmRvdy5zY3JvbGxZXTtcclxuICAgICAgICB0aGlzLmhhbmRsZVB1c2hTdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU2Nyb2xsUG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge307XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6Y29tcGxldGUnLCAncGpheDpzdWNjZXNzJ10pO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVN3aXRjaGVzID0gZnVuY3Rpb24gKHN3aXRjaFF1ZXVlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBzd2l0Y2hRdWV1ZS5tYXAoZnVuY3Rpb24gKHN3aXRjaE9iaikge1xyXG4gICAgICAgICAgICBzd2l0Y2hPYmoub2xkRWwuaW5uZXJIVE1MID0gc3dpdGNoT2JqLm5ld0VsLmlubmVySFRNTDtcclxuICAgICAgICAgICAgX3RoaXMucGFyc2VET00oc3dpdGNoT2JqLm9sZEVsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpbmFsaXplKCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuc3dpdGNoU2VsZWN0b3JzID0gZnVuY3Rpb24gKHNlbGVjdG9ycywgdG9FbCwgZnJvbUVsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgc3dpdGNoUXVldWUgPSBbXTtcclxuICAgICAgICBzZWxlY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIG5ld0VscyA9IHRvRWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIHZhciBvbGRFbHMgPSBmcm9tRWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BqYXggU3dpdGNoOiAnLCBzZWxlY3RvciwgbmV3RWxzLCBvbGRFbHMpO1xyXG4gICAgICAgICAgICBpZiAobmV3RWxzLmxlbmd0aCAhPT0gb2xkRWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RPTSBkb2VzblxcJ3QgbG9vayB0aGUgc2FtZSBvbiB0aGUgbmV3IHBhZ2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdFbHMuZm9yRWFjaChmdW5jdGlvbiAobmV3RWwsIGkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRFbCA9IG9sZEVsc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBlbFN3aXRjaCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdFbDogbmV3RWwsXHJcbiAgICAgICAgICAgICAgICAgICAgb2xkRWw6IG9sZEVsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoUXVldWUucHVzaChlbFN3aXRjaCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzd2l0Y2hRdWV1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZG5cXCd0IGZpbmQgYW55dGhpbmcgdG8gc3dpdGNoJyk7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdENoYW5jZSh0aGlzLnJlcXVlc3QucmVzcG9uc2VVUkwpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlU3dpdGNoKVxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0b0VsLnRpdGxlO1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVN3aXRjaGVzKHN3aXRjaFF1ZXVlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubGFzdENoYW5jZSA9IGZ1bmN0aW9uICh1cmkpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FjaGVkIGNvbnRlbnQgaGFzIGEgcmVzcG9uc2Ugb2YgJywgdGhpcy5jYWNoZS5zdGF0dXMsICcgYnV0IHdlIHJlcXVpcmUgYSBzdWNjZXNzIHJlc3BvbnNlLCBmYWxsYmFjayBsb2FkaW5nIHVyaSAnLCB1cmkpO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnN0YXR1c0NoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZvciAodmFyIHN0YXR1c18xID0gMjAwOyBzdGF0dXNfMSA8PSAyMDY7IHN0YXR1c18xKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGUuc3RhdHVzID09PSBzdGF0dXNfMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubG9hZENhY2hlZENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXR1c0NoZWNrKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0Q2hhbmNlKHRoaXMuY2FjaGUudXJsKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBjb250YWluc18xLmRlZmF1bHQoZG9jdW1lbnQsIHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zd2l0Y2hTZWxlY3RvcnModGhpcy5vcHRpb25zLnNlbGVjdG9ycywgdGhpcy5jYWNoZS5odG1sLCBkb2N1bWVudCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUucGFyc2VDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJ2dsb2JhbHMnKTtcclxuICAgICAgICB2YXIgaHRtbFJlZ2V4ID0gL1xccz9bYS16Ol0rKD89KD86XFwnfFxcXCIpW15cXCdcXFwiPl0rKD86XFwnfFxcXCIpKSovZ2k7XHJcbiAgICAgICAgdmFyIG1hdGNoZXMgPSByZXNwb25zZVRleHQubWF0Y2goaHRtbFJlZ2V4KTtcclxuICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRlbXBFbDtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5jYWNoZUNvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0LCBzdGF0dXMsIHVyaSkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSB0aGlzLnBhcnNlQ29udGVudChyZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGlmICh0ZW1wRWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wRWwuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTCA9IHJlc3BvbnNlVGV4dDtcclxuICAgICAgICB0aGlzLmNhY2hlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgICAgICAgaHRtbDogdGVtcEVsLFxyXG4gICAgICAgICAgICB1cmw6IHVyaVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhY2hlZCBDb250ZW50OiAnLCB0aGlzLmNhY2hlKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcclxuICAgICAgICB2YXIgdGVtcEVsID0gdGhpcy5wYXJzZUNvbnRlbnQocmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBpZiAodGVtcEVsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6ZXJyb3InXSk7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdENoYW5jZSh0aGlzLnJlcXVlc3QucmVzcG9uc2VVUkwpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBFbC5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MID0gcmVzcG9uc2VUZXh0O1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGNvbnRhaW5zXzEuZGVmYXVsdChkb2N1bWVudCwgdGhpcy5vcHRpb25zLnNlbGVjdG9ycywgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN3aXRjaFNlbGVjdG9ycyh0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCB0ZW1wRWwsIGRvY3VtZW50KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uIChlLCBsb2FkVHlwZSkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYTUwgSHR0cCBSZXF1ZXN0IFN0YXR1czogJywgdGhpcy5yZXF1ZXN0LnN0YXR1cyk7XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB0aGlzLnJlcXVlc3Q7XHJcbiAgICAgICAgaWYgKHJlcXVlc3QucmVzcG9uc2VUZXh0ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6ZXJyb3InXSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoIChsb2FkVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdwcmVmZXRjaCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlybWVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0LCByZXF1ZXN0LnN0YXR1cywgcmVxdWVzdC5yZXNwb25zZVVSTCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncG9wc3RhdGUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdyZWxvYWQnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmRvUmVxdWVzdCA9IGZ1bmN0aW9uIChocmVmKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcmVxdWVzdE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMucmVxdWVzdE9wdGlvbnMgfHwge307XHJcbiAgICAgICAgdmFyIHJlcWV1c3RNZXRob2QgPSAocmVxdWVzdE9wdGlvbnMucmVxdWVzdE1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB2YXIgcmVxdWVzdFBhcmFtcyA9IHJlcXVlc3RPcHRpb25zLnJlcXVlc3RQYXJhbXMgfHwgbnVsbDtcclxuICAgICAgICB2YXIgdGltZW91dCA9IHRoaXMub3B0aW9ucy50aW1lb3V0IHx8IDA7XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB2YXIgcmVxdWVzdFBheWxvYWQgPSBudWxsO1xyXG4gICAgICAgIHZhciBxdWVyeVN0cmluZztcclxuICAgICAgICBpZiAocmVxdWVzdFBhcmFtcyAmJiByZXF1ZXN0UGFyYW1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBxdWVyeVN0cmluZyA9IChyZXF1ZXN0UGFyYW1zLm1hcChmdW5jdGlvbiAocGFyYW0pIHsgcmV0dXJuIHBhcmFtLm5hbWUgKyAnPScgKyBwYXJhbS52YWx1ZTsgfSkpLmpvaW4oJyYnKTtcclxuICAgICAgICAgICAgc3dpdGNoIChyZXFldXN0TWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdHRVQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhyZWYgPSBocmVmLnNwbGl0KCc/JylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZiArPSAnPyc7XHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZiArPSBxdWVyeVN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1BPU1QnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RQYXlsb2FkID0gcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYWNoZUJ1c3QpXHJcbiAgICAgICAgICAgIGhyZWYgKz0gKHF1ZXJ5U3RyaW5nLmxlbmd0aCkgPyAoJyZ0PScgKyBEYXRlLm5vdygpKSA6ICgndD0nICsgRGF0ZS5ub3coKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKHJlcWV1c3RNZXRob2QsIGhyZWYsIHRydWUpO1xyXG4gICAgICAgICAgICByZXF1ZXN0LnRpbWVvdXQgPSB0aW1lb3V0O1xyXG4gICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVBKQVgnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUEpBWC1TZWxlY3RvcnMnLCBKU09OLnN0cmluZ2lmeShfdGhpcy5vcHRpb25zLnNlbGVjdG9ycykpO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IHJlc29sdmU7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IHJlamVjdDtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKHJlcXVlc3RQYXlsb2FkKTtcclxuICAgICAgICAgICAgX3RoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUHJlZmV0Y2ggPSBmdW5jdGlvbiAoaHJlZikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1ByZWZldGNoaW5nOiAnLCBocmVmKTtcclxuICAgICAgICB0aGlzLmFib3J0UmVxdWVzdCgpO1xyXG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6cHJlZmV0Y2gnXSk7XHJcbiAgICAgICAgdGhpcy5kb1JlcXVlc3QoaHJlZilcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGUpIHsgX3RoaXMuaGFuZGxlUmVzcG9uc2UoZSwgJ3ByZWZldGNoJyk7IH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYSFIgUmVxdWVzdCBFcnJvcjogJywgZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlTG9hZCA9IGZ1bmN0aW9uIChocmVmLCBsb2FkVHlwZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIENhY2hlZDogJywgaHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZENhY2hlZENvbnRlbnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5yZXF1ZXN0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBQcmVmZXRjaDogJywgaHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlybWVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZzogJywgaHJlZik7XHJcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6c2VuZCddKTtcclxuICAgICAgICAgICAgdGhpcy5kb1JlcXVlc3QoaHJlZilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsIGxvYWRUeXBlKTsgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmNsZWFyUHJlZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFib3J0UmVxdWVzdCgpO1xyXG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6Y2FuY2VsJ10pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQamF4O1xyXG59KCkpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IFBqYXg7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBqYXguanMubWFwIl19
