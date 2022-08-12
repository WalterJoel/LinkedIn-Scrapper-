//Esbuild empaqueta y hace que mi codigo quede en un solo archivo
import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/index.js','src/scripts/scrapper.js'],
    watch: true,
    bundle: true,
    outdir: 'dist',
    minify: true,
}).then(res=>console.log(res))
    .catch(err=>console.log(err))

