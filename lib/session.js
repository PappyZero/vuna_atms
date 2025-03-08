import { sealData, unsealData } from 'iron-session'

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'uni-session',
  ttl: 60 * 60, // 1 hour
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export async function createSession(res, address) {
  const session = await sealData({ address }, sessionOptions)
  res.setHeader('Set-Cookie', `${sessionOptions.cookieName}=${session}; HttpOnly; Secure; Path=/`)
}

export async function getSession(req) {
  const cookie = req.cookies[sessionOptions.cookieName]
  return cookie ? await unsealData(cookie, sessionOptions) : null
}

export function destroySession(res) {
  res.setHeader('Set-Cookie', `${sessionOptions.cookieName}=; Max-Age=0; Path=/`)
}