interface IOptions{
    elements?:          string;
    selectors?:         string[];
    history?:           boolean;
    cacheBust?:         boolean;
    scrollTo?:          number;
    debug?:             boolean;
    timeout?:           number;
    titleSwitch?:       boolean;
    customTransitions?: boolean;
}

interface CacheObject{
    status: number;
    html:   Document;
    url:    string;
}

interface StateObject{
    url?:       string;
    title?:     string;
    history?:   boolean;
    scrollPos?: number[];
}

interface EventOptions{
    triggerElement: Element;
}

interface SwitchOptions{
    oldEl: Element;
    newEl: Element;
}

interface CachedSwitchOptions{
    queue:  Array<SwitchOptions>;
    title?: string;
}