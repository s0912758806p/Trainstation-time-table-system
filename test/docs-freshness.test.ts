/**
 * README 是活文件：裡面寫到的腳本、環境變數、Node 版本、workflow 都必須和實際檔案一致。
 * 每個檢查都是 fail-closed —— 抓不到 README 的宣稱字樣時要失敗，而不是默默通過。
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const README = read('README.md');
const pkg = JSON.parse(read('package.json')) as { scripts: Record<string, string>; engines: { node: string } };

function section(title: string): string {
  const start = README.indexOf(`## ${title}`) >= 0 ? README.indexOf(`## ${title}`) : README.indexOf(`### ${title}`);
  expect(start, `README section "${title}" not found`).toBeGreaterThanOrEqual(0);
  const rest = README.slice(start + 3);
  const end = rest.search(/\n##? /);
  return end < 0 ? rest : rest.slice(0, end);
}

function sourceFiles(dir: string): string[] {
  return readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((d) => {
    const rel = join(dir, d.name);
    if (d.isDirectory()) return sourceFiles(rel);
    return /\.(ts|tsx)$/.test(d.name) ? [rel] : [];
  });
}

describe('README stays in sync with the code', () => {
  it('every npm script it mentions exists', () => {
    const mentioned = [...README.matchAll(/npm (?:run ([\w:-]+)|(test|start)\b)/g)].map((m) => m[1] ?? m[2]);
    expect(mentioned.length).toBeGreaterThan(0);
    for (const name of new Set(mentioned)) expect(pkg.scripts, `npm script "${name}"`).toHaveProperty(name);
  });

  it('documents every npm script', () => {
    for (const name of Object.keys(pkg.scripts)) {
      expect(README, `README should mention npm script "${name}"`).toMatch(
        name === 'test' || name === 'start' ? new RegExp(`npm (run )?${name}\\b`) : new RegExp(`npm run ${name}\\b`),
      );
    }
  });

  it('environment variables match .env.example and the code', () => {
    const documented = new Set([...section('Environment variables').matchAll(/`([A-Z][A-Z0-9_]+)`/g)].map((m) => m[1]));
    documented.delete('NEXT_PUBLIC_'); // 只是警語
    const example = new Set([...read('.env.example').matchAll(/^([A-Z][A-Z0-9_]+)=/gm)].map((m) => m[1]));
    const used = new Set(
      ['lib', 'app', 'components'].flatMap(sourceFiles).concat('proxy.ts')
        .flatMap((f) => [...read(f).matchAll(/process\.env\.([A-Z][A-Z0-9_]+)/g)].map((m) => m[1]))
        .filter((v) => v !== 'NODE_ENV'),
    );
    expect(documented.size).toBeGreaterThan(0);
    expect([...documented].sort()).toEqual([...example].sort());
    expect([...used].sort()).toEqual([...example].sort());
  });

  it('states the Node version from package.json engines', () => {
    const min = pkg.engines.node.replace(/^>=\s*/, '');
    expect(README).toContain(`Node.js ${min}+`);
  });

  it('lists exactly the workflow files that exist', () => {
    const files = readdirSync(join(ROOT, '.github/workflows')).filter((f) => f.endsWith('.yml')).sort();
    const listed = [...new Set([...section('Branching & Deployment').matchAll(/`([\w-]+\.yml)`/g)].map((m) => m[1]))].sort();
    expect(files.length).toBeGreaterThan(0);
    expect(listed).toEqual(files);
  });

  it('every test file it names exists', () => {
    const named = [...README.matchAll(/`(test\/[\w./-]+\.ts)`/g)].map((m) => m[1]);
    expect(named.length).toBeGreaterThan(0);
    for (const f of named) expect(existsSync(join(ROOT, f)), f).toBe(true);
  });
});
