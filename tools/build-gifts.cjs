const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const docs = path.join(root, 'docs');
const target = path.join(docs, 'hediyeler');
fs.mkdirSync(target, { recursive: true });
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 32 * 1024 * 1024 });
const sites = [
  ['hikayemiz', 'e7ba0ae', 'Fotoğraflı Hikâyemiz', 'Her karede biz, her dokunuşta başka bir anı.', 'Anılar', '♡', '16-foto-kirpildi/foto-01.jpeg'],
  ['dokuzuncu-ay', '664368d', '9. Ayımız', 'Dokuz ay, otuz yıldız ve bir dolu sevme sebebi.', 'Anılar', '✦', 'ay9.jpeg'],
  ['ondorduncu-ay', 'e1d6352', '14. Ayımız', 'Birlikte geçen zaman, güzel anılar ve sana bir mektup.', 'Anılar', '✉', 'WhatsApp Image 2026-06-22 at 23.50.14.jpeg'],
  ['evlilik-teklifi', '12b1e4d', 'Benimle Evlenir misin?', 'Küçük bir soru, ömürlük bir hayal. Altıncı ayımıza…', 'Sürprizler', '💍'],
  ['kasimpati', '9841852', 'Sana Bir Kasımpatı', 'Hiç solmasın diye, sana açan bir çiçek.', 'Çiçekler', '🌸'],
  ['buyuyen-kasimpati', '64be8e5', 'Sevgimiz Gibi Büyüyen', 'Bir sap, bir yaprak, sonra senin için açan bir çiçek.', 'Çiçekler', '🌱'],
  ['buket', 'c1f44c8', 'Esmam İçin Bir Buket', 'Rengârenk çiçeklerin hepsi sana.', 'Çiçekler', '💐'],
  ['abdulkadir-v4', '80c5f59', 'Abdulkadir v4.0', 'Ömür boyu geçerli, bol sevgili bir sürüm güncellemesi.', 'Sürprizler', '💌'],
  ['papatya-fali', 'be3ce36', 'Papatya Falı', 'Bir yaprak seç; bakalım kalbim ne diyecek?', 'Oyunlar', '🌼'],
  ['stres-savar', 'ff84aa3', 'Stres-Savar Baloncuklar', 'Biraz mola ver, baloncukları patlat, gülümse.', 'Oyunlar', '🫧'],
  ['sevgi-baloncuklari', '5a34a15', 'Sevgi Baloncukları', 'Uçuşan baloncukları yakala; her birinde bir iltifat var.', 'Oyunlar', '💕'],
  ['ne-kadar-seviyorum', '5fb41b4', 'Seni Ne Kadar Seviyorum?', 'Aşağı kaydır… Bu sevgi sayfalara sığar mı?', 'Sürprizler', '∞'],
  ['yolculugumuz', '8b9da94', 'Bizim Yolculuğumuz', 'Birlikte gördüğümüz yerler, birlikte kurduğumuz hayaller.', 'Anılar', '🧳'],
  ['pcos-rehberi', '1d0ceb6', 'Senin İçin Yaşam Rehberi', 'Beslenme, günlük rutin ve her zaman yanında olma sözü.', 'Yanındayım', '🌿'],
  ['motivasyon', '1d0e6d1', 'Her Daim Yanındayım', 'İhtiyacın olduğunda aç: seni çok seviyorum.', 'Yanındayım', '💗'],
];

// Recover the photographs at the last revision before their deletion.
for (const file of git('ls-tree', '-r', '--name-only', 'e1d6352', '--', 'docs/img').toString('utf8').trim().split('\n')) {
  if (!file || !/\.(jpeg|jpg|png|gif|webp)$/i.test(file)) continue;
  const destination = path.join(root, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, git('show', `e1d6352:${file}`));
}

