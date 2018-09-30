import Pjax from '../globals';

let parsedOptions: Pjax.IOptions;

export default function parseOptions(options?: Pjax.IOptions){
    parsedOptions                         = options || {};
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