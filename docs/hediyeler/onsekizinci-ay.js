'use strict';

const enter = document.getElementById('enter');
const home = document.getElementById('home');
const room = document.getElementById('room');
const dialog = document.getElementById('memory-dialog');
const body = document.getElementById('memory-body');
const closeButton = document.getElementById('dialog-close');
const letterButton = document.getElementById('letter-open');
const visited = new Set();
const pagesRead = new Set();
const labels = {
  wallPhoto: ['01 · DUVARDAKİ BİZ', 'Her zamanda sana âşığım.'],
  kitchen: ['02 · BİZİM MUTFAĞIMIZ', 'Basit hayatın muhteşem günleri.'],
  window: ['03 · İLK TATİLİMİZ', 'Huzur, tam da bu an.'],
  cups: ['04 · İKİ KUPA, BİR BİZ', 'Battaniyemiz, çaylarımız, sen.'],
  notebook: ['05 · DEFTERİMİZ', 'Sende öğrendiğim 10 şey'],
  suitcase: ['06 · HAYAL BAVULUMUZ', 'Başrolde hep sen.']
};
let content;
let currentKey;
let page = 0;
let trigger;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function markDiscovered(key) {
  if (visited.has(key)) return;
  visited.add(key);
  document.querySelectorAll(`[data-open="${key}"]`).forEach(button => {
    button.classList.add('discovered');
    const dot = button.querySelector('.discovery-dot, b');
    if (dot) dot.textContent = '✓';
  });
  document.getElementById('progress').textContent = `${visited.size} / 6 küçük mutluluk keşfedildi`;
  document.querySelectorAll('#progress-dots i').forEach((dot, index) => dot.classList.toggle('filled', index < visited.size));
  room.classList.toggle('warming', visited.size >= 1);
  room.classList.toggle('blooming', visited.size >= 3);
  if (visited.size === 6) {
    room.classList.add('complete');
    document.getElementById('progress-hint').textContent = 'Bütün anılar yerini buldu. Şimdi mektubunu açabilirsin.';
    document.getElementById('letter-hint').textContent = 'Evimizin her köşesinde biz varız. Bir de sana son bir sözüm…';
    document.getElementById('finale').classList.add('unlocked');
    letterButton.disabled = false;
    letterButton.replaceChildren(document.createTextNode('Mektubunu aç '), element('span', '', '♡'));
  }
}

function showBook() {
  const notebook = content.sections.notebook;
  const entry = notebook.entries[page];
  pagesRead.add(page);
  if (pagesRead.size === notebook.entries.length) markDiscovered('notebook');
  const layout = element('div', 'book-layout');
  const cover = element('aside', 'book-cover');
  cover.append(element('span', '', 'ESMAM’A'), element('div', 'book-heart', '♡'), element('h2', '', notebook.title), element('small', '', '18 ayın bana öğrettikleri…'));
  const sheet = element('article', 'book-page');
  const title = element('h2', '', entry.title);
  title.id = 'memory-title';
  const count = element('p', 'page-number', `SAYFA ${String(page + 1).padStart(2, '0')} / ${notebook.entries.length}`);
  count.setAttribute('aria-live', 'polite');
  sheet.append(count, title, element('p', 'memory-text', entry.text));
  const pagination = element('nav', 'book-pagination');
  pagination.setAttribute('aria-label', 'Defter sayfaları');
  const previous = element('button', '', '← Önceki');
  previous.type = 'button';
  previous.disabled = page === 0;
  previous.addEventListener('click', () => turnPage(-1));
  const next = element('button', '', page === notebook.entries.length - 1 ? 'Defteri kapat ♡' : 'Sonraki →');
  next.type = 'button';
  next.addEventListener('click', () => page === notebook.entries.length - 1 ? dialog.close() : turnPage(1));
  pagination.append(previous, element('span', '', `${page + 1} / ${notebook.entries.length}`), next);
  const note = pagesRead.size === notebook.entries.length ? 'Bütün sayfaları okudun. Bu defter hep senin. ♡' : 'Her sayfada sana söylemek istediğim başka bir şey var.';
  sheet.append(pagination, element('p', 'book-note', note));
  layout.append(cover, sheet);
  body.replaceChildren(layout);
}

