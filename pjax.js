"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_options_1 = require("./lib/parse-options");
var trigger_1 = require("./lib/events/trigger");
var parse_dom_1 = require("./lib/parse-dom");
var scroll_1 = require("./lib/util/scroll");
var clear_active_1 = require("./lib/util/clear-active");
var fuel_state_manager_1 = require("fuel-state-manager");
var fuel_device_manager_1 = require("fuel-device-manager");
var Pjax = (function () {
    function Pjax(options) {
        var _this = this;
        this.handlePopstate = function (e) {
            if (e.state) {
                if (_this.options.debug) {
                    console.log('%c[Pjax] ' + "%chijacking popstate event", 'color:#f3ff35', 'color:#eee');
                }
                _this.scrollTo = e.state.scrollPos;
                _this.loadUrl(e.state.uri, 'popstate');
            }
        };
        this.handleContinue = function (e) {
            if (_this.cachedSwitch !== null) {
                if (_this.options.titleSwitch) {
                    document.title = _this.cachedSwitch.title;
                }
                _this.handleSwitches(_this.cachedSwitch.queue);
            }
            else {
                if (_this.options.debug) {
                    console.log('%c[Pjax] ' + "%cswitch queue was empty. You might be sending pjax:continue early", 'color:#f3ff35', 'color:#eee');
                }
                trigger_1.default(document, ['pjax:error']);
            }
        };
        if (fuel_device_manager_1.default.isIE) {
            console.log('%c[Pjax] ' + "%cIE 11 detected - Pjax aborted", 'color:#f3ff35', 'color:#eee');
            return;
        }
        this.cache = null;
        this.options = parse_options_1.default(options);
        this.stateManager = new fuel_state_manager_1.default(this.options.debug, true);
        this.request = null;
        this.confirmed = false;
        this.cachedSwitch = null;
        this.scrollTo = { x: 0, y: 0 };
        this.isPushstate = true;
        this.init();
    }
    Pjax.prototype.init = function () {
        if (this.options.debug) {
            console.log('%c[Pjax] ' + ("%cinitializing Pjax version " + Pjax.VERSION), 'color:#f3ff35', 'color:#eee');
            console.log('%c[Pjax] ' + "%cview Pjax documentation at http://papertrain.io/pjax", 'color:#f3ff35', 'color:#eee');
            console.log('%c[Pjax] ' + "%cloaded with the following options: ", 'color:#f3ff35', 'color:#eee');
            console.log(this.options);
        }
        window.addEventListener('popstate', this.handlePopstate);
        if (this.options.customTransitions) {
            document.addEventListener('pjax:continue', this.handleContinue);
        }
        parse_dom_1.default(document.body, this);
    };
    Pjax.prototype.loadUrl = function (href, loadType) {
        this.abortRequest();
        this.handleLoad(href, loadType);
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
    Pjax.prototype.finalize = function () {
        if (this.options.debug) {
            console.log('%c[Pjax] ' + "%cpage transition completed", 'color:#f3ff35', 'color:#eee');
        }
        if (this.options.history) {
            if (this.isPushstate) {
                this.stateManager.doPush(this.request.responseURL, document.title);
            }
            else {
                this.stateManager.doReplace(this.request.responseURL, document.title);
            }
        }
        scroll_1.default(this.scrollTo);
        this.cache = null;
        this.request = null;
        this.confirmed = false;
        this.cachedSwitch = null;
        this.isPushstate = true;
        this.scrollTo = { x: 0, y: 0 };
        trigger_1.default(document, ['pjax:complete']);
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
                console.log('%c[Pjax] ' + ("%ctemporary document was null, telling the browser to load " + ((this.cache !== null) ? this.cache.url : this.request.responseURL)), 'color:#f3ff35', 'color:#eee');
            }
            if (this.cache !== null) {
                this.lastChance(this.cache.url);
            }
            else {
                this.lastChance(this.request.responseURL);
            }
        }
        var switchQueue = [];
        var contiansScripts = false;
        for (var i = 0; i < selectors.length; i++) {
            var newContainers = Array.from(tempDocument.querySelectorAll(selectors[i]));
            var currentContainers = Array.from(currentDocument.querySelectorAll(selectors[i]));
            if (this.options.debug) {
                console.log('%c[Pjax] ' + ("%cswapping " + newContainers + " from selector " + selectors[i] + " into " + currentContainers), 'color:#f3ff35', 'color:#eee');
            }
            if (newContainers.length !== currentContainers.length) {
                if (this.options.debug) {
                    console.log('%c[Pjax] ' + "%cthe dom doesn't look the same", 'color:#f3ff35', 'color:#eee');
                }
                this.lastChance(this.request.responseURL);
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
            this.lastChance(this.request.responseURL);
            return;
        }
        if (contiansScripts) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + "%cthe new page contains scripts", 'color:#f3ff35', 'color:#eee');
            }
            this.lastChance(this.request.responseURL);
            return;
        }
        if (!this.options.customTransitions) {
            if (this.options.titleSwitch) {
                document.title = tempDocument.title;
            }
            this.handleSwitches(switchQueue);
        }
        else {
            this.cachedSwitch = {
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
            if (this.cache.status === status_1) {
                return true;
            }
        }
        return false;
    };
    Pjax.prototype.loadCachedContent = function () {
        if (!this.statusCheck()) {
            this.lastChance(this.cache.url);
            return;
        }
        clear_active_1.default();
        this.stateManager.doReplace(window.location.href, document.title);
        this.switchSelectors(this.options.selectors, this.cache.document, document);
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
        this.cache = {
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
            this.stateManager.doReplace(window.location.href, document.title);
            this.switchSelectors(this.options.selectors, tempDocument, document);
        }
        else {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + "%cresponse wasn't an HTML document", 'color:#f3ff35', 'color:#eee');
            }
            trigger_1.default(document, ['pjax:error']);
            this.lastChance(this.request.responseURL);
            return;
        }
    };
    Pjax.prototype.handleResponse = function (e, loadType) {
        if (this.options.debug) {
            console.log('%c[Pjax] ' + ("%cXML Http Request status: " + this.request.status), 'color:#f3ff35', 'color:#eee');
        }
        if (this.request.responseText === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        switch (loadType) {
            case 'prefetch':
                if (this.confirmed) {
                    this.loadContent(this.request.responseText);
                }
                else {
                    this.cacheContent(this.request.responseText, this.request.status, this.request.responseURL);
                }
                break;
            case 'popstate':
                this.isPushstate = false;
                this.loadContent(this.request.responseText);
                break;
            case 'reload':
                this.isPushstate = false;
                this.loadContent(this.request.responseText);
                break;
            default:
                this.loadContent(this.request.responseText);
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
        if (this.options.cacheBust) {
            uri += (queryString === undefined) ? ("?cb=" + Date.now()) : ("&cb=" + Date.now());
        }
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
            console.log('%c[Pjax] ' + ("%cprefetching " + href), 'color:#f3ff35', 'color:#eee');
        }
        this.abortRequest();
        trigger_1.default(document, ['pjax:prefetch']);
        this.doRequest(href).then(function (e) {
            _this.handleResponse(e, 'prefetch');
        }).catch(function (e) {
            if (_this.options.debug) {
                console.log('%c[Pjax] ' + "%cXHR error:", 'color:#f3ff35', 'color:#eee');
                console.log(e);
            }
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
            if (this.options.debug) {
                console.log('%c[Pjax] ' + ("%cloading cached content from " + href), 'color:#f3ff35', 'color:#eee');
            }
            this.loadCachedContent();
        }
        else if (this.request !== null) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + ("%cconfirming prefetch for " + href), 'color:#f3ff35', 'color:#eee');
            }
            this.confirmed = true;
        }
        else {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + ("%cloading " + href), 'color:#f3ff35', 'color:#eee');
            }
            this.doRequest(href).then(function (e) {
                _this.handleResponse(e, loadType);
            }).catch(function (e) {
                if (_this.options.debug) {
                    console.log('%c[Pjax] ' + "%cXHR error:", 'color:#f3ff35', 'color:#eee');
                    console.log(e);
                }
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
    Pjax.VERSION = '1.2.1';
    return Pjax;
}());
exports.default = Pjax;
//# sourceMappingURL=pjax.js.map