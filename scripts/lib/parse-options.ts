import pjax from '../globals'; // Imports IOptions declaration

/**
 * Parse options based on the IOptions object passed in by the Pjax class' constructor
 */
export default (options?: pjax.IOptions)=>{
    let parsedOptions                         = options || {};
        parsedOptions.elements                = options.elements || 'a[href]';
        parsedOptions.selectors               = options.selectors || ['title', '.js-pjax'];
        parsedOptions.switches                = options.switches || {};
        parsedOptions.history                 = (typeof options.history === undefined) ? true : options.history;
        parsedOptions.scrollTo                = (typeof options.scrollTo === undefined) ? 0 : options.scrollTo;
        parsedOptions.cacheBust               = (typeof options.cacheBust === undefined) ? true : options.cacheBust;
        parsedOptions.debug                   = options.debug || false;
        parsedOptions.timeout                 = options.timeout || 0;

    return parsedOptions;
}