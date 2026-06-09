// 法定 lien waiver 模板库。
//
// ⚠️ 法律护栏（Cycle 5 Munger 红线）：
//   #1 本文件逐字复现各州法定表格，系统只做「格式渲染」，不做法律判断。
//   #2 每个模板透明标注 statutoryRef 法条出处，由用户自决选用。
//   #4 上线前必经建筑法律师审核（CA + TX + FL），本文件视为 DRAFT。
//
// 加州：Civil Code §§ 8132 / 8134 / 8136 / 8138（2012-07-01 生效版表格）
// 德州：Property Code § 53.284
// 佛州：Fla. Stat. § 713.20(4)（Progress Payment）/ § 713.20(5)（Final Payment）
//   ⚠️ 佛州法定表格只有这两个，且本身均为 unconditional —— 不存在加州式 conditional/unconditional × progress/final
//   的 4 类划分。§713.20(7) 允许另行附加 conditional 语句，但该子句原文未经律师核实，本轮不收录（宁缺毋滥）。

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

  // 德州 §53.284(c) —— Unconditional Progress：顶部强制 NOTICE，付款到账后立即生效
  {
    state: 'TX',
    type: 'unconditional-progress',
    label: 'Unconditional Waiver and Release on Progress Payment',
    statutoryRef: 'Texas Property Code § 53.284(c)',
    formFields: [
      { key: 'projectName', label: 'Project', required: true },
      { key: 'jobNumber', label: 'Job No.' },
      f.paymentAmount,
      { key: 'contractedWith', label: 'Person With Whom Signer Contracted', required: true },
      f.owner,
      { key: 'location', label: 'Location', required: true },
      { key: 'jobDescription', label: 'Release Extent / Job Description', type: 'multiline', required: true },
      { key: 'companyName', label: 'Company Name', required: true },
      { key: 'claimantName', label: 'Signer Name', required: true },
      f.claimantTitle,
      f.signDate,
    ],
    blocks: [
      {
        kind: 'notice',
        text: 'NOTICE: This document waives rights unconditionally and states that you have been paid for giving up those rights. It is prohibited for a person to require you to sign this document if you have not been paid the payment amount set forth below. If you have not been paid, use a conditional release form.',
      },
      { kind: 'title', text: 'UNCONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT' },
      { kind: 'field', key: 'projectName', label: 'Project' },
      { kind: 'field', key: 'jobNumber', label: 'Job No.' },
      { kind: 'spacer' },
      {
        kind: 'paragraph',
        text: 'The signer of this document has been paid and has received a progress payment in the sum of ${{paymentAmount}} for all labor, services, equipment, or materials furnished to the property or to {{contractedWith}} (person with whom signer contracted) on the property of {{owner}} (owner) located at {{location}} (location) to the following extent: {{jobDescription}} (job description). The signer therefore waives and releases any mechanic’s lien right, any right arising from a payment bond that complies with a state or federal statute, any common law payment bond right, any claim for payment, and any rights under any similar ordinance, rule, or statute related to claim or payment rights for persons in the signer’s position that the signer has on the above referenced project to the following extent:',
      },
      {
        kind: 'paragraph',
        text: 'This release covers a progress payment for all labor, services, equipment, or materials furnished to the property or to {{contractedWith}} (person with whom signer contracted) as indicated in the attached statement(s) or progress payment request(s), except for unpaid retention, pending modifications and changes, or other items furnished.',
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

  // 德州 §53.284(d) —— Conditional Final：尾款支票兑付后才生效，付款前签的安全网
  {
    state: 'TX',
    type: 'conditional-final',
    label: 'Conditional Waiver and Release on Final Payment',
    statutoryRef: 'Texas Property Code § 53.284(d)',
    formFields: [
      { key: 'projectName', label: 'Project', required: true },
      { key: 'jobNumber', label: 'Job No.' },
      f.maker,
      f.amount,
      f.payable,
      f.owner,
      { key: 'location', label: 'Location', required: true },
      { key: 'jobDescription', label: 'Release Extent / Job Description', type: 'multiline', required: true },
      { key: 'contractedWith', label: 'Person With Whom Signer Contracted', required: true },
      { key: 'companyName', label: 'Company Name', required: true },
      { key: 'claimantName', label: 'Signer Name', required: true },
      f.claimantTitle,
      f.signDate,
    ],
    blocks: [
      { kind: 'title', text: 'CONDITIONAL WAIVER AND RELEASE ON FINAL PAYMENT' },
      { kind: 'field', key: 'projectName', label: 'Project' },
      { kind: 'field', key: 'jobNumber', label: 'Job No.' },
      { kind: 'spacer' },
      {
        kind: 'paragraph',
        text: 'On receipt by the signer of this document of a check from {{makerOfCheck}} (maker of check) in the sum of ${{amountOfCheck}} payable to {{checkPayableTo}} (payee or payees of check) and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document becomes effective to release any mechanic’s lien right, any right arising from a payment bond that complies with a state or federal statute, any common law payment bond right, any claim for payment, and any rights under any similar ordinance, rule, or statute related to claim or payment rights for persons in the signer’s position that the signer has on the property of {{owner}} (owner) located at {{location}} (location) to the following extent: {{jobDescription}} (job description).',
      },
      {
        kind: 'paragraph',
        text: 'This release covers the final payment to the signer for all labor, services, equipment, or materials furnished to the property or to {{contractedWith}} (person with whom signer contracted).',
      },
      {
        kind: 'paragraph',
        text: 'Before any recipient of this document relies on this document, the recipient should verify evidence of payment to the signer.',
      },
      {
        kind: 'paragraph',
        text: 'The signer warrants that the signer has already paid or will use the funds received from this final payment to promptly pay in full all of the signer’s laborers, subcontractors, materialmen, and suppliers for all work, materials, equipment, or services provided for or to the above referenced project up to the date of this waiver and release.',
      },
      { kind: 'spacer' },
      { kind: 'field', key: 'dateOfSignature', label: 'Date' },
      { kind: 'field', key: 'companyName', label: 'Company Name' },
      { kind: 'field', key: 'claimantName', label: 'By (Signature)' },
      { kind: 'field', key: 'claimantTitle', label: 'Title' },
    ],
  },

  // 德州 §53.284(e) —— Unconditional Final：尾款已到账后才签，签完即放弃全部留置权（无安全网）
  {
    state: 'TX',
    type: 'unconditional-final',
    label: 'Unconditional Waiver and Release on Final Payment',
    statutoryRef: 'Texas Property Code § 53.284(e)',
    formFields: [
      { key: 'projectName', label: 'Project', required: true },
      { key: 'jobNumber', label: 'Job No.' },
      { key: 'contractedWith', label: 'Person With Whom Signer Contracted', required: true },
      f.owner,
      { key: 'location', label: 'Location', required: true },
      { key: 'jobDescription', label: 'Release Extent / Job Description', type: 'multiline', required: true },
      { key: 'companyName', label: 'Company Name', required: true },
      { key: 'claimantName', label: 'Signer Name', required: true },
      f.claimantTitle,
      f.signDate,
    ],
    blocks: [
      {
        kind: 'notice',
        text: 'NOTICE: This document waives rights unconditionally and states that you have been paid for giving up those rights. It is prohibited for a person to require you to sign this document if you have not been paid the payment amount set forth below. If you have not been paid, use a conditional release form.',
      },
      { kind: 'title', text: 'UNCONDITIONAL WAIVER AND RELEASE ON FINAL PAYMENT' },
      { kind: 'field', key: 'projectName', label: 'Project' },
      { kind: 'field', key: 'jobNumber', label: 'Job No.' },
      { kind: 'spacer' },
      {
        kind: 'paragraph',
        text: 'The signer of this document has been paid in full for all labor, services, equipment, or materials furnished to the property or to {{contractedWith}} (person with whom signer contracted) on the property of {{owner}} (owner) located at {{location}} (location) to the following extent: {{jobDescription}} (job description). The signer therefore waives and releases any mechanic’s lien right, any right arising from a payment bond that complies with a state or federal statute, any common law payment bond right, any claim for payment, and any rights under any similar ordinance, rule, or statute related to claim or payment rights for persons in the signer’s position.',
      },
      {
        kind: 'paragraph',
        text: 'The signer warrants that the signer has already paid or will use the funds received from this final payment to promptly pay in full all of the signer’s laborers, subcontractors, materialmen, and suppliers for all work, materials, equipment, or services provided for or to the above referenced project up to the date of this waiver and release.',
      },
      { kind: 'spacer' },
      { kind: 'field', key: 'dateOfSignature', label: 'Date' },
      { kind: 'field', key: 'companyName', label: 'Company Name' },
      { kind: 'field', key: 'claimantName', label: 'By (Signature)' },
      { kind: 'field', key: 'claimantTitle', label: 'Title' },
    ],
  },

  // ───────────────────────── 佛州 §713.20(4) ─────────────────────────
  {
    state: 'FL',
    type: 'progress',
    label: 'Waiver and Release of Lien Upon Progress Payment',
    statutoryRef: 'Florida Statutes § 713.20(4)',
    formFields: [
      f.paymentAmount,
      f.through,
      f.customer,
      f.owner,
      { key: 'propertyDescription', label: 'Description of Property', type: 'multiline', required: true },
      f.claimant,
      f.claimantTitle,
      f.signDate,
    ],
    blocks: [
      { kind: 'title', text: 'WAIVER AND RELEASE OF LIEN UPON PROGRESS PAYMENT' },
      {
        kind: 'paragraph',
        text: 'The undersigned lienor, in consideration of the sum of ${{paymentAmount}}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished through {{throughDate}} (insert date) to {{customerName}} (insert the name of your customer) on the job of {{owner}} (insert the name of the owner) to the following property:',
      },
      { kind: 'field', key: 'propertyDescription', label: 'Description of Property' },
      { kind: 'spacer' },
      {
        kind: 'paragraph',
        text: 'This waiver and release does not cover any retention or labor, services, or materials furnished after the date specified.',
      },
      { kind: 'spacer' },
      { kind: 'field', key: 'dateOfSignature', label: 'Dated on' },
      { kind: 'spacer' },
      { kind: 'field', key: 'claimantName', label: 'Lienor' },
      { kind: 'field', key: 'claimantTitle', label: 'By (print name and title/office)' },
    ],
  },

  // ───────────────────────── 佛州 §713.20(5) ─────────────────────────
  {
    state: 'FL',
    type: 'final',
    label: 'Waiver and Release of Lien Upon Final Payment',
    statutoryRef: 'Florida Statutes § 713.20(5)',
    formFields: [
      { key: 'paymentAmount', label: 'Amount of Final Payment', type: 'currency', required: true },
      f.customer,
      f.owner,
      { key: 'propertyDescription', label: 'Description of Property', type: 'multiline', required: true },
      f.claimant,
      f.claimantTitle,
      f.signDate,
    ],
    blocks: [
      { kind: 'title', text: 'WAIVER AND RELEASE OF LIEN UPON FINAL PAYMENT' },
      {
        kind: 'paragraph',
        text: 'The undersigned lienor, in consideration of the final payment in the amount of ${{paymentAmount}}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished to {{customerName}} (insert the name of your customer) on the job of {{owner}} (insert the name of the owner) to the following described property:',
      },
      { kind: 'field', key: 'propertyDescription', label: 'Description of Property' },
      { kind: 'spacer' },
      { kind: 'field', key: 'dateOfSignature', label: 'Dated on' },
      { kind: 'spacer' },
      { kind: 'field', key: 'claimantName', label: 'Lienor' },
      { kind: 'field', key: 'claimantTitle', label: 'By (print name and title/office)' },
    ],
  },
]

export function getTemplate(state: StateCode, type: WaiverType): WaiverTemplate | undefined {
  return TEMPLATES.find((t) => t.state === state && t.type === type)
}

export function templatesForState(state: StateCode): WaiverTemplate[] {
  return TEMPLATES.filter((t) => t.state === state)
}
