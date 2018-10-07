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
                this.cacheContent(request.responseText);
                break;
            case 'popstate':
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
        this.abortRequest();
        trigger_1.default(document, ['pjax:cancel']);
        this.cache = null;
    };
    return Pjax;
}());
module.exports = Pjax;

},{"./lib/events/link-events":1,"./lib/events/trigger":3,"./lib/parse-options":4,"./lib/util/check-element":5,"./lib/util/contains":6,"./lib/uuid":7}]},{},[8])(8)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBvbl8xID0gcmVxdWlyZShcIi4vb25cIik7XHJcbnZhciBpc0RlZmF1bHRQcmV2ZW50ZWQgPSBmdW5jdGlvbiAoZWwsIGUpIHtcclxuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBlbHNlIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ3ByZXZlbnQtZGVmYXVsdCcpICE9PSBudWxsKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZWxzZSBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCduby10cmFuc2l0aW9uJykpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG52YXIgY2hlY2tGb3JBYm9ydCA9IGZ1bmN0aW9uIChlbCwgZSkge1xyXG4gICAgaWYgKGVsLnByb3RvY29sICE9PSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfHwgZWwuaG9zdCAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3QpXHJcbiAgICAgICAgcmV0dXJuICdleHRlcm5hbCc7XHJcbiAgICBpZiAoZWwuaGFzaCAmJiBlbC5ocmVmLnJlcGxhY2UoZWwuaGFzaCwgJycpID09PSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKGxvY2F0aW9uLmhhc2gsICcnKSlcclxuICAgICAgICByZXR1cm4gJ2FuY2hvcic7XHJcbiAgICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSArICcjJylcclxuICAgICAgICByZXR1cm4gJ2FuY2hvci1lbXB0eSc7XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxudmFyIGhhbmRsZUNsaWNrID0gZnVuY3Rpb24gKGVsLCBlLCBwamF4KSB7XHJcbiAgICBpZiAoaXNEZWZhdWx0UHJldmVudGVkKGVsLCBlKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgZXZlbnRPcHRpb25zID0ge1xyXG4gICAgICAgIHRyaWdnZXJFbGVtZW50OiBlbFxyXG4gICAgfTtcclxuICAgIHZhciBhdHRyVmFsdWUgPSBjaGVja0ZvckFib3J0KGVsLCBlKTtcclxuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUocGpheC5vcHRpb25zLmF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlLCAncmVsb2FkJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZWwuc2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUsICdsb2FkJyk7XHJcbiAgICBwamF4LmhhbmRsZUxvYWQoZWwuaHJlZiwgZWwuZ2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUpKTtcclxufTtcclxudmFyIGhhbmRsZUhvdmVyID0gZnVuY3Rpb24gKGVsLCBlLCBwamF4KSB7XHJcbiAgICBpZiAoaXNEZWZhdWx0UHJldmVudGVkKGVsLCBlKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICBpZiAoZS50eXBlID09PSAnbW91c2VvdXQnKSB7XHJcbiAgICAgICAgcGpheC5jbGVhclByZWZldGNoKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdmFyIGV2ZW50T3B0aW9ucyA9IHtcclxuICAgICAgICB0cmlnZ2VyRWxlbWVudDogZWxcclxuICAgIH07XHJcbiAgICB2YXIgYXR0clZhbHVlID0gY2hlY2tGb3JBYm9ydChlbCwgZSk7XHJcbiAgICBpZiAoYXR0clZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUsIGF0dHJWYWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKGVsLmhyZWYgIT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0pXHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUsICdwcmVmZXRjaCcpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIHBqYXguaGFuZGxlUHJlZmV0Y2goZWwuaHJlZiwgZXZlbnRPcHRpb25zKTtcclxufTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgcGpheCkge1xyXG4gICAgZWwuc2V0QXR0cmlidXRlKHBqYXgub3B0aW9ucy5hdHRyU3RhdGUsICcnKTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlQ2xpY2soZWwsIGUsIHBqYXgpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChlKSB7IGhhbmRsZUhvdmVyKGVsLCBlLCBwamF4KTsgfSk7XHJcbiAgICBvbl8xLmRlZmF1bHQoZWwsICdtb3VzZW91dCcsIGZ1bmN0aW9uIChlKSB7IGhhbmRsZUhvdmVyKGVsLCBlLCBwamF4KTsgfSk7XHJcbiAgICBvbl8xLmRlZmF1bHQoZWwsICdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGUua2V5ID09PSAnZW50ZXInIHx8IGUua2V5Q29kZSA9PT0gMTMpXHJcbiAgICAgICAgICAgIGhhbmRsZUNsaWNrKGVsLCBlLCBwamF4KTtcclxuICAgIH0pO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGluay1ldmVudHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCwgZXZlbnQsIGxpc3RlbmVyKSB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBldmVudHMpIHtcclxuICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KGUpO1xyXG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmlnZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0gbnVsbDsgfVxyXG4gICAgdmFyIHBhcnNlZE9wdGlvbnMgPSAob3B0aW9ucyAhPT0gbnVsbCkgPyBvcHRpb25zIDoge307XHJcbiAgICBwYXJzZWRPcHRpb25zLmVsZW1lbnRzID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5lbGVtZW50cyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuZWxlbWVudHMgOiAnYVtocmVmXSc7XHJcbiAgICBwYXJzZWRPcHRpb25zLnNlbGVjdG9ycyA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuc2VsZWN0b3JzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5zZWxlY3RvcnMgOiBbJ3RpdGxlJywgJy5qcy1wamF4J107XHJcbiAgICBwYXJzZWRPcHRpb25zLnN3aXRjaGVzID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zd2l0Y2hlcyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuc3dpdGNoZXMgOiB7fTtcclxuICAgIHBhcnNlZE9wdGlvbnMuaGlzdG9yeSA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuaGlzdG9yeSAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuaGlzdG9yeSA6IHRydWU7XHJcbiAgICBwYXJzZWRPcHRpb25zLnNjcm9sbFRvID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5zY3JvbGxUbyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuc2Nyb2xsVG8gOiAwO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5jYWNoZUJ1c3QgPSAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmNhY2hlQnVzdCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuY2FjaGVCdXN0IDogZmFsc2U7XHJcbiAgICBwYXJzZWRPcHRpb25zLmRlYnVnID0gKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucy5kZWJ1ZyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMuZGVidWcgOiBmYWxzZTtcclxuICAgIHBhcnNlZE9wdGlvbnMudGltZW91dCA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMudGltZW91dCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMudGltZW91dCA6IDA7XHJcbiAgICBwYXJzZWRPcHRpb25zLmF0dHJTdGF0ZSA9IChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMuYXR0clN0YXRlICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5hdHRyU3RhdGUgOiAnZGF0YS1wamF4LXN0YXRlJztcclxuICAgIHJldHVybiBwYXJzZWRPcHRpb25zO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2Utb3B0aW9ucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBwamF4KSB7XHJcbiAgICBzd2l0Y2ggKGVsLnRhZ05hbWUudG9Mb2NhbGVMb3dlckNhc2UoKSkge1xyXG4gICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgICBpZiAoIWVsLmhhc0F0dHJpYnV0ZShwamF4Lm9wdGlvbnMuYXR0clN0YXRlKSlcclxuICAgICAgICAgICAgICAgIHBqYXguc2V0TGlua0xpc3RlbmVycyhlbCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93ICdQamF4IGNhbiBvbmx5IGJlIGFwcGxpZWQgb24gPGE+IGVsZW1lbnRzJztcclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZWNrLWVsZW1lbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChkb2MsIHNlbGVjdG9ycywgZWxlbWVudCkge1xyXG4gICAgc2VsZWN0b3JzLm1hcChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgc2VsZWN0b3JFbHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgc2VsZWN0b3JFbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgaWYgKGVsLmNvbnRhaW5zKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb250YWlucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV1aWQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHBhcnNlX29wdGlvbnNfMSA9IHJlcXVpcmUoXCIuL2xpYi9wYXJzZS1vcHRpb25zXCIpO1xyXG52YXIgdXVpZF8xID0gcmVxdWlyZShcIi4vbGliL3V1aWRcIik7XHJcbnZhciB0cmlnZ2VyXzEgPSByZXF1aXJlKFwiLi9saWIvZXZlbnRzL3RyaWdnZXJcIik7XHJcbnZhciBjb250YWluc18xID0gcmVxdWlyZShcIi4vbGliL3V0aWwvY29udGFpbnNcIik7XHJcbnZhciBsaW5rX2V2ZW50c18xID0gcmVxdWlyZShcIi4vbGliL2V2ZW50cy9saW5rLWV2ZW50c1wiKTtcclxudmFyIGNoZWNrX2VsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2xpYi91dGlsL2NoZWNrLWVsZW1lbnRcIik7XHJcbnZhciBQamF4ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBqYXgob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcclxuICAgICAgICAgICAgaGlzdG9yeTogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsUG9zOiBbMCwgMF1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHBhcnNlX29wdGlvbnNfMS5kZWZhdWx0KG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMubGFzdFVVSUQgPSB1dWlkXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BqYXggT3B0aW9uczonLCB0aGlzLm9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG4gICAgUGpheC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uIChlKSB7IHJldHVybiBfdGhpcy5oYW5kbGVQb3BzdGF0ZShlKTsgfSk7XHJcbiAgICAgICAgdGhpcy5wYXJzZURPTShkb2N1bWVudC5ib2R5KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVSZWxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnNldExpbmtMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICBsaW5rX2V2ZW50c18xLmRlZmF1bHQoZWwsIHRoaXMpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmdldEVsZW1lbnRzID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5vcHRpb25zLmVsZW1lbnRzKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5wYXJzZURPTSA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gdGhpcy5nZXRFbGVtZW50cyhlbCk7XHJcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgY2hlY2tfZWxlbWVudF8xLmRlZmF1bHQoZWwsIF90aGlzKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVSZWZyZXNoID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZURPTShlbCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUG9wc3RhdGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChlLnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSGlqYWNraW5nIFBvcHN0YXRlIEV2ZW50Jyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFVybChlLnN0YXRlLnVybCwgJ3BvcHN0YXRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmFib3J0UmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0ID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkVXJsID0gZnVuY3Rpb24gKGhyZWYsIGxvYWRUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxvYWQoaHJlZiwgbG9hZFR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQdXNoU3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IHt9KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmhpc3RvcnkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1B1c2hpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnN0YXRlLnRpdGxlLCB0aGlzLnN0YXRlLnVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXBsYWNpbmcgSGlzdG9yeSBTdGF0ZTogJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVVUlEID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLnN0YXRlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICB1dWlkOiB0aGlzLmxhc3RVVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvczogWzAsIDBdXHJcbiAgICAgICAgICAgICAgICB9LCBkb2N1bWVudC50aXRsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlU2Nyb2xsUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGlzdG9yeSkge1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgdGVtcC5ocmVmID0gdGhpcy5zdGF0ZS51cmw7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wLmhhc2gpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lXzEgPSB0ZW1wLmhhc2guc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICBuYW1lXzEgPSBkZWNvZGVVUklDb21wb25lbnQobmFtZV8xKTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyVG9wID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lXzEpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKG5hbWVfMSlbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5vZmZzZXRQYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclRvcCArPSB0YXJnZXQub2Zmc2V0VG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Lm9mZnNldFBhcmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAodGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgY3VyclRvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHRoaXMub3B0aW9ucy5zY3JvbGxUbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsUG9zKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh0aGlzLnN0YXRlLnNjcm9sbFBvc1swXSwgdGhpcy5zdGF0ZS5zY3JvbGxQb3NbMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmluaXNoaW5nIFBqYXgnKTtcclxuICAgICAgICB0aGlzLnN0YXRlLnVybCA9IHRoaXMucmVxdWVzdC5yZXNwb25zZVVSTDtcclxuICAgICAgICB0aGlzLnN0YXRlLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY3JvbGxQb3MgPSBbMCwgd2luZG93LnNjcm9sbFldO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUHVzaFN0YXRlKCk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTY3JvbGxQb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuICAgICAgICB0aGlzLnJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6Y29tcGxldGUnLCAncGpheDpzdWNjZXNzJ10pO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVN3aXRjaGVzID0gZnVuY3Rpb24gKHN3aXRjaFF1ZXVlKSB7XHJcbiAgICAgICAgc3dpdGNoUXVldWUubWFwKGZ1bmN0aW9uIChzd2l0Y2hPYmopIHtcclxuICAgICAgICAgICAgc3dpdGNoT2JqLm9sZEVsLmlubmVySFRNTCA9IHN3aXRjaE9iai5uZXdFbC5pbm5lckhUTUw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maW5hbGl6ZSgpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnN3aXRjaFNlbGVjdG9ycyA9IGZ1bmN0aW9uIChzZWxlY3RvcnMsIHRvRWwsIGZyb21FbCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHN3aXRjaFF1ZXVlID0gW107XHJcbiAgICAgICAgc2VsZWN0b3JzLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdFbHMgPSB0b0VsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB2YXIgb2xkRWxzID0gZnJvbUVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQamF4IFN3aXRjaDogJywgc2VsZWN0b3IsIG5ld0Vscywgb2xkRWxzKTtcclxuICAgICAgICAgICAgaWYgKG5ld0Vscy5sZW5ndGggIT09IG9sZEVscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdET00gZG9lc25cXCd0IGxvb2sgdGhlIHNhbWUgb24gdGhlIG5ldyBwYWdlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV3RWxzLmZvckVhY2goZnVuY3Rpb24gKG5ld0VsLCBpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkRWwgPSBvbGRFbHNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxTd2l0Y2ggPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3RWw6IG5ld0VsLFxyXG4gICAgICAgICAgICAgICAgICAgIG9sZEVsOiBvbGRFbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaFF1ZXVlLnB1c2goZWxTd2l0Y2gpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoc3dpdGNoUXVldWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ291bGRuXFwndCBmaW5kIGFueXRoaW5nIHRvIHN3aXRjaCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hlcyhzd2l0Y2hRdWV1ZSk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUubG9hZENhY2hlZENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgY29udGFpbnNfMS5kZWZhdWx0KGRvY3VtZW50LCB0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3dpdGNoU2VsZWN0b3JzKHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIHRoaXMuY2FjaGUsIGRvY3VtZW50KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5wYXJzZUNvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0KSB7XHJcbiAgICAgICAgdmFyIHRlbXBFbCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgnZ2xvYmFscycpO1xyXG4gICAgICAgIHZhciBodG1sUmVnZXggPSAvXFxzP1thLXo6XSsoPz0oPzpcXCd8XFxcIilbXlxcJ1xcXCI+XSsoPzpcXCd8XFxcIikpKi9naTtcclxuICAgICAgICB2YXIgbWF0Y2hlcyA9IHJlc3BvbnNlVGV4dC5tYXRjaChodG1sUmVnZXgpO1xyXG4gICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGVtcEVsO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmNhY2hlQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQpIHtcclxuICAgICAgICB2YXIgdGVtcEVsID0gdGhpcy5wYXJzZUNvbnRlbnQocmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBpZiAodGVtcEVsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6ZXJyb3InXSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcEVsLmRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwgPSByZXNwb25zZVRleHQ7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IHRlbXBFbDtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FjaGVkIENvbnRlbnQ6ICcsIHRoaXMuY2FjaGUpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmxvYWRDb250ZW50ID0gZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgIHZhciB0ZW1wRWwgPSB0aGlzLnBhcnNlQ29udGVudChyZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGlmICh0ZW1wRWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wRWwuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTCA9IHJlc3BvbnNlVGV4dDtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBjb250YWluc18xLmRlZmF1bHQoZG9jdW1lbnQsIHRoaXMub3B0aW9ucy5zZWxlY3RvcnMsIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zd2l0Y2hTZWxlY3RvcnModGhpcy5vcHRpb25zLnNlbGVjdG9ycywgdGVtcEVsLCBkb2N1bWVudCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbiAoZSwgbG9hZFR5cGUpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnWE1MIEh0dHAgUmVxdWVzdCBTdGF0dXM6ICcsIHRoaXMucmVxdWVzdC5zdGF0dXMpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0O1xyXG4gICAgICAgIGlmIChyZXF1ZXN0LnJlc3BvbnNlVGV4dCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAobG9hZFR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAncHJlZmV0Y2gnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVDb250ZW50KHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdwb3BzdGF0ZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZENvbnRlbnQocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmhpc3RvcnkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29udGVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuZG9SZXF1ZXN0ID0gZnVuY3Rpb24gKGhyZWYpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZXF1ZXN0T3B0aW9ucyA9IHRoaXMub3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyB8fCB7fTtcclxuICAgICAgICB2YXIgcmVxZXVzdE1ldGhvZCA9IChyZXF1ZXN0T3B0aW9ucy5yZXF1ZXN0TWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0UGFyYW1zID0gcmVxdWVzdE9wdGlvbnMucmVxdWVzdFBhcmFtcyB8fCBudWxsO1xyXG4gICAgICAgIHZhciB0aW1lb3V0ID0gdGhpcy5vcHRpb25zLnRpbWVvdXQgfHwgMDtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0UGF5bG9hZCA9IG51bGw7XHJcbiAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgIGlmIChyZXF1ZXN0UGFyYW1zICYmIHJlcXVlc3RQYXJhbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5U3RyaW5nID0gKHJlcXVlc3RQYXJhbXMubWFwKGZ1bmN0aW9uIChwYXJhbSkgeyByZXR1cm4gcGFyYW0ubmFtZSArICc9JyArIHBhcmFtLnZhbHVlOyB9KSkuam9pbignJicpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHJlcWV1c3RNZXRob2QpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0dFVCc6XHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZiA9IGhyZWYuc3BsaXQoJz8nKVswXTtcclxuICAgICAgICAgICAgICAgICAgICBocmVmICs9ICc/JztcclxuICAgICAgICAgICAgICAgICAgICBocmVmICs9IHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnUE9TVCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFBheWxvYWQgPSBxdWVyeVN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNhY2hlQnVzdClcclxuICAgICAgICAgICAgaHJlZiArPSAocXVlcnlTdHJpbmcubGVuZ3RoKSA/ICgnJnQ9JyArIERhdGUubm93KCkpIDogKCd0PScgKyBEYXRlLm5vdygpKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4ocmVxZXVzdE1ldGhvZCwgaHJlZiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3QudGltZW91dCA9IHRpbWVvdXQ7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xyXG4gICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUEpBWCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1QSkFYLVNlbGVjdG9ycycsIEpTT04uc3RyaW5naWZ5KF90aGlzLm9wdGlvbnMuc2VsZWN0b3JzKSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25sb2FkID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gcmVqZWN0O1xyXG4gICAgICAgICAgICByZXF1ZXN0LnNlbmQocmVxdWVzdFBheWxvYWQpO1xyXG4gICAgICAgICAgICBfdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQcmVmZXRjaCA9IGZ1bmN0aW9uIChocmVmKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUHJlZmV0Y2hpbmc6ICcsIGhyZWYpO1xyXG4gICAgICAgIHRoaXMuYWJvcnRSZXF1ZXN0KCk7XHJcbiAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDpwcmVmZXRjaCddKTtcclxuICAgICAgICB0aGlzLmRvUmVxdWVzdChocmVmKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZSkgeyBfdGhpcy5oYW5kbGVSZXNwb25zZShlLCAncHJlZmV0Y2gnKTsgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVMb2FkID0gZnVuY3Rpb24gKGhyZWYsIGxvYWRUeXBlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgQ2FjaGVkOiAnLCBocmVmKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQ2FjaGVkQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnJlcXVlc3QgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIFByZWZldGNoOiAnLCBocmVmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZzogJywgaHJlZik7XHJcbiAgICAgICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6c2VuZCddKTtcclxuICAgICAgICAgICAgdGhpcy5kb1JlcXVlc3QoaHJlZilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsIGxvYWRUeXBlKTsgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmNsZWFyUHJlZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmNhbmNlbCddKTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGpheDtcclxufSgpKTtcclxubW9kdWxlLmV4cG9ydHMgPSBQamF4O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wamF4LmpzLm1hcCJdfQ==
