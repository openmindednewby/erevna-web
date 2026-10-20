import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const { maxWarnings } = JSON.parse(readFileSync(new URL('../lint-warning-ratchet.json', import.meta.url), 'utf8'));
const run = spawnSync('npx', ['eslint', '.', '--max-warnings', String(maxWarnings)], { stdio: 'inherit', shell: true });
process.exit(run.status ?? 1);
