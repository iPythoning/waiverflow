import { generateWaiverPdf, downloadPdf } from './generatePdf'
import type { WaiverData, WaiverTemplate } from './types'

// 生成 → 命名 → 触发下载。文件名带州/类型/索赔人，方便归档。
export async function downloadWaiver(template: WaiverTemplate, data: WaiverData) {
  const bytes = await generateWaiverPdf(template, data)
  const who = (data.claimantName || 'waiver').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  const filename = `${template.state}-${template.type}-${who}.pdf`
  downloadPdf(bytes, filename)
}
