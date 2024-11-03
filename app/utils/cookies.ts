import { createCookie } from '@remix-run/node' // or cloudflare/deno

export const localeCookie = createCookie('language', {
  maxAge: 60 * 60 * 24 * 30 * 12,
  secure: false
})
