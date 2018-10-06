(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Pjax = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var _this = this;
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
var handleClick = function (el, e) {
    if (isDefaultPrevented(el, e))
        return;
    var eventOptions = {
        triggerElement: el
    };
    var attrValue = checkForAbort(el, e);
    if (attrValue !== null) {
        el.setAttribute(_this.options.attrState, attrValue);
        return;
    }
    e.preventDefault();
    if (el.href === window.location.href.split('#')[0]) {
        el.setAttribute(_this.options.attrState, 'reload');
        return;
    }
    el.setAttribute(_this.options.attrState, 'load');
    _this.handleLoad(el.href, eventOptions);
};
var handleHover = function (el, e) {
    if (isDefaultPrevented(el, e))
        return;
    if (e.type === 'mouseout') {
        _this.handleUnhover();
        return;
    }
    var eventOptions = {
        triggerElement: el
    };
    var attrValue = checkForAbort(el, e);
    if (attrValue !== null) {
        el.setAttribute(_this.options.attrState, attrValue);
        return;
    }
    if (el.href !== window.location.href.split('#')[0])
        el.setAttribute(_this.options.attrState, 'prefetch');
    else
        return;
    _this.handlePrefetch(el.href, eventOptions);
};
exports.default = (function (el) {
    el.setAttribute(_this.options.attrState, '');
    on_1.default(el, 'click', function (e) { handleClick(el, e); });
    on_1.default(el, 'mouseover', function (e) { handleHover(el, e); });
    on_1.default(el, 'mouseout', function (e) { handleHover(el, e); });
    on_1.default(el, 'keyup', function (e) {
        if (e.key === 'enter' || e.keyCode === 13)
            handleClick(el, e);
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
    parsedOptions.elements = (options !== null) ? options.elements : 'a[href]';
    parsedOptions.selectors = (options !== null) ? options.selectors : ['title', '.js-pjax'];
    parsedOptions.switches = (options !== null) ? options.switches : {};
    parsedOptions.history = (options !== null) ? options.history : true;
    parsedOptions.scrollTo = (options !== null) ? options.scrollTo : 0;
    parsedOptions.cacheBust = (options !== null) ? options.cacheBust : false;
    parsedOptions.debug = (options !== null) ? options.debug : false;
    parsedOptions.timeout = (options !== null) ? options.timeout : 0;
    parsedOptions.attrState = (options !== null) ? options.attrState : 'data-pjax-state';
    return parsedOptions;
});

},{}],5:[function(require,module,exports){
"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (el) {
    switch (el.tagName.toLocaleLowerCase()) {
        case 'a':
            if (!el.hasAttribute(_this.options.attrState))
                _this.setLinkListeners(el);
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
            href: null,
            options: null
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
        link_events_1.default(el);
    };
    Pjax.prototype.getElements = function (el) {
        return el.querySelectorAll(this.options.elements);
    };
    Pjax.prototype.parseDOM = function (el) {
        var elements = this.getElements(el);
        elements.forEach(function (el) {
            check_element_1.default(el);
        });
    };
    Pjax.prototype.handleRefresh = function (el) {
        this.parseDOM(el);
    };
    Pjax.prototype.handlePopstate = function (e) {
        if (e.state) {
            var options = {
                url: e.state.url,
                title: e.state.title,
                history: false,
                scrollPos: e.state.scrollPos,
                backward: (e.state.uuid < this.lastUUID) ? true : false
            };
            this.lastUUID = e.state.uuid;
        }
    };
    Pjax.prototype.abortRequest = function () {
        this.request.abort();
    };
    Pjax.prototype.loadUrl = function (href, eOptions) {
        var _this = this;
        if (this.options.debug)
            console.log('Loading url: ${href} with ', eOptions);
        this.abortRequest();
        if (this.cache === null) {
            trigger_1.default(document, ['pjax:send']);
            this.doRequest(href, eOptions)
                .then(function (e) {
            })
                .catch(function (e) {
                if (_this.options.debug)
                    console.log('XHR Request Error: ', e);
            });
        }
        else {
            this.loadCachedContent();
        }
    };
    Pjax.prototype.switchSelectors = function (selectors, fromEl, toEl, options) {
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
        this.switchSelectors(this.options.selectors, this.cache, document, this.options);
    };
    Pjax.prototype.parseContent = function (responseText) {
        var tempEl = document.implementation.createHTMLDocument('pjax');
        var htmlRegex = /\s?[a-z:]+(?=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi;
        var matches = responseText.match(htmlRegex);
        if (matches && matches.length)
            return tempEl;
        return null;
    };
    Pjax.prototype.cacheContent = function (responseText, eOptions) {
        var tempEl = this.parseContent(responseText);
        if (tempEl === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        tempEl.documentElement.innerHTML = responseText;
        this.cache = tempEl;
    };
    Pjax.prototype.handleResponse = function (e, eOptions) {
        if (e.responseText === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        this.state.href = e.responseURL;
        this.state.options = eOptions;
        switch (eOptions.triggerElement.getAttribute(this.options.attrState)) {
            case 'prefetch':
                this.cacheContent(e.responseText, eOptions);
                break;
        }
    };
    Pjax.prototype.doRequest = function (href, options) {
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
        this.doRequest(href, eOptions)
            .then(function (e) { _this.handleResponse(e, eOptions); })
            .catch(function (e) {
            if (_this.options.debug)
                console.log('XHR Request Error: ', e);
        });
    };
    return Pjax;
}());
module.exports = Pjax;

},{"./lib/events/link-events":1,"./lib/events/trigger":3,"./lib/parse-options":4,"./lib/util/check-element":5,"./lib/util/contains":6,"./lib/uuid":7}]},{},[8])(8)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZXZlbnRzL2xpbmstZXZlbnRzLmpzIiwibGliL2V2ZW50cy9vbi5qcyIsImxpYi9ldmVudHMvdHJpZ2dlci5qcyIsImxpYi9wYXJzZS1vcHRpb25zLmpzIiwibGliL3V0aWwvY2hlY2stZWxlbWVudC5qcyIsImxpYi91dGlsL2NvbnRhaW5zLmpzIiwibGliL3V1aWQuanMiLCJwamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfdGhpcyA9IHRoaXM7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIG9uXzEgPSByZXF1aXJlKFwiLi9vblwiKTtcclxudmFyIGlzRGVmYXVsdFByZXZlbnRlZCA9IGZ1bmN0aW9uIChlbCwgZSkge1xyXG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZClcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZSgncHJldmVudC1kZWZhdWx0JykgIT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBlbHNlIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ25vLXRyYW5zaXRpb24nKSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbn07XHJcbnZhciBjaGVja0ZvckFib3J0ID0gZnVuY3Rpb24gKGVsLCBlKSB7XHJcbiAgICBpZiAoZWwucHJvdG9jb2wgIT09IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB8fCBlbC5ob3N0ICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdClcclxuICAgICAgICByZXR1cm4gJ2V4dGVybmFsJztcclxuICAgIGlmIChlbC5oYXNoICYmIGVsLmhyZWYucmVwbGFjZShlbC5oYXNoLCAnJykgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgJycpKVxyXG4gICAgICAgIHJldHVybiAnYW5jaG9yJztcclxuICAgIGlmIChlbC5ocmVmID09PSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdICsgJyMnKVxyXG4gICAgICAgIHJldHVybiAnYW5jaG9yLWVtcHR5JztcclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG52YXIgaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZWwsIGUpIHtcclxuICAgIGlmIChpc0RlZmF1bHRQcmV2ZW50ZWQoZWwsIGUpKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIHZhciBldmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgdHJpZ2dlckVsZW1lbnQ6IGVsXHJcbiAgICB9O1xyXG4gICAgdmFyIGF0dHJWYWx1ZSA9IGNoZWNrRm9yQWJvcnQoZWwsIGUpO1xyXG4gICAgaWYgKGF0dHJWYWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShfdGhpcy5vcHRpb25zLmF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShfdGhpcy5vcHRpb25zLmF0dHJTdGF0ZSwgJ3JlbG9hZCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGVsLnNldEF0dHJpYnV0ZShfdGhpcy5vcHRpb25zLmF0dHJTdGF0ZSwgJ2xvYWQnKTtcclxuICAgIF90aGlzLmhhbmRsZUxvYWQoZWwuaHJlZiwgZXZlbnRPcHRpb25zKTtcclxufTtcclxudmFyIGhhbmRsZUhvdmVyID0gZnVuY3Rpb24gKGVsLCBlKSB7XHJcbiAgICBpZiAoaXNEZWZhdWx0UHJldmVudGVkKGVsLCBlKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICBpZiAoZS50eXBlID09PSAnbW91c2VvdXQnKSB7XHJcbiAgICAgICAgX3RoaXMuaGFuZGxlVW5ob3ZlcigpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciBldmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgdHJpZ2dlckVsZW1lbnQ6IGVsXHJcbiAgICB9O1xyXG4gICAgdmFyIGF0dHJWYWx1ZSA9IGNoZWNrRm9yQWJvcnQoZWwsIGUpO1xyXG4gICAgaWYgKGF0dHJWYWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShfdGhpcy5vcHRpb25zLmF0dHJTdGF0ZSwgYXR0clZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoZWwuaHJlZiAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXSlcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoX3RoaXMub3B0aW9ucy5hdHRyU3RhdGUsICdwcmVmZXRjaCcpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIF90aGlzLmhhbmRsZVByZWZldGNoKGVsLmhyZWYsIGV2ZW50T3B0aW9ucyk7XHJcbn07XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwpIHtcclxuICAgIGVsLnNldEF0dHJpYnV0ZShfdGhpcy5vcHRpb25zLmF0dHJTdGF0ZSwgJycpO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBoYW5kbGVDbGljayhlbCwgZSk7IH0pO1xyXG4gICAgb25fMS5kZWZhdWx0KGVsLCAnbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ21vdXNlb3V0JywgZnVuY3Rpb24gKGUpIHsgaGFuZGxlSG92ZXIoZWwsIGUpOyB9KTtcclxuICAgIG9uXzEuZGVmYXVsdChlbCwgJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5rZXkgPT09ICdlbnRlcicgfHwgZS5rZXlDb2RlID09PSAxMylcclxuICAgICAgICAgICAgaGFuZGxlQ2xpY2soZWwsIGUpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5rLWV2ZW50cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKGVsLCBldmVudCwgbGlzdGVuZXIpIHtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IChmdW5jdGlvbiAoZWwsIGV2ZW50cykge1xyXG4gICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoZSk7XHJcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyaWdnZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSBudWxsOyB9XHJcbiAgICB2YXIgcGFyc2VkT3B0aW9ucyA9IChvcHRpb25zICE9PSBudWxsKSA/IG9wdGlvbnMgOiB7fTtcclxuICAgIHBhcnNlZE9wdGlvbnMuZWxlbWVudHMgPSAob3B0aW9ucyAhPT0gbnVsbCkgPyBvcHRpb25zLmVsZW1lbnRzIDogJ2FbaHJlZl0nO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5zZWxlY3RvcnMgPSAob3B0aW9ucyAhPT0gbnVsbCkgPyBvcHRpb25zLnNlbGVjdG9ycyA6IFsndGl0bGUnLCAnLmpzLXBqYXgnXTtcclxuICAgIHBhcnNlZE9wdGlvbnMuc3dpdGNoZXMgPSAob3B0aW9ucyAhPT0gbnVsbCkgPyBvcHRpb25zLnN3aXRjaGVzIDoge307XHJcbiAgICBwYXJzZWRPcHRpb25zLmhpc3RvcnkgPSAob3B0aW9ucyAhPT0gbnVsbCkgPyBvcHRpb25zLmhpc3RvcnkgOiB0cnVlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5zY3JvbGxUbyA9IChvcHRpb25zICE9PSBudWxsKSA/IG9wdGlvbnMuc2Nyb2xsVG8gOiAwO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5jYWNoZUJ1c3QgPSAob3B0aW9ucyAhPT0gbnVsbCkgPyBvcHRpb25zLmNhY2hlQnVzdCA6IGZhbHNlO1xyXG4gICAgcGFyc2VkT3B0aW9ucy5kZWJ1ZyA9IChvcHRpb25zICE9PSBudWxsKSA/IG9wdGlvbnMuZGVidWcgOiBmYWxzZTtcclxuICAgIHBhcnNlZE9wdGlvbnMudGltZW91dCA9IChvcHRpb25zICE9PSBudWxsKSA/IG9wdGlvbnMudGltZW91dCA6IDA7XHJcbiAgICBwYXJzZWRPcHRpb25zLmF0dHJTdGF0ZSA9IChvcHRpb25zICE9PSBudWxsKSA/IG9wdGlvbnMuYXR0clN0YXRlIDogJ2RhdGEtcGpheC1zdGF0ZSc7XHJcbiAgICByZXR1cm4gcGFyc2VkT3B0aW9ucztcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLW9wdGlvbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfdGhpcyA9IHRoaXM7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgc3dpdGNoIChlbC50YWdOYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICBjYXNlICdhJzpcclxuICAgICAgICAgICAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUoX3RoaXMub3B0aW9ucy5hdHRyU3RhdGUpKVxyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0TGlua0xpc3RlbmVycyhlbCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93ICdQamF4IGNhbiBvbmx5IGJlIGFwcGxpZWQgb24gPGE+IGVsZW1lbnRzJztcclxuICAgIH1cclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZWNrLWVsZW1lbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChkb2MsIHNlbGVjdG9ycywgZWxlbWVudCkge1xyXG4gICAgc2VsZWN0b3JzLm1hcChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgc2VsZWN0b3JFbHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgc2VsZWN0b3JFbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgaWYgKGVsLmNvbnRhaW5zKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb250YWlucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICdwamF4XycgKyBEYXRlLm5vdygpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXVpZC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgcGFyc2Vfb3B0aW9uc18xID0gcmVxdWlyZShcIi4vbGliL3BhcnNlLW9wdGlvbnNcIik7XHJcbnZhciB1dWlkXzEgPSByZXF1aXJlKFwiLi9saWIvdXVpZFwiKTtcclxudmFyIHRyaWdnZXJfMSA9IHJlcXVpcmUoXCIuL2xpYi9ldmVudHMvdHJpZ2dlclwiKTtcclxudmFyIGNvbnRhaW5zXzEgPSByZXF1aXJlKFwiLi9saWIvdXRpbC9jb250YWluc1wiKTtcclxudmFyIGxpbmtfZXZlbnRzXzEgPSByZXF1aXJlKFwiLi9saWIvZXZlbnRzL2xpbmstZXZlbnRzXCIpO1xyXG52YXIgY2hlY2tfZWxlbWVudF8xID0gcmVxdWlyZShcIi4vbGliL3V0aWwvY2hlY2stZWxlbWVudFwiKTtcclxudmFyIFBqYXggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUGpheChvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaHJlZjogbnVsbCxcclxuICAgICAgICAgICAgb3B0aW9uczogbnVsbFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gcGFyc2Vfb3B0aW9uc18xLmRlZmF1bHQob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5sYXN0VVVJRCA9IHV1aWRfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGpheCBPcHRpb25zOicsIHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbiAgICBQamF4LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24gKGUpIHsgcmV0dXJuIF90aGlzLmhhbmRsZVBvcHN0YXRlKGUpOyB9KTtcclxuICAgICAgICB0aGlzLnBhcnNlRE9NKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuc2V0TGlua0xpc3RlbmVycyA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIGxpbmtfZXZlbnRzXzEuZGVmYXVsdChlbCk7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuZ2V0RWxlbWVudHMgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMuZWxlbWVudHMpO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnBhcnNlRE9NID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gdGhpcy5nZXRFbGVtZW50cyhlbCk7XHJcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgY2hlY2tfZWxlbWVudF8xLmRlZmF1bHQoZWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmhhbmRsZVJlZnJlc2ggPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICB0aGlzLnBhcnNlRE9NKGVsKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQb3BzdGF0ZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGUuc3RhdGUpIHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IGUuc3RhdGUudXJsLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IGUuc3RhdGUudGl0bGUsXHJcbiAgICAgICAgICAgICAgICBoaXN0b3J5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNjcm9sbFBvczogZS5zdGF0ZS5zY3JvbGxQb3MsXHJcbiAgICAgICAgICAgICAgICBiYWNrd2FyZDogKGUuc3RhdGUudXVpZCA8IHRoaXMubGFzdFVVSUQpID8gdHJ1ZSA6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVVSUQgPSBlLnN0YXRlLnV1aWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmFib3J0UmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5sb2FkVXJsID0gZnVuY3Rpb24gKGhyZWYsIGVPcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyB1cmw6ICR7aHJlZn0gd2l0aCAnLCBlT3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5hYm9ydFJlcXVlc3QoKTtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OnNlbmQnXSk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9SZXF1ZXN0KGhyZWYsIGVPcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuZGVidWcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRDYWNoZWRDb250ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLnN3aXRjaFNlbGVjdG9ycyA9IGZ1bmN0aW9uIChzZWxlY3RvcnMsIGZyb21FbCwgdG9FbCwgb3B0aW9ucykge1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmxvYWRDYWNoZWRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGNvbnRhaW5zXzEuZGVmYXVsdChkb2N1bWVudCwgdGhpcy5vcHRpb25zLnNlbGVjdG9ycywgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN3aXRjaFNlbGVjdG9ycyh0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCB0aGlzLmNhY2hlLCBkb2N1bWVudCwgdGhpcy5vcHRpb25zKTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5wYXJzZUNvbnRlbnQgPSBmdW5jdGlvbiAocmVzcG9uc2VUZXh0KSB7XHJcbiAgICAgICAgdmFyIHRlbXBFbCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgncGpheCcpO1xyXG4gICAgICAgIHZhciBodG1sUmVnZXggPSAvXFxzP1thLXo6XSsoPz0oPzpcXCd8XFxcIilbXlxcJ1xcXCI+XSsoPzpcXCd8XFxcIikpKi9naTtcclxuICAgICAgICB2YXIgbWF0Y2hlcyA9IHJlc3BvbnNlVGV4dC5tYXRjaChodG1sUmVnZXgpO1xyXG4gICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGVtcEVsO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfTtcclxuICAgIFBqYXgucHJvdG90eXBlLmNhY2hlQ29udGVudCA9IGZ1bmN0aW9uIChyZXNwb25zZVRleHQsIGVPcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIHRlbXBFbCA9IHRoaXMucGFyc2VDb250ZW50KHJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgaWYgKHRlbXBFbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyXzEuZGVmYXVsdChkb2N1bWVudCwgWydwamF4OmVycm9yJ10pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBFbC5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MID0gcmVzcG9uc2VUZXh0O1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSB0ZW1wRWw7XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbiAoZSwgZU9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoZS5yZXNwb25zZVRleHQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdHJpZ2dlcl8xLmRlZmF1bHQoZG9jdW1lbnQsIFsncGpheDplcnJvciddKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXRlLmhyZWYgPSBlLnJlc3BvbnNlVVJMO1xyXG4gICAgICAgIHRoaXMuc3RhdGUub3B0aW9ucyA9IGVPcHRpb25zO1xyXG4gICAgICAgIHN3aXRjaCAoZU9wdGlvbnMudHJpZ2dlckVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5hdHRyU3RhdGUpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3ByZWZldGNoJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVDb250ZW50KGUucmVzcG9uc2VUZXh0LCBlT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGpheC5wcm90b3R5cGUuZG9SZXF1ZXN0ID0gZnVuY3Rpb24gKGhyZWYsIG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZXF1ZXN0T3B0aW9ucyA9IHRoaXMub3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyB8fCB7fTtcclxuICAgICAgICB2YXIgcmVxZXVzdE1ldGhvZCA9IChyZXF1ZXN0T3B0aW9ucy5yZXF1ZXN0TWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0UGFyYW1zID0gcmVxdWVzdE9wdGlvbnMucmVxdWVzdFBhcmFtcyB8fCBudWxsO1xyXG4gICAgICAgIHZhciB0aW1lb3V0ID0gdGhpcy5vcHRpb25zLnRpbWVvdXQgfHwgMDtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0UGF5bG9hZCA9IG51bGw7XHJcbiAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgIGlmIChyZXF1ZXN0UGFyYW1zICYmIHJlcXVlc3RQYXJhbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5U3RyaW5nID0gKHJlcXVlc3RQYXJhbXMubWFwKGZ1bmN0aW9uIChwYXJhbSkgeyByZXR1cm4gcGFyYW0ubmFtZSArICc9JyArIHBhcmFtLnZhbHVlOyB9KSkuam9pbignJicpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHJlcWV1c3RNZXRob2QpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0dFVCc6XHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZiA9IGhyZWYuc3BsaXQoJz8nKVswXTtcclxuICAgICAgICAgICAgICAgICAgICBocmVmICs9ICc/JztcclxuICAgICAgICAgICAgICAgICAgICBocmVmICs9IHF1ZXJ5U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnUE9TVCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFBheWxvYWQgPSBxdWVyeVN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNhY2hlQnVzdClcclxuICAgICAgICAgICAgaHJlZiArPSAocXVlcnlTdHJpbmcubGVuZ3RoKSA/ICgnJnQ9JyArIERhdGUubm93KCkpIDogKCd0PScgKyBEYXRlLm5vdygpKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4ocmVxZXVzdE1ldGhvZCwgaHJlZiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3QudGltZW91dCA9IHRpbWVvdXQ7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xyXG4gICAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUEpBWCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1QSkFYLVNlbGVjdG9ycycsIEpTT04uc3RyaW5naWZ5KF90aGlzLm9wdGlvbnMuc2VsZWN0b3JzKSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25sb2FkID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gcmVqZWN0O1xyXG4gICAgICAgICAgICByZXF1ZXN0LnNlbmQocmVxdWVzdFBheWxvYWQpO1xyXG4gICAgICAgICAgICBfdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQamF4LnByb3RvdHlwZS5oYW5kbGVQcmVmZXRjaCA9IGZ1bmN0aW9uIChocmVmLCBlT3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZylcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1ByZWZldGNoaW5nOiAnLCBocmVmKTtcclxuICAgICAgICB0aGlzLmFib3J0UmVxdWVzdCgpO1xyXG4gICAgICAgIHRyaWdnZXJfMS5kZWZhdWx0KGRvY3VtZW50LCBbJ3BqYXg6cHJlZmV0Y2gnXSk7XHJcbiAgICAgICAgdGhpcy5kb1JlcXVlc3QoaHJlZiwgZU9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChlKSB7IF90aGlzLmhhbmRsZVJlc3BvbnNlKGUsIGVPcHRpb25zKTsgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcHRpb25zLmRlYnVnKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1hIUiBSZXF1ZXN0IEVycm9yOiAnLCBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGpheDtcclxufSgpKTtcclxubW9kdWxlLmV4cG9ydHMgPSBQamF4O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wamF4LmpzLm1hcCJdfQ==
