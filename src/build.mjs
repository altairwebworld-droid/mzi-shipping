import fs from 'node:fs';
import path from 'node:path';
import {pages} from './pages.mjs';
import {header,footer,breadcrumb} from './components.mjs';
const origin='https://mzishipping.co';
const out=path.resolve('dist');fs.mkdirSync(out,{recursive:true});fs.cpSync('public',out,{recursive:true});fs.cpSync('.openai',path.join(out,'.openai'),{recursive:true});
for(const [route,page] of Object.entries(pages)){
 const url=origin+route;const title=page.title+' | MZI Shipping';
 const schema=[{'@context':'https://schema.org','@type':'Organization',name:'MZI Shipping',url:origin,address:{'@type':'PostalAddress',addressCountry:'CN'}},...(route==='/'?[]:[{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:page.title,item:url}]}])];
 if(['/shipping/','/product-sourcing/','/vehicle-imports/','/machinery/'].includes(route))schema.push({'@context':'https://schema.org','@type':'Service',name:page.title,provider:{'@type':'Organization',name:'MZI Shipping'},url});
 const html=`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${page.description}"><meta name="theme-color" content="#f8f9f6"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${page.description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/assets/hero.webp"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${page.description}"><meta name="twitter:image" content="${origin}/assets/hero.webp"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/editorial.css"><script type="application/ld+json">${JSON.stringify(schema)}</script><script type="module" src="/app.js"></script><script type="module" src="/vault-motion.js"></script></head><body id="top" class="${route==='/'?'home-page':'inner-page'}">${header(route)}<main id="main">${route==='/'?'':breadcrumb(page.title)}${page.render()}</main>${footer()}</body></html>`;
 const dir=path.join(out,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
}
fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(r=>`<url><loc>${origin+r}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync(path.join(out,'404.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | MZI Shipping</title><link rel="stylesheet" href="/styles.css"><main class="tracking-page wrap"><p class="eyebrow">MZI SHIPPING</p><h1>This page<br>has moved.</h1><p>Find the service you need from the home page.</p><a class="button" href="/">Back to home ↗</a></main></html>`);
console.log(`Built ${Object.keys(pages).length} static pages.`);
