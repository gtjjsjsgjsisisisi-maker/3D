(function(){
'use strict';
var canvas=document.getElementById('gl');
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(typeof THREE==='undefined'){window.dispatchEvent(new Event('lumen:ready'));return;}
var renderer;try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,powerPreference:'high-performance'});}catch(e){window.dispatchEvent(new Event('lumen:ready'));return;}
var pr=Math.min(window.devicePixelRatio||1,1.75);renderer.setPixelRatio(pr);
var scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x070b1a,.04);
var cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.set(0,0,9);

scene.add(new THREE.AmbientLight(0x8899ff,.55));
var l1=new THREE.PointLight(0x6ff3e0,2.4,40);l1.position.set(5,4,6);scene.add(l1);
var l2=new THREE.PointLight(0xff9ad5,2.2,40);l2.position.set(-6,-3,4);scene.add(l2);

var hero=new THREE.Group();scene.add(hero);
var knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.4,.42,200,24),
 new THREE.MeshPhysicalMaterial({color:0x9fb4ff,metalness:.65,roughness:.14,clearcoat:1,clearcoatRoughness:.1,emissive:0x101a55,emissiveIntensity:.6}));
hero.add(knot);
var shell=new THREE.Mesh(new THREE.IcosahedronGeometry(2.7,1),
 new THREE.MeshBasicMaterial({color:0x6ff3e0,wireframe:true,transparent:true,opacity:.14}));
hero.add(shell);

var gem=new THREE.OctahedronGeometry(.18),gm=new THREE.MeshStandardMaterial({color:0xffb38a,metalness:.8,roughness:.25,emissive:0x552200,emissiveIntensity:.4});
var orbit=new THREE.Group(),i,m;hero.add(orbit);
for(i=0;i<16;i++){m=new THREE.Mesh(gem,gm);var a=i/16*Math.PI*2,r=3.3+(i%3)*.35;
 m.position.set(Math.cos(a)*r,Math.sin(i*1.7)*1.4,Math.sin(a)*r);m.userData.s=.4+Math.random();orbit.add(m);}

var N=2600,pos=new Float32Array(N*3),col=new Float32Array(N*3),c1=new THREE.Color(0x6ff3e0),c2=new THREE.Color(0xff9ad5),c=new THREE.Color();
for(i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*40;pos[i*3+1]=(Math.random()-.5)*60;pos[i*3+2]=(Math.random()-.5)*30-4;
 c.copy(c1).lerp(c2,Math.random());col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
var pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));pg.setAttribute('color',new THREE.BufferAttribute(col,3));
var dust=new THREE.Points(pg,new THREE.PointsMaterial({size:.05,vertexColors:true,transparent:true,opacity:.75,depthWrite:false,blending:THREE.AdditiveBlending}));
scene.add(dust);

var mx=0,my=0,tx=0,ty=0,prog=0,tprog=0,W=0,H=0,run=true,narrow=false;
addEventListener('pointermove',function(e){tx=e.clientX/innerWidth*2-1;ty=e.clientY/innerHeight*2-1;},{passive:true});
function onScroll(){var d=document.documentElement.scrollHeight-innerHeight;tprog=d>0?scrollY/d:0;}
addEventListener('scroll',onScroll,{passive:true});onScroll();

function resize(){W=innerWidth;H=innerHeight;narrow=W<760;renderer.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();onScroll();}
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(resize,120);});resize();
document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run){last=performance.now();requestAnimationFrame(loop);}});

var last=performance.now(),acc=0,frames=0,lowered=false,first=true;
function loop(t){
 if(!run)return;requestAnimationFrame(loop);
 var dt=Math.min((t-last)/1000,.05);last=t;
 if(!lowered){acc+=dt;frames++;if(acc>2){if(frames/acc<42&&pr>1){pr=1;renderer.setPixelRatio(1);resize();}lowered=true;}}
 var k=reduce?0:1;
 mx+=(tx-mx)*.06;my+=(ty-my)*.06;prog+=(tprog-prog)*.07;
 knot.rotation.x+=dt*.22*k;knot.rotation.y+=dt*.3*k;shell.rotation.y-=dt*.08*k;shell.rotation.x+=dt*.05*k;
 orbit.rotation.y+=dt*.18*k;
 for(var j=0;j<orbit.children.length;j++){var o=orbit.children[j];o.rotation.x+=dt*o.userData.s*k;o.rotation.y+=dt*o.userData.s*k;}
 hero.scale.setScalar((narrow?.62:1)*(1+Math.sin(prog*Math.PI*2)*.12));
 hero.position.x=narrow?0:2.8*Math.cos(prog*Math.PI*3);
 hero.position.y=narrow?1.6-prog*1.2:Math.sin(prog*Math.PI*2)*.8;
 hero.rotation.y=prog*Math.PI*2+mx*.4;hero.rotation.x=my*.25;
 dust.position.y=prog*14;dust.rotation.y=prog*.6+t*.00002*k;
 cam.position.x+=(mx*.8-cam.position.x)*.05;cam.position.y+=(-my*.5-cam.position.y)*.05;
 cam.position.z=9-prog*2.5;cam.lookAt(0,0,0);
 l1.position.x=5+Math.sin(t*.0006)*3;l2.position.y=-3+Math.cos(t*.0008)*3;
 renderer.render(scene,cam);
 if(first){first=false;window.dispatchEvent(new Event('lumen:ready'));}
}
requestAnimationFrame(loop);
})();
