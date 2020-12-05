export default (text: string) => {
  if('clipboard' in navigator) {
    return navigator.clipboard.writeText(text)
  } else {
    console.warn('Diese Funktion wird leider nicht unterstützt!')
  }
}