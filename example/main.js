// Event listeners
document.addEventListener('pjax:error', ()=>{ console.log('Event: pjax:error'); });
document.addEventListener('pjax:send', ()=>{ console.log('Event: pjax:send'); });
document.addEventListener('pjax:prefetch', ()=>{ console.log('Event: pjax:prefetch'); });
document.addEventListener('pjax:cancel', ()=>{ console.log('Event: pjax:cancel'); });

document.addEventListener('DOMContentLoaded', ()=>{
    let pjax = new Pjax({
        debug: true,
        selectors: ['title', '.js-pjax-container']
    });

    console.log('New Pjax: ', pjax);
});