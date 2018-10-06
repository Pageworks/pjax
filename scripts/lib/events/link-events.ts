import on from './on';

let attrState = 'data-pjaxState';

/**
 * Check if the event has had it's default prevented OR
 * if the developer added a `prevent-default` attribute OR
 * if the element has a `no-transition` class
 * otherwise return false
 * @param el
 * @param e
 */
const isDefaultPrevented = (el:HTMLAnchorElement, e:Event)=>{
    if(e.defaultPrevented) return true;
    else if(el.getAttribute('prevent-default') !== null) return true;
    else if(el.classList.contains('no-transition')) return true;
    else return false;
}

/**
 * Check for link types and edge cases so we can abort if needed
 * This method prevents us from breaking some default browser behaviors
 * @param el 
 * @param e 
 */
const checkForAbort = (el:HTMLAnchorElement, e:Event)=>{
    // Ignore external links
    if(el.protocol !== window.location.protocol || el.host !== window.location.host) return 'external';

    // Ignore anchors on the smae page
    if(el.hash && el.href.replace(el.hash, '') === window.location.href.replace(location.hash, '')) return 'anchor';

    // Ignore empty anchor
    if(el.href === window.location.href.split('#')[0] + '#') return 'anchor-empty';

    return null;
}

const handleClick = (el:HTMLAnchorElement, e:Event)=>{
    if(isDefaultPrevented(el, e)) return;

    let eventOptions = {
        triggerElement: el
    };

    let attrValue = checkForAbort(el, e);
    if(attrValue !== null){
        el.setAttribute(attrState, attrValue);
        return;
    }

    e.preventDefault();

    // Don't do 'nothing' if the user is trying to reload the page by clicking on the same link twice
    if(el.href === window.location.href.split('#')[0]){
        el.setAttribute(attrState, 'reload');
        return;
    }

    el.setAttribute(attrState, 'load');
    return;

    this.loadUrl(el.href, eventOptions);
}

const handleHover = (el:HTMLAnchorElement, e:Event)=>{
    if(isDefaultPrevented(el, e)) return;

    if(e.type === 'mouseout'){
        this.clearCache();
        return;
    }

    let eventOptions = {
        triggerElement: el
    };

    let attrValue = checkForAbort(el, e);
    if(attrValue !== null){
        el.setAttribute(attrState, attrValue);
        return;
    }

    el.setAttribute(attrState, 'prefetch');
    return;

    this.prefetch(el.href, eventOptions);
}

export default (el:HTMLAnchorElement)=>{
    el.setAttribute(attrState, '');

    // Use clicked a link
    on(el, 'click', (e:Event)=>{ handleClick(el, e); });

    // User is hovering over a link
    on(el, 'mouseover', (e:Event)=>{ handleHover(el, e); });

    // User unhovered the link
    on(el, 'mouseout', (e:Event)=>{ handleHover(el, e); });

    // User released a key press
    on(el, 'keyup', (e:KeyboardEvent)=>{
        if(e.key === 'enter' || e.keyCode === 13) handleClick(el, e);
    });
}