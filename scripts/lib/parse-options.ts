import pjax from '../globals'; // Imports IOptions declaration

/**
 * Parse options based on the IOptions object passed in by the Pjax class' constructor
 */
export default (options?: pjax.IOptions)=>{
    let parsedOptions           = options || {};
        parsedOptions.elements  = options.elements || 'a[href]';
        parsedOptions.selectors = options.selectors || ['title', '.js-pjax'];
        parsedOptions.switches  = options.switches || {};
        parsedOptions.history   = options.history || true;
        parsedOptions.scrollTo  = options.scrollTo || 0;
        parsedOptions.cacheBust = options.cacheBust || false;
        parsedOptions.debug     = options.debug || false;
        parsedOptions.timeout   = options.timeout || 0;

    return parsedOptions;
}