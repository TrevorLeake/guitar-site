export {}
/*
let passiveIfSupported: null|Object = null

try {
  window.addEventListener('transitionstart',
    Object.defineProperty(
      {},
      "passive",
      {
        get: function() { passiveIfSupported = { passive: true }; }
      }
    )
  );
} catch(err) {}



const usePassiveEventListener = () => {

window.addEventListener('scroll', function(event) {
  // can't use event.preventDefault();
}, passiveIfSupported );

export default usePassiveEventListener

*/
