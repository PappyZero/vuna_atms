import { createSession } from '../../../lib/session';
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { address } = req.body;
    
    if (!address || !ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;
    if (ethers.getAddress(address) !== ethers.getAddress(adminWallet)) {
      return res.status(401).json({ error: 'Unauthorized wallet address' });
    }

    await createSession(res, address);
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('University login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}