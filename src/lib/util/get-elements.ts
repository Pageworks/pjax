import Pjax from "../../pjax";

/**
 * Builds an array of elements based on the string array provided by the options object.
 * @param el - `document.body` element
 * @returns `Array<Element>`
 */
export default (el:Element, pjax:Pjax)=>{
    const elements = Array.from(el.querySelectorAll(pjax.options.elements));
    return elements;
}