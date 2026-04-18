const base = 'https://api.ec-nordbund.de/nuxt'

export async function get<T = {}>(url: string): Promise<T> {
  if (url[0] === '/') url = base + url
  return $fetch<T>(url)
}

export async function post<T = {}>(url: string, data: any): Promise<T> {
  if (url[0] === '/') url = base + url
  return $fetch<T>(url, {
    method: 'POST',
    body: data,
  })
}
