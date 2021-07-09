import fs from 'fs/promises';
import glob from 'glob';
import path from 'path';

const packageRoot = path.resolve(__dirname, '../src/@nebula-js/webapp-fns');

const files = glob.sync(`*/**/*.ts`, {
  cwd: packageRoot,
  ignore: [`**/__*__/**`],
});

const index = `// THIS FILE IS AUTO CREATED
// @see ~/scripts/create-index.webapp-fns.ts
export * from './types';

${files
  .map((file) => `export * from './${file.replace(/\.ts(x*)$/, '')}';`)
  .join('\n')}
`;

fs.writeFile(path.resolve(packageRoot, 'index.ts'), index, {
  encoding: 'utf8',
}).then(() => {
  console.log(`👍 ${path.resolve(packageRoot, 'index.ts')}`);
});

