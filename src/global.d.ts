interface Options{
    elements?:          string;
    selectors?:         string[];
    history?:           boolean;
    cacheBust?:         boolean;
    scrollTo?:          ScrollPosition;
    debug?:             boolean;
    timeout?:           number;
    titleSwitch?:       boolean;
    customTransitions?: boolean;
}

interface ScrollPosition{
    x:  number;
    y:  number;
}

interface CacheObject{
    status:     number;
    document:   Document;
    url:        string;
}

interface StateObject{
    url?:       string;
    timestamp?: number;
    title?:     string;
    history?:   boolean;
    scrollPos?: number[];
}

interface EventOptions{
    triggerElement: Element;
}

interface SwitchObject{
    new:        Element;
    current:    Element;
}

interface CachedSwitchOptions{
    queue:  Array<SwitchObject>;
    title?: string;
}