import { createPlugin, pkgRootFrom } from '@deepwhale-cn/dsh-guard-core/plugin';
import { registerApi } from './api.js';

const base = createPlugin({
  name: 'csv-diff',
  pkgRoot: pkgRootFrom(import.meta.url),
  skillFile: 'skill/csv-diff.md',
  binFile: 'bin/cli.mjs',
  description: '深鲸表格对比：两份 CSV 按关键列比较，列出新增、删除、修改的行',
  whenToUse: '当用户要比两份表格差异时使用：按关键列（如编号）配对，列出新增/删除/修改。',
});
export const name = base.name;
export const inject = [...base.inject, 'webServer'];
export function apply(ctx) {
  base.apply(ctx);
  try { if (ctx.webServer?.register) registerApi(ctx); } catch (e) { ctx.logger?.warn?.('[csv-diff] 面板出口注册失败: ' + (e?.message || e)); }
}
