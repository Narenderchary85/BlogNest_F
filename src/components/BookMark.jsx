import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BookmarkCard from './BookmarkCard';

const BookMark = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <Navbar />

  <div className="flex pt-16">
    {!isMobile && (
      <div className="w-64 flex-shrink-0">
        <Sidebar />
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
          <Sidebar />
        </div>
      </div>
    )}

    <main className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
            <BookmarkCard/>
      </div>
    </main>
  </div>

  {isMobile && (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <Sidebar />
    </div>
  )}
</div>
)
}

export default BookMark
