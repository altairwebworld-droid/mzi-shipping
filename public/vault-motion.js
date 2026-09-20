/* Adapted from the user's Component Vault:
 * Hero Animations #18/files/script.js: horizontal clip-path expansion.
 * Hero Animations #23/files/script.js: image wipe and staggered caption rise.
 * Demo assets and preloader removed; native Web Animations replace GSAP.
 * Original package metadata for both components declares ISC.
 */
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const mobileMotion = matchMedia('(max-width: 640px)');
const dataSaver = navigator.connection?.saveData === true;
const active = new Set();
const ease = 'cubic-bezier(.22,1,.36,1)';
function animate(el,frames,options){
  if (!el || preference.matches || !el.animate) return;
  const animation=el.animate(frames,options);
  active.add(animation);
  animation.finished.catch(()=>{}).finally(()=>active.delete(animation));
}
const hero=document.querySelector('[data-vault="hero-18"]');
if(hero){
  const video=hero.querySelector('video');
  video?.addEventListener('error',()=>hero.classList.add('video-unavailable'),{once:true});
  if(dataSaver || preference.matches) hero.classList.add('video-unavailable');
  if(!mobileMotion.matches && !dataSaver && !preference.matches){
    animate(hero,[{clipPath:'polygon(0% 45%,100% 45%,100% 55%,0% 55%)'},{clipPath:'polygon(0% 0%,100% 0%,100% 100%,0% 100%)'}],{duration:1100,easing:'cubic-bezier(.87,0,.13,1)'});
    animate(hero.querySelector('img'),[{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:1500,easing:ease});
    document.querySelectorAll('.cinema-title h1>span').forEach((line,i)=>animate(line,[{transform:'translateY(30px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:900,delay:180+i*100,easing:ease,fill:'backwards'}));
  }
}
let observer;
if ('IntersectionObserver' in window && !preference.matches){
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const tiles=[...entry.target.querySelectorAll('.category')];
    if(mobileMotion.matches){observer.unobserve(entry.target);return;}
    tiles.forEach((tile,i)=>{
      const delay=i*110;
      animate(tile.querySelector('.category-image'),[{clipPath:'polygon(0% 100%,100% 100%,100% 100%,0% 100%)',transform:'translateY(22px)'},{clipPath:'polygon(0% 100%,100% 100%,100% 0%,0% 0%)',transform:'translateY(0)'}],{duration:900,delay,easing:ease,fill:'backwards'});
      animate(tile.querySelector('.category-label'),[{transform:'translateY(24px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:750,delay:delay+150,easing:ease,fill:'backwards'});
    });
    observer.unobserve(entry.target);
  }),{threshold:.12});
  document.querySelectorAll('[data-vault="hero-23"]').forEach(el=>observer.observe(el));
}
preference.addEventListener('change',()=>{if(preference.matches){active.forEach(a=>a.cancel());observer?.disconnect();}});

document.querySelectorAll('[data-product-display]').forEach(display=>{
  const desktop=matchMedia('(min-width:981px)');
  const tiles=[...display.querySelectorAll('.product-tile')];
  const preview=display.querySelector('.product-display-preview');
  const previewImage=preview?.querySelector('img');
  const title=preview?.querySelector('h3');
  const copy=preview?.querySelector('span');
  const action=preview?.querySelector('strong');
  let closeTimer;
  const close=()=>{
    clearTimeout(closeTimer);
    display.classList.remove('is-previewing');
  };
  const show=tile=>{
    if(!desktop.matches || preference.matches || !preview) return;
    clearTimeout(closeTimer);
    previewImage.src=tile.dataset.productImage;
    title.textContent=tile.dataset.productName;
    copy.textContent=tile.dataset.productCopy;
    action.innerHTML=`Open sourcing request <span aria-hidden="true">↗</span>`;
    display.classList.add('is-previewing');
  };
  tiles.forEach(tile=>{
    tile.addEventListener('pointerenter',()=>show(tile));
    tile.addEventListener('focus',()=>show(tile));
  });
  display.addEventListener('pointerleave',()=>{closeTimer=setTimeout(close,80);});
  display.addEventListener('focusout',event=>{
    if(!display.contains(event.relatedTarget)) close();
  });
  display.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      close();
      event.currentTarget.querySelector('.product-tile:focus')?.blur();
    }
  });
  desktop.addEventListener('change',close);
});

document.querySelectorAll('[data-fluid-cta]').forEach(section=>{
  if(preference.matches || mobileMotion.matches || dataSaver) return;
  const canvas=section.querySelector('.cta-fluid');
  const context=canvas?.getContext('2d');
  if(!context) return;
  const pointer={x:.72,y:.42,energy:0};
  let frame;
  const resize=()=>{
    const ratio=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(section.clientWidth*ratio);
    canvas.height=Math.round(section.clientHeight*ratio);
    canvas.style.width=`${section.clientWidth}px`;
    canvas.style.height=`${section.clientHeight}px`;
    context.setTransform(ratio,0,0,ratio,0,0);
  };
  const paint=()=>{
    const width=section.clientWidth;
    const height=section.clientHeight;
    context.clearRect(0,0,width,height);
    const radius=Math.max(width,height)*(.26+pointer.energy*.12);
    const glow=context.createRadialGradient(pointer.x*width,pointer.y*height,0,pointer.x*width,pointer.y*height,radius);
    glow.addColorStop(0,'rgba(82,119,138,.18)');
    glow.addColorStop(.38,'rgba(165,196,207,.09)');
    glow.addColorStop(1,'rgba(225,232,233,0)');
    context.fillStyle=glow;
    context.fillRect(0,0,width,height);
    pointer.energy*=.94;
    if(pointer.energy>.01) frame=requestAnimationFrame(paint); else frame=undefined;
  };
  const awaken=()=>{if(!frame) frame=requestAnimationFrame(paint);};
  resize();
  paint();
  section.addEventListener('pointermove',event=>{
    const bounds=section.getBoundingClientRect();
    pointer.x=(event.clientX-bounds.left)/bounds.width;
    pointer.y=(event.clientY-bounds.top)/bounds.height;
    pointer.energy=1;
    awaken();
  });
  addEventListener('resize',resize,{passive:true});
});