function turnPage(direction) {
  const next = page + direction;
  if (next < 0 || next >= content.sections.notebook.entries.length) return;
  page = next;
  showBook();
  dialog.scrollTop = 0;
  // Replacing a page also replaces its buttons; move focus into the new page.
  const title = document.getElementById('memory-title');
  title.tabIndex = -1;
  title.focus({ preventScroll: true });
}

function showMemory(key) {
  const data = content.sections[key];
  const [eyebrow, heading] = labels[key];
  const layout = element('article', data.image ? 'memory-layout' : 'memory-copy text-only');
  const copy = data.image ? element('div', 'memory-copy') : layout;
  if (data.image) {
    const figure = element('div', 'memory-image');
    const photo = element('img');
    photo.src = data.image;
    photo.alt = key === 'wallPhoto' ? '80’ler akımında Esma ve Kadir' : key === 'kitchen' ? 'Mutfağımız için alışveriş yaptığımız gün' : 'Akyaka’da ilk tatilimiz, otel odasında pizza keyfi';
    figure.append(photo);
    layout.append(figure, copy);
  } else {
    const symbol = element('span', 'small-illustration', key === 'cups' ? '♡ ♡' : '↗');
    symbol.setAttribute('aria-hidden', 'true');
    copy.append(symbol);
  }
  const title = element('h2', '', heading);
  title.id = 'memory-title';
  copy.append(element('p', 'eyebrow', eyebrow), title, element('p', 'memory-text', data.text), element('p', 'memory-signature', '— Kadir'));
  body.replaceChildren(layout);
  markDiscovered(key);
}

function showLetter() {
  const letter = content.sections.letter;
  const paper = element('article', 'letter-paper');
  const title = element('h2', '', letter.title);
  title.id = 'memory-title';
  const back = element('button', 'return-home', 'Yuvamıza dön ↗');
  back.type = 'button';
  back.addEventListener('click', () => dialog.close());
  paper.append(element('p', 'eyebrow', '18. AYIMIZIN HATIRASINA'), title, element('p', 'memory-text', letter.text), element('p', 'memory-signature', 'Sana hep aşkla bakan, Kadir'), element('p', 'letter-date', '23 Ekim 2026 · İyi ki biz.'), back);
  body.replaceChildren(paper);
}

function openMemory(key, source) {
  if (!content || (key === 'letter' && visited.size !== 6)) return;
  trigger = source;
  currentKey = key;
  if (key === 'notebook') showBook();
  else if (key === 'letter') showLetter();
  else showMemory(key);
  dialog.showModal();
  dialog.scrollTop = 0;
  closeButton.focus({ preventScroll: true });
}

enter.addEventListener('click', () => {
  document.getElementById('welcome').hidden = true;
  home.hidden = false;
  document.getElementById('home-title').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
});
document.querySelectorAll('[data-open]').forEach(button => {
  button.addEventListener('click', () => openMemory(button.dataset.open, button));
});
letterButton.addEventListener('click', () => openMemory('letter', letterButton));
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  currentKey = undefined;
  trigger?.focus({ preventScroll: true });
});
dialog.addEventListener('keydown', event => {
  if (currentKey !== 'notebook' || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  turnPage(event.key === 'ArrowRight' ? 1 : -1);
});

async function loadContent() {
  const status = document.getElementById('load-status');
  try {
    const response = await fetch('onsekizinci-ay-icerik.json');
    if (!response.ok) throw new Error('İçerik yüklenemedi');
    const data = await response.json();
    for (const key of [...Object.keys(labels), 'letter']) {
      if (!data.sections?.[key]) throw new Error('İçerik eksik');
    }
    if (data.sections.notebook.entries.length !== 10) throw new Error('Defter sayfaları eksik');
    content = data;
    enter.disabled = false;
    status.hidden = true;
  } catch {
    status.replaceChildren(document.createTextNode('Notlar yüklenemedi. '));
    const retry = element('button', 'return-home', 'Yeniden dene');
    retry.type = 'button';
    retry.addEventListener('click', () => { status.textContent = 'Küçük yuvamız hazırlanıyor…'; loadContent(); });
    status.append(retry);
  }
}
loadContent();
