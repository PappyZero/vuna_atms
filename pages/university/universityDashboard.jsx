import { useEffect, useState } from 'react';
import Link from 'next/link';
import UniversityNavbar from '../../components/UniversityNavbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import ProtectedRoute from '../../components/ProtectedRoute';
import { FaWallet } from 'react-icons/fa'; 
import { Tooltip } from 'react-tooltip'; 
import 'react-tooltip/dist/react-tooltip.css'; 

export default function UniversityDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/university/session');
        if (response.ok) {
          const data = await response.json();
          setUserAddress(data.user.address); // Ensure the address is being set correctly
        } else {
          throw new Error('Failed to fetch session');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        toast.error('Session check failed. Please try again.');
      }
    };
  
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/db-api');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! ${res.status}`);
        }
        const data = await res.json();
        setStudents(data.students || []);
        toast.success('Students data loaded successfully!');
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error(`Error fetching students: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSession();
    fetchStudents();
  }, []); 

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch('/api/university/logout', {
  //       method: 'POST',
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Logout failed');
  //     }

  //     toast.success('Logged out successfully!');
  //     window.location.href = '/university/universityLogin';
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //     toast.error('Logout failed. Please try again.');
  //   }
  // };

  if (loading) return <div className="text-black p-6">Loading...</div>;

  // Function to truncate the wallet address for better readability
  const truncateAddress = (address) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <ProtectedRoute>
      <div className="text-black flex flex-col min-h-screen">
        <UniversityNavbar />
        <div className="main-content flex-grow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Student Registry</h1>
            <div className="flex items-center gap-4">
              <span
                className="text-sm text-gray-600 flex items-center"
                data-tooltip-id="wallet-tooltip"
                data-tooltip-content={userAddress} // Ensure the full address is passed here
              >
                <FaWallet className="mr-2" /> {/* Wallet icon */}
                Logged in as: {truncateAddress(userAddress)}
              </span>
              <Tooltip
                id="wallet-tooltip"
                place="bottom" // Position the tooltip below the text
                content={userAddress} // Ensure the full address is displayed in the tooltip
              /> {/* Tooltip component */}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-green-100">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Matric Number</th>
                  <th className="py-2 px-4 border">Wallet Address</th>
                  <th className="py-2 px-4 border">Faculty</th>
                  <th className="py-2 px-4 border">Programme</th>
                  <th className="py-2 px-4 border">Department</th>
                  <th className="py-2 px-4 border">Level</th>
                  <th className="py-2 px-4 border">Latest GPA</th>
                  <th className="py-2 px-4 border">Transcript Hash</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="py-2 px-4 border">{student.name}</td>
                    <td className="py-2 px-4 border">{student.matricNumber}</td>
                    <td className="py-2 px-4 border font-mono">
                      {student.walletAddress}
                    </td>
                    <td className="py-2 px-4 border">{student.faculty}</td>
                    <td className="py-2 px-4 border">{student.programme}</td>
                    <td className="py-2 px-4 border">{student.department}</td>
                    <td className="py-2 px-4 border">Level {student.level}</td>
                    <td className="py-2 px-4 border">
                      {student.latestGPA?.toFixed(2) || '-'}
                    </td>
                    <td className="py-2 px-4 border font-mono">
                      {student.transcriptHash || 'Not generated'}
                    </td>
                    <td className="py-2 px-4 border">
                      <Link href={`/university/transcript/${student._id}`}>
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                          View Transcript
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}