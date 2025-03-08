import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function UniversityNavbar() {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/university/logout');
      if (!response.ok) throw new Error('Logout failed');
      toast.success('Logged out successfully');
      window.location.href = '/university/universityLogin';
    } catch (error) {
      toast.error(error.message);
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-500 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link href="/">
              <span className="flex-shrink-0 flex items-center space-x-2 cursor-pointer">
                <Image
                  src="/pappy_tech.svg"
                  alt="ATMS University Logo"
                  width={70}
                  height={30}
                  className="dark:invert hover:rotate-12 transition-transform duration-300"
                  priority
                />
                <span className="hidden md:block text-white text-xl font-bold tracking-tight">
                  VERITAS
                </span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/university/universityDashboard">
              <span className="text-gray-100 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
                Dashboard
              </span>
            </Link>
            <Link href="/about-us/about-us">
              <span className="text-gray-100 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
                About Us
              </span>
            </Link>
            <Link href="/contact-us/contact-us">
              <span className="text-gray-100 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
                Contact Us
              </span>
            </Link>
            <Link href="/university/upload-transcript">
              <span className="text-gray-100 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer">
                Upload Transcript
              </span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}