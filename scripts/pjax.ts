// Function Imports
import parseOptions from './lib/parse-options';
import uuid from './lib/uuid';
import trigger from './lib/events/trigger';
import contains from './lib/util/contains';

// TypeScript Declaration Imports
import pjax from './globals';

export default class Pjax{
    state: pjax.StateObject
    cache: Document
    options: pjax.IOptions
    lastUUID: string
    request: XMLHttpRequest

    constructor(options?: pjax.IOptions){
        this.state = {
            numPendingSwitches: 0,
            href: null,
            options: null
        }
        this.cache = null;
        this.options = parseOptions(options);
        this.lastUUID = uuid();
        this.request = null;

        if(this.options.debug) console.log('Pjax Options:', this.options);

        this.init();
    }

    init(){
        window.addEventListener('popstate', e => this.handlePopstate(e));
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
                backward: (e.state.uid < this.lastUUID) ? true : false
            };

            this.lastUUID = e.state.uid;

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

        this.abortRequest(this.request);

        if(this.cache === null){
            trigger(document, ['pjax:send']);
            this.request = this.doRequest(href, options, this.handleResponse);
        }else{
            this.loadCachedContent();
        }
    }

    switchSelectors(selectors: string[], fromEl: Document, toEl: Document, options: object){

    }

    loadCachedContent(){
        if(document.activeElement && contains(document, this.options.selectors, document.activeElement)){
            try{
                (document.activeElement as HTMLElement).blur();
            }catch(e){ console.log(e) }
        }

        this.switchSelectors(this.options.selectors, this.cache, document, this.options);
    }

    abortRequest(request: XMLHttpRequest){
        request.onreadystatechange = ()=>{};
        request.abort();
    }

    parseContent(responseText: string){
        let tempEl = document.implementation.createHTMLDocument('pjax');

        // let htmlRegex = /<html[^>]+>/gi;
        const htmlRegex = /\s?[a-z:]+(?=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi;
        let matches = responseText.match(htmlRegex);
        
        if(matches && matches.length){
            matches = matches[0].match(htmlRegex);
            if(matches.length){
                matches.shift();
                matches.forEach((htmlAttribute)=>{
                    let attr = htmlAttribute.trim().split('=');
                    if(attr.length === 1){
                        tempEl.documentElement.setAttribute(attr[0], "true");
                    }else{
                        tempEl.documentElement.setAttribute(attr[0], attr[1].slice(1,-1));
                    }
                });
            }
        }

        return tempEl;
    }

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

    doRequest(href: string, options: object, callback: Function){
        const requestOptions    = this.options.requestOptions || {};
        const reqeustMethod     = (requestOptions.requestMethod || 'GET').toUpperCase();
        const requestParams     = requestOptions.requestParams || null;
        const timeout           = this.options.timeout || 0;
        const request           = new XMLHttpRequest();
        let requestPayload      = null;
        let queryString;

        request.onreadystatechange = ()=>{
            if(request.readyState === 4){
                if(request.status === 200){
                    callback(request.responseText, request, href, options);
                }
                else if(request.status !== 0){
                    callback(null, request, href, options);
                }
            }
        }

        request.onerror = (e)=>{
            console.log(e);
            callback(null, request, href, options);
        }

        request.ontimeout = ()=>{
            callback(null, request, href, options);
        }

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

        request.open(reqeustMethod, href, true);
        request.timeout = timeout;
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('X-PJAX', 'true');
        request.setRequestHeader('X-PJAX-Selectors', JSON.stringify(this.options.selectors));

        request.send(requestPayload);

        return request;
    }
}