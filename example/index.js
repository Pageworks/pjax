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
    if (el.href === window.location.href.split('#')[0]) {
        el.setAttribute(pjax.options.attrState, 'reload');
        return;
    }
    el.setAttribute(pjax.options.attrState, 'load');
    pjax.handleLoad(el.href, eventOptions);
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
    return 'pjax_' + Date.now();
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
    Pjax.prototype.handleRefresh = function (el) {
        this.parseDOM(el);
    };
    Pjax.prototype.handlePopstate = function (e) {
        if (e.state) {
            if (this.options.debug)
                console.log('Hijacking Popstate Event');
            e.preventDefault();
            this.lastUUID = e.state.uuid;
            this.loadUrl(e.state.url, null);
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
    Pjax.prototype.loadUrl = function (href, eOptions) {
        this.abortRequest();
        if (this.cache === null) {
            this.handleLoad(href, eOptions);
        }
        else {
            this.loadCachedContent();
        }
    };
    Pjax.prototype.handlePushState = function () {
        if (this.state !== {}) {
            if (this.state.history) {
                this.lastUUID = uuid_1.default();
                window.history.pushState({
                    url: this.state.url,
                    title: this.state.title,
                    uuid: this.lastUUID,
                    scrollPos: [0, 0]
                }, this.state.title, this.state.url);
            }
            else {
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
        this.state = {
            url: this.request.responseURL,
            title: document.title,
            history: true,
            scrollPos: [0, window.scrollY]
        };
        if (this.options.debug)
            console.log('Setting History State: ', this.state);
        this.handlePushState();
        this.handleScrollPosition();
        this.cache = null;
        this.state = {};
        this.request = null;
        trigger_1.default(document, ['pjax:complete', 'pjax:success']);
    };
    Pjax.prototype.handleSwitches = function (switchQueue) {
        switchQueue.map(function (switchObj) {
            switchObj.oldEl.innerHTML = switchObj.newEl.innerHTML;
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
        else
            this.handleSwitches(switchQueue);
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
    Pjax.prototype.handleResponse = function (e, eOptions) {
        if (this.options.debug)
            console.log('XML Http Request Status: ', this.request.status);
        var request = this.request;
        if (request.responseText === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        var loadType = (eOptions !== null) ? eOptions.triggerElement.getAttribute(this.options.attrState) : null;
        switch (loadType) {
            case 'prefetch':
                this.cacheContent(request.responseText);
                break;
            default:
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
    Pjax.prototype.handlePrefetch = function (href, eOptions) {
        var _this = this;
        if (this.options.debug)
            console.log('Prefetching: ', href);
        this.abortRequest();
        trigger_1.default(document, ['pjax:prefetch']);
        this.doRequest(href)
            .then(function (e) { _this.handleResponse(e, eOptions); })
            .catch(function (e) {
            if (_this.options.debug)
                console.log('XHR Request Error: ', e);
        });
    };
    Pjax.prototype.handleLoad = function (href, eOptions) {
        var _this = this;
        if (this.cache !== null) {
            if (this.options.debug)
                console.log('Loading Cached: ', href);
            this.loadCachedContent();
        }
        else if (this.request !== null) {
            if (this.options.debug)
                console.log('Loading Prefetch: ', href);
        }
        else {
            if (this.options.debug)
                console.log('Loading: ', href);
            trigger_1.default(document, ['pjax:send']);
            this.doRequest(href)
                .then(function (e) { _this.handleResponse(e, eOptions); })
                .catch(function (e) {
                if (_this.options.debug)
                    console.log('XHR Request Error: ', e);
            });
        }
    };
    Pjax.prototype.clearPrefetch = function () {
        this.abortRequest();
        trigger_1.default(document, ['pjax:cancel']);
        this.cache = null;
    };
    return Pjax;
}());
module.exports = Pjax;

},{"./lib/events/link-events":1,"./lib/events/trigger":3,"./lib/parse-options":4,"./lib/util/check-element":5,"./lib/util/contains":6,"./lib/uuid":7}]},{},[8])(8)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIG9uXzEgPSByZXF1aXJlKFwiLi9vblwiKTtcclxudmFyIGlzRGVmYXVsdFByZXZlbnRlZCA9IGZ1bmN0aW9uIChlbCwgZSkge1xyXG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZClcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgncHJldmVudC1kZWZhdWx0JykgIT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBlbHNlIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ25vLXRyYW5zaXRpb24nKSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbn07XHJcbnZhciBjaGVja0ZvckFib3J0ID0gZnVuY3Rpb24gKGVsLCBlKSB7XHJcbiAgICBpZiAoZWwucHJvdG9jb2wgIT09IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB8fCBlbC5ob3N0ICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdClcclxuICAgICAgICByZXR1cm4gJ2V4dGVybmFsJztcclxuICAgIGlmIChlbC5oYXNoICYmIGVsLmhyZWYucmVwbGFjZShlbC5oYXNoLCAnJykgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgJycpKVxyXG4gICAgICAgIHJldHVybiAnYW5jaG9yJztcclxuICAgIGlmIChlbC5ocmVmID09PSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdICsgJyMnKVxyXG4gICAgICAgIHJldHVybiAnYW5jaG9yLWVtcHR5JztcclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG52YXIgaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZWwsIGUsIHBqYXgpIHtcclxuICAgIGlmIChpc0RlZmF1bHRQcmV2ZW50ZWQoZWwsIGUpKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIHZhciBldmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgdHJpZ2dlckVsZW1lbnQ6IGVsXHJcbiAgICB9O1xyXG4gICAgdmFyIGF0dHJWYWx1ZSA9IGNoZWNrRm9yQWJvcnQoZWwsIGUpO1xyXG4gICAgaWYgKGF0dHJWYWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlLCBhdHRyVmFsdWUpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmIChlbC5ocmVmID09PSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUsICdyZWxvYWQnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJ2xvYWQnKTtcclxuICAgIHBqYXguaGFuZGxlTG9hZChlbC5ocmVmLCBldmVudE9wdGlvbnMpO1xyXG59O1xyXG52YXIgaGFuZGxlSG92ZXIgPSBmdW5jdGlvbiAoZWwsIGUsIHBqYXgpIHtcclxuICAgIGlmIChpc0RlZmF1bHRQcmV2ZW50ZWQoZWwsIGUpKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZW91dCcpIHtcclxuICAgICAgICBwamF4LmNsZWFyUHJlZmV0Y2goKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgZXZlbnRPcHRpb25zID0ge1xyXG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxyXG4gICAgfTtcclxuICAgIHZhciBhdHRyVmFsdWUgPSBjaGVja0ZvckFib3J0KGVsLCBlKTtcclxuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoZWwuaHJlZiAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSlcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJ3ByZWZldGNoJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgcGpheC5oYW5kbGVQcmVmZXRjaChlbC5ocmVmLCBldmVudE9wdGlvbnMpO1xyXG59O1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBwamF4KSB7XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgJycpO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVDbGljayhlbCwgZSwgcGpheCk7IH0pO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUsIHBqYXgpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlb3V0JywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUsIHBqYXgpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5rZXkgPT09ICdlbnRlcicgfHwgZS5rZXlDb2RlID09PSAxMylcclxuICAgICAgICAgICAgaGFuZGxlQ2xpY2soZWwsIGUsIHBqYXgpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5rLWV2ZW50cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBldmVudCwgbGlzdGVuZXIpIHtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIGV2ZW50cykge1xyXG4gICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoZSk7XHJcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyaWdnZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSBudWxsOyB9XHJcbiAgICB2YXIgcGFyc2VkT3B0aW9ucyA9IChvcHRpb25zICE9PSBudWxsKSA/IG9wdGlvbnMgOiB7fTtcclxuICAgIHBhcnNlZE9wdGlvbnMuZWxlbWVudHMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmVsZW1lbnRzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5lbGVtZW50cyA6ICdhW2hyZWZdJztcclxuICAgIHBhcnNlZE9wdGlvbnMuc2VsZWN0b3JzID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zZWxlY3RvcnMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnNlbGVjdG9ycyA6IFsndGl0bGUnLCAnLmpzLXBqYXgnXTtcclxuICAgIHBhcnNlZE9wdGlvbnMuc3dpdGNoZXMgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnN3aXRjaGVzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zd2l0Y2hlcyA6IHt9O1xyXG4gICAgcGFyc2VkT3B0aW9ucy5oaXN0b3J5ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5oaXN0b3J5ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5oaXN0b3J5IDogdHJ1ZTtcclxuICAgIHBhcnNlZE9wdGlvbnMuc2Nyb2xsVG8gPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnNjcm9sbFRvICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zY3JvbGxUbyA6IDA7XHJcbiAgICBwYXJzZWRPcHRpb25zLmNhY2hlQnVzdCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuY2FjaGVCdXN0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5jYWNoZUJ1c3QgOiBmYWxzZTtcclxuICAgIHBhcnNlZE9wdGlvbnMuZGVidWcgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmRlYnVnICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5kZWJ1ZyA6IGZhbHNlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy50aW1lb3V0ID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy50aW1lb3V0ICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy50aW1lb3V0IDogMDtcclxuICAgIHBhcnNlZE9wdGlvbnMuYXR0clN0YXRlID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5hdHRyU3RhdGUgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLmF0dHJTdGF0ZSA6ICdkYXRhLXBqYXgtc3RhdGUnO1xyXG4gICAgcmV0dXJuIHBhcnNlZE9wdGlvbnM7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1vcHRpb25zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIHBqYXgpIHtcclxuICAgIHN3aXRjaCAoZWwudGFnTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgY2FzZSAnYSc6XHJcbiAgICAgICAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUpKVxyXG4gICAgICAgICAgICAgICAgcGpheC5zZXRMaW5rTGlzdGVuZXJzKGVsKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgJ1BqYXggY2FuIG9ubHkgYmUgYXBwbGllZCBvbiA8YT4gZWxlbWVudHMnO1xyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2hlY2stZWxlbWVudC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGRvYywgc2VsZWN0b3JzLCBlbGVtZW50KSB7XHJcbiAgICBzZWxlY3RvcnMubWFwKGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBzZWxlY3RvckVscyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICBzZWxlY3RvckVscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICBpZiAoZWwuY29udGFpbnMoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBmYWxzZTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnRhaW5zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gJ3BqYXhfJyArIERhdGUubm93KCk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD11dWlkLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBwYXJzZV9vcHRpb25zXzEgPSByZXF1aXJlKFwiLi9saWIvcGFyc2Utb3B0aW9uc1wiKTtcclxudmFyIHV1aWRfMSA9IHJlcXVpcmUoXCIuL2xpYi91dWlkXCIpO1xyXG52YXIgdHJpZ2dlcl8xID0gcmVxdWlyZShcIi4vbGliL2V2ZW50cy90cmlnZ2VyXCIpO1xyXG52YXIgY29udGFpbnNfMSA9IHJlcXVpcmUoXCIuL2xpYi91dGlsL2NvbnRhaW5zXCIpO1xyXG52YXIgbGlua19ldmVudHNfMSA9IHJlcXVpcmUoXCIuL2xpYi9ldmVudHMvbGluay1ldmVudHNcIik7XHJcbnZhciBjaGVja19lbGVtZW50XzEgPSByZXF1aXJlKFwiLi9saWIvdXRpbC9jaGVjay1lbGVtZW50XCIpO1xyXG52YXIgUGpheCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQamF4KG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgICAgICB0aXRsZTogZG9jdW1lbnQudGl0bGUsXHJcbiAgICAgICAgICAgIGhpc3Rvcnk6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBwYXJzZV9vcHRpb25zXzEuZGVmYXVsdChvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQamF4IE9wdGlvbnM6JywgdGhpcy5vcHRpb25zKTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuICAgIFBqYXgucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMuaGFuZGxlUG9wc3RhdGUoZSk7IH0pO1xyXG4gICAgICAgIHRoaXMucGFyc2VET00oZG9jdW1lbnQuYm9keSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUmVsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5zZXRMaW5rTGlzdGVuZXJzID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgbGlua19ldmVudHNfMS5kZWZhdWx0KGVsLCB0aGlzKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5lbGVtZW50cyk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUucGFyc2VET00gPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbGVtZW50cyA9IHRoaXMuZ2V0RWxlbWVudHMoZWwpO1xyXG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIGNoZWNrX2VsZW1lbnRfMS5kZWZhdWx0KGVsLCBfdGhpcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUmVmcmVzaCA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHRoaXMucGFyc2VET00oZWwpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVBvcHN0YXRlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0hpamFja2luZyBQb3BzdGF0ZSBFdmVudCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVVSUQgPSBlLnN0YXRlLnV1aWQ7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFVybChlLnN0YXRlLnVybCwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmFib3J0UmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0ID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkVXJsID0gZnVuY3Rpb24gKGhyZWYsIGVPcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxvYWQoaHJlZiwgZU9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQdXNoU3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IHt9KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmhpc3RvcnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdFVVSUQgPSB1dWlkXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMuc3RhdGUudXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLnN0YXRlLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IHRoaXMubGFzdFVVSUQsXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zOiBbMCwgMF1cclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuc3RhdGUudGl0bGUsIHRoaXMuc3RhdGUudXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdFVVSUQgPSB1dWlkXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMuc3RhdGUudXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLnN0YXRlLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IHRoaXMubGFzdFVVSUQsXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zOiBbMCwgMF1cclxuICAgICAgICAgICAgICAgIH0sIGRvY3VtZW50LnRpdGxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVTY3JvbGxQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICB0ZW1wLmhyZWYgPSB0aGlzLnN0YXRlLnVybDtcclxuICAgICAgICAgICAgaWYgKHRlbXAuaGFzaCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWVfMSA9IHRlbXAuaGFzaC5zbGljZSgxKTtcclxuICAgICAgICAgICAgICAgIG5hbWVfMSA9IGRlY29kZVVSSUNvbXBvbmVudChuYW1lXzEpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJUb3AgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWVfMSkgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUobmFtZV8xKVswXTtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Lm9mZnNldFBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyVG9wICs9IHRhcmdldC5vZmZzZXRUb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICh0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBjdXJyVG9wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgdGhpcy5vcHRpb25zLnNjcm9sbFRvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxQb3MpIHtcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHRoaXMuc3RhdGUuc2Nyb2xsUG9zWzBdLCB0aGlzLnN0YXRlLnNjcm9sbFBvc1sxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGaW5pc2hpbmcgUGpheCcpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5yZXF1ZXN0LnJlc3BvbnNlVVJMLFxyXG4gICAgICAgICAgICB0aXRsZTogZG9jdW1lbnQudGl0bGUsXHJcbiAgICAgICAgICAgIGhpc3Rvcnk6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIHdpbmRvdy5zY3JvbGxZXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NldHRpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVQdXNoU3RhdGUoKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVNjcm9sbFBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG51bGw7XHJcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpjb21wbGV0ZScsICdwamF4OnN1Y2Nlc3MnXSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlU3dpdGNoZXMgPSBmdW5jdGlvbiAoc3dpdGNoUXVldWUpIHtcclxuICAgICAgICBzd2l0Y2hRdWV1ZS5tYXAoZnVuY3Rpb24gKHN3aXRjaE9iaikge1xyXG4gICAgICAgICAgICBzd2l0Y2hPYmoub2xkRWwuaW5uZXJIVE1MID0gc3dpdGNoT2JqLm5ld0VsLmlubmVySFRNTDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpbmFsaXplKCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuc3dpdGNoU2VsZWN0b3JzID0gZnVuY3Rpb24gKHNlbGVjdG9ycywgdG9FbCwgZnJvbUVsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgc3dpdGNoUXVldWUgPSBbXTtcclxuICAgICAgICBzZWxlY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIG5ld0VscyA9IHRvRWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIHZhciBvbGRFbHMgPSBmcm9tRWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BqYXggU3dpdGNoOiAnLCBzZWxlY3RvciwgbmV3RWxzLCBvbGRFbHMpO1xyXG4gICAgICAgICAgICBpZiAobmV3RWxzLmxlbmd0aCAhPT0gb2xkRWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RPTSBkb2VzblxcJ3QgbG9vayB0aGUgc2FtZSBvbiB0aGUgbmV3IHBhZ2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdFbHMuZm9yRWFjaChmdW5jdGlvbiAobmV3RWwsIGkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRFbCA9IG9sZEVsc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBlbFN3aXRjaCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdFbDogbmV3RWwsXHJcbiAgICAgICAgICAgICAgICAgICAgb2xkRWw6IG9sZEVsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoUXVldWUucHVzaChlbFN3aXRjaCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzd2l0Y2hRdWV1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZG5cXCd0IGZpbmQgYW55dGhpbmcgdG8gc3dpdGNoJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVN3aXRjaGVzKHN3aXRjaFF1ZXVlKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkQ2FjaGVkQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBjb250YWluc18xLmRlZmF1bHQoZG9jdW1lbnQsIHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zd2l0Y2hTZWxlY3RvcnModGhpcy5vcHRpb25zLnNlbGVjdG9ycywgdGhpcy5jYWNoZSwgZG9jdW1lbnQpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnBhcnNlQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcclxuICAgICAgICB2YXIgdGVtcEVsID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCdnbG9iYWxzJyk7XHJcbiAgICAgICAgdmFyIGh0bWxSZWdleCA9IC9cXHM/W2EtejpdKyg/PSg/OlxcJ3xcXFwiKVteXFwnXFxcIj5dKyg/OlxcJ3xcXFwiKSkqL2dpO1xyXG4gICAgICAgIHZhciBtYXRjaGVzID0gcmVzcG9uc2VUZXh0Lm1hdGNoKGh0bWxSZWdleCk7XHJcbiAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wRWw7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuY2FjaGVDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSB0aGlzLnBhcnNlQ29udGVudChyZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGlmICh0ZW1wRWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wRWwuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTCA9IHJlc3BvbnNlVGV4dDtcclxuICAgICAgICB0aGlzLmNhY2hlID0gdGVtcEVsO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYWNoZWQgQ29udGVudDogJywgdGhpcy5jYWNoZSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubG9hZENvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0KSB7XHJcbiAgICAgICAgdmFyIHRlbXBFbCA9IHRoaXMucGFyc2VDb250ZW50KHJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgaWYgKHRlbXBFbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBFbC5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MID0gcmVzcG9uc2VUZXh0O1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGNvbnRhaW5zXzEuZGVmYXVsdChkb2N1bWVudCwgdGhpcy5vcHRpb25zLnNlbGVjdG9ycywgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN3aXRjaFNlbGVjdG9ycyh0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCB0ZW1wRWwsIGRvY3VtZW50KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uIChlLCBlT3B0aW9ucykge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdYTUwgSHR0cCBSZXF1ZXN0IFN0YXR1czogJywgdGhpcy5yZXF1ZXN0LnN0YXR1cyk7XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB0aGlzLnJlcXVlc3Q7XHJcbiAgICAgICAgaWYgKHJlcXVlc3QucmVzcG9uc2VUZXh0ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6ZXJyb3InXSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxvYWRUeXBlID0gKGVPcHRpb25zICE9PSBudWxsKSA/IGVPcHRpb25zLnRyaWdnZXJFbGVtZW50LmdldEF0dHJpYnV0ZSh0aGlzLm9wdGlvbnMuYXR0clN0YXRlKSA6IG51bGw7XHJcbiAgICAgICAgc3dpdGNoIChsb2FkVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdwcmVmZXRjaCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmRvUmVxdWVzdCA9IGZ1bmN0aW9uIChocmVmKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcmVxdWVzdE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMucmVxdWVzdE9wdGlvbnMgfHwge307XHJcbiAgICAgICAgdmFyIHJlcWV1c3RNZXRob2QgPSAocmVxdWVzdE9wdGlvbnMucmVxdWVzdE1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB2YXIgcmVxdWVzdFBhcmFtcyA9IHJlcXVlc3RPcHRpb25zLnJlcXVlc3RQYXJhbXMgfHwgbnVsbDtcclxuICAgICAgICB2YXIgdGltZW91dCA9IHRoaXMub3B0aW9ucy50aW1lb3V0IHx8IDA7XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB2YXIgcmVxdWVzdFBheWxvYWQgPSBudWxsO1xyXG4gICAgICAgIHZhciBxdWVyeVN0cmluZztcclxuICAgICAgICBpZiAocmVxdWVzdFBhcmFtcyAmJiByZXF1ZXN0UGFyYW1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBxdWVyeVN0cmluZyA9IChyZXF1ZXN0UGFyYW1zLm1hcChmdW5jdGlvbiAocGFyYW0pIHsgcmV0dXJuIHBhcmFtLm5hbWUgKyAnPScgKyBwYXJhbS52YWx1ZTsgfSkpLmpvaW4oJyYnKTtcclxuICAgICAgICAgICAgc3dpdGNoIChyZXFldXN0TWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdHRVQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhyZWYgPSBocmVmLnNwbGl0KCc/JylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZiArPSAnPyc7XHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZiArPSBxdWVyeVN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1BPU1QnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RQYXlsb2FkID0gcXVlcnlTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYWNoZUJ1c3QpXHJcbiAgICAgICAgICAgIGhyZWYgKz0gKHF1ZXJ5U3RyaW5nLmxlbmd0aCkgPyAoJyZ0PScgKyBEYXRlLm5vdygpKSA6ICgndD0nICsgRGF0ZS5ub3coKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKHJlcWV1c3RNZXRob2QsIGhyZWYsIHRydWUpO1xyXG4gICAgICAgICAgICByZXF1ZXN0LnRpbWVvdXQgPSB0aW1lb3V0O1xyXG4gICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVBKQVgnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUEpBWC1TZWxlY3RvcnMnLCBKU09OLnN0cmluZ2lmeShfdGhpcy5vcHRpb25zLnNlbGVjdG9ycykpO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IHJlc29sdmU7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IHJlamVjdDtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKHJlcXVlc3RQYXlsb2FkKTtcclxuICAgICAgICAgICAgX3RoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUHJlZmV0Y2ggPSBmdW5jdGlvbiAoaHJlZiwgZU9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQcmVmZXRjaGluZzogJywgaHJlZik7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OnByZWZldGNoJ10pO1xyXG4gICAgICAgIHRoaXMuZG9SZXF1ZXN0KGhyZWYpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsIGVPcHRpb25zKTsgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVMb2FkID0gZnVuY3Rpb24gKGhyZWYsIGVPcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgQ2FjaGVkOiAnLCBocmVmKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnJlcXVlc3QgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIFByZWZldGNoOiAnLCBocmVmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZzogJywgaHJlZik7XHJcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6c2VuZCddKTtcclxuICAgICAgICAgICAgdGhpcy5kb1JlcXVlc3QoaHJlZilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsIGVPcHRpb25zKTsgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmNsZWFyUHJlZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmNhbmNlbCddKTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGpheDtcclxufSgpKTtcclxubW9kdWxlLmV4cG9ydHMgPSBQamF4O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wamF4LmpzLm1hcCJdfQ==
