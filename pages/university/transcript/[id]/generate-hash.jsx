import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UniversityNavbar from '../../../../components/UniversityNavbar';
import Footer from '../../../../components/Footer';

export default function GenerateHashPage() {
  const router = useRouter();
  const { id } = router.query;
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to generate SHA-256 hash
  const generateHash = async (data) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // Function to copy hash and show notification
  const copyHashToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      toast.success('Hash copied to clipboard!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Failed to copy hash!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Function to upload hash to the database
  const uploadHashToDatabase = async () => {
    try {
      const res = await fetch('/api/update-transcript-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcriptId: id, hash }), // Send transcriptId and hash
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! ${res.status}`);
      }

      toast.success('Transcript hash uploaded to database successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(`Error uploading hash: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    const fetchTranscriptAndGenerateHash = async () => {
      try {
        // Validate the ID
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
          throw new Error('Invalid student ID');
        }

        // Fetch transcript data
        const res = await fetch(`/api/student-transcript?id=${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! ${res.status}`);
        }
        const data = await res.json();

        // Convert transcript data to a string
        const transcriptString = JSON.stringify(data);

        // Generate the hash
        const generatedHash = await generateHash(transcriptString);
        setHash(generatedHash);

        // Show success toast
        toast.success('Hash generated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        // Show error toast
        toast.error(`Error generating hash: ${error.message}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTranscriptAndGenerateHash();
  }, [id]);

  if (loading) return <div className="text-black p-6">Generating hash...</div>;

  return (
    <div className="text-black flex flex-col min-h-screen">
      <UniversityNavbar />
      <div className="main-content flex-grow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Generate Blockchain Hash</h1>
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generated Hash</h2>
          <div className="bg-gray-100 p-4 rounded">
            <code className="break-all">{hash}</code>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={copyHashToClipboard}
            >
              Copy Hash
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={uploadHashToDatabase}
            >
              Upload Hash to Database
            </button>
          </div>
        </div>
      </div>
      <Footer />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}