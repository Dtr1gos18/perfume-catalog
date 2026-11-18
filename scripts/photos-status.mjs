// Uso: npm run photos:status [-- --csv]
// Muestra qué perfumes ya tienen foto en src/assets/perfumes/<codigo>.<ext>
// y, con --csv, escribe fotos-pendientes.csv para repartir el trabajo.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const perfumes = JSON.parse(fs.readFileSync(path.join(root, 'src/data/perfumes.json'), 'utf8'));
const photosDir = path.join(root, 'src/assets/perfumes');

const withPhoto = new Set(
  fs.existsSync(photosDir)
    ? fs
        .readdirSync(photosDir)
        .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
        .map((f) => f.replace(/\.[^.]+$/, ''))
    : [],
);

// También cuenta las fotos referenciadas explícitamente con el campo `image`.
for (const p of perfumes) if (p.image) withPhoto.add(p.id);

const missing = perfumes.filter((p) => !withPhoto.has(p.id));
console.log(`Con foto: ${perfumes.length - missing.length} / ${perfumes.length}`);
console.log(`Pendientes: ${missing.length}`);

if (process.argv.includes('--csv')) {
  const esc = (s) => `"${String(s).replaceAll('"', '""')}"`;
  const rows = [
    'codigo,nombre,genero',
    ...missing.map((p) => [p.id, esc(p.name), p.gender].join(',')),
  ];
  const out = path.join(root, 'fotos-pendientes.csv');
  fs.writeFileSync(out, rows.join('\n') + '\n');
  console.log(`Lista escrita en ${path.relative(root, out)}`);
}
