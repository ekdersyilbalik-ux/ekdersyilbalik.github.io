'use strict';
const $ = id => document.getElementById(id);
const colors = ['#e7b6bd', '#d9dfc6', '#eacc9e', '#cec9e2', '#bfcfd1', '#ecd1bc'];
const options = [];
const special = 'Kadir’e sor 💌';
const phone = '905462121748';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let spinning = false;
let angle = 0;
let wheelAnimation;
function randomIndex(length) {
  const buffer = new Uint32Array(1);
  const limit = Math.floor(4294967296 / length) * length;
  do { crypto.getRandomValues(buffer); } while (buffer[0] >= limit);
  return buffer[0] % length;
}
function whatsapp() {
  const choicesToSend = [...options];
  const pending = $('option-input').value.trim();
  if (pending && !choicesToSend.some(text => text.toLocaleLowerCase('tr') === pending.toLocaleLowerCase('tr'))) choicesToSend.push(pending);
  const choices = choicesToSend.length ? '\nSeçeneklerim:\n' + choicesToSend.map((text, i) => `${i + 1}. ${text}`).join('\n') : '';
  return `https://wa.me/${phone}?text=${encodeURIComponent('askim, karar veremedim. Bir de sana sorayım dedim. 💌' + choices + '\nSence ne seçeyim?')}`;
}
function updateWhatsappLinks() {
  for (const id of ['ask-kadir', 'ask-kadir-direct', 'result-whatsapp']) $(id).href = whatsapp();
}
$('option-input').addEventListener('input', updateWhatsappLinks);
function svgNode(tag, attributes, text) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}
function render() {
  // Empty pastel slices preview the wheel before the first choice is added.
  const entries = options.length ? [...options, special] : ['', '', '', '', '', special];
  const wheel = $('wheel');
  wheel.replaceChildren();
  const step = 360 / entries.length;
  entries.forEach((entry, i) => {
    const start = (i * step - 90) * Math.PI / 180;
    const end = ((i + 1) * step - 90) * Math.PI / 180;
    const fill = i === entries.length - 1 ? '#824256' : colors[i % colors.length];
    if (entries.length === 1) wheel.append(svgNode('circle', {cx:220,cy:220,r:219,fill}));
    else wheel.append(svgNode('path', {d:`M220 220 L${220 + 219 * Math.cos(start)} ${220 + 219 * Math.sin(start)} A219 219 0 ${step > 180 ? 1 : 0} 1 ${220 + 219 * Math.cos(end)} ${220 + 219 * Math.sin(end)} Z`,fill,stroke:'#fff8ed','stroke-width':2}));
    const mid = i * step + step / 2 - 90;
    const label = entry.length > 20 ? entry.slice(0, 18) + '…' : entry;
    wheel.append(svgNode('text', {x:350,y:220,transform:`rotate(${mid} 220 220)`,fill:i === entries.length - 1 ? '#fff7eb' : '#4e4144','text-anchor':'middle','dominant-baseline':'middle','font-family':'Segoe UI, Arial, sans-serif','font-size':entries.length > 9 ? 11 : 13,'font-weight':500}, label));
  });
  wheel.setAttribute('aria-label', options.length ? `Çarktaki seçenekler: ${entries.join(', ')}` : 'Boş çark önizlemesi. Kadir’e sor hazır; kendi seçeneklerini ekle.');
  $('slice-count').textContent = options.length ? `${String(entries.length).padStart(2,'0')} DİLİM` : 'SENİN SEÇİMLERİNLE';
  $('option-count').textContent = `${options.length} / 12`;
  $('empty-state').hidden = options.length > 0;
  $('spin').disabled = spinning || options.length < 2;
  $('option-input').disabled = spinning;
  $('add-option').disabled = spinning || options.length >= 12;
  $('clear').disabled = spinning || !options.length;
  $('wheel-note').textContent = options.length < 2 ? 'Başlamak için en az iki seçenek ekle.' : 'Her dilimin şansı eşit. Kadir de çarkta. ♡';
  $('option-list').replaceChildren();
  options.forEach((text, index) => {
    const row = document.createElement('li');
    const dot = document.createElement('span'); dot.className = 'swatch'; dot.style.background = colors[index % colors.length];
    const label = document.createElement('span'); label.textContent = text;
    const remove = document.createElement('button'); remove.type='button'; remove.className='remove-option'; remove.textContent='×'; remove.disabled=spinning; remove.setAttribute('aria-label',`${text} seçeneğini sil`);
    remove.addEventListener('click',()=>{if(spinning)return;options.splice(index,1);resetWheel();render();});
    row.append(dot,label,remove); $('option-list').append(row);
  });
  updateWhatsappLinks();
}
function resetWheel() { wheelAnimation?.cancel(); angle=0; $('wheel').style.transform='rotate(0deg)'; }
$('option-form').addEventListener('submit',event=>{
  event.preventDefault(); if(spinning)return;
  const value=$('option-input').value.trim();
  if(!value)return;
  if(options.length>=12){$('input-status').textContent='Bir çarka en fazla 12 seçeneğini ekleyebilirsin.';return;}
  if(options.some(item=>item.toLocaleLowerCase('tr')===value.toLocaleLowerCase('tr')) || /^kadir[’'\s]*e?\s*sor/i.test(value)){$('input-status').textContent='Bu seçenek zaten çarkımızda. Başka bir ihtimal ekleyelim.';return;}
  options.push(value);$('option-input').value='';$('input-status').textContent='';resetWheel();render();$('option-input').focus();
});
$('clear').addEventListener('click',()=>{if(spinning)return;options.length=0;resetWheel();render();$('option-input').focus();});
function confetti() {
  $('confetti').replaceChildren(); if(reducedMotion.matches)return;
  for(let i=0;i<24;i++){const piece=document.createElement('i');piece.style.left=`${randomIndex(100)}%`;piece.style.background=colors[i%colors.length];piece.style.animationDelay=`${i*.025}s`;$('confetti').append(piece);}
}
function result(title, copy, mode='normal') {
  $('result-title').textContent=title;$('result-copy').textContent=copy;
  $('rank-list').hidden=true;$('rank-list').replaceChildren();
  $('result-whatsapp').hidden=mode!=='kadir';$('result-whatsapp').href=whatsapp();
  $('accept-result').hidden=mode==='kadir';$('accept-result').textContent=mode==='rank'?'Sıramız belli ♡':'Tamam, bunu seçtim ♡';
  $('reconsider').hidden=mode!=='normal';
  $('result-eyebrow').textContent=mode==='rank'?'KÜÇÜK BİR BAŞLANGIÇ PLANI':'ŞANSIN KÜÇÜK İŞARETİ';
  $('result-dialog').showModal(); confetti();
}
$('spin').addEventListener('click',async()=>{
  if(spinning||options.length<2)return;
  spinning=true;render();$('wheel-note').textContent='Bakalım şans bugün ne fısıldayacak…';$('spin').textContent='Çark dönüyor…';
  const entries=[...options,special];const chosen=randomIndex(entries.length);const step=360/entries.length;
  const destination=(360-(chosen+.5)*step)%360;
  const target=angle+360*5+((destination-angle%360+360)%360);
  wheelAnimation=$('wheel').animate([{transform:`rotate(${angle}deg)`},{transform:`rotate(${target}deg)`}],{duration:reducedMotion.matches?0:4400,easing:'cubic-bezier(.14,.72,.12,1)',fill:'forwards'});
  await wheelAnimation.finished;angle=target;$('wheel').style.transform=`rotate(${angle}deg)`;wheelAnimation.cancel();
  spinning=false;render();$('spin').textContent='Bir daha çevir ↗';
  result(entries[chosen],chosen===options.length?'Bu kararda sevgilinin fikrine başvuruyoruz. Seçeneklerin mesajda hazır; WhatsApp’ta bana gönderebilirsin.':'Çarkın seçimi bu oldu sevgilim. Peki, senin içine sindi mi?',chosen===options.length?'kadir':'normal');
});
document.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{const box=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))dialog.close();}));
$('accept-result').addEventListener('click',()=>{$('result-dialog').close();document.querySelector('.love-note').classList.remove('celebrate');requestAnimationFrame(()=>document.querySelector('.love-note').classList.add('celebrate'));});
$('reconsider').addEventListener('click',()=>{$('result-title').textContent='Gönlündekini bulduk. ♡';$('result-copy').textContent='Bak, çark bahaneymiş sevgilim. Diğerini istiyorsan onu seç; karar yine senin.';$('reconsider').hidden=true;$('accept-result').textContent='Gönlümdekini seçiyorum ♡';});
$('coin-open').addEventListener('click',()=>{$('coin-dialog').showModal();});
$('coin-form').addEventListener('submit',event=>{event.preventDefault();const a=$('coin-a').value.trim(),b=$('coin-b').value.trim();if(!a||!b)return;$('coin-dialog').close();result(randomIndex(2)?a:b,'Yazı tura kararını verdi. İçinden geçen de bu muydu sevgilim?');});
$('shuffle').addEventListener('click',()=>{
  if(options.length<2){$('input-status').textContent='Sıralamak için önce yukarıya en az iki seçenek ekle.';$('option-input').focus();return;}
  const order=[...options];for(let i=order.length-1;i>0;i--){const j=randomIndex(i+1);[order[i],order[j]]=[order[j],order[i]];}
  result('Önce bundan başlayalım.','Hepsine bir sıra bulduk. Acele etmeden, birer birer.','rank');
  order.forEach(text=>{const li=document.createElement('li');li.textContent=text;$('rank-list').append(li);});$('rank-list').hidden=false;
});
render();
