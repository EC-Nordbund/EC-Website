import { set, get } from 'idb-keyval'

async function webP() {
  if (!self.createImageBitmap) {
    return false
  }

  const webpData =
    'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
  const blob = await fetch(webpData).then((r) => r.blob())

  try {
    await createImageBitmap(blob)
    return true
  } catch (ex) {
    return false
  }
}

export async function supportsWebp() {
  const isSupported = await get('webp-support')

  if (isSupported === undefined) {
    const isSupported = await webP()
    set('webp-support', isSupported)
    return isSupported
  }

  return isSupported
}
