import { ref, onBeforeUnmount, computed } from '@nuxtjs/composition-api'

export const useCurrentTime = (updateInterval: number = 1000) => {
  const currentTime = ref(new Date())

  const updateCurrentTime = () => {
    currentTime.value = new Date()
  }

  const intervalHandle = setInterval(updateCurrentTime, updateInterval)
  onBeforeUnmount(() => clearInterval(intervalHandle))

  return { currentTime }
}
