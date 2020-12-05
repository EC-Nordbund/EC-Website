import { Ref, computed, unref } from '@nuxtjs/composition-api'

function getAge(gebDat: Ref<string> | string, wann?: string | Date) {
  const today = wann ? new Date(wann) : new Date()
  const birthDate = new Date(unref(gebDat))
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export function useAlter(gebDat: Ref<string>, wann?: string) {
  const alter = computed(() => getAge(gebDat, wann))
  const under18 = computed(() => alter.value < 18)

  return {
    alter,
    under18,
  }
}
