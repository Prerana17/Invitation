let marathi=false;
const weddingDate=new Date('2026-12-18T13:00:00+05:30');
function countdown(){const diff=Math.max(0,weddingDate.getTime()-Date.now());const vals=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=(typeof marathi!=='undefined'&&marathi?String(vals[i]).padStart(2,'0').replace(/[0-9]/g,d=>'०१२३४५६७८९'[+d]):String(vals[i]).padStart(2,'0')));if(diff===0)document.getElementById('countdown-note').textContent='The celebrations have begun! ✨'}countdown();setInterval(countdown,1000);
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.getElementById('progress').style.width=(max>0?scrollY/max*100:0)+'%'},{passive:true});
document.getElementById('lang').addEventListener('click',()=>{marathi=!marathi;document.querySelectorAll('[data-en]').forEach(el=>el.textContent=el.dataset[marathi?'mr':'en']);document.getElementById('lang').textContent=marathi?'English':'मराठी';document.documentElement.lang=marathi?'mr':'en'});
const events={wedding:{title:'Prerana & Raunak — Wedding Ceremony',start:'20261218T073000Z',end:'20261218T093000Z'},reception:{title:'Prerana & Raunak — Wedding Reception',start:'20261218T123000Z',end:'20261218T143000Z'}};const venue='Larisa Resort, Gangapur-Savargaon Road, near York Winery, Gangavhare, Nashik, Maharashtra 422222, India';
function icsEscape(s){return s.replace(/\\/g,'\\\\').replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n')}
document.querySelectorAll('.calendar').forEach(btn=>btn.addEventListener('click',()=>{const e=events[btn.dataset.event];const uid=`${btn.dataset.event}-20261218@prerana-raunak`;const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Prerana Raunak Wedding//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${uid}`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART:${e.start}`,`DTEND:${e.end}`,`SUMMARY:${icsEscape(e.title)}`,`LOCATION:${icsEscape(venue)}`,'DESCRIPTION:We look forward to celebrating with you!','END:VEVENT','END:VCALENDAR'];const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`prerana-raunak-${btn.dataset.event}.ics`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}));
document.getElementById('share').addEventListener('click',async()=>{const status=document.getElementById('share-status');try{if(navigator.share){await navigator.share({title:'Prerana & Raunak — Wedding Invitation',text:'Join us on 18 December 2026 in Nashik!',url:location.href});return}await navigator.clipboard.writeText(location.href);status.textContent='Invitation link copied!'}catch(err){if(err.name!=='AbortError')status.textContent='Copy the URL from your browser to share.'}});

// Complete Marathi toggle: dynamic countdown messages, navigation, labels and envelope.
const languageButton=document.getElementById('lang');
function translateDynamic(){
  const ended=Date.now()>=weddingDate.getTime();
  if(ended){document.getElementById('countdown-note').textContent=marathi?'मंगल सोहळा सुरू झाला आहे! ✨':'The celebrations have begun! ✨'}
  document.getElementById('music-toggle').textContent=musicOn?(marathi?'♫ संगीत बंद करा':'♫ Music on'):(marathi?'♫ संगीत सुरू करा':'♫ Music off');
}
languageButton.addEventListener('click',translateDynamic);

// Countdown interval from the original script updates only numbers and the ended message.
// Marathi numerals are displayed by applying language formatting to each countdown value.
const numberFormatter=()=>{if(marathi){const digits='०१२३४५६७८९';['days','hours','minutes','seconds'].forEach(id=>{const e=document.getElementById(id);e.textContent=e.textContent.replace(/[0-9]/g,d=>digits[+d])})}};
setInterval(translateDynamic,1000);

// Floating flower petals. Low particle count, no external libraries.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const petals=document.getElementById('petal-field');
if(!reducedMotion){for(let i=0;i<24;i++){
  const petal=document.createElement('span');petal.className='petal'+(i%5===0?' gold':i%4===0?' purple':'');
  petal.style.setProperty('--left',`${(i*47.37)%100}%`);
  petal.style.setProperty('--delay',`${-(i*2.13)%20}s`);
  petal.style.setProperty('--duration',`${11+(i%8)*1.4}s`);
  petal.style.setProperty('--sway',`${(i%2?1:-1)*(45+i%7*11)}px`);
  petal.style.setProperty('--rotation',`${i*32}deg`);petals.append(petal);
}}

// A gentle original instrumental melody generated locally using Web Audio.
// Browsers require a user gesture before audio can start; no autoplay.
let musicOn = false;
const music = SC.Widget(document.getElementById('wedding-music'));
function toggleMusic() {
  if (musicOn) {
    music.pause();
    musicOn = false;
  } else {
    music.play();
    musicOn = true;
  }
  document.getElementById('music-toggle')
    .setAttribute('aria-pressed', String(musicOn));

  translateDynamic();
}
document.getElementById('music-toggle')
  .addEventListener('click', toggleMusic);

// Wax-seal opening starts music after the guest clicks (browser autoplay policy).
const overlay=document.getElementById('envelope-overlay');
const openButton=document.getElementById('open-invitation');
function openInvitation(){if(overlay.classList.contains('opening'))return;if(!musicOn)toggleMusic();overlay.classList.add('opening');setTimeout(()=>{overlay.classList.add('opened');overlay.setAttribute('aria-hidden','true');openButton.setAttribute('tabindex','-1');document.querySelector('.hero .primary').focus({preventScroll:true})},reducedMotion?50:1300)}
openButton.addEventListener('click',openInvitation);

// One scroll observer for every reveal style (including newly added elements).
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12, rootMargin: '0px 0px -24px 0px'});
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom')
  .forEach(el => scrollObserver.observe(el));
