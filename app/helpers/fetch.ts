const base = 'https://api.ec-nordbund.de/nuxt'

export async function get<T = unknown>(url: string): Promise<T> {
  if (url[0] === '/') url = base + url

  const res = await fetch(url)
  const json = await res.json()

  return json
}

export async function post<T = unknown>(url: string, data: any): Promise<T> {
  if (url[0] === '/') url = base + url

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })

  return res.json()
}
