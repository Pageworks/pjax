import getElements from './util/get-elements';
import checkElement from './util/check-element';
import Pjax from '../pjax';

/**
 * Called by Pjax's init method.
 * Gets all the elements that need event listeners.
 * @param el - `document.body` element
 */
export default (el:Element, pjax:Pjax)=>{
    // Get an array of elements that need event listeners.
    const elements:Array<Element> = getElements(el, pjax);

    if(pjax.options.debug && elements.length === 0){
        console.log('%c[Pjax] '+`%cno elements could be found, check what selectors you're providing Pjax`,'color:#f3ff35','color:#eee');
        return;
    }
    
    // Check element
    for(let i = 0; i < elements.length; i++){
        checkElement(elements[i], pjax);
    }
}