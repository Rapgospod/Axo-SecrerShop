// Собирает works.json из файлов в папке works/ (запускается автоматически при деплое на Vercel).
// Имена файлов:
//   tgs1e(Название).tgs   эмодзи, полностью кастомные   (tgs2e, tgs3e ...)
//   tgs1ec(Название).tgs  эмодзи, кастомные на шаблоне  (tgs2ec ...)
//   tgs1el(Название).tgs  эмодзи, шаблонные             (tgs2el ...)
//   tgs1s(Название).tgs   анимированный стикер    (tgs2s, tgs3s ...)
//   avatar1(Название).png аватар (png, jpg, webp, gif, mp4, webm)
// Скобки и название необязательны: tgs1e.tgs тоже подойдёт.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const dir = path.join(root, 'works');
const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
const clean = s => (s || '').replace(/[_]+/g, ' ').trim();
const out = [];
for (const f of files) {
  let m;
  if ((m = f.match(/^tgs(\d+)(ec|el|e|s)(?=[\s_\-(.])[\s_-]*\(?([^)]*)\)?\.(tgs|json)$/i))) {
    out.push({ c: m[2].toLowerCase(), n: +m[1], name: clean(m[3]), src: 'works/' + encodeURIComponent(f) });
  } else if ((m = f.match(/^avatar(\d+)[\s_-]*\(?([^)]*)\)?\.(png|jpe?g|webp|gif|mp4|webm)$/i))) {
    out.push({ c: 'a', n: +m[1], name: clean(m[2]), src: 'works/' + encodeURIComponent(f) });
  }
}
const order = { s: 0, e: 1, ec: 2, el: 3, a: 4 };
out.sort((a, b) => order[a.c] - order[b.c] || a.n - b.n);
fs.writeFileSync(path.join(root, 'works.json'), JSON.stringify(out, null, 1));
console.log('works.json: ' + out.length + ' files');
