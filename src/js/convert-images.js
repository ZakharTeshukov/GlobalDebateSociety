const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const imageDir = path.join(__dirname, '..', 'assets', 'images');
const outputDir = path.join(__dirname, '..', 'assets', 'images', 'webp');

fs.ensureDirSync(outputDir);

const files = glob.sync(`${imageDir}/**/*.{png,jpg,jpeg}`);

files.forEach(file => {
  const { dir, name } = path.parse(file);
  const relativeDir = path.relative(imageDir, dir);
  const outputSubDir = path.join(outputDir, relativeDir);
  
  fs.ensureDirSync(outputSubDir);

  sharp(file)
    .toFormat('webp')
    .toFile(path.join(outputSubDir, `${name}.webp`), (err, info) => {
      if (err) {
        console.error(`Error converting ${file} to WebP:`, err);
      } else {
        console.log(`Successfully converted ${file} to WebP:`, info);
      }
    });
}); 