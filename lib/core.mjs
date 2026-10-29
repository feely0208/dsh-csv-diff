import { existsSync, readFileSync } from 'node:fs';

function 解析(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ''));
}

export function run({ a = '', b = '', key = '' } = {}) {
  if (!a || !b) return { ok: false, text: '请填写两个 CSV 文件路径（--a / --b）' };
  if (!existsSync(a) || !existsSync(b)) return { ok: false, text: '文件不存在：' + (!existsSync(a) ? a : b) };
  const A = 解析(readFileSync(a, 'utf8')), B = 解析(readFileSync(b, 'utf8'));
  if (!A.length || !B.length) return { ok: false, text: 'CSV 是空的' };
  const 头A = A[0], 头B = B[0];
  const 键列 = key ? 头A.indexOf(key) : 0;
  if (键列 < 0) return { ok: false, text: '左表没有列：' + key };
  const 键列B = key ? 头B.indexOf(key) : 0;
  const 表A = new Map(), 表B = new Map();
  for (const r of A.slice(1)) 表A.set(r[键列] ?? '', r);
  for (const r of B.slice(1)) 表B.set(r[键列B] ?? '', r);
  const 新增 = [], 删除 = [], 修改 = [];
  for (const [k, r] of 表B) if (!表A.has(k)) 新增.push(k);
  for (const [k, r] of 表A) if (!表B.has(k)) 删除.push(k);
  for (const [k, ra] of 表A) {
    const rb = 表B.get(k); if (!rb) continue;
    const 差异 = [];
    for (let i = 0; i < Math.max(ra.length, rb.length); i++) if ((ra[i] ?? '') !== (rb[i] ?? '')) 差异.push((头A[i] ?? 'col' + i) + ': ' + (ra[i] ?? '') + ' → ' + (rb[i] ?? ''));
    if (差异.length) 修改.push(k + '（' + 差异.slice(0, 3).join('；') + '）');
  }
  const lines = [
    '表 A：' + (A.length - 1) + ' 行 · 表 B：' + (B.length - 1) + ' 行 · 对比列：' + (key || 头A[0]),
    '新增 ' + 新增.length + ' 行 · 删除 ' + 删除.length + ' 行 · 修改 ' + 修改.length + ' 行',
    '',
    新增.length ? ('新增：' + 新增.slice(0, 20).join('、')) : '',
    删除.length ? ('删除：' + 删除.slice(0, 20).join('、')) : '',
    修改.length ? ('修改：\n  ' + 修改.slice(0, 20).join('\n  ')) : '',
  ].filter(Boolean).join('\n');
  return { ok: true, text: lines };
}
