// Event listeners
document.addEventListener('pjax:error', ()=>{ console.log('Event: pjax:error'); });
document.addEventListener('pjax:send', ()=>{ console.log('Event: pjax:send'); });
document.addEventListener('pjax:prefetch', ()=>{ console.log('Event: pjax:prefetch'); });
document.addEventListener('pjax:cancel', ()=>{ console.log('Event: pjax:cancel'); });
document.addEventListener('pjax:complete', ()=>{ console.log('Event: pjax:complete'); });

document.addEventListener('DOMContentLoaded', ()=>{
    let pjax = new Pjax({
        debug: false,
        selectors: ['.js-pjax-container', '.js-pjax-container-2']
    });

    console.log('New Pjax: ', pjax);
});