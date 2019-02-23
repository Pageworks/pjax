import PJAX from '../../global';

/**
 * Scrolls the window to the provided `ScrollPosition`
 */
export default (scrollTo:PJAX.IScrollPosition)=>{
    window.scrollTo(scrollTo.x, scrollTo.y);
}