// 法定 lien waiver 模板库。
//
// ⚠️ 法律护栏（Cycle 5 Munger 红线）：
//   #1 本文件逐字复现各州法定表格，系统只做「格式渲染」，不做法律判断。
//   #2 每个模板透明标注 statutoryRef 法条出处，由用户自决选用。
//   #4 上线前必经建筑法律师审核（CA + TX + FL），本文件视为 DRAFT。
//
// 加州：Civil Code §§ 8132 / 8134 / 8136 / 8138（2012-07-01 生效版表格）
// 德州：Property Code § 53.284

import type { FieldDef, StateCode, WaiverTemplate, WaiverType } from './types'

// —— 复用字段（DRY）——
const f = {
  claimant: { key: 'claimantName', label: 'Name of Claimant', required: true } as FieldDef,
  customer: { key: 'customerName', label: 'Name of Customer', required: true } as FieldDef,
  jobLocation: { key: 'jobLocation', label: 'Job Location', required: true } as FieldDef,
  owner: { key: 'owner', label: 'Owner', required: true } as FieldDef,
  through: { key: 'throughDate', label: 'Through Date', type: 'date', required: true } as FieldDef,
  maker: { key: 'makerOfCheck', label: 'Maker of Check', required: true } as FieldDef,
  amount: { key: 'amountOfCheck', label: 'Amount of Check', type: 'currency', required: true } as FieldDef,
  payable: { key: 'checkPayableTo', label: 'Check Payable to', required: true } as FieldDef,
  paymentAmount: { key: 'paymentAmount', label: 'Amount of Progress Payment', type: 'currency', required: true } as FieldDef,
  disputed: { key: 'disputedAmount', label: 'Disputed Claims for Extras (amount)', type: 'currency' } as FieldDef,
  claimantTitle: { key: 'claimantTitle', label: "Claimant's Title", required: true } as FieldDef,
  signDate: { key: 'dateOfSignature', label: 'Date of Signature', type: 'date', required: true } as FieldDef,
}

const idHeading = { kind: 'heading', text: 'Identifying Information' } as const
const idFields = [
  { kind: 'field', key: 'claimantName', label: 'Name of Claimant' },
  { kind: 'field', key: 'customerName', label: 'Name of Customer' },
  { kind: 'field', key: 'jobLocation', label: 'Job Location' },
  { kind: 'field', key: 'owner', label: 'Owner' },
] as const

const signatureBlocks = [
  { kind: 'heading', text: 'Signature' },
  { kind: 'field', key: 'claimantName', label: "Claimant's Signature" },
  { kind: 'field', key: 'claimantTitle', label: "Claimant's Title" },
  { kind: 'field', key: 'dateOfSignature', label: 'Date of Signature' },
] as const

