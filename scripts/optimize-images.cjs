const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const outputDir = path.join(imagesDir, 'optimized');

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Récupérer toutes les images .jpg
const files = fs.readdirSync(imagesDir)
  .filter(file => file.match(/\.(jpg|jpeg)$/i));

console.log(`🖼️  Conversion de ${files.length} images en WebP...\n`);

let totalOriginal = 0;
let totalOptimized = 0;

// Convertir chaque image
Promise.all(files.map(async (file) => {
  const inputPath = path.join(imagesDir, file);
  const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg)$/i, '.webp'));

  const originalSize = fs.statSync(inputPath).size;
  totalOriginal += originalSize;

  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    const optimizedSize = fs.statSync(outputPath).size;
    totalOptimized += optimizedSize;

    const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    console.log(`✓ ${file} → ${path.basename(outputPath)}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(optimizedSize / 1024 / 1024).toFixed(2)} MB (-${reduction}%)\n`);
  } catch (err) {
    console.error(`✗ Erreur avec ${file}:`, err.message);
  }
})).then(() => {
  const totalReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
  console.log(`\n🎉 Conversion terminée !`);
  console.log(`📊 Taille originale : ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📊 Taille optimisée : ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📊 Réduction totale : -${totalReduction}%`);
});
