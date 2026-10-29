#!/usr/bin/env node
import { run } from '../lib/core.mjs';

const args = process.argv.slice(2);
const val = (k, d = '') => { const i = args.indexOf('--' + k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
if (!args.length || args.includes('--help')) {
  console.log(`dsh-csv-diff —— 深鲸表格对比

用法：dsh-csv-diff --op <diff> [参数]
参数：a,b,key
示例：dsh-csv-diff --a ./上月.csv --b ./本月.csv --key 编号`);
  process.exit(0);
}
const input = { op: val('op', 'diff') };
for (const k of ["a", "b", "key"]) input[k] = val(k);
const r = await run(input);
if (!r.ok) { console.error('❌', r.text || '失败'); process.exit(1); }
console.log(r.text || '');
process.exit(0);
