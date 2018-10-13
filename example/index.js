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
        console.log(elements);
        elements.forEach(function (el) {
            check_element_1.default(el, _this);
        });
    };
    Pjax.prototype.handleRefresh = function (el) {
        this.parseDOM(el);
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
            return;
        }
        else {
            if (this.options.titleSwitch)
                document.title = toEl.title;
            this.handleSwitches(switchQueue);
        }
    };
    Pjax.prototype.loadCachedContent = function () {
        if (document.activeElement && contains_1.default(document, this.options.selectors, document.activeElement)) {
            try {
                document.activeElement.blur();
            }
            catch (e) {
                console.log(e);
            }
        }
        this.switchSelectors(this.options.selectors, this.cache, document);
    };
    Pjax.prototype.parseContent = function (responseText) {
        var tempEl = document.implementation.createHTMLDocument('globals');
        var htmlRegex = /\s?[a-z:]+(?=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi;
        var matches = responseText.match(htmlRegex);
        if (matches && matches.length)
            return tempEl;
        return null;
    };
    Pjax.prototype.cacheContent = function (responseText) {
        var tempEl = this.parseContent(responseText);
        if (tempEl === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        tempEl.documentElement.innerHTML = responseText;
        this.cache = tempEl;
        if (this.options.debug)
            console.log('Cached Content: ', this.cache);
    };
    Pjax.prototype.loadContent = function (responseText) {
        var tempEl = this.parseContent(responseText);
        if (tempEl === null) {
            trigger_1.default(document, ['pjax:error']);
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
                    this.cacheContent(request.responseText);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgb25fMSA9IHJlcXVpcmUoXCIuL29uXCIpO1xyXG52YXIgaXNEZWZhdWx0UHJldmVudGVkID0gZnVuY3Rpb24gKGVsLCBlKSB7XHJcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZWxzZSBpZiAoZWwuZ2V0QXR0cmlidXRlKCdwcmV2ZW50LWRlZmF1bHQnKSAhPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucygnbm8tdHJhbnNpdGlvbicpKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxufTtcclxudmFyIGNoZWNrRm9yQWJvcnQgPSBmdW5jdGlvbiAoZWwsIGUpIHtcclxuICAgIGlmIChlbC5wcm90b2NvbCAhPT0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIHx8IGVsLmhvc3QgIT09IHdpbmRvdy5sb2NhdGlvbi5ob3N0KVxyXG4gICAgICAgIHJldHVybiAnZXh0ZXJuYWwnO1xyXG4gICAgaWYgKGVsLmhhc2ggJiYgZWwuaHJlZi5yZXBsYWNlKGVsLmhhc2gsICcnKSA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShsb2NhdGlvbi5oYXNoLCAnJykpXHJcbiAgICAgICAgcmV0dXJuICdhbmNob3InO1xyXG4gICAgaWYgKGVsLmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0gKyAnIycpXHJcbiAgICAgICAgcmV0dXJuICdhbmNob3ItZW1wdHknO1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbnZhciBoYW5kbGVDbGljayA9IGZ1bmN0aW9uIChlbCwgZSwgcGpheCkge1xyXG4gICAgaWYgKGlzRGVmYXVsdFByZXZlbnRlZChlbCwgZSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgdmFyIGV2ZW50T3B0aW9ucyA9IHtcclxuICAgICAgICB0cmlnZ2VyRWxlbWVudDogZWxcclxuICAgIH07XHJcbiAgICB2YXIgYXR0clZhbHVlID0gY2hlY2tGb3JBYm9ydChlbCwgZSk7XHJcbiAgICBpZiAoYXR0clZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUsIGF0dHJWYWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKGVsLmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0pXHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUsICdyZWxvYWQnKTtcclxuICAgIGVsc2VcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJ2xvYWQnKTtcclxuICAgIHBqYXguaGFuZGxlTG9hZChlbC5ocmVmLCBlbC5nZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSkpO1xyXG59O1xyXG52YXIgaGFuZGxlSG92ZXIgPSBmdW5jdGlvbiAoZWwsIGUsIHBqYXgpIHtcclxuICAgIGlmIChpc0RlZmF1bHRQcmV2ZW50ZWQoZWwsIGUpKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZW91dCcpIHtcclxuICAgICAgICBwamF4LmNsZWFyUHJlZmV0Y2goKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgZXZlbnRPcHRpb25zID0ge1xyXG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxyXG4gICAgfTtcclxuICAgIHZhciBhdHRyVmFsdWUgPSBjaGVja0ZvckFib3J0KGVsLCBlKTtcclxuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoZWwuaHJlZiAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSlcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJ3ByZWZldGNoJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgcGpheC5oYW5kbGVQcmVmZXRjaChlbC5ocmVmLCBldmVudE9wdGlvbnMpO1xyXG59O1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBwamF4KSB7XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJycpO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVDbGljayhlbCwgZSwgcGpheCk7IH0pO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUsIHBqYXgpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlb3V0JywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUsIHBqYXgpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5rZXkgPT09ICdlbnRlcicgfHwgZS5rZXlDb2RlID09PSAxMylcclxuICAgICAgICAgICAgaGFuZGxlQ2xpY2soZWwsIGUsIHBqYXgpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5rLWV2ZW50cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBldmVudCwgbGlzdGVuZXIpIHtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIGV2ZW50cykge1xyXG4gICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoZSk7XHJcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyaWdnZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSBudWxsOyB9XHJcbiAgICB2YXIgcGFyc2VkT3B0aW9ucyA9IChvcHRpb25zICE9PSBudWxsKSA/IG9wdGlvbnMgOiB7fTtcclxuICAgIHBhcnNlZE9wdGlvbnMuZWxlbWVudHMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmVsZW1lbnRzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5lbGVtZW50cyA6ICdhW2hyZWZdJztcclxuICAgIHBhcnNlZE9wdGlvbnMuc2VsZWN0b3JzID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zZWxlY3RvcnMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnNlbGVjdG9ycyA6IFsndGl0bGUnLCAnLmpzLXBqYXgnXTtcclxuICAgIHBhcnNlZE9wdGlvbnMuc3dpdGNoZXMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnN3aXRjaGVzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zd2l0Y2hlcyA6IHt9O1xyXG4gICAgcGFyc2VkT3B0aW9ucy5oaXN0b3J5ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5oaXN0b3J5ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5oaXN0b3J5IDogdHJ1ZTtcclxuICAgIHBhcnNlZE9wdGlvbnMuc2Nyb2xsVG8gPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnNjcm9sbFRvICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zY3JvbGxUbyA6IDA7XHJcbiAgICBwYXJzZWRPcHRpb25zLmNhY2hlQnVzdCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuY2FjaGVCdXN0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jYWNoZUJ1c3QgOiBmYWxzZTtcclxuICAgIHBhcnNlZE9wdGlvbnMuZGVidWcgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmRlYnVnICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5kZWJ1ZyA6IGZhbHNlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy50aW1lb3V0ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy50aW1lb3V0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy50aW1lb3V0IDogMDtcclxuICAgIHBhcnNlZE9wdGlvbnMuYXR0clN0YXRlID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5hdHRyU3RhdGUgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmF0dHJTdGF0ZSA6ICdkYXRhLXBqYXgtc3RhdGUnO1xyXG4gICAgcGFyc2VkT3B0aW9ucy50aXRsZVN3aXRjaCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMudGl0bGVTd2l0Y2ggIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnRpdGxlU3dpdGNoIDogdHJ1ZTtcclxuICAgIHJldHVybiBwYXJzZWRPcHRpb25zO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2Utb3B0aW9ucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBwamF4KSB7XHJcbiAgICBzd2l0Y2ggKGVsLnRhZ05hbWUudG9Mb2NhbGVMb3dlckNhc2UoKSkge1xyXG4gICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgICBpZiAoIWVsLmhhc0F0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlKSlcclxuICAgICAgICAgICAgICAgIHBqYXguc2V0TGlua0xpc3RlbmVycyhlbCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93ICdQamF4IGNhbiBvbmx5IGJlIGFwcGxpZWQgb24gPGE+IGVsZW1lbnRzJztcclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZWNrLWVsZW1lbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChkb2MsIHNlbGVjdG9ycywgZWxlbWVudCkge1xyXG4gICAgc2VsZWN0b3JzLm1hcChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgc2VsZWN0b3JFbHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgc2VsZWN0b3JFbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgaWYgKGVsLmNvbnRhaW5zKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb250YWlucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV1aWQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHBhcnNlX29wdGlvbnNfMSA9IHJlcXVpcmUoXCIuL2xpYi9wYXJzZS1vcHRpb25zXCIpO1xyXG52YXIgdXVpZF8xID0gcmVxdWlyZShcIi4vbGliL3V1aWRcIik7XHJcbnZhciB0cmlnZ2VyXzEgPSByZXF1aXJlKFwiLi9saWIvZXZlbnRzL3RyaWdnZXJcIik7XHJcbnZhciBjb250YWluc18xID0gcmVxdWlyZShcIi4vbGliL3V0aWwvY29udGFpbnNcIik7XHJcbnZhciBsaW5rX2V2ZW50c18xID0gcmVxdWlyZShcIi4vbGliL2V2ZW50cy9saW5rLWV2ZW50c1wiKTtcclxudmFyIGNoZWNrX2VsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2xpYi91dGlsL2NoZWNrLWVsZW1lbnRcIik7XHJcbnZhciBQamF4ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBqYXgob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcclxuICAgICAgICAgICAgaGlzdG9yeTogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsUG9zOiBbMCwgMF1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHBhcnNlX29wdGlvbnNfMS5kZWZhdWx0KG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMubGFzdFVVSUQgPSB1dWlkXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGpheCBPcHRpb25zOicsIHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbiAgICBQamF4LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIF90aGlzLmhhbmRsZVBvcHN0YXRlKGUpOyB9KTtcclxuICAgICAgICB0aGlzLnBhcnNlRE9NKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuc2V0TGlua0xpc3RlbmVycyA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIGxpbmtfZXZlbnRzXzEuZGVmYXVsdChlbCwgdGhpcyk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuZ2V0RWxlbWVudHMgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMuZWxlbWVudHMpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnBhcnNlRE9NID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgZWxlbWVudHMgPSB0aGlzLmdldEVsZW1lbnRzKGVsKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhlbGVtZW50cyk7XHJcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgY2hlY2tfZWxlbWVudF8xLmRlZmF1bHQoZWwsIF90aGlzKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVSZWZyZXNoID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZURPTShlbCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUG9wc3RhdGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChlLnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSGlqYWNraW5nIFBvcHN0YXRlIEV2ZW50Jyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFVybChlLnN0YXRlLnVybCwgJ3BvcHN0YXRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmFib3J0UmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0ID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkVXJsID0gZnVuY3Rpb24gKGhyZWYsIGxvYWRUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxvYWQoaHJlZiwgbG9hZFR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQdXNoU3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IHt9KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmhpc3RvcnkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1B1c2hpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnN0YXRlLnRpdGxlLCB0aGlzLnN0YXRlLnVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXBsYWNpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgICAgICAgICB9LCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlU2Nyb2xsUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGlzdG9yeSkge1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgdGVtcC5ocmVmID0gdGhpcy5zdGF0ZS51cmw7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wLmhhc2gpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lXzEgPSB0ZW1wLmhhc2guc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICBuYW1lXzEgPSBkZWNvZGVVUklDb21wb25lbnQobmFtZV8xKTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyVG9wID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lXzEpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKG5hbWVfMSlbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5vZmZzZXRQYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclRvcCArPSB0YXJnZXQub2Zmc2V0VG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lm9mZnNldFBhcmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAodGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgY3VyclRvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHRoaXMub3B0aW9ucy5zY3JvbGxUbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsUG9zKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh0aGlzLnN0YXRlLnNjcm9sbFBvc1swXSwgdGhpcy5zdGF0ZS5zY3JvbGxQb3NbMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmluaXNoaW5nIFBqYXgnKTtcclxuICAgICAgICB0aGlzLnN0YXRlLnVybCA9IHRoaXMucmVxdWVzdC5yZXNwb25zZVVSTDtcclxuICAgICAgICB0aGlzLnN0YXRlLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY3JvbGxQb3MgPSBbMCwgd2luZG93LnNjcm9sbFldO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUHVzaFN0YXRlKCk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTY3JvbGxQb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gZmFsc2U7XHJcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpjb21wbGV0ZScsICdwamF4OnN1Y2Nlc3MnXSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlU3dpdGNoZXMgPSBmdW5jdGlvbiAoc3dpdGNoUXVldWUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHN3aXRjaFF1ZXVlLm1hcChmdW5jdGlvbiAoc3dpdGNoT2JqKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaE9iai5vbGRFbC5pbm5lckhUTUwgPSBzd2l0Y2hPYmoubmV3RWwuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICBfdGhpcy5wYXJzZURPTShzd2l0Y2hPYmoub2xkRWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmluYWxpemUoKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5zd2l0Y2hTZWxlY3RvcnMgPSBmdW5jdGlvbiAoc2VsZWN0b3JzLCB0b0VsLCBmcm9tRWwpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzd2l0Y2hRdWV1ZSA9IFtdO1xyXG4gICAgICAgIHNlbGVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICB2YXIgbmV3RWxzID0gdG9FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgdmFyIG9sZEVscyA9IGZyb21FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUGpheCBTd2l0Y2g6ICcsIHNlbGVjdG9yLCBuZXdFbHMsIG9sZEVscyk7XHJcbiAgICAgICAgICAgIGlmIChuZXdFbHMubGVuZ3RoICE9PSBvbGRFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRE9NIGRvZXNuXFwndCBsb29rIHRoZSBzYW1lIG9uIHRoZSBuZXcgcGFnZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld0Vscy5mb3JFYWNoKGZ1bmN0aW9uIChuZXdFbCwgaSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZEVsID0gb2xkRWxzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsU3dpdGNoID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0VsOiBuZXdFbCxcclxuICAgICAgICAgICAgICAgICAgICBvbGRFbDogb2xkRWxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2hRdWV1ZS5wdXNoKGVsU3dpdGNoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHN3aXRjaFF1ZXVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkblxcJ3QgZmluZCBhbnl0aGluZyB0byBzd2l0Y2gnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50aXRsZVN3aXRjaClcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gdG9FbC50aXRsZTtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hlcyhzd2l0Y2hRdWV1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmxvYWRDYWNoZWRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGNvbnRhaW5zXzEuZGVmYXVsdChkb2N1bWVudCwgdGhpcy5vcHRpb25zLnNlbGVjdG9ycywgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN3aXRjaFNlbGVjdG9ycyh0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCB0aGlzLmNhY2hlLCBkb2N1bWVudCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUucGFyc2VDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJ2dsb2JhbHMnKTtcclxuICAgICAgICB2YXIgaHRtbFJlZ2V4ID0gL1xccz9bYS16Ol0rKD89KD86XFwnfFxcXCIpW15cXCdcXFwiPl0rKD86XFwnfFxcXCIpKSovZ2k7XHJcbiAgICAgICAgdmFyIG1hdGNoZXMgPSByZXNwb25zZVRleHQubWF0Y2goaHRtbFJlZ2V4KTtcclxuICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRlbXBFbDtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5jYWNoZUNvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0KSB7XHJcbiAgICAgICAgdmFyIHRlbXBFbCA9IHRoaXMucGFyc2VDb250ZW50KHJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgaWYgKHRlbXBFbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBFbC5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MID0gcmVzcG9uc2VUZXh0O1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSB0ZW1wRWw7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhY2hlZCBDb250ZW50OiAnLCB0aGlzLmNhY2hlKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcclxuICAgICAgICB2YXIgdGVtcEVsID0gdGhpcy5wYXJzZUNvbnRlbnQocmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBpZiAodGVtcEVsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6ZXJyb3InXSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcEVsLmRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwgPSByZXNwb25zZVRleHQ7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgY29udGFpbnNfMS5kZWZhdWx0KGRvY3VtZW50LCB0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3dpdGNoU2VsZWN0b3JzKHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIHRlbXBFbCwgZG9jdW1lbnQpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24gKGUsIGxvYWRUeXBlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1hNTCBIdHRwIFJlcXVlc3QgU3RhdHVzOiAnLCB0aGlzLnJlcXVlc3Quc3RhdHVzKTtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHRoaXMucmVxdWVzdDtcclxuICAgICAgICBpZiAocmVxdWVzdC5yZXNwb25zZVRleHQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGxvYWRUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3ByZWZldGNoJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maXJtZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZUNvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3BvcHN0YXRlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmVsb2FkJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaGlzdG9yeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5kb1JlcXVlc3QgPSBmdW5jdGlvbiAoaHJlZikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RPcHRpb25zID0gdGhpcy5vcHRpb25zLnJlcXVlc3RPcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHZhciByZXFldXN0TWV0aG9kID0gKHJlcXVlc3RPcHRpb25zLnJlcXVlc3RNZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RQYXJhbXMgPSByZXF1ZXN0T3B0aW9ucy5yZXF1ZXN0UGFyYW1zIHx8IG51bGw7XHJcbiAgICAgICAgdmFyIHRpbWVvdXQgPSB0aGlzLm9wdGlvbnMudGltZW91dCB8fCAwO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RQYXlsb2FkID0gbnVsbDtcclxuICAgICAgICB2YXIgcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgaWYgKHJlcXVlc3RQYXJhbXMgJiYgcmVxdWVzdFBhcmFtcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcXVlcnlTdHJpbmcgPSAocmVxdWVzdFBhcmFtcy5tYXAoZnVuY3Rpb24gKHBhcmFtKSB7IHJldHVybiBwYXJhbS5uYW1lICsgJz0nICsgcGFyYW0udmFsdWU7IH0pKS5qb2luKCcmJyk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocmVxZXVzdE1ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnR0VUJzpcclxuICAgICAgICAgICAgICAgICAgICBocmVmID0gaHJlZi5zcGxpdCgnPycpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGhyZWYgKz0gJz8nO1xyXG4gICAgICAgICAgICAgICAgICAgIGhyZWYgKz0gcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdQT1NUJzpcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0UGF5bG9hZCA9IHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FjaGVCdXN0KVxyXG4gICAgICAgICAgICBocmVmICs9IChxdWVyeVN0cmluZy5sZW5ndGgpID8gKCcmdD0nICsgRGF0ZS5ub3coKSkgOiAoJ3Q9JyArIERhdGUubm93KCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub3BlbihyZXFldXN0TWV0aG9kLCBocmVmLCB0cnVlKTtcclxuICAgICAgICAgICAgcmVxdWVzdC50aW1lb3V0ID0gdGltZW91dDtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1QSkFYJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVBKQVgtU2VsZWN0b3JzJywgSlNPTi5zdHJpbmdpZnkoX3RoaXMub3B0aW9ucy5zZWxlY3RvcnMpKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSByZWplY3Q7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0UGF5bG9hZCk7XHJcbiAgICAgICAgICAgIF90aGlzLnJlcXVlc3QgPSByZXF1ZXN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVByZWZldGNoID0gZnVuY3Rpb24gKGhyZWYpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQcmVmZXRjaGluZzogJywgaHJlZik7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OnByZWZldGNoJ10pO1xyXG4gICAgICAgIHRoaXMuZG9SZXF1ZXN0KGhyZWYpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsICdwcmVmZXRjaCcpOyB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWEhSIFJlcXVlc3QgRXJyb3I6ICcsIGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZUxvYWQgPSBmdW5jdGlvbiAoaHJlZiwgbG9hZFR5cGUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBDYWNoZWQ6ICcsIGhyZWYpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRDYWNoZWRDb250ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMucmVxdWVzdCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgUHJlZmV0Y2g6ICcsIGhyZWYpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmc6ICcsIGhyZWYpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OnNlbmQnXSk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9SZXF1ZXN0KGhyZWYpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkgeyBfdGhpcy5oYW5kbGVSZXNwb25zZShlLCBsb2FkVHlwZSk7IH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYSFIgUmVxdWVzdCBFcnJvcjogJywgZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5jbGVhclByZWZldGNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmNhbmNlbCddKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGpheDtcclxufSgpKTtcclxubW9kdWxlLmV4cG9ydHMgPSBQamF4O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wamF4LmpzLm1hcCJdfQ==
