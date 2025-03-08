import { useState } from 'react';
import { useRouter } from 'next/router';
import UniversityNavbar from '../../components/UniversityNavbar';
import Footer from '../../components/Footer';

export default function UploadTranscript() {
  const [formData, setFormData] = useState({
    studentAddress: '',
    transcriptHash: ''
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/university/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/university/universityDashboard');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="text-black flex flex-col min-h-screen">
      <UniversityNavbar />
      <div className="main-content flex-grow p-6 max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Student Transcript</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Student Wallet Address"
            required
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, studentAddress: e.target.value })}
          />
          <input
            type="text"
            placeholder="Transcript Hash"
            required
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, transcriptHash: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Upload to Blockchain
          </button>
        </form>
      </div>  
      <Footer />
    </div>
  );
}