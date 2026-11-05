(function(){
var l=document.getElementById('loader'),done=false;
function hide(){if(done)return;done=true;l.classList.add('off');}
addEventListener('lumen:ready',function(){setTimeout(hide,250);});
setTimeout(hide,3500); // never block the page if WebGL is slow or unavailable
})();
