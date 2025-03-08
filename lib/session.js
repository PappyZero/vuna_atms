import { sealData, unsealData } from 'iron-session';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD, // Ensure this is at least 32 characters long
  cookieName: 'uni-session',
  ttl: 0, // Session expires immediately
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function createSession(res, address) {
  try {
    const session = await sealData({ address }, sessionOptions);
    res.setHeader(
      'Set-Cookie',
      `${sessionOptions.cookieName}=${session}; HttpOnly; Secure; Path=/; SameSite=Strict`
    );
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function getSession(req) {
  const cookie = req.cookies[sessionOptions.cookieName];
  return cookie ? await unsealData(cookie, sessionOptions) : null;
}

export function destroySession(res) {
  res.setHeader(
    'Set-Cookie',
    `${sessionOptions.cookieName}=; Max-Age=0; HttpOnly; Secure; Path=/; SameSite=Strict`
  );
}