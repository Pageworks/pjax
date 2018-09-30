import Pjax from '../globals';

export default function parseOptions(options?: Pjax.IOptions){
    options                         = options || {};
    options.elements                = options.elements || 'a[href]';
    options.selectors               = options.selectors || ['title', '.js-pjax'];
    options.switches                = options.switches || {};
    options.history                 = (typeof options.history === undefined) ? true : options.history;
    options.scrollTo                = (typeof options.scrollTo === undefined) ? 0 : options.scrollTo;
    options.cacheBust               = (typeof options.cacheBust === undefined) ? true : options.cacheBust;
    options.debug                   = options.debug || false;
    options.timeout                 = options.timeout || 0;

    return options;
}