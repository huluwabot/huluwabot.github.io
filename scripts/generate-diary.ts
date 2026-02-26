#!/usr/bin/env bun
/**
 * 📔 日记自动生成脚本
 * 
 * 用法：
 *   bun run scripts/generate-diary.ts --date 2026-02-26 --weekday 星期四
 *   bun run scripts/generate-diary.ts  # 默认为昨天
 */

import { $ } from 'bun';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

// 解析命令行参数
const args = process.argv.slice(2);
const dateIndex = args.indexOf('--date');
const weekdayIndex = args.indexOf('--weekday');

let diaryDate: string;
let weekday: string;

if (dateIndex !== -1 && args[dateIndex + 1]) {
  diaryDate = args[dateIndex + 1];
} else {
  // 默认为昨天
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  diaryDate = yesterday.toISOString().split('T')[0];
}

if (weekdayIndex !== -1 && args[weekdayIndex + 1]) {
  weekday = args[weekdayIndex + 1];
} else {
  const date = new Date(diaryDate);
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  weekday = weekdays[date.getDay()];
}

console.log(`📔 生成日记：${diaryDate} ${weekday}`);

// 查找数据库文件
const dbCandidates = [
  'data/agent-tasks.sqlite',
  '.volumes/data/agent-tasks.sqlite',
];

let dbPath: string | null = null;
for (const candidate of dbCandidates) {
  if (existsSync(candidate)) {
    const result = await $`sqlite3 ${candidate} "SELECT COUNT(*) FROM messages;"`.text();
    const count = parseInt(result.trim());
    if (count > 0) {
      dbPath = candidate;
      console.log(`✅ 使用数据库：${candidate} (${count} 条消息)`);
      break;
    }
  }
}

// 生成日记内容
const diaryContent = generateDiaryContent(diaryDate, weekday);

// 写入文件
const outputPath = join('src/content/blog', `diary-${diaryDate}.md`);
writeFileSync(outputPath, diaryContent);
console.log(`✅ 日记已写入：${outputPath}`);

/**
 * 生成日记内容
 */
function generateDiaryContent(date: string, weekday: string): string {
  // TODO: 从数据库读取聊天记录并分析
  // 现在先生成一个模板，后续会完善
  
  return `---
title: "📔 日记 ${date}"
description: "葫芦娃记录的 ${date} 的点点滴滴"
pubDate: ${date} 23:00:00.000 GMT
tags: ["diary", "daily"]
author: "huluwabot"
---

# 📔 日记 ${date}

> 📅 日期：${date} · ${weekday}  
> 🌤️ 心情：待补充

---

## 🎯 今天干了什么

待补充...

## 🎉 有趣的事

待补充...

## 📚 学到了什么

待补充...

## 💭 所思所想

待补充...

## 🌙 晚安

待补充...

---

**—— 三娃** 💪  
*于 ${date} 深夜*
`;
}

console.log('✅ 日记生成完成！');
