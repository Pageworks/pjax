// Function Imports
import parseOptions from './lib/parse-options';
import uuid from './lib/uuid';
import trigger from './lib/events/trigger';
import contains from './lib/util/contains';
import linkEvent from './lib/events/link-events';
import checkElement from './lib/util/check-element';

// TypeScript Declaration Imports
import pjax from './globals';

export default class Pjax{
    state:      pjax.StateObject
    cache:      Document
    options:    pjax.IOptions
    lastUUID:   string
    request:    Promise<object>
    links:      NodeList

    constructor(options?: pjax.IOptions){
        this.state = {
            href: null,
            options: null
        };
        this.cache = null;
        this.options = parseOptions(options);
        this.lastUUID = uuid();
        this.request = null;

        if(this.options.debug) console.log('Pjax Options:', this.options);

        this.init();
    }

    /**
     * Declare all initial event listeners
     */
    init(){
        window.addEventListener('popstate', e => this.handlePopstate(e));
        this.parseDOM(document.body); // Attach listeners to initial link elements
    }

    handleReload(){
        window.location.reload();
    }

    setLinkListeners(el:HTMLAnchorElement){
        linkEvent(el);
    }

    getElements(el:Element){
        return el.querySelectorAll(this.options.elements);
    }

    parseDOM(el:Element){
        const elements = this.getElements(el);
        elements.forEach((el)=>{
            checkElement(<HTMLAnchorElement>el);
        });
    }

    handleRefresh(el:Element){
        this.parseDOM(el);
    }

    /**
     * Handles the windows popstate event
     * Called by a popstate event listener
     * @param e PopStateEvent
     */
    handlePopstate(e: PopStateEvent){
        if(e.state){
            const options = {
                url: e.state.url,
                title: e.state.title,
                history: false,
                scrollPos: e.state.scrollPos,
                backward: (e.state.uuid < this.lastUUID) ? true : false
            };

            this.lastUUID = e.state.uuid;

            this.loadUrl(e.state.url, options);
        }
    }

    /**
     * Abort any current request
     * If we have content cached load the content
     * If we don't have content cached trigger the pjax:send event before
     * starting our new XML HTTP request
     * @param href string
     * @param options object
     */
    loadUrl(href: string, options: object){
        if(this.options.debug) console.log('Loading url: ${href} with ', options);

        if(this.cache === null){
            trigger(document, ['pjax:send']);
            this.request = this.doRequest(href, options);
            this.request.then((e: Event)=>{
                
            })
            .catch((e: ErrorEvent)=>{
                if(this.options.debug) console.log('XHR Request Error: ', e);
            });
        }else{
            this.loadCachedContent();
        }
    }

    switchSelectors(selectors: string[], fromEl: Document, toEl: Document, options: object){

    }

    /**
     * If we have cached content we need to check if there is an active element and if the document contains our selectors and active element
     * If it does blur the HTMLElement
     * Then tell Pjax to switch selectors
     */
    loadCachedContent(){
        if(document.activeElement && contains(document, this.options.selectors, document.activeElement)){
            try{
                (document.activeElement as HTMLElement).blur();
            }catch(e){ console.log(e) }
        }

        this.switchSelectors(this.options.selectors, this.cache, document, this.options);
    }

    /**
     * Create an HTML Document
     * Check if the responseText is an HTML Document by checking with regex
     * If the responseText matches our format return the new document otherwise return null
     * @param responseText string
     */
    parseContent(responseText: string){
        let tempEl = document.implementation.createHTMLDocument('pjax');

        // let htmlRegex = /<html[^>]+>/gi;
        const htmlRegex = /\s?[a-z:]+(?=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi;
        let matches = responseText.match(htmlRegex);
        
        if(matches && matches.length) return tempEl;

        return null;
    }

    /**
     * Attempts to cache the prefetched request
     * First we parse the content and return a new HTML Document
     * If parseContent returns null trigger and error and return
     * Otherwise set the innerHTML of the document to the responseText
     * Then cache the temp HTML Document
     * @param responseText string
     * @param options object
     */
    cacheContent(responseText: string, options: object){
        let tempEl = this.parseContent(responseText);

        if(tempEl === null){
            trigger(document, ['pjax:error']);
            return;
        }

        tempEl.documentElement.innerHTML = responseText;
        this.cache = tempEl;
    }

    handleResponse(responseText: string, request: XMLHttpRequest, href: string, options: object){
        if(responseText === null){
            trigger(document, ['pjax:error']);
            return;
        }

        this.state.href = href;
        this.state.options = options;

        this.cacheContent(responseText, options);
    }

    doRequest(href: string, options: object){
        const requestOptions        = this.options.requestOptions || {};
        const reqeustMethod         = (requestOptions.requestMethod || 'GET').toUpperCase();
        const requestParams         = requestOptions.requestParams || null;
        const timeout               = this.options.timeout || 0;
        const request               = new XMLHttpRequest();
        let requestPayload:string   = null;
        let queryString;

        if(requestParams && requestParams.length){
            queryString = (requestParams.map((param)=>{ return param.name + '=' + param.value })).join('&'); // Build query string

            switch(reqeustMethod){
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

        if(this.options.cacheBust) href += (queryString.length) ? ('&t=' + Date.now()) : ('t=' + Date.now());

        return new Promise((resolve, reject)=>{
            request.open(reqeustMethod, href, true);
            request.timeout = timeout;
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.setRequestHeader('X-PJAX', 'true');
            request.setRequestHeader('X-PJAX-Selectors', JSON.stringify(this.options.selectors));
            request.onload = resolve;
            request.onerror = reject;
            request.send(requestPayload);
        });
    }
}