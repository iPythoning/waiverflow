import { generateWaiverPdf, downloadPdf } from './generatePdf'
import { normalizeCurrencyFields } from './validate'
import type { WaiverData, WaiverTemplate } from './types'

// 文件名带州/类型/索赔人，方便归档。
export function waiverFilename(template: WaiverTemplate, data: WaiverData): string {
  const who = (data.claimantName || 'waiver').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  return `${template.state}-${template.type}-${who}.pdf`
}

// 生成 PDF 字节 —— 预览与下载共用同一字节（只生成一次，符合不可变）。
export async function buildWaiver(
  template: WaiverTemplate,
  data: WaiverData,
): Promise<{ bytes: Uint8Array; filename: string }> {
  // currency 字段规范化为千分位后再渲染 —— PDF 与表单预览所见即所填。
  const bytes = await generateWaiverPdf(template, normalizeCurrencyFields(template, data))
  return { bytes, filename: waiverFilename(template, data) }
}

// 下载已生成的字节（与预览同一份，不重新生成）。
export function downloadWaiver(bytes: Uint8Array, filename: string) {
  downloadPdf(bytes, filename)
}
