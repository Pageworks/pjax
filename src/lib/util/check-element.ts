import Pjax from "../../pjax";
import setLinkListeners from '../events/link-events';

/**
 * Called by `Pjax.parseDOM` method
 * @param el - element to check
 * @param pjax - reference to the Pjax
 */
export default (el:Element, pjax:Pjax)=>{
    
    // Check if element has a `href` attribute we can use
    if(el.getAttribute('href')){
        setLinkListeners(el, pjax);
    }else{
        if(pjax.options.debug){
            console.log(`${ el } is missing a href attribute. Pjax can't assign listeners.`);
        }
    }
}