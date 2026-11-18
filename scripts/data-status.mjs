// Uso: npm run data:status [-- --csv]
// Resume qué datos olfativos tiene cada perfume y, con --csv, escribe datos-pendientes.csv
// con los que aún necesitan información (la columna "concentracion" se puede rellenar a mano).
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const perfumes = JSON.parse(fs.readFileSync(path.join(root, 'src/data/perfumes.json'), 'utf8'));
const photosDir = path.join(root, 'src/assets/perfumes');
const withPhoto = new Set(
  fs.existsSync(photosDir) ? fs.readdirSync(photosDir).map((f) => f.replace(/\.[^.]+$/, '')) : [],
);

// Una descripción de texto cubre la falta de notas por niveles.
const missingOf = (p) =>
  [
    !p.notes && !p.description && 'notas',
    !p.family && 'familia',
    !p.concentration && 'concentracion',
  ].filter(Boolean);

const count = (fn) => perfumes.filter(fn).length;
console.log(`Perfumes: ${perfumes.length}`);
console.log(`Con notas: ${count((p) => p.notes)}`);
console.log(`Solo con descripción (sin notas): ${count((p) => !p.notes && p.description)}`);
console.log(`Con familia: ${count((p) => p.family)}`);
console.log(`Con concentración: ${count((p) => p.concentration)}`);
const hasIntensity = (p) => Boolean(p.intensity || p.concentration);
console.log(
  `Con intensidad: ${count(hasIntensity)} (por concentración: ${count((p) => !p.intensityBasis && p.concentration)}, ` +
    `según reseñas: ${count((p) => p.intensityBasis === 'resenas')}, ` +
    `estimada: ${count((p) => p.intensityBasis === 'estimada')})`,
);
console.log(`Sin intensidad: ${count((p) => !hasIntensity(p))}`);
console.log(`Completos: ${count((p) => missingOf(p).length === 0)}`);
console.log(`Sin ningún dato: ${count((p) => missingOf(p).length === 3)}`);

if (process.argv.includes('--csv')) {
  const esc = (s) => `"${String(s).replaceAll('"', '""')}"`;
  const rows = ['codigo,nombre,genero,falta,tiene_foto,concentracion'];
  for (const p of perfumes) {
    const missing = missingOf(p);
    if (!missing.length) continue;
    rows.push(
      [
        p.id,
        esc(p.name),
        p.gender,
        esc(missing.join(' + ')),
        withPhoto.has(p.id) ? 'si' : 'no',
        p.concentration ?? '',
      ].join(','),
    );
  }
  const out = path.join(root, 'datos-pendientes.csv');
  fs.writeFileSync(out, rows.join('\n') + '\n');
  console.log(`Lista escrita en ${path.relative(root, out)} (${rows.length - 1} perfumes)`);
}