for (const [slug, rev] of sites) {
  const source = slug === 'motivasyon' ? 'docs/motivasyon.html' : 'docs/index.html';
  let html = git('show', `${rev}:${source}`).toString('utf8');
  html = html.replaceAll('./img/', '../img/');
  if (slug === 'pcos-rehberi') html = html.replace('href="style.css"', 'href="pcos.css"');
  if (slug === 'motivasyon') html = html.replace('href="index.html"', 'href="pcos-rehberi.html"');
  if (!/name=["']viewport["']/i.test(html)) {
    html = html.replace('</head>', '<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>');
  }
  html = html.replace('</head>', '<link rel="stylesheet" href="../hediye-menu.css">\n</head>');
  html = html.replace(/<body([^>]*)>/i, '<body$1>\n<a id="esma-home-link" href="../index.html" aria-label="Hediye ana menüsüne dön">← Ana menü <span aria-hidden="true">♡</span></a>');
  fs.writeFileSync(path.join(target, `${slug}.html`), html);
}
fs.writeFileSync(path.join(target, 'pcos.css'), git('show', '1d0ceb6:docs/style.css'));
fs.writeFileSync(path.join(docs, 'hediye-menu.css'), `#esma-home-link{position:fixed!important;inset:auto 16px calc(16px + env(safe-area-inset-bottom)) auto!important;z-index:2147483647!important;display:inline-flex!important;align-items:center!important;gap:12px!important;padding:11px 17px!important;border:1px solid #e8d8d3!important;border-radius:999px!important;background:#fffaf4!important;color:#702c40!important;font:600 13px/1.4 system-ui,sans-serif!important;text-decoration:none!important;box-shadow:0 4px 24px #24111a26!important;transform:none!important;opacity:1!important;visibility:visible!important}#esma-home-link:hover{background:#f9e5e9!important}#esma-home-link:focus-visible{outline:3px solid #a54d66!important;outline-offset:4px!important}`);

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const cards = sites.map(([slug, rev, title, description, category, icon, photo], index) => `
    <a class="gift ${photo ? 'with-photo' : ''}" href="hediyeler/${slug}.html" data-category="${category}" style="--tone:${index % 5}">
      <div class="gift-art art-${index % 5}">${photo ? `<img src="img/${escape(photo)}" alt="" loading="lazy">` : `<span aria-hidden="true">${icon}</span><i class="orbit" aria-hidden="true"></i>`}<span class="number">${String(index + 1).padStart(2, '0')}</span></div>
      <div class="gift-copy"><span class="category">${category}</span><h3>${title}</h3><p>${description}</p><span class="open">Hediyeyi aç <span aria-hidden="true">↗</span></span></div>
    </a>`).join('');
const categories = ['Hepsi', 'Anılar', 'Çiçekler', 'Oyunlar', 'Sürprizler', 'Yanındayım'];
fs.writeFileSync(path.join(docs, 'index.html'), `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#faf6ef">
  <meta name="description" content="Esmam için sevgiyle hazırladığım 15 hediye: anılarımız, çiçekler, küçük oyunlar ve sürprizler.">
  <title>ESMAMA HEDİYE WEB SİTELERİM</title>
  <link rel="stylesheet" href="hediyeler.css">
  <script src="hediyeler.js" defer></script>
</head>
<body>
  <a class="skip" href="#hediyeler">Hediyelere geç</a>
  <header class="topbar"><a class="brand" href="index.html">K <span>♡</span> E</a><span class="top-note">Sadece senin için, sevgiyle.</span><a class="top-link" href="#hediyeler">Hediyelerin <span aria-hidden="true">↗</span></a></header>
  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy"><p class="eyebrow"><span aria-hidden="true">✦</span> KALBİMDEN EKRANINA</p><h1 id="hero-title">ESMAMA HEDİYE<br><em>WEB SİTELERİM</em></h1><p class="intro">Sana hazırladığım bütün küçük mutluluklar,<br class="desktop-break"> artık aynı yerde. Birini seç, içindeki sevgiyi aç.</p><a class="primary" href="#hediyeler">Hediyelerini keşfet <span aria-hidden="true">↓</span></a><div class="hero-foot"><span class="tiny-heart" aria-hidden="true">♡</span><span>15 hediye, hepsinde sen.</span></div></div>
      <div class="hero-art"><span class="scribble s1" aria-hidden="true">♡</span><figure class="polaroid back"><img src="img/ay9.jpeg" alt="Birlikte bir anımız"><figcaption>iyi ki biz…</figcaption></figure><figure class="polaroid front"><span class="tape" aria-hidden="true"></span><img src="img/ay4.jpeg" alt="Kadir ve Esma"><figcaption>en güzel hikâyem sensin ♡</figcaption></figure><span class="scribble s2" aria-hidden="true">✧</span><span class="handwritten">Esmam'a, Kadir'den</span></div>
    </section>
    <section class="collection" id="hediyeler" aria-labelledby="collection-title"><div class="section-top"><div><p class="eyebrow">KÜÇÜK BİR HEDİYE KOLEKSİYONU</p><h2 id="collection-title">Hangisini açmak istersin?</h2></div><span class="collection-count" aria-live="polite">15 hediye seni bekliyor</span></div><div class="filters" role="group" aria-label="Hediye kategorileri">${categories.map((c,i) => `<button type="button" data-filter="${c}" aria-pressed="${i === 0}">${c}</button>`).join('')}</div><div class="gift-grid">${cards}
    </div></section>
    <section class="closing"><span aria-hidden="true">♡</span><p>Her sayfada başka bir sürpriz,<br><em>hepsinde aynı cümle: seni çok seviyorum.</em></p><span class="signature">Kadir</span></section>
  </main><footer><a class="brand" href="index.html">K <span>♡</span> E</a><p>Esmam için, sevgiyle hazırlandı.</p><a href="#hero-title">Yukarı dön ↑</a></footer>
</body>
</html>`);
console.log(`Restored ${sites.length} gifts and their photographs.`);
