export const COLOR_MODE_STORAGE_KEY = 'wiemo-color-mode'
export const COLOR_MODE_ATTRIBUTE = 'data-theme'

export type ColorMode = 'dark' | 'light'

export function createColorModeInitScript() {
  return `(function () {
    try {
      var storedMode = localStorage.getItem('${COLOR_MODE_STORAGE_KEY}')
      var preferredMode = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
      var resolvedMode = storedMode === 'light' || storedMode === 'dark'
        ? storedMode
        : preferredMode
      document.documentElement.setAttribute('${COLOR_MODE_ATTRIBUTE}', resolvedMode)
    } catch (_) {
      document.documentElement.setAttribute('${COLOR_MODE_ATTRIBUTE}', 'dark')
    }
  })()`
}
