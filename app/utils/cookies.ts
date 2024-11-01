import { createCookie } from '@remix-run/node' // or cloudflare/deno

export const localeCookie = createCookie('locale', {
  maxAge: 60 * 60 * 24 * 30 * 12,
  secure: false,
})