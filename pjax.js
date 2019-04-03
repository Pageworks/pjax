"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_options_1 = require("./lib/parse-options");
var trigger_1 = require("./lib/events/trigger");
var parse_dom_1 = require("./lib/parse-dom");
var scroll_1 = require("./lib/util/scroll");
var clear_active_1 = require("./lib/util/clear-active");
var state_manager_1 = require("@codewithkyle/state-manager");
var device_manager_1 = require("@codewithkyle/device-manager");
var Pjax = (function () {
    function Pjax(options) {
        var _this = this;
        this.handlePopstate = function (e) {
            if (e.state) {
                if (_this.options.debug) {
                    console.log('%c[Pjax] ' + "%chijacking popstate event", 'color:#f3ff35', 'color:#eee');
                }
                _this._scrollTo = e.state.scrollPos;
                _this.loadUrl(e.state.uri, 'popstate');
            }
        };
        this.handleContinue = function (e) {
            if (_this._cachedSwitch !== null) {
                if (_this.options.titleSwitch) {
                    document.title = _this._cachedSwitch.title;
                }
                _this.handleSwitches(_this._cachedSwitch.queue);
            }
            else {
                if (_this.options.debug) {
                    console.log('%c[Pjax] ' + "%cswitch queue was empty. You might be sending pjax:continue early", 'color:#f3ff35', 'color:#eee');
                }
                trigger_1.default(document, ['pjax:error']);
            }
        };
        this._dom = document.documentElement;
        if (device_manager_1.default.isIE) {
            console.log('%c[Pjax] ' + "%cIE 11 detected - Pjax aborted", 'color:#f3ff35', 'color:#eee');
            this._dom.classList.remove('dom-is-loading');
            this._dom.classList.add('dom-is-loaded');
            return;
        }
        this._cache = null;
        this.options = parse_options_1.default(options);
        this._request = null;
        this._response = null;
        this._confirmed = false;
        this._cachedSwitch = null;
        this._scrollTo = { x: 0, y: 0 };
        this._isPushstate = true;
        this.init();
    }
    Pjax.prototype.init = function () {
        if (this.options.debug) {
            console.log('%c[Pjax] ' + ("%cinitializing Pjax version " + Pjax.VERSION), 'color:#f3ff35', 'color:#eee');
            console.log('%c[Pjax] ' + "%cview Pjax documentation at http://papertrain.io/pjax", 'color:#f3ff35', 'color:#eee');
            console.log('%c[Pjax] ' + "%cloaded with the following options: ", 'color:#f3ff35', 'color:#eee');
            console.log(this.options);
        }
        this._dom.classList.add('dom-is-loaded');
        this._dom.classList.remove('dom-is-loading');
        new state_manager_1.default(this.options.debug, true);
        window.addEventListener('popstate', this.handlePopstate);
        if (this.options.customTransitions) {
            document.addEventListener('pjax:continue', this.handleContinue);
        }
        parse_dom_1.default(document.body, this);
    };
    Pjax.prototype.loadUrl = function (href, loadType) {
        this.abortRequest();
        this._cache = null;
        this.handleLoad(href, loadType);
    };
    Pjax.prototype.abortRequest = function () {
        this._request = null;
        this._response = null;
    };
    Pjax.prototype.finalize = function () {
        if (this.options.debug) {
            console.log('%c[Pjax] ' + "%cpage transition completed", 'color:#f3ff35', 'color:#eee');
        }
        scroll_1.default(this._scrollTo);
        if (this.options.history) {
            if (this._isPushstate) {
                state_manager_1.default.doPush(this._response.url, document.title);
            }
            else {
                state_manager_1.default.doReplace(this._response.url, document.title);
            }
        }
        this._cache = null;
        this._request = null;
        this._response = null;
        this._confirmed = false;
        this._cachedSwitch = null;
        this._isPushstate = true;
        this._scrollTo = { x: 0, y: 0 };
        trigger_1.default(document, ['pjax:complete']);
        this._dom.classList.add('dom-is-loaded');
        this._dom.classList.remove('dom-is-loading');
    };
    Pjax.prototype.handleSwitches = function (switchQueue) {
        for (var i = 0; i < switchQueue.length; i++) {
            switchQueue[i].current.innerHTML = switchQueue[i].new.innerHTML;
            parse_dom_1.default(switchQueue[i].current, this);
        }
        this.finalize();
    };
    Pjax.prototype.switchSelectors = function (selectors, tempDocument, currentDocument) {
        if (tempDocument === null) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + ("%ctemporary document was null, telling the browser to load " + ((this._cache !== null) ? this._cache.url : this._response.url)), 'color:#f3ff35', 'color:#eee');
            }
            if (this._cache !== null) {
                this.lastChance(this._cache.url);
            }
            else {
                this.lastChance(this._response.url);
            }
        }
        var switchQueue = [];
        var contiansScripts = false;
        for (var i = 0; i < selectors.length; i++) {
            var newContainers = Array.from(tempDocument.querySelectorAll(selectors[i]));
            var currentContainers = Array.from(currentDocument.querySelectorAll(selectors[i]));
            if (this.options.debug) {
                console.log('%c[Pjax] ' + ("%cswapping content from " + selectors[i]), 'color:#f3ff35', 'color:#eee');
            }
            if (newContainers.length !== currentContainers.length) {
                if (this.options.debug) {
                    console.log('%c[Pjax] ' + "%cthe dom doesn't look the same", 'color:#f3ff35', 'color:#eee');
                }
                this.lastChance(this._response.url);
                return;
            }
            for (var k = 0; k < newContainers.length; k++) {
                var scripts = Array.from(newContainers[k].querySelectorAll('script'));
                if (scripts.length > 0) {
                    contiansScripts = true;
                }
                var newContainer = newContainers[k];
                var currentContainer = currentContainers[k];
                var switchObject = {
                    new: newContainer,
                    current: currentContainer
                };
                switchQueue.push(switchObject);
            }
        }
        if (switchQueue.length === 0) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + "%ccouldn't find anything to switch", 'color:#f3ff35', 'color:#eee');
            }
            this.lastChance(this._response.url);
            return;
        }
        if (contiansScripts) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + "%cthe new page contains scripts", 'color:#f3ff35', 'color:#eee');
            }
            this.lastChance(this._response.url);
            return;
        }
        if (!this.options.customTransitions) {
            if (this.options.titleSwitch) {
                document.title = tempDocument.title;
            }
            this.handleSwitches(switchQueue);
        }
        else {
            this._cachedSwitch = {
                queue: switchQueue,
                title: tempDocument.title
            };
        }
    };
    Pjax.prototype.lastChance = function (uri) {
        if (this.options.debug) {
            console.log('%c[Pjax] ' + ("%csomething caused Pjax to break, native loading " + uri), 'color:#f3ff35', 'color:#eee');
        }
        window.location.href = uri;
    };
    Pjax.prototype.statusCheck = function () {
        for (var status_1 = 200; status_1 <= 206; status_1++) {
            if (this._cache.status === status_1) {
                return true;
            }
        }
        return false;
    };
    Pjax.prototype.loadCachedContent = function () {
        if (!this.statusCheck()) {
            this.lastChance(this._cache.url);
            return;
        }
        clear_active_1.default();
        state_manager_1.default.doReplace(window.location.href, document.title);
        this.switchSelectors(this.options.selectors, this._cache.document, document);
    };
    Pjax.prototype.parseContent = function (responseText) {
        var tempDocument = document.implementation.createHTMLDocument('pjax-temp-document');
        var htmlRegex = /<html[^>]+>/gi;
        var matches = responseText.match(htmlRegex);
        if (matches !== null) {
            tempDocument.documentElement.innerHTML = responseText;
            return tempDocument;
        }
        return null;
    };
    Pjax.prototype.cacheContent = function (responseText, responseStatus, uri) {
        var tempDocument = this.parseContent(responseText);
        this._cache = {
            status: responseStatus,
            document: tempDocument,
            url: uri
        };
        if (tempDocument instanceof HTMLDocument) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + "%ccaching content", 'color:#f3ff35', 'color:#eee');
            }
        }
        else {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + "%cresponse wan't an HTML document", 'color:#f3ff35', 'color:#eee');
            }
            trigger_1.default(document, ['pjax:error']);
        }
    };
    Pjax.prototype.loadContent = function (responseText) {
        var tempDocument = this.parseContent(responseText);
        if (tempDocument instanceof HTMLDocument) {
            clear_active_1.default();
            state_manager_1.default.doReplace(window.location.href, document.title);
            this.switchSelectors(this.options.selectors, tempDocument, document);
        }
        else {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + "%cresponse wasn't an HTML document", 'color:#f3ff35', 'color:#eee');
            }
            trigger_1.default(document, ['pjax:error']);
            this.lastChance(this._response.url);
            return;
        }
    };
    Pjax.prototype.handleResponse = function (response) {
        var _this = this;
        if (this.options.debug) {
            console.log('%c[Pjax] ' + ("%cXML Http Request status: " + response.status), 'color:#f3ff35', 'color:#eee');
        }
        if (!response.ok) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        this._response = response;
        response.text().then(function (responseText) {
            switch (_this._request) {
                case 'prefetch':
                    if (_this._confirmed) {
                        _this.loadContent(responseText);
                    }
                    else {
                        _this.cacheContent(responseText, _this._response.status, _this._response.url);
                    }
                    break;
                case 'popstate':
                    _this._isPushstate = false;
                    _this.loadContent(responseText);
                    break;
                case 'reload':
                    _this._isPushstate = false;
                    _this.loadContent(responseText);
                    break;
                default:
                    _this.loadContent(responseText);
                    break;
            }
        });
    };
    Pjax.prototype.doRequest = function (href) {
        var _this = this;
        var uri = href;
        var queryString = href.split('?')[1];
        if (this.options.cacheBust) {
            uri += (queryString === undefined) ? ("?cb=" + Date.now()) : ("&cb=" + Date.now());
        }
        fetch(uri).then(function (response) {
            _this.handleResponse(response);
        }).catch(function (error) {
            if (_this.options.debug) {
                console.group();
                console.error('%c[Pjax] ' + "%cXHR error:", 'color:#f3ff35', 'color:#eee');
                console.error(error);
                console.groupEnd();
            }
        });
    };
    Pjax.prototype.handlePrefetch = function (href) {
        if (this._confirmed) {
            return;
        }
        if (this.options.debug) {
            console.log('%c[Pjax] ' + ("%cprefetching " + href), 'color:#f3ff35', 'color:#eee');
        }
        this.abortRequest();
        trigger_1.default(document, ['pjax:prefetch']);
        this._request = 'prefetch';
        this.doRequest(href);
    };
    Pjax.prototype.handleLoad = function (href, loadType, el) {
        if (el === void 0) { el = null; }
        if (this._confirmed) {
            return;
        }
        trigger_1.default(document, ['pjax:send'], el);
        this._dom.classList.remove('dom-is-loaded');
        this._dom.classList.add('dom-is-loading');
        this._confirmed = true;
        if (this._cache !== null) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + ("%cloading cached content from " + href), 'color:#f3ff35', 'color:#eee');
            }
            this.loadCachedContent();
        }
        else if (this._response === null) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + ("%cconfirming prefetch for " + href), 'color:#f3ff35', 'color:#eee');
            }
            this._confirmed = true;
        }
        else {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + ("%cloading " + href), 'color:#f3ff35', 'color:#eee');
            }
            this._request = loadType;
            this.doRequest(href);
        }
    };
    Pjax.prototype.clearPrefetch = function () {
        if (!this._confirmed) {
            this._cache = null;
            this.abortRequest();
            trigger_1.default(document, ['pjax:cancel']);
        }
    };
    Pjax.VERSION = '1.3.0';
    return Pjax;
}());
exports.default = Pjax;
//# sourceMappingURL=pjax.js.map