import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UniversityNavbar from '../../../../components/UniversityNavbar';
import Footer from '../../../../components/Footer';

export default function TranscriptPage() {
  const router = useRouter();
  const { id } = router.query;
  const [transcriptData, setTranscriptData] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Function to handle PDF download
  const handleDownloadPDF = () => {
    const transcriptElement = document.getElementById('transcript');

    // Use html2canvas to capture the transcript content as an image
    html2canvas(transcriptElement, {
      scale: 2, // Increase scale for better quality
      useCORS: true, // Enable CORS for external resources (if any)
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png'); // Convert canvas to image (PNG)
        const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new PDF in A4 size

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height to maintain aspect ratio

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Generate the filename using the student's matric number
        const matricNumber = transcriptData.studentInfo.matricNumber;
        const filename = `transcript_${matricNumber}.pdf`;

        // Save the PDF with the dynamic filename
        pdf.save(filename);
        toast.success('Transcript download in progress...');
      })
      .catch((error) => {
        toast.error(`Error downloading transcript: ${error.message}`);
      });
  };

  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
        // Validate the ID
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
          throw new Error('Invalid student ID');
        }

        console.log('Fetching transcript data for student ID:', id);

        const res = await fetch(`/api/student-transcript?id=${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! ${res.status}`);
        }
        const data = await res.json();
        setTranscriptData(data);

        // Show success toast only when data is successfully fetched
        toast.success('Transcript data loaded successfully!');
      } catch (error) {
        // Show error toast only when there is an error
        toast.error(`Error fetching transcript: ${error.message}`);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchTranscriptData();
  }, [id]); // Only run when `id` changes

  // Show loading state while data is being fetched
  if (loading) return <div className="text-black p-6">Loading...</div>;

  return (
    <div className="text-black flex flex-col min-h-screen">
      <UniversityNavbar />
      <div
        className="main-content flex-grow p-6"
        id="transcript"
        style={{
          width: '794px', // A4 width in pixels (210mm)
          margin: '0 auto', // Center the content
          padding: '20px', // Add padding inside the container
          backgroundColor: 'white', // Set background color to white
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow effect
          color: '#000000', // Ensure text color is black
        }}
      >
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: '#000000' }}>
          Unofficial Transcript
        </h1>

        {/* Student Information Section */}
        {transcriptData ? (
          <>
            <div className="mb-8">
              <table className="w-full border-collapse mb-4" style={{ width: '100%', color: '#000000' }}>
                <tbody>
                  <tr>
                    <td className="border p-2 font-semibold w-1/4">Name</td>
                    <td className="border p-2 w-1/4">{transcriptData.studentInfo.name}</td>
                    <td className="border p-2 font-semibold w-1/4">Matric Number</td>
                    <td className="border p-2 w-1/4">{transcriptData.studentInfo.matricNumber}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Wallet Address</td>
                    <td className="border p-2 font-mono" colSpan="3">
                      {transcriptData.studentInfo.walletAddress}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Faculty</td>
                    <td className="border p-2">{transcriptData.studentInfo.faculty}</td>
                    <td className="border p-2 font-semibold">Programme</td>
                    <td className="border p-2">{transcriptData.studentInfo.programme}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Department</td>
                    <td className="border p-2">{transcriptData.studentInfo.department}</td>
                    <td className="border p-2 font-semibold">Current Level</td>
                    <td className="border p-2">Level {transcriptData.studentInfo.currentLevel}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Academic Records Section */}
            {transcriptData.academicRecords.length > 0 ? (
              transcriptData.academicRecords.map((record, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#000000' }}>
                    {record.session} | Level {record.level} | {record.semester} Semester
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse" style={{ width: '100%', color: '#000000' }}>
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">#</th>
                          <th className="border p-2">Course Code</th>
                          <th className="border p-2">Course Title</th>
                          <th className="border p-2">Credit Unit</th>
                          <th className="border p-2">Score</th>
                          <th className="border p-2">Grade</th>
                          <th className="border p-2">Pass/Fail</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.courses.map((course, courseIndex) => (
                          <tr key={courseIndex}>
                            <td className="border p-2 text-center">{courseIndex + 1}</td>
                            <td className="border p-2">{course.courseCode}</td>
                            <td className="border p-2">{course.courseTitle}</td>
                            <td className="border p-2 text-center">{course.creditUnit}</td>
                            <td className="border p-2 text-center">{course.score}</td>
                            <td className="border p-2 text-center">{course.grade}</td>
                            <td className="border p-2 text-center">{course.passFail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4">
                    <table className="w-1/2 ml-auto" style={{ width: '50%', marginLeft: 'auto', color: '#000000' }}>
                      <tbody>
                        <tr>
                          <td className="border p-2 font-semibold">Total Credit Units</td>
                          <td className="border p-2 text-center">
                            {record.courses.reduce((sum, course) => sum + course.creditUnit, 0)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-semibold">Semester GPA</td>
                          <td className="border p-2 text-center">{record.semesterGPA?.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500" style={{ color: '#000000' }}>
                No academic records found.
              </div>
            )}

            {/* Cumulative GPA Section */}
            <div className="mt-8">
              <table className="w-1/2 ml-auto border-t-2 border-black" style={{ width: '50%', marginLeft: 'auto', color: '#000000' }}>
                <tbody>
                  <tr>
                    <td className="p-2 font-semibold text-lg">Cumulative GPA</td>
                    <td className="p-2 text-center text-lg">
                      {transcriptData.cumulativeGPA?.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => router.push(`/university/transcript/${id}/generate-hash`)}
              >
                Generate Blockchain Hash
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500" style={{ color: '#000000' }}>
            No transcript data available.
          </div>
        )}
      </div>
      <Footer />

      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}