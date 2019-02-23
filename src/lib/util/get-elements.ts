import Pjax from "../../pjax";

/**
 * Builds an array of elements based on the string array provided by the options object.
 * @param el - `document.body` element
 * @returns `Array<Element>`
 */
export default (el:Element)=>{
    const elements = Array.from(el.querySelectorAll(this.options.elements));
    return elements;
}