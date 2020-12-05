import { computed, Ref, ref } from '@nuxtjs/composition-api'

export { ruleLib } from './validateLib'

type BASIC = string | boolean | number
type DATA = { [key: string]: BASIC | DATA }

type RULES<T> = {
  [K in keyof T]?: RULE<T[K]> | Array<RULE<T[K]>> | RULES<T[K]>
}
type ERRORS<T> = {
  [K in keyof T]?: ERROR | ERRORS<T[K]>
}
type RULE<T> = (value: T) => true | string
type ERROR = COMP<readonly string[]>
type COMP<T> = Readonly<Ref<T>>

function getPath<T = BASIC>(data: any, path: Array<string> = []): T {
  let dataCheck: any = data
  path.forEach((part) => {
    dataCheck = (dataCheck || {})[part]
  })
  return dataCheck
}

function filterArray(arr: Array<true | string>): Array<string> {
  return <any>arr.filter((v) => v !== true)
}

export function applyRules<T extends DATA>(data: T, rules: RULES<T>) {
  const result = internApplyRules(data, rules, [])
  return {
    errorMap: <ERRORS<T>>result.errorMap,
    valid: computed(() => {
      let valid = true

      result.errorList.forEach((error) => {
        if (error.value.length > 0) {
          valid = false
        }
      })

      return valid
    }),
    errorList: result.errorList,
  }
}

function internApplyRules<T extends DATA>(
  data: T,
  rules: RULES<T>,
  dataPath: Array<string>
): {
  errorMap: ERRORS<any>
  errorList: Array<ERROR>
} {
  const errList: Array<ERROR> = []

  function createError(
    ruleInput: Array<RULE<BASIC>> | RULE<BASIC>,
    data: any,
    path: Array<string>
  ) {
    const rules = typeof ruleInput === 'function' ? [ruleInput] : ruleInput
    const comp = computed(() => {
      const dataCheck = getPath(data, path)

      return filterArray(rules.map((rule) => rule(dataCheck)))
    })
    errList.push(comp)
    return comp
  }

  const result: ERRORS<T> = {}

  for (const key in rules) {
    const rule = rules[key]

    if (Array.isArray(rule) || typeof rule === 'function') {
      result[key] = createError(<any>rule, data, [...dataPath, key])
    } else {
      const innerResult = internApplyRules(data, <any>rule, [...dataPath, key])
      result[key] = innerResult.errorMap
      errList.push(...innerResult.errorList)
    }
  }

  return {
    errorMap: result,
    errorList: errList,
  }
}

export function createPropsAndListeners<T extends DATA>(
  _data: T,
  errorMap: ERRORS<T>,
  path: string
) {
  const partedPath = path.split('.')
  const dirty = ref(false)

  // Möglichkeiten: 1. @input, 2. @change
  const listener = () => {
    dirty.value = true
  }

  const errMSG = computed(() =>
    dirty.value ? getPath<ERROR>(errorMap, partedPath).value : []
  )

  return {
    errMSG,
    listener,
  }
}

export function mapper<T extends DATA>(
  data: T,
  errorMap: ERRORS<T>,
  names: Array<string>
) {
  const result: any = {}

  names.forEach((name) => {
    const el = createPropsAndListeners(data, errorMap, name)

    result[name + 'Event'] = el.listener
    result[name + 'Errors'] = el.errMSG
  })

  return result
}

export function useValidation<T extends DATA>(
  data: T,
  rules: RULES<T>,
  rootMap: Array<string> = []
) {
  const _ = applyRules(data, rules)

  return {
    ..._,
    createPropsAndListeners: (path: string) =>
      createPropsAndListeners(data, _.errorMap, path),
    rootMapper: mapper(data, _.errorMap, rootMap),
    mapper,
  }
}
