import { ref, onBeforeUnmount } from 'vue'

export const useCurrentTime = (updateInterval: number = 1000) => {
  const currentTime = ref(new Date())

  if (import.meta.client) {
    const updateCurrentTime = () => {
      currentTime.value = new Date()
    }

    const intervalHandle = setInterval(updateCurrentTime, updateInterval)
    onBeforeUnmount(() => clearInterval(intervalHandle))
  }

  return { currentTime }
}
