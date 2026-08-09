import {
  COLOR_MODE_ATTRIBUTE,
  COLOR_MODE_STORAGE_KEY,
  type ColorMode,
} from '~~/shared/colorMode'

export function useColorMode() {
  const colorMode = useState<ColorMode>('color-mode', () => 'dark')

  function readColorMode(): ColorMode {
    return document.documentElement.getAttribute(COLOR_MODE_ATTRIBUTE) === 'light' ? 'light' : 'dark'
  }

  function setColorMode(mode: ColorMode) {
    colorMode.value = mode
    document.documentElement.setAttribute(COLOR_MODE_ATTRIBUTE, mode)

    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode)
    } catch {
      // The theme still applies for this visit if storage is unavailable.
    }
  }

  function toggleColorMode() {
    const currentMode = readColorMode()
    setColorMode(currentMode === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    colorMode.value = readColorMode()
  })

  return { colorMode: readonly(colorMode), toggleColorMode }
}
