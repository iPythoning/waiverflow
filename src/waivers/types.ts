// 数据驱动的 lien waiver 模型 —— 加州/德州、四种法定类型走同一套渲染管线。
// 法律护栏 #1：本系统只做格式渲染，绝不做法律判断/合规保证。

export type StateCode = 'CA' | 'TX'

export type WaiverType =
  | 'conditional-progress'
  | 'unconditional-progress'
  | 'conditional-final'
  | 'unconditional-final'

// 表单字段定义 —— 同时驱动「表单输入」和「PDF 字段块」，单一数据源。
export interface FieldDef {
  key: string
  label: string
  type?: 'text' | 'date' | 'currency' | 'multiline'
  placeholder?: string
  required?: boolean
}

// PDF 渲染块 —— 声明式，generatePdf 顺序遍历。
export type Block =
  | { kind: 'title'; text: string }
  | { kind: 'notice'; text: string } // 法定警示框，加粗大写
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string } // 静态法定正文，支持 {{key}} 插值
  | { kind: 'field'; key: string; label: string; prefix?: string } // 「标签: 值」行
  | { kind: 'spacer' }

export interface WaiverTemplate {
  state: StateCode
  type: WaiverType
  label: string // 给用户看的人类可读名
  statutoryRef: string // 法条出处，透明标注（护栏 #2）
  formFields: FieldDef[]
  blocks: Block[]
}

export type WaiverData = Record<string, string>
