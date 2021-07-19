import fs from 'fs/promises';
import glob from 'glob';
import path from 'path';

const packageRoot = path.resolve(__dirname, '../src/@nebula-js/webapp-provider');

const files = glob.sync(`*/**/*.{ts,tsx}`, {
  cwd: packageRoot,
  ignore: [`**/__*__/**`, `**/internal/**`],
});

const index = `// THIS FILE IS AUTO CREATED
// @see ~/scripts/create-index.webapp-provider.ts
export * from './env';

${files
  .map((file) => `export * from './${file.replace(/\.tsx?$/, '')}';`)
  .join('\n')}
`;

fs.writeFile(path.resolve(packageRoot, 'index.ts'), index, {
  encoding: 'utf8',
}).then(() => {
  console.log(`👍 ${path.resolve(packageRoot, 'index.ts')}`);
});

