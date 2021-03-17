const base = process.browser ? window.origin : 'http://localhost:3000'

export async function get<T = {}>(url: string): Promise<T> {
  let fetch: Window['fetch']

  console.log('err1')
  if (process.server) {
    fetch = require('node-fetch')
  } else {
    fetch = window.fetch
  }
  console.log('err2')
  const res = await fetch(base + url)
  console.log('err3')
  const json = await res.json()

  return json
}

export async function post<T = {}>(url: string, data: any): Promise<T> {
  let fetch: Window['fetch']

  if (process.server) {
    fetch = require('node-fetch')
  } else {
    fetch = window.fetch
  }

  const res = await fetch(base + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });

  return res.json();
}
