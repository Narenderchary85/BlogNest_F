import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Blogspage from './Blogspage';
import axios from 'axios';

const Homepage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/get`);
      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar fetchBlogs={fetchBlogs}/>

      <div className="flex pt-16">
        {!isMobile && (
          <div className="w-64 flex-shrink-0">
            <Sidebar fetchBlogs={fetchBlogs}/>
          </div>
        )}
        
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div 
              className="fixed left-0 top-0 h-full w-64 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar fetchBlogs={fetchBlogs}/>
            </div>
          </div>
        )}

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
           <Blogspage fetchBlogs={fetchBlogs} blogs={blogs}/>
          </div>
        </main>
      </div>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <Sidebar fetchBlogs={fetchBlogs}/>
        </div>
      )}
    </div>
  );
};

export default Homepage;