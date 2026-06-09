// 「公司档案」本地记忆 —— 让批量开 waiver 的承包商不必每张重敲自身身份。
// 纯 localStorage：数据从不离开浏览器，守住首页「Nothing is uploaded」承诺。
//
// ⚠️ 故意只记承包商「自身稳定身份」，绝不记金额/日期/支票/项目/业主字段：
//    那些每张 waiver 都不同，若错误带入上一张的交易数据，用户可能没注意就签了 —— 法律风险。
//    这是 Munger 法律红线在 UX 层的延伸：减负不能以引入错误数据为代价。
import type { WaiverData } from './types'

const KEY = 'waiverflow.profile.v1'

// 跨所有 waiver、所有项目永远不变的身份字段。owner/customer/job 是项目级、会变，故不记。
export const REMEMBERED_KEYS = ['claimantName', 'claimantTitle', 'companyName'] as const

export function loadProfile(): WaiverData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    const out: WaiverData = {}
    for (const k of REMEMBERED_KEYS) {
      const v = (parsed as Record<string, unknown>)[k]
      if (typeof v === 'string' && v.trim()) out[k] = v
    }
    return out
  } catch {
    return {} // localStorage 不可用（隐私模式/损坏数据）—— 静默降级，功能照常
  }
}

export function saveProfile(data: WaiverData): void {
  try {
    const out: Record<string, string> = {}
    for (const k of REMEMBERED_KEYS) {
      const v = data[k]?.trim()
      if (v) out[k] = v
    }
    if (Object.keys(out).length) localStorage.setItem(KEY, JSON.stringify(out))
  } catch {
    // localStorage 写入失败 —— 静默降级，不打断生成
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function hasProfile(): boolean {
  return Object.keys(loadProfile()).length > 0
}
