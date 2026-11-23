// Собирает works.json из файлов в папке works/ (запускается автоматически при деплое на Vercel).
// Имена файлов (скобки и название необязательны, номер задаёт рамку):
//   tgs1s(Название).tgs   стикеры анимированные, детализированные
//   tgs1l(Название).tgs   стикеры анимированные, упрощённые
//   png1(Название).png    стикеры статичные (png, webp, jpg, gif)
//   tgs1e(Название).tgs   эмодзи, полностью кастомные
//   tgs1ec(Название).tgs  эмодзи, кастомные на шаблоне
//   tgs1el(Название).tgs  эмодзи, шаблонные
//   avatar1(Название).png аватары (png, jpg, webp, gif, mp4, webm)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const dir = path.join(root, 'works');
const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
const clean = s => (s || '').replace(/[_]+/g, ' ').trim();
const url = f => 'works/' + encodeURIComponent(f);
const out = [];
for (const f of files) {
  let m;
  if ((m = f.match(/^tgs(\d+)(ec|el|e|s|l)(?=[\s_\-(.])[\s_-]*\(?([^)]*)\)?\.(tgs|json)$/i))) {
    out.push({ c: m[2].toLowerCase(), n: +m[1], name: clean(m[3]), src: url(f) });
  } else if ((m = f.match(/^png(\d+)[\s_-]*\(?([^)]*)\)?\.(png|webp|jpe?g|gif)$/i))) {
    out.push({ c: 'p', n: +m[1], name: clean(m[2]), src: url(f) });
  } else if ((m = f.match(/^avatar(\d+)[\s_-]*\(?([^)]*)\)?\.(png|jpe?g|webp|gif|mp4|webm)$/i))) {
    out.push({ c: 'a', n: +m[1], name: clean(m[2]), src: url(f) });
  } else if (!/^(artist|manager)\./.test(f)) {
    console.log('ПРОПУЩЕН (имя не подходит): ' + f);
  }
}
const order = { s: 0, l: 1, p: 2, e: 3, ec: 4, el: 5, a: 6 };
out.sort((a, b) => order[a.c] - order[b.c] || a.n - b.n);
for (const o of out) {
  const size = fs.statSync(path.join(root, decodeURIComponent(o.src))).size;
  if (size > 1.5 * 1024 * 1024) console.log('ТЯЖЁЛЫЙ ФАЙЛ (' + (size / 1048576).toFixed(1) + ' МБ), на телефонах будет грузиться долго: ' + o.src);
}
fs.writeFileSync(path.join(root, 'works.json'), JSON.stringify(out, null, 1));
console.log('works.json: ' + out.length + ' files');
