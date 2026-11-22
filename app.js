const projects = [
  ['Divergo Fleet Management','Systems engineering','A three-tier fleet platform for owners, drivers and customers. Booking APIs use MongoDB for trip data and Redis for caching and rate limiting.','divergo-fleet-management','','df','#292d24','#c5d99c'],
  ['AI Resume Matcher','Hiring tools','A hiring interface for matching résumés with job requirements. Explore the live application and its frontend implementation.','ai_resume_frontend','https://ai-resume-frontend-pi.vercel.app','ai','#35271e','#ffae7e'],
  ['EduWave','Education technology','A collaborative learning platform connecting teachers and students.','eduWave','https://edu-wave.vercel.app','ew','#222e38','#a5d1e7'],
  ['All Blogs','Full-stack development','A blogging application built with MongoDB, Express, React and Node.js.','Blog-website','https://allblogapp-project.vercel.app','ab','#312636','#deb1e2']
];
const grid = document.querySelector('#projects');
for (const [title, category, description, repo, demo, mark, bg, ink] of projects) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.group = demo ? 'demo' : 'systems';
  card.innerHTML = `<div class="art" aria-hidden="true" style="--bg:${bg};--ink:${ink}"><b>${mark}</b></div><div class="cardbody"><small>${category}</small><h3>${title}</h3><p>${description}</p>${demo ? '<a href="'+demo+'">Live demo</a>' : ''}<a href="https://github.com/SundaRahul/${repo}">GitHub source</a></div>`;
  grid.append(card);
}
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.onclick = () => {
  filters.forEach(item => item.setAttribute('aria-pressed',item === button));
  for (const card of grid.children) card.hidden = button.dataset.filter !== 'all' && card.dataset.group !== button.dataset.filter;
});
const dialog = document.querySelector('dialog');
document.querySelectorAll('[data-contact]').forEach(button => button.onclick = () => dialog.showModal());
dialog.querySelector('.close').onclick = () => dialog.close();
dialog.querySelector('form').onsubmit = event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const body = data.get('message')+'\n\n'+data.get('sender')+'\n'+data.get('email');
  location.href = 'mailto:rahulsunda977@gmail.com?subject='+encodeURIComponent('Hiring inquiry — '+data.get('role'))+'&body='+encodeURIComponent(body);
};

// Project a tube around a trefoil curve, ordered by depth for hidden surfaces.
const canvas = document.querySelector('#mesh');
const ctx = canvas.getContext('2d');
const tau = Math.PI*2;
function center(t) {
  const radius = 1.2 + .55*Math.cos(3*t);
  return [radius*Math.cos(2*t),radius*Math.sin(2*t),.72*Math.sin(3*t)];
}
function unit(v) { const length=Math.hypot(...v); return v.map(n=>n/length); }
function cross(a,b) { return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]; }
const rings=96, sides=18;
const vertices=Array.from({length:rings},(_,i)=>{
  const t=tau*i/rings, c=center(t), next=center(t+.001);
  const tangent=unit(next.map((v,k)=>v-c[k])), normal=unit(cross(tangent,[0,0,1])), binormal=cross(tangent,normal);
  return Array.from({length:sides},(_,j)=>c.map((v,k)=>v+.28*(Math.cos(tau*j/sides)*normal[k]+Math.sin(tau*j/sides)*binormal[k])));
});
function draw(angle=.18) {
  const w=canvas.clientWidth,h=canvas.clientHeight, pixel=Math.min(devicePixelRatio,2);
  canvas.width=Math.round(w*pixel);canvas.height=Math.round(h*pixel);ctx.scale(pixel,pixel);
  ctx.fillStyle='#5a5042';
  for(let x=12;x<w;x+=20)for(let y=12;y<h-22;y+=20)ctx.fillRect(x,y,1,1);
  const scale=Math.min(w/4.55,(h-42)/3.7);
  const points=vertices.map(r=>r.map(([x,y,z])=>{
    const u=x*Math.cos(angle)-y*Math.sin(angle),v=x*Math.sin(angle)+y*Math.cos(angle);
    return [w/2+u*scale,h*.45+(v*.75-z*.66)*scale,v*.66+z*.75];
  }));
  const faces=[];
  points.forEach((r,i)=>r.forEach((p,j)=>{
    const next=points[(i+1)%rings], k=(j+1)%sides, face=[p,next[j],next[k],r[k]];
    faces.push([face.reduce((sum,v)=>sum+v[2],0)/4,face]);
  }));
  faces.sort((a,b)=>a[0]-b[0]);
  for(const [z,face] of faces){
    const light=Math.max(25,Math.min(78,54+z*16));
    ctx.fillStyle='#261b16';ctx.strokeStyle='hsl(25 89% '+light+'%)';ctx.lineWidth=.8;
    ctx.beginPath();face.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.stroke();
  }
}
new ResizeObserver(()=>draw()).observe(canvas);
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  canvas.onpointermove=e=>draw(.18+(e.offsetX/canvas.clientWidth-.5)*.6);
  canvas.onpointerleave=()=>draw();
}
