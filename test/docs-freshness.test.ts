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

/** 找到以 title 開頭的標題，回傳到下一個同層或更高層標題之前的內容 */
function section(title: string): string {
  const m = new RegExp(`^(#{2,4}) ${title}`, 'm').exec(README);
  expect(m, `README section "${title}" not found`).not.toBeNull();
  const rest = README.slice(m!.index + m![0].length);
  const end = rest.search(new RegExp(`\\n#{1,${m![1].length}} `));
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
    const documented = new Set([...section('環境變數').matchAll(/`([A-Z][A-Z0-9_]+)`/g)].map((m) => m[1]));
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
    const listed = [...new Set([...section('分支與部署').matchAll(/`([\w-]+\.yml)`/g)].map((m) => m[1]))].sort();
    expect(files.length).toBeGreaterThan(0);
    expect(listed).toEqual(files);
  });

  it('every test file it names exists', () => {
    const named = [...README.matchAll(/`((?:test|e2e)\/[\w./-]+\.ts)`/g)].map((m) => m[1]);
    expect(named.length).toBeGreaterThan(0);
    for (const f of named) expect(existsSync(join(ROOT, f)), f).toBe(true);
  });
});
