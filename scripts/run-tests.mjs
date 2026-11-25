import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, '.tmp-test');
const tscBin = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');

try {
  fs.rmSync(outDir, { recursive: true, force: true });
  execFileSync(
    process.execPath,
    [
      tscBin,
      '--module',
      'commonjs',
      '--moduleResolution',
      'node',
      '--target',
      'ES2020',
      '--esModuleInterop',
      '--skipLibCheck',
      '--strict',
      '--outDir',
      outDir,
      'tests/frontend-security.test.ts',
    ],
    { stdio: 'inherit' },
  );

  const testFile = path.join(outDir, 'tests', 'frontend-security.test.js');
  execFileSync(process.execPath, ['--test', testFile], { stdio: 'inherit' });
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
