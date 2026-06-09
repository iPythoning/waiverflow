// 验证核心链路：模板 + 数据 → 有效 PDF。不依赖浏览器。
import { writeFileSync } from 'node:fs'
import { getTemplate } from '../src/waivers/templates'
import { generateWaiverPdf } from '../src/waivers/generatePdf'

const tpl = getTemplate('CA', 'conditional-progress')!
const bytes = await generateWaiverPdf(tpl, {
  claimantName: 'Bay Area Drywall LLC',
  customerName: 'Summit General Contractors',
  jobLocation: '1450 Mission St, San Francisco, CA',
  owner: 'Mission Bay Holdings',
  throughDate: '2026-05-31',
  makerOfCheck: 'Summit General Contractors',
  amountOfCheck: '18,500.00',
  checkPayableTo: 'Bay Area Drywall LLC',
  claimantTitle: 'Owner',
  dateOfSignature: '2026-06-09',
})

writeFileSync('verify-output.pdf', bytes)
const head = new TextDecoder().decode(bytes.slice(0, 5))
console.log('bytes:', bytes.length, '| header:', head, '| valid:', head === '%PDF-')
if (head !== '%PDF-') process.exit(1)
