import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';

export default function UniversityLogin() {
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/university/session');
        if (res.ok) {
          router.push('/university/dashboard');
        }
      } catch (error) {
        toast.error('Session check failed');
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router]);

  const handleConnect = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];

      const response = await fetch('/api/university/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authorization failed');
      }

      toast.success('Login successful! Redirecting...');
      router.push('/university/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (checkingSession) return <div className="text-black p-6">Checking session...</div>;

  return (
    <div className='text-black'>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">Exam Officer Login</h1>
          <button
            onClick={handleConnect}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Connect MetaMask
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}