import cp from 'vite-plugin-cp';
import path from 'node:path';

const external = [];

function genCpModule(module: string) {
  return { src: `./node_modules/${module}`, dest: `dist/node_modules/${module}`, flatten: false };
}

let config = {
  main: {
    build: {
      outDir: 'dist/main',
      emptyOutDir: true,
      lib: {
        formats: ['cjs'],
        entry: { main: 'src/main.ts' },
      },
      rollupOptions: {
        external,
        input: 'src/main.ts',
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
    plugins: [
      cp({
        targets: [
          ...external.map(genCpModule),
          { src: './package.json', dest: 'dist' },
          { src: './manifest.json', dest: 'dist' }
        ],
      }),
    ],
  },
  preload: {
    build: {
      outDir: 'dist/preload',
      emptyOutDir: true,
      lib: {
        formats: ['cjs'],
        entry: { preload: 'src/preload.ts' },
      },
      rollupOptions: {
        // external: externalAll,
        input: 'src/preload.ts',
      },
    },
    resolve: {},
  },
  renderer: {
    build: {
      outDir: 'dist/renderer',
      emptyOutDir: true,
      lib: {
        formats: ['es'],
        entry: { renderer: 'src/renderer.ts' },
      },
      rollupOptions: {
        // external: externalAll,
        input: 'src/renderer.ts',
      },
    },
    resolve: {},
  },
}

export default config