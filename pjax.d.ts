export as namespace Pjax;

export {Pjax as default};

declare class Pjax {
    constructor(options?: Partial<Pjax.IOptions>);
}

declare namespace Pjax{

    export interface IOptions{
        elements?: string
        selectors?: string[]
        history?: boolean
        cacheBust?: boolean
        scrollTo?: number
        debug?: boolean
        timeout?: number
        titleSwitch?: boolean,
        customTransitions?: boolean
    }

    export interface CacheObject{
        status: number
        html: Document
        url: string
    }

    export interface StateObject{
        url?: string
        title?: string
        history?: boolean
        scrollPos?: number[]
    }

    export interface EventOptions{
        triggerElement: Element
    }

    export interface SwitchOptions{
        oldEl: Element
        newEl: Element
    }

    export interface CachedSwitchOptions{
        queue:  Array<SwitchOptions>
        title?: string
    }
}