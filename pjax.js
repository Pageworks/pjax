"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_options_1 = require("./lib/parse-options");
var uuid_1 = require("./lib/uuid");
var trigger_1 = require("./lib/events/trigger");
var contains_1 = require("./lib/util/contains");
var Pjax = (function () {
    function Pjax(options) {
        this.state = {
            numPendingSwitches: 0,
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
            this.loadUrl(e.state.url, options);
        }
    };
    Pjax.prototype.loadUrl = function (href, options) {
        if (this.options.debug)
            console.log('Loading url: ${href} with ', options);
        this.abortRequest(this.request);
        if (this.cache === null) {
            trigger_1.default(document, ['pjax:send']);
            this.request = this.doRequest(href, options, this.handleResponse);
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
    Pjax.prototype.abortRequest = function (request) {
        request.onreadystatechange = function () { };
        request.abort();
    };
    Pjax.prototype.parseContent = function (responseText) {
        var tempEl = document.implementation.createHTMLDocument('pjax');
        var htmlRegex = /\s?[a-z:]+(?=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi;
        var matches = responseText.match(htmlRegex);
        if (matches && matches.length)
            return tempEl;
        return null;
    };
    Pjax.prototype.cacheContent = function (responseText, options) {
        var tempEl = this.parseContent(responseText);
        if (tempEl === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        tempEl.documentElement.innerHTML = responseText;
        this.cache = tempEl;
    };
    Pjax.prototype.handleResponse = function (responseText, request, href, options) {
        if (responseText === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        this.state.href = href;
        this.state.options = options;
        this.cacheContent(responseText, options);
    };
    Pjax.prototype.doRequest = function (href, options, callback) {
        var requestOptions = this.options.requestOptions || {};
        var reqeustMethod = (requestOptions.requestMethod || 'GET').toUpperCase();
        var requestParams = requestOptions.requestParams || null;
        var timeout = this.options.timeout || 0;
        var request = new XMLHttpRequest();
        var requestPayload = null;
        var queryString;
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    callback(request.responseText, request, href, options);
                }
                else if (request.status !== 0) {
                    callback(null, request, href, options);
                }
            }
        };
        request.onerror = function (e) {
            console.log(e);
            callback(null, request, href, options);
        };
        request.ontimeout = function () {
            callback(null, request, href, options);
        };
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
        request.open(reqeustMethod, href, true);
        request.timeout = timeout;
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('X-PJAX', 'true');
        request.setRequestHeader('X-PJAX-Selectors', JSON.stringify(this.options.selectors));
        request.send(requestPayload);
        return request;
    };
    return Pjax;
}());
exports.default = Pjax;
//# sourceMappingURL=pjax.js.map