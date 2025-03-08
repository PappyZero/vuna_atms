import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/university/session');
        
        if (!response.ok) {
          toast.error('Session expired, please login');
          router.push('/university/universityLogin');
        } else {
          setIsVerified(true);
        }
      } catch (error) {
        toast.error('Session verification failed');
        router.push('/university/universityLogin');
      }
    };

    verifySession();
  }, [router]);

  if (!isVerified) return <div className="text-black p-6">Verifying session...</div>;

  return children;
}