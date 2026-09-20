const selected=new Set();
const output=document.querySelector('#chosen');
const copy=document.querySelector('#copy');
const update=()=>{const values=[...selected];output.textContent=values.length?values.join(', '):'Nothing picked yet';copy.disabled=!values.length;};
document.querySelectorAll('[data-code] button').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('[data-code]');const code=card.dataset.code;if(selected.has(code)){selected.delete(code);card.classList.remove('is-selected');button.textContent=button.textContent.replace('Selected','Select');}else{selected.add(code);card.classList.add('is-selected');button.textContent='Selected';}update();}));
copy.addEventListener('click',async()=>{const text=[...selected].join(', ');try{await navigator.clipboard.writeText(text);copy.textContent='Copied';setTimeout(()=>copy.textContent='Copy selection',1400);}catch{output.textContent=text+' (copy this)';}});
