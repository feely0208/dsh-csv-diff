# 深鲸表格对比（@deepwhale-cn/dsh-csv-diff）

两份 CSV 按关键列比较：新增 / 删除 / 修改。

## 安装

```bash
dsh plugin --profile web add @deepwhale-cn/dsh-csv-diff
```

## 用法

```bash
dsh-csv-diff --a ./上月.csv --b ./本月.csv --key 编号
```

面板：侧栏「深鲸表格对比」。纯本地解析，不上传。
