(function(){
'use strict';
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover)').matches;

var h=$('h1.split');if(h){var out='',d=0;h.setAttribute('aria-label',h.textContent);h.childNodes.forEach(function(n){
 if(n.nodeType===3){Array.from(n.textContent).forEach(function(ch){out+='<span class="ch" aria-hidden="true" style="animation-delay:'+(d+=.045).toFixed(3)+'s">'+(ch===' '?'&nbsp;':ch)+'</span>';});}
 else out+='<br>';});h.innerHTML=out;}

if(fine){var gl=$('#glow'),px=0,py=0,q0=false;addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY;
 if(!q0){q0=true;requestAnimationFrame(function(){gl.style.setProperty('--x',px+'px');gl.style.setProperty('--y',py+'px');q0=false;});}},{passive:true});}

if(fine&&!reduce){$$('.tilt').forEach(function(el){var q=false,ev;
 el.addEventListener('pointermove',function(e){ev=e;if(q)return;q=true;requestAnimationFrame(function(){var r=el.getBoundingClientRect();
  el.style.setProperty('--ry',(((ev.clientX-r.left)/r.width)-.5)*12+'deg');el.style.setProperty('--rx',(.5-((ev.clientY-r.top)/r.height))*12+'deg');q=false;});});
 el.addEventListener('pointerleave',function(){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');});});}

var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);
 var el=e.target,n=+el.dataset.n,t0=performance.now();(function f(t){var p=Math.min((t-t0)/1400,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f);})(t0);});},{threshold:.6});
$$('[data-n]').forEach(function(el){if(reduce)el.textContent=el.dataset.n;else cio.observe(el);});

var burger=$('.burger'),menu=$('#menu');
burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
$$('#menu a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded',false);});});
var links=$$('#menu a'),nio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id);});});},{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(function(s){nio.observe(s);});

var f=$('#form'),msg=$('#msg');f.addEventListener('submit',function(e){e.preventDefault();var ok=true;
 $$('input,textarea',f).forEach(function(i){var bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.classList.toggle('bad',bad);if(bad)ok=false;});
 msg.style.color=ok?'':'#ff7a8a';msg.textContent=ok?'ส่งแล้ว เราจะตอบกลับภายใน 1 วันทำการ':'กรอกชื่อ อีเมลที่ถูกต้อง และรายละเอียดโปรเจกต์ให้ครบ';if(ok)f.reset();});
})();
