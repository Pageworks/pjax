/**
 * Scrolls the window to the provided `ScrollPosition`
 */
export default (scrollTo:ScrollPosition)=>{
    window.scrollTo(scrollTo.x, scrollTo.y);
}