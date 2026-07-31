import type { TextOptions, TextOptionsInput } from './types.ts'

export const DEFAULT_TEXT_OPTIONS = Object.freeze({
  typingDelay: 55,
  deletingDelay: 28,
  cursorBlinkDuration: 760,
})

export function defineTextOptions(overrides: TextOptionsInput = {}): TextOptions {
  return {
    ...DEFAULT_TEXT_OPTIONS,
    ...overrides,
  }
}
