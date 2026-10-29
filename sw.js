// Programma di memoria della Scheda DCM: permette l'uso senza rete. Non contiene dati di pazienti.
const CACHE='scheda-dcm-cfbbe981a3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('scheda-dcm-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  if(r.mode==='navigate'){ // prima la rete (aggiornamenti), poi la copia salvata
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ if(res.ok&&(r.url.startsWith(self.location.origin)||/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(r.url))){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c))} return res })));
});
