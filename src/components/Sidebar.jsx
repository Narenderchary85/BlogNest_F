import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import AddBlog from './AddBlog';
import { FaPlusSquare } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa";
import { MdHome } from "react-icons/md";

const Sidebar = ({fetchBlogs}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get("user"); 
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);

        setUserId(parsedUser.id); 
      } catch (err) {
        console.error("Invalid user cookie:", err);
      }
    }
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const handleLogout = () => {
    Cookies.remove("token"); 
    Cookies.remove("user");  
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isProfilePage = () => {
    return location.pathname === '/profile' || location.pathname.startsWith('/myprofile/');
  };

  const menuItems = [
    { path: '/blog', label: 'Home', icon: <MdHome /> },
    { path: userId ? `/myprofile/${userId}` : '/profile', label: 'Profile', icon: <BsPersonCircle /> },
    { path: '/bookmarks', label: 'Bookmarks', icon: <FaBookmark /> },
  ];

  const mobileMenuItems = [
    { path: userId ? `/myprofile/${userId}` : '/profile', label: 'Profile', icon:<BsPersonCircle />, type: 'link' },
    { label: 'Add Blog', icon:<FaPlusSquare /> , type: 'action' },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex justify-around">
          {mobileMenuItems.map((item) => {
            if (item.type === 'link') {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-3 px-5 text-xs transition-all duration-300 ${
                    activeItem === item.path || (item.label === 'Profile' && isProfilePage())
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="text-lg mb-1">{item.icon}</span>
                  <span>{item.label}</span>
                  {(activeItem === item.path || (item.label === 'Profile' && isProfilePage())) && (
                    <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mt-1"></div>
                  )}
                </Link>
              );
            } else if (item.type === 'action') {
              return (
                <button
                  key={item.label}
                  onClick={() => setIsAddBlogOpen(true)}
                  className="flex flex-col items-center py-3 px-5 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  <span className="text-lg mb-1">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            }
            return null;
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center py-3 px-5 text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
          >
            <span className="text-lg mb-1"><IoLogOut /></span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      <AddBlog isOpen={isAddBlogOpen} onClose={() => setIsAddBlogOpen(false)} fetchBlogs={fetchBlogs}/>
    </div>
    );
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`fixed top-10 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-md transition-all duration-300 md:hidden ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full z-40 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-auto md:shadow-none`}
        style={{ width: '250px' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">

            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 md:hidden"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = activeItem === item.path || (item.label === 'Profile' && isProfilePage());
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
            >
              <span className="text-xl mr-3"><IoLogOut/></span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;