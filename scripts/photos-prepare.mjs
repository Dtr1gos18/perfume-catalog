// Uso: npm run photos:prepare -- <carpeta-con-fotos> [--force]
//
// Toma fotos tomadas con el celular, nombradas por código (104.jpg, 001.png, ...),
// las recorta, centra y normaliza a 800x800 sobre fondo blanco y las guarda en src/assets/perfumes/<codigo>.jpg.
// Así el repositorio no se llena de fotos de varios MB.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SIZE = 800;
// Margen blanco alrededor del producto tras recortar el fondo sobrante.
const MARGIN = 24;
const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'src/assets/perfumes');
const args = process.argv.slice(2);
const force = args.includes('--force');
const inputDir = args.find((a) => !a.startsWith('--'));

if (!inputDir || !fs.existsSync(inputDir)) {
  console.error('Indica la carpeta con las fotos: npm run photos:prepare -- <carpeta>');
  process.exit(1);
}

const perfumes = JSON.parse(fs.readFileSync(path.join(root, 'src/data/perfumes.json'), 'utf8'));
const ids = new Set(perfumes.map((p) => p.id));
fs.mkdirSync(outDir, { recursive: true });

const result = { ok: [], skipped: [], unknownCode: [], failed: [] };

const files = fs.readdirSync(inputDir).filter((f) => /\.(jpe?g|png|webp|heic|avif)$/i.test(f));
for (const file of files) {
  const code = file.replace(/\.[^.]+$/, '');
  if (!ids.has(code)) {
    result.unknownCode.push(file);
    continue;
  }
  const target = path.join(outDir, `${code}.jpg`);
  if (fs.existsSync(target) && !force) {
    result.skipped.push(file);
    continue;
  }
  try {
    await sharp(path.join(inputDir, file))
      .rotate() // respeta la orientación EXIF del celular
      .flatten({ background: '#ffffff' })
      .trim({ threshold: 25 }) // quita el fondo sobrante para que el frasco llene la card
      .resize(SIZE - MARGIN * 2, SIZE - MARGIN * 2, { fit: 'inside' })
      .extend({
        top: MARGIN,
        bottom: MARGIN,
        left: MARGIN,
        right: MARGIN,
        background: '#ffffff',
      })
      .resize(SIZE, SIZE, { fit: 'contain', background: '#ffffff' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(target);
    result.ok.push(code);
  } catch (error) {
    result.failed.push(`${file}: ${error.message}`);
  }
}

console.log(`Procesadas: ${result.ok.length}`);
if (result.skipped.length)
  console.log(`Omitidas (ya existían, usa --force): ${result.skipped.join(', ')}`);
if (result.unknownCode.length) {
  console.log(
    `Sin perfume con ese código (revisa el nombre del archivo): ${result.unknownCode.join(', ')}`,
  );
}
if (result.failed.length) console.log(`Con error:\n  ${result.failed.join('\n  ')}`);
if (result.unknownCode.length || result.failed.length) process.exitCode = 1;