export const TEMPLATES: WaiverTemplate[] = [
  // ───────────────────────── 加州 §8132 ─────────────────────────
  {
    state: 'CA',
    type: 'conditional-progress',
    label: 'Conditional Waiver and Release Upon Progress Payment',
    statutoryRef: 'California Civil Code § 8132',
    formFields: [f.claimant, f.customer, f.jobLocation, f.owner, f.through, f.maker, f.amount, f.payable, f.claimantTitle, f.signDate],
    blocks: [
      { kind: 'title', text: 'CONDITIONAL WAIVER AND RELEASE UPON PROGRESS PAYMENT' },
      {
        kind: 'notice',
        text: "NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.",
      },
      idHeading,
      ...idFields,
      { kind: 'field', key: 'throughDate', label: 'Through Date' },
      { kind: 'spacer' },
      { kind: 'heading', text: 'Conditional Waiver and Release' },
      {
        kind: 'paragraph',
        text: 'This document waives and releases lien, stop payment notice, and payment bond rights the claimant has for labor and service provided, and equipment and material delivered, to the customer on this job through the Through Date of this document. Rights based upon labor or service provided, or equipment or material delivered, pursuant to a written change order that has been fully executed by the parties prior to the date that this document is signed by the claimant, are waived and released by this document, unless listed as an Exception below. This document is effective only on the claimant’s receipt of payment from the financial institution on which the following check is drawn:',
      },
      { kind: 'field', key: 'makerOfCheck', label: 'Maker of Check' },
      { kind: 'field', key: 'amountOfCheck', label: 'Amount of Check', prefix: '$' },
      { kind: 'field', key: 'checkPayableTo', label: 'Check Payable to' },
      { kind: 'spacer' },
      { kind: 'heading', text: 'Exceptions' },
      {
        kind: 'paragraph',
        text: 'This document does not affect any of the following: (1) Retentions. (2) Extras for which the claimant has not received payment. (3) The following progress payments for which the claimant has previously given a conditional waiver and release but has not received payment. (4) Contract rights, including (A) a right based on rescission, abandonment, or breach of contract, and (B) the right to recover compensation for work not compensated by the payment.',
      },
      { kind: 'spacer' },
      ...signatureBlocks,
    ],
  },

  // ───────────────────────── 加州 §8134 ─────────────────────────
  {
    state: 'CA',
    type: 'unconditional-progress',
    label: 'Unconditional Waiver and Release Upon Progress Payment',
    statutoryRef: 'California Civil Code § 8134',
    formFields: [f.claimant, f.customer, f.jobLocation, f.owner, f.through, f.paymentAmount, f.claimantTitle, f.signDate],
    blocks: [
      { kind: 'title', text: 'UNCONDITIONAL WAIVER AND RELEASE UPON PROGRESS PAYMENT' },
      {
        kind: 'notice',
        text: 'NOTICE TO CLAIMANT: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.',
      },
      idHeading,
      ...idFields,
      { kind: 'field', key: 'throughDate', label: 'Through Date' },
      { kind: 'spacer' },
      { kind: 'heading', text: 'Unconditional Waiver and Release' },
      {
        kind: 'paragraph',
        text: 'This document waives and releases lien, stop payment notice, and payment bond rights the claimant has for labor and service provided, and equipment and material delivered, to the customer on this job through the Through Date of this document. Rights based upon labor or service provided, or equipment or material delivered, pursuant to a written change order that has been fully executed by the parties prior to the date that this document is signed by the claimant, are waived and released by this document, unless listed as an Exception below. The claimant has received the following progress payment:',
      },
      { kind: 'field', key: 'paymentAmount', label: 'Progress Payment Received', prefix: '$' },
      { kind: 'spacer' },
      { kind: 'heading', text: 'Exceptions' },
      {
        kind: 'paragraph',
        text: 'This document does not affect the following: (1) Retentions. (2) Extras for which the claimant has not received payment. (3) Contract rights, including (A) a right based on rescission, abandonment, or breach of contract, and (B) the right to recover compensation for work not compensated by the payment.',
      },
      { kind: 'spacer' },
      ...signatureBlocks,
    ],
  },

  // ───────────────────────── 加州 §8136 ─────────────────────────
  {
    state: 'CA',
    type: 'conditional-final',
    label: 'Conditional Waiver and Release Upon Final Payment',
    statutoryRef: 'California Civil Code § 8136',
    formFields: [f.claimant, f.customer, f.jobLocation, f.owner, f.maker, f.amount, f.payable, f.disputed, f.claimantTitle, f.signDate],
    blocks: [
      { kind: 'title', text: 'CONDITIONAL WAIVER AND RELEASE UPON FINAL PAYMENT' },
      {
        kind: 'notice',
        text: "NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.",
      },
      idHeading,
      ...idFields,
      { kind: 'spacer' },
      { kind: 'heading', text: 'Conditional Waiver and Release' },
      {
        kind: 'paragraph',
        text: 'This document waives and releases lien, stop payment notice, and payment bond rights the claimant has for all labor and service provided, and equipment and material delivered, to the customer on this job. Rights based upon labor or service provided, or equipment or material delivered, pursuant to a written change order that has been fully executed by the parties prior to the date that this document is signed by the claimant, are waived and released by this document, unless listed as an Exception below. This document is effective only on the claimant’s receipt of payment from the financial institution on which the following check is drawn:',
      },
      { kind: 'field', key: 'makerOfCheck', label: 'Maker of Check' },
      { kind: 'field', key: 'amountOfCheck', label: 'Amount of Check', prefix: '$' },
      { kind: 'field', key: 'checkPayableTo', label: 'Check Payable to' },
      { kind: 'spacer' },
      { kind: 'heading', text: 'Exceptions' },
      { kind: 'paragraph', text: 'This document does not affect any of the following: Disputed claims for extras in the amount of:' },
      { kind: 'field', key: 'disputedAmount', label: 'Disputed Claims for Extras', prefix: '$' },
      { kind: 'spacer' },
      ...signatureBlocks,
    ],
  },

  // ───────────────────────── 加州 §8138 ─────────────────────────
  {
    state: 'CA',
    type: 'unconditional-final',
    label: 'Unconditional Waiver and Release Upon Final Payment',
    statutoryRef: 'California Civil Code § 8138',
    formFields: [f.claimant, f.customer, f.jobLocation, f.owner, f.disputed, f.claimantTitle, f.signDate],
    blocks: [
      { kind: 'title', text: 'UNCONDITIONAL WAIVER AND RELEASE UPON FINAL PAYMENT' },
      {
        kind: 'notice',
        text: 'NOTICE TO CLAIMANT: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.',
      },
      idHeading,
      ...idFields,
      { kind: 'spacer' },
      { kind: 'heading', text: 'Unconditional Waiver and Release' },
      {
        kind: 'paragraph',
        text: 'This document waives and releases lien, stop payment notice, and payment bond rights the claimant has for all labor and service provided, and equipment and material delivered, to the customer on this job. Rights based upon labor or service provided, or equipment or material delivered, pursuant to a written change order that has been fully executed by the parties prior to the date that this document is signed by the claimant, are waived and released by this document, unless listed as an Exception below. The claimant has been paid in full.',
      },
      { kind: 'spacer' },
      { kind: 'heading', text: 'Exceptions' },
      { kind: 'paragraph', text: 'This document does not affect the following: Disputed claims for extras in the amount of:' },
      { kind: 'field', key: 'disputedAmount', label: 'Disputed Claims for Extras', prefix: '$' },
      { kind: 'spacer' },
      ...signatureBlocks,
    ],
  },

  // ───────────────────────── 德州 §53.284 ─────────────────────────
  {
    state: 'TX',
    type: 'conditional-progress',
    label: 'Conditional Waiver and Release on Progress Payment',
    statutoryRef: 'Texas Property Code § 53.284(b)',
    formFields: [
      { key: 'projectName', label: 'Project', required: true },
      { key: 'jobNumber', label: 'Job No.' },
      f.maker,
      f.amount,
      f.payable,
      { key: 'jobDescription', label: 'Release Extent / Job Description', type: 'multiline', required: true },
      { key: 'contractedWith', label: 'Person With Whom Signer Contracted', required: true },
      { key: 'companyName', label: 'Company Name', required: true },
      { key: 'claimantName', label: 'Signer Name', required: true },
      f.claimantTitle,
      f.signDate,
    ],
    blocks: [
      { kind: 'title', text: 'CONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT' },
      { kind: 'field', key: 'projectName', label: 'Project' },
      { kind: 'field', key: 'jobNumber', label: 'Job No.' },
      { kind: 'spacer' },
      {
        kind: 'paragraph',
        text: 'On receipt by the signer of this document of a check from {{makerOfCheck}} (maker of check) in the sum of ${{amountOfCheck}} payable to {{checkPayableTo}} (payee or payees of check) and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document becomes effective to release any mechanic’s lien right, any right arising from a payment bond that complies with a state or federal statute, any common law payment bond right, any contractual payment bond right, and any claim for payment to the following extent: {{jobDescription}}.',
      },
      {
        kind: 'paragraph',
        text: 'This release covers a progress payment for all labor, services, equipment, or materials furnished to the property or to {{contractedWith}} (person with whom signer contracted) as indicated in the attached statement(s) or progress payment request(s), except for unpaid retention, pending modifications and changes, or other items furnished.',
      },
      {
        kind: 'paragraph',
        text: 'Before any recipient of this document relies on this document, the recipient should verify evidence of payment to the signer.',
      },
      {
        kind: 'paragraph',
        text: 'The signer warrants that the signer has already paid or will use the funds received from this progress payment to promptly pay in full all of the signer’s laborers, subcontractors, materialmen, and suppliers for all work, materials, equipment, or services provided for or to the above referenced project in regard to the attached statement(s) or progress payment request(s).',
      },
      { kind: 'spacer' },
      { kind: 'field', key: 'dateOfSignature', label: 'Date' },
      { kind: 'field', key: 'companyName', label: 'Company Name' },
      { kind: 'field', key: 'claimantName', label: 'By (Signature)' },
      { kind: 'field', key: 'claimantTitle', label: 'Title' },
    ],
  },
]

export function getTemplate(state: StateCode, type: WaiverType): WaiverTemplate | undefined {
  return TEMPLATES.find((t) => t.state === state && t.type === type)
}

export function templatesForState(state: StateCode): WaiverTemplate[] {
  return TEMPLATES.filter((t) => t.state === state)
}
