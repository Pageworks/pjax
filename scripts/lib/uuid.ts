/**
 * Cheap and easy UUID generation
 * Could be replaced by actual UUID generation later
 */
export default ()=>{
    return 'pjax_' + Date.now();
}