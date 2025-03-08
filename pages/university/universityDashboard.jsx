import { useEffect, useState } from 'react';
import Link from 'next/link';
import UniversityNavbar from '../../components/UniversityNavbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function UniversityDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        toast.error(`Error fetching students: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <div className="text-black p-6">Loading...</div>;

  return (
    <ProtectedRoute>
      <div className="text-black flex flex-col min-h-screen">
        <UniversityNavbar />
        <div className="main-content flex-grow p-6">
          <h1 className="text-2xl font-bold mb-4">Student List</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Course</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{student.id}</td>
                    <td className="py-2 px-4 border-b">{student.name}</td>
                    <td className="py-2 px-4 border-b">{student.email}</td>
                    <td className="py-2 px-4 border-b">{student.course}</td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/university/student/${student.id}`}>
                        <a className="text-blue-500 hover:text-blue-700">View</a>
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