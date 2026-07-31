export interface TextOptions {
  typingDelay: number
  deletingDelay: number
  cursorBlinkDuration: number
}

export type TextOptionsInput = Partial<TextOptions>
