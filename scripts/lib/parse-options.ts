import pjax from '../globals'; // Imports IOptions declaration

/**
 * Parse options based on the IOptions object passed in by the Pjax class' constructor
 */
export default (options:pjax.IOptions = null)=>{
    let parsedOptions           = (options !== null) ? options : {};
        parsedOptions.elements  = (options !== null) ? options.elements : 'a[href]';
        parsedOptions.selectors = (options !== null) ? options.selectors : ['title', '.js-pjax'];
        parsedOptions.switches  = (options !== null) ? options.switches : {};
        parsedOptions.history   = (options !== null) ? options.history : true;
        parsedOptions.scrollTo  = (options !== null) ? options.scrollTo : 0;
        parsedOptions.cacheBust = (options !== null) ? options.cacheBust : false;
        parsedOptions.debug     = (options !== null) ? options.debug : false;
        parsedOptions.timeout   = (options !== null) ? options.timeout : 0;
        parsedOptions.attrState = (options !== null) ? options.attrState : 'data-pjax-state';

    return parsedOptions;
}