// Event listeners
document.addEventListener('pjax:error', ()=>{ console.log('Event: pjax:error'); });
document.addEventListener('pjax:send', ()=>{ console.log('Event: pjax:send'); });
document.addEventListener('pjax:prefetch', ()=>{ console.log('Event: pjax:prefetch'); });

document.addEventListener('DOMContentLoaded', ()=>{
    let pjax = new Pjax({
        debug: true
    });

    console.log('Pjax:', pjax);
});