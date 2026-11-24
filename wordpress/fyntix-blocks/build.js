const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

// Find all view.js files in blocks
const blocks = fs.readdirSync(path.join(__dirname, 'blocks'))
  .filter(name => fs.statSync(path.join(__dirname, 'blocks', name)).isDirectory());

const entryPoints = {};
blocks.forEach(block => {
  const viewFile = path.join(__dirname, 'blocks', block, 'view.js');
  if (fs.existsSync(viewFile)) {
    entryPoints[`blocks/${block}/view`] = viewFile;
  }
});

// Build configuration
const config = {
  entryPoints,
  bundle: true,
  outdir: 'build',
  format: 'iife',
  minify: !isWatch,
  sourcemap: isWatch,
  target: ['es2020'],
  external: [],
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(config);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      await esbuild.build(config);
      console.log('Build complete!');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
