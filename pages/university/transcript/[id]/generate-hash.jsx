import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import UniversityNavbar from '../../../../components/UniversityNavbar';
import Footer from '../../../../components/Footer';

export default function GenerateHashPage() {
  const router = useRouter();
  const { id } = router.query;
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(true);

  const generateHash = async (data) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  };

  const copyHashToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      toast.success('Hash copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy hash!');
    }
  };

  const uploadHashToDatabase = async () => {
    try {
      const res = await fetch('/api/update-transcript-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcriptId: id, hash }),
      });

      if (!res.ok) throw new Error((await res.json()).message || 'Upload failed');
      toast.success('Hash uploaded successfully!');
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchTranscriptAndGenerateHash = async () => {
      try {
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) throw new Error('Invalid student ID');
        
        const res = await fetch(`/api/student-transcript?id=${id}`);
        if (!res.ok) throw new Error((await res.json()).message || 'Fetch failed');
        
        const data = await res.json();
        setHash(await generateHash(JSON.stringify(data)));
        toast.success('Hash generated successfully!');
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscriptAndGenerateHash();
  }, [id]);

  if (loading) return <div className="text-gray-800 p-6 bg-gray-50 min-h-screen">Generating hash...</div>;

  return (
    <div className="text-black">
      <UniversityNavbar />
      {/* Background Decoration */}
      <div className="blob top-right"></div>
      <div className="blob top-left animation-delay-2000"></div>

      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="pt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Blockchain Hash Generation
            </h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Generated Hash</h2>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <code className="break-all font-mono text-gray-600">{hash}</code>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={copyHashToClipboard}
                  className="text-black hover:bg-green-200 p-2 shadow-xl border-b-2 border-green-500 bg-green rounded-md transition-colors duration-200"
                >
                  Copy Hash
                </button>
                <button
                  onClick={uploadHashToDatabase}
                  className="text-black hover:bg-green-200 p-2 shadow-xl border-b-2 border-green-500 bg-green rounded-md transition-colors duration-200"
                >
                  Save to Database
                </button>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => router.back()}
                  className="text-black hover:bg-green-200 p-2 shadow-xl border-b-2 border-green-500 bg-green rounded-md transition-colors duration-200"
                >
                  ← Back to Transcript
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}