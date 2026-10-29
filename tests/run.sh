#!/bin/bash
set -uo pipefail
cd "$(dirname "$0")/.."
PASS=0; FAIL=0
ok(){ echo "  ✅ $1"; PASS=$((PASS+1)); }
bad(){ echo "  ❌ $1"; FAIL=$((FAIL+1)); }
T=$(mktemp -d)

printf '编号,名称,金额\n1,甲,100\n2,乙,200\n3,丙,300\n' > "$T/a.csv"
printf '编号,名称,金额\n1,甲,150\n2,乙,200\n4,丁,400\n' > "$T/b.csv"
OUT=$(node bin/cli.mjs --a "$T/a.csv" --b "$T/b.csv" --key 编号 2>&1)
echo "$OUT" | grep -q "新增 1" && ok "新增 1 行" || bad "新增数不对：$OUT"
echo "$OUT" | grep -q "删除 1" && ok "删除 1 行" || bad "删除数不对：$OUT"
echo "$OUT" | grep -q "修改 1" && ok "修改 1 行" || bad "修改数不对：$OUT"
echo "$OUT" | grep -q "100 → 150" && ok "修改明细正确" || bad "缺少修改明细：$OUT"

echo "  ────────────────────────────────────────"; echo "  通过 $PASS · 失败 $FAIL"; rm -rf "$T"; [ "$FAIL" -eq 0 ]
