import Pjax from '../pjax';

/**
 * IIFE for starting Pjax on load
 */
(function(){
    var pjax = new Pjax({ debug:true, importScripts: false });

    var prefetchLight = document.body.querySelector('.js-prefetch');
    var loadLight = document.body.querySelector('.js-load');
    var errorLight = document.body.querySelector('.js-error');
    var cancelLight = document.body.querySelector('.js-cancel');
    var completeLight = document.body.querySelector('.js-complete');

    var clearEventsButton = document.body.querySelector('.js-clear');

    function clearStatus(){
        prefetchLight.classList.remove('is-lit');
        loadLight.classList.remove('is-lit');
        errorLight.classList.remove('is-lit');
        cancelLight.classList.remove('is-lit');
        completeLight.classList.remove('is-lit');
    }

    clearEventsButton.addEventListener('click', function(e){
        clearStatus();
    });

    document.addEventListener('pjax:prefetch', function(e){
        clearStatus();
        prefetchLight.classList.add('is-lit');
    });

    document.addEventListener('pjax:send', function(e){
        loadLight.classList.add('is-lit');
    });

    document.addEventListener('pjax:error', function(e){
        errorLight.classList.add('is-lit');
    });

    document.addEventListener('pjax:cancel', function(e){
        cancelLight.classList.add('is-lit');
    });

    document.addEventListener('pjax:complete', function(e){
        completeLight.classList.add('is-lit');
    });
})();
