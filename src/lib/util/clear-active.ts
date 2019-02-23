/**
 * Attempt to clear the active element.
 */
export default ()=>{
    if(document.activeElement){
        try{
            // Attempt to blur the element
            (document.activeElement as HTMLElement).blur();
        }catch(e){ 
            console.log(e);
        }
    }
}