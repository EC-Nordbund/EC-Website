import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useCurrentTime = (updateInterval: number = 1000) => {
  const currentTime = ref(new Date())

  const updateCurrentTime = () => {
    currentTime.value = new Date()
  }

  let intervalHandle: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    updateCurrentTime()
    intervalHandle = setInterval(updateCurrentTime, updateInterval)
  })
  onBeforeUnmount(() => clearInterval(intervalHandle))

  return { currentTime }
}
