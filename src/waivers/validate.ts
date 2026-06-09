// 轻量格式/合理性校验 —— 只给非阻断提示与金额规范化预览。
// ⚠️ Munger 红线：纯格式/合理性，绝不做法律判断；规范化绝不改写金额数值。
import type { WaiverData, WaiverTemplate } from './types'

// 保守解析金额：去掉 $ , 空格后必须是「整数 + 至多两位小数」，否则返回 null（不规范化）。
// 拒绝（而非四舍五入）超过两位小数 —— 绝不偷偷改写用户金额。补零（1234.5 → 1,234.50）数值不变，安全。
export function normalizeCurrency(raw: string): string | null {
  const cleaned = raw.replace(/[$,\s]/g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const n = Number(cleaned)
  if (!Number.isFinite(n)) return null
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 把 data 里所有 currency 字段规范化成千分位（仅在能干净解析时）；返回新对象（不可变）。
// 预览与 PDF 共用此函数 → 所见即所填。
export function normalizeCurrencyFields(template: WaiverTemplate, data: WaiverData): WaiverData {
  const out: WaiverData = { ...data }
  for (const field of template.formFields) {
    if (field.type !== 'currency') continue
    // 只规范化数字本身；$ 由 PDF field 的 prefix 负责，避免双重 $。
    const norm = normalizeCurrency(data[field.key] ?? '')
    if (norm !== null) out[field.key] = norm
  }
  return out
}

export interface Hint {
  text: string
  kind: 'info' | 'warn'
}

// 每个已填字段的非阻断提示：金额规范化预览(info) / 格式可疑(warn) / 日期合理性(warn)。
export function fieldHints(template: WaiverTemplate, data: WaiverData): Record<string, Hint> {
  const hints: Record<string, Hint> = {}
  const today = todayISO()

  for (const field of template.formFields) {
    const v = (data[field.key] ?? '').trim()
    if (!v) continue
    if (field.type === 'currency') {
      const norm = normalizeCurrency(v)
      hints[field.key] = norm
        ? { text: `Will print as $${norm}`, kind: 'info' }
        : { text: 'Enter a plain dollar amount, e.g. 1,250.00', kind: 'warn' }
    } else if (field.type === 'date' && v > today) {
      // <input type=date> 值为 'YYYY-MM-DD'，字典序 = 时间序。
      hints[field.key] = { text: 'This date is in the future — double-check.', kind: 'warn' }
    }
  }

  // through-date 应在签名日当天或之前；晚于则提示顺序（覆盖该字段可能的 future 提示，信息量更大）。
  const through = (data.throughDate ?? '').trim()
  const sign = (data.dateOfSignature ?? '').trim()
  if (through && sign && through > sign) {
    hints.throughDate = {
      text: 'Through date is after the signature date — usually it should be on or before.',
      kind: 'warn',
    }
  }

  return hints
}

function todayISO(): string {
  const d = new Date()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
