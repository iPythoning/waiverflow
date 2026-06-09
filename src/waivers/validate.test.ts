// 纯函数回归测试：tsx src/waivers/validate.test.ts
import assert from 'node:assert/strict'
import { normalizeCurrency, normalizeCurrencyFields, fieldHints } from './validate'
import { getTemplate } from './templates'

// —— normalizeCurrency：补零安全、超 2 位小数拒绝（绝不四舍五入改金额）——
assert.equal(normalizeCurrency('1234'), '1,234.00')
assert.equal(normalizeCurrency('1234.5'), '1,234.50') // 补零，数值不变
assert.equal(normalizeCurrency('1234.56'), '1,234.56')
assert.equal(normalizeCurrency('1,234.56'), '1,234.56')
assert.equal(normalizeCurrency('$1,234.56'), '1,234.56')
assert.equal(normalizeCurrency(' 1234 '), '1,234.00')
assert.equal(normalizeCurrency('0'), '0.00')
assert.equal(normalizeCurrency('1000000'), '1,000,000.00')
// 拒绝（返回 null，不改写）：
assert.equal(normalizeCurrency(''), null)
assert.equal(normalizeCurrency('abc'), null)
assert.equal(normalizeCurrency('12.34.56'), null)
assert.equal(normalizeCurrency('-5'), null)
assert.equal(normalizeCurrency('1234.999'), null) // 超 2 位 → 拒绝，绝不舍入成 1,235.00
assert.equal(normalizeCurrency('.5'), null)

// —— normalizeCurrencyFields：只动 currency 字段，返回新对象，原对象不变 ——
{
  const tpl = getTemplate('CA', 'conditional-progress')! // 含 amountOfCheck(currency)、claimantName(text)、throughDate(date)
  const data = { amountOfCheck: '1234.5', claimantName: 'Acme Co', throughDate: '2026-01-01' }
  const out = normalizeCurrencyFields(tpl, data)
  assert.equal(out.amountOfCheck, '1,234.50') // 纯数字；$ 由 PDF prefix 负责
  assert.equal(out.claimantName, 'Acme Co') // 非 currency 不动
  assert.equal(out.throughDate, '2026-01-01')
  assert.equal(data.amountOfCheck, '1234.5') // 原对象未被 mutate
  assert.notEqual(out, data)
  // 解析失败的金额保留原值（PDF 显示原值 + 表单 warn）
  assert.equal(normalizeCurrencyFields(tpl, { amountOfCheck: 'lots' }).amountOfCheck, 'lots')
}

// —— fieldHints：金额 info/warn、日期未来 warn、through>sign 顺序 warn ——
{
  const tpl = getTemplate('CA', 'conditional-progress')!
  const h1 = fieldHints(tpl, { amountOfCheck: '1234.5' })
  assert.equal(h1.amountOfCheck.kind, 'info')
  assert.match(h1.amountOfCheck.text, /\$1,234\.50/)

  const h2 = fieldHints(tpl, { amountOfCheck: 'oops' })
  assert.equal(h2.amountOfCheck.kind, 'warn')

  const h3 = fieldHints(tpl, { throughDate: '2099-01-01' })
  assert.equal(h3.throughDate.kind, 'warn')
  assert.match(h3.throughDate.text, /future/)

  // through 晚于 signature → throughDate 顺序提示
  const h4 = fieldHints(tpl, { throughDate: '2026-06-10', dateOfSignature: '2026-06-01' })
  assert.match(h4.throughDate.text, /after the signature date/)

  // through 早于 signature → 无顺序提示
  const h5 = fieldHints(tpl, { throughDate: '2026-06-01', dateOfSignature: '2026-06-10' })
  assert.equal(h5.throughDate, undefined)

  // 空字段不提示
  assert.deepEqual(fieldHints(tpl, {}), {})
}

console.log('✓ validate.test.ts — all assertions passed')
