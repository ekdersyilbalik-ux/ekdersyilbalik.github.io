const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../docs');
const gifts = fs.readdirSync(path.join(root, 'hediyeler')).filter(f => f.endsWith('.html'));
assert.equal(gifts.length, 15);
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(home.includes('ESMAMA HEDİYE'));
assert(!home.includes('Özür Dilerim'));
assert.equal([...home.matchAll(/class="gift /g)].length, 15);
let assets = 0, scripts = 0;
for (const file of ['index.html', ...gifts.map(f => `hediyeler/${f}`)]) {
  const absolute = path.join(root, file);
  const html = fs.readFileSync(absolute, 'utf8');
  if (file !== 'index.html') assert(html.includes('id="esma-home-link" href="../index.html"'), file);
  for (const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
    const ref = match[1];
    if (/^(https?:|data:|#|mailto:)/.test(ref)) continue;
    const resolved = path.resolve(path.dirname(absolute), decodeURIComponent(ref.split('#')[0]));
    assert(fs.existsSync(resolved), `${file}: missing ${ref}`);
    if (/\.(jpeg|jpg|png)$/i.test(resolved)) assert(fs.statSync(resolved).size > 0);
    assets++;
  }
  for (const match of html.matchAll(/["'`]((?:\.\.\/img\/)[^"'`]+\.(?:jpeg|jpg|png))["'`]/g)) {
    assert(fs.existsSync(path.resolve(path.dirname(absolute), match[1])), `${file}: missing dynamic photo ${match[1]}`);
    assets++;
  }
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (match[1].trim()) { new vm.Script(match[1], { filename: file }); scripts++; }
  }
}
new vm.Script(fs.readFileSync(path.join(root, 'hediyeler.js'), 'utf8'));
console.log(`PASS: 15 gift pages, ${assets} local references, ${scripts} restored scripts, home links and excluded apology page.`);
