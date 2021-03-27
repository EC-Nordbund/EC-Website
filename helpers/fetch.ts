const base = process.browser ? window.origin : 'http://localhost:3000'

export async function get<T = {}>(url: string): Promise<T> {
  let fetch: Window['fetch']

  if (process.server) {
    fetch = require('node-fetch').default
  } else {
    fetch = window.fetch
  }

  if(url[0] === '/') url = base + url

  const res = await fetch(url)
  const json = await res.json()

  return json
}

export async function post<T = {}>(url: string, data: any): Promise<T> {
  let fetch: Window['fetch']

  if (process.server) {
    fetch = require('node-fetch').default
  } else {
    fetch = window.fetch
  }

  if (url[0] === '/') url = base + url

  const res = await fetch( url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });

  return res.json();
}
