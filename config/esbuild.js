//Esbuild empaqueta y hace que mi codigo quede en un solo archivo
import esbuild from 'esbuild';

const entryPoints = [
    'src/index.js',
    'src/scripts/scrapper.js',
    'src/scripts/scrapCandidates.js',
  ];

esbuild.build({
    entryPoints,
    watch: true,
    bundle: true,
    outdir: 'dist',
    minify: true,
}).then(res=>console.log(res))
    .catch(err=>console.log(err))

