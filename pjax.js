"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_options_1 = require("./lib/parse-options");
var trigger_1 = require("./lib/events/trigger");
var parse_dom_1 = require("./lib/parse-dom");
var scroll_1 = require("./lib/util/scroll");
var clear_active_1 = require("./lib/util/clear-active");
var state_manager_1 = require("@pageworks/state-manager");
var device_manager_1 = require("@pageworks/device-manager");
var Pjax = (function () {
    function Pjax(options) {
        var _this = this;
        this.handleManualLoad = function (e) {
            var uri = e.detail.uri;
            if (_this.options.debug) {
                console.log('%c[Pjax] ' + ("%cmanually loading " + uri), 'color:#f3ff35', 'color:#eee');
            }
            _this.doRequest(uri);
        };
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
        this._scriptsToAppend = [];
        this._requestId = 0;
        this.init();
    }
    Pjax.prototype.init = function () {
        if (this.options.debug) {
            console.group();
            console.log('%c[Pjax] ' + ("%cinitializing Pjax version " + Pjax.VERSION), 'color:#f3ff35', 'color:#eee');
            console.log('%c[Pjax] ' + "%cview Pjax documentation at http://papertrain.io/pjax", 'color:#f3ff35', 'color:#eee');
            console.log('%c[Pjax] ' + "%cloaded with the following options: ", 'color:#f3ff35', 'color:#eee');
            console.log(this.options);
            console.groupEnd();
        }
        this._dom.classList.add('dom-is-loaded');
        this._dom.classList.remove('dom-is-loading');
        new state_manager_1.default(this.options.debug, true);
        window.addEventListener('popstate', this.handlePopstate);
        if (this.options.customTransitions) {
            document.addEventListener('pjax:continue', this.handleContinue);
        }
        document.addEventListener('pjax:load', this.handleManualLoad);
        parse_dom_1.default(document.body, this);
    };
    Pjax.prototype.loadUrl = function (href, loadType) {
        if (this._confirmed) {
            return;
        }
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
        trigger_1.default(document, ['pjax:complete']);
        if (!this._scriptsToAppend.length) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + "%cNo new scripts to load", 'color:#f3ff35', 'color:#eee');
                trigger_1.default(document, ['pjax:scriptContentLoaded']);
            }
        }
        this._dom.classList.add('dom-is-loaded');
        this._dom.classList.remove('dom-is-loading');
        this._cache = null;
        this._request = null;
        this._response = null;
        this._cachedSwitch = null;
        this._isPushstate = true;
        this._scrollTo = { x: 0, y: 0 };
        this._confirmed = false;
    };
    Pjax.prototype.handleSwitches = function (switchQueue) {
        for (var i = 0; i < switchQueue.length; i++) {
            switchQueue[i].current.innerHTML = switchQueue[i].new.innerHTML;
            parse_dom_1.default(switchQueue[i].current, this);
        }
        this.finalize();
    };
    Pjax.prototype.switchSelectors = function (selectors, tempDocument) {
        var _this = this;
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
            return;
        }
        if (!this.options.importScripts) {
            var newScripts = Array.from(tempDocument.querySelectorAll('script'));
            if (newScripts.length) {
                var currentScripts_1 = Array.from(document.querySelectorAll('script'));
                newScripts.forEach(function (newScript) {
                    var isNewScript = true;
                    currentScripts_1.forEach(function (currentScript) {
                        if (newScript.src === currentScript.src) {
                            isNewScript = false;
                        }
                    });
                    if (isNewScript) {
                        if (_this.options.debug) {
                            console.log('%c[Pjax] ' + "%cthe new page contains scripts", 'color:#f3ff35', 'color:#eee');
                        }
                        _this.lastChance(_this._response.url);
                    }
                });
            }
        }
        if (!this.options.importCSS) {
            var newStylesheets = Array.from(tempDocument.querySelectorAll('link[rel="stylesheet"]'));
            if (newStylesheets.length) {
                var currentStylesheets_1 = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
                newStylesheets.forEach(function (newStylesheet) {
                    var isNewSheet = true;
                    currentStylesheets_1.forEach(function (currentStylesheet) {
                        if (newStylesheet.getAttribute('href') === currentStylesheet.getAttribute('href')) {
                            isNewSheet = false;
                        }
                    });
                    if (isNewSheet) {
                        if (_this.options.debug) {
                            console.log('%c[Pjax] ' + "%cthe new page contains new stylesheets", 'color:#f3ff35', 'color:#eee');
                        }
                        _this.lastChance(_this._response.url);
                    }
                });
            }
        }
        var switchQueue = [];
        for (var i = 0; i < selectors.length; i++) {
            var newContainers = Array.from(tempDocument.querySelectorAll(selectors[i]));
            var currentContainers = Array.from(document.querySelectorAll(selectors[i]));
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
        if (this.options.importScripts) {
            this.handleScripts(tempDocument);
        }
        if (this.options.importCSS) {
            this.handleCSS(tempDocument);
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
        this.switchSelectors(this.options.selectors, this._cache.document);
    };
    Pjax.prototype.parseContent = function (responseText) {
        var tempDocument = document.implementation.createHTMLDocument('pjax-temp-document');
        var contentType = this._response.headers.get('Content-Type');
        var htmlRegex = /text\/html/gi;
        var matches = contentType.match(htmlRegex);
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
            this.switchSelectors(this.options.selectors, tempDocument);
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
    Pjax.prototype.handleScripts = function (newDocument) {
        var _this = this;
        if (newDocument instanceof HTMLDocument) {
            var newScripts = Array.from(newDocument.querySelectorAll('script'));
            var currentScripts_2 = Array.from(document.querySelectorAll('script'));
            newScripts.forEach(function (newScript) {
                var appendScript = true;
                var newScriptFilename = 'inline-script';
                if (newScript.getAttribute('src') !== null) {
                    newScriptFilename = newScript.getAttribute('src').match(/[^/]+$/g)[0];
                }
                currentScripts_2.forEach(function (currentScript) {
                    var currentScriptFilename = 'inline-script';
                    if (currentScript.getAttribute('src') !== null) {
                        currentScriptFilename = currentScript.getAttribute('src').match(/[^/]+$/g)[0];
                    }
                    if (newScriptFilename === currentScriptFilename && newScriptFilename !== 'inline-script') {
                        appendScript = false;
                    }
                });
                if (appendScript) {
                    _this._scriptsToAppend.push(newScript);
                }
            });
            if (this._scriptsToAppend.length) {
                var scriptLoadCount_1 = 0;
                this._scriptsToAppend.forEach(function (script) {
                    if (script.src === '') {
                        var newScript = document.createElement('script');
                        newScript.dataset.src = _this._response.url;
                        newScript.innerHTML = script.innerHTML;
                        _this.options.scriptImportLocation.appendChild(newScript);
                        scriptLoadCount_1++;
                        _this.checkForScriptLoadComplete(scriptLoadCount_1);
                    }
                    else {
                        fetch(script.src, {
                            method: 'GET',
                            credentials: 'include',
                            headers: new Headers({
                                'X-Requested-With': 'XMLHttpRequest',
                                'Accept': 'text/javascript'
                            })
                        })
                            .then(function (request) { return request.text(); })
                            .then(function (response) {
                            var newScript = document.createElement('script');
                            newScript.setAttribute('src', script.src);
                            newScript.innerHTML = response;
                            _this.options.scriptImportLocation.appendChild(newScript);
                            scriptLoadCount_1++;
                            _this.checkForScriptLoadComplete(scriptLoadCount_1);
                        })
                            .catch(function (error) {
                            console.error('Failed to fetch script', script.src, error);
                        });
                    }
                });
            }
        }
    };
    Pjax.prototype.checkForScriptLoadComplete = function (scriptCount) {
        if (scriptCount === this._scriptsToAppend.length) {
            if (this.options.debug) {
                console.log('%c[Pjax] ' + "%cAll scripts have been loaded", 'color:#f3ff35', 'color:#eee');
            }
            this._scriptsToAppend = [];
            trigger_1.default(document, ['pjax:scriptContentLoaded']);
        }
    };
    Pjax.prototype.handleCSS = function (newDocument) {
        if (newDocument instanceof HTMLDocument) {
            var newStyles = Array.from(newDocument.querySelectorAll('link[rel="stylesheet"]'));
            var currentStyles_1 = Array.from(document.querySelectorAll('link[rel="stylesheet"], style[href]'));
            var stylesToAppend_1 = [];
            newStyles.forEach(function (newStyle) {
                var appendStyle = true;
                var newStyleFile = newStyle.getAttribute('href').match(/[^/]+$/g)[0];
                currentStyles_1.forEach(function (currentStyle) {
                    var currentStyleFile = currentStyle.getAttribute('href').match(/[^/]+$/g)[0];
                    if (newStyleFile === currentStyleFile) {
                        appendStyle = false;
                    }
                });
                if (appendStyle) {
                    stylesToAppend_1.push(newStyle);
                }
            });
            if (stylesToAppend_1.length) {
                stylesToAppend_1.forEach(function (style) {
                    fetch(style.href, {
                        method: 'GET',
                        credentials: 'include',
                        headers: new Headers({
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'text/javascript'
                        })
                    })
                        .then(function (request) { return request.text(); })
                        .then(function (response) {
                        var newStyle = document.createElement('style');
                        newStyle.setAttribute('rel', 'stylesheet');
                        newStyle.setAttribute('href', style.href);
                        newStyle.innerHTML = response;
                        document.head.appendChild(newStyle);
                    })
                        .catch(function (error) {
                        console.error('Failed to fetch stylesheet', style.href, error);
                    });
                });
            }
        }
    };
    Pjax.prototype.handleResponse = function (response) {
        var _this = this;
        if (this._request === null) {
            return;
        }
        if (this.options.debug) {
            console.log('%c[Pjax] ' + ("%cRequest status: " + response.status), 'color:#f3ff35', 'color:#eee');
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
        this._requestId++;
        var idAtStartOfRequest = this._requestId;
        var uri = href;
        var queryString = href.split('?')[1];
        if (this.options.cacheBust) {
            uri += (queryString === undefined) ? ("?cb=" + Date.now()) : ("&cb=" + Date.now());
        }
        var fetchMethod = 'GET';
        var fetchHeaders = new Headers({
            'X-Requested-With': 'XMLHttpRequest',
            'X-Pjax': 'true'
        });
        fetch(uri, {
            method: fetchMethod,
            headers: fetchHeaders
        }).then(function (response) {
            if (idAtStartOfRequest === _this._requestId) {
                _this.handleResponse(response);
            }
        }).catch(function (error) {
            if (_this.options.debug) {
                console.group();
                console.error('%c[Pjax] ' + "%cFetch error:", 'color:#f3ff35', 'color:#eee');
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
        else if (this._request !== 'prefetch') {
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
    Pjax.load = function (url) {
        var customEvent = new CustomEvent('pjax:load', {
            detail: {
                uri: url
            }
        });
        document.dispatchEvent(customEvent);
    };
    Pjax.VERSION = '2.2.0';
    return Pjax;
}());
exports.default = Pjax;
//# sourceMappingURL=pjax.js.map