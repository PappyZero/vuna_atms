import { getSession } from '../../../lib/session'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession(req)
    if (!session?.address) {
      return res.status(401).json({ authenticated: false })
    }
    res.status(200).json({ authenticated: true, address: session.address })
  } catch (error) {
    console.error('Session check error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}