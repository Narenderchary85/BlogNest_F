import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import AddBlog from './AddBlog';

const Navbar = ({fetchBlogs}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name: string; image?: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const userCookie = Cookies.get("user"); 
      
      if (userCookie) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(userCookie));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkAuthStatus();
    window.addEventListener('scroll', handleScroll);
    
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token"); 
  Cookies.remove("user");  
  window.location.href = "/login";
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white dark:bg-gray-900 shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link 
            to="/blog" 
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div className="absolute -inset-1.5 bg-blue-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 -z-10"></div>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">BlogNest</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div
                onClick={() => setIsAddBlogOpen(true)}
                  className="hidden md:flex  cursor-pointer items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group animate-pulse"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Blog
                    
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-md blur opacity-30 group-hover:opacity-100 group-hover:inset-0 transition-all duration-300"></div>
                </div>

                <div className="hidden md:flex items-center space-x-3 relative group">
                  <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {userData?.image ? (
                <img src={userData?.image} alt={userData.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                userData?.name?.charAt(0).toUpperCase() || 'U'
                )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {userData?.name || 'User'}
                    </span>
                  </div>
                </div>
              </>
            ) : (

              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-md transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition duration-300"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-xl">

          {isLoggedIn ? (
            <>
              <div className="pt-2 pb-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium mr-2">
                    {userData?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {userData?.name || 'User'}
                  </span>
                </div>           
              </div>
            </>
          ) : (
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/login"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 mb-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-3 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 text-center shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
      <AddBlog isOpen={isAddBlogOpen} onClose={() => setIsAddBlogOpen(false)} fetchBlogs={fetchBlogs}/>
    </nav>
  );
};

export default Navbar;