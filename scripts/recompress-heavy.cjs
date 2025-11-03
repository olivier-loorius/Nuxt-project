const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Les 5 images les plus lourdes à recompresser
const targetImages = [
  'cafeconcetto-GRbrlVGbNGY-unsplash.webp',
  'charles-chen-w2ZFjDnUL3w-unsplash.webp',
  'marcelo-cidrack-7jZNgIuJrCM-unsplash.webp',
  'victoria-shes-IUk1S6n2s0o-unsplash.webp',
  'andrey-matveev-SPG0SznDi8c-unsplash.webp'
];

console.log(`🔥 Compression agressive de ${targetImages.length} images (qualité 70)...\n`);

let totalBefore = 0;
let totalAfter = 0;

Promise.all(targetImages.map(async (filename) => {
  const inputPath = path.join(imagesDir, filename);
  const tempPath = path.join(imagesDir, `temp_${filename}`);

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  ${filename} n'existe pas, ignoré.\n`);
    return;
  }

  const originalSize = fs.statSync(inputPath).size;
  totalBefore += originalSize;

  try {
    // Recompresser en WebP qualité 70
    await sharp(inputPath)
      .webp({ quality: 70 })
      .toFile(tempPath);

    const newSize = fs.statSync(tempPath).size;
    totalAfter += newSize;

    // Remplacer l'original
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);

    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(`✓ ${filename}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(newSize / 1024 / 1024).toFixed(2)} MB (-${reduction}%)\n`);
  } catch (err) {
    console.error(`✗ Erreur avec ${filename}:`, err.message);
    // Nettoyer le fichier temp si erreur
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
})).then(() => {
  const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`\n🎉 Recompression terminée !`);
  console.log(`📊 Taille avant : ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📊 Taille après : ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📊 Réduction : -${totalReduction}%`);
  console.log(`📊 Gain : ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB`);
});
