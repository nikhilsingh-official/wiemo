/** Installs the small browser API surface Three.js's GLTF helpers use in Node. */
export function installNodeGltfShims() {
  globalThis.self = globalThis
  globalThis.createImageBitmap = async () => ({ width: 1, height: 1, close() {} })
  globalThis.FileReader ??= class FileReader {
    result = null
    onloadend = null

    readAsArrayBuffer(blob) {
      void blob.arrayBuffer().then((result) => {
        this.result = result
        this.onloadend?.()
      })
    }
  }
}
