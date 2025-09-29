import React, { useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";

const BookMarkButton = ({ blog, onBookmarkUpdate }) => {
  const [isBookmarked, setIsBookmarked] = useState(blog.isBookMark || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.stopPropagation(); 
    setIsLoading(true);

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert('Please log in to bookmark blogs');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/blog/bookmark/${blog._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials:true
        }
      );

      if (response.data.success) {
        setIsBookmarked(response.data.isBookmarked);
        if (onBookmarkUpdate) {
          onBookmarkUpdate(blog._id, response.data.isBookmarked);
        }
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={isLoading}
      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
        isBookmarked
          ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
          : 'bg-white/90 text-gray-600 hover:bg-white hover:text-yellow-500 dark:bg-gray-800/90 dark:text-gray-400 dark:hover:bg-gray-700'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isBookmarked ? 'Remove bookmark' : 'Add to bookmarks'}
    >
      {isLoading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
    </button>
  );
};

export default BookMarkButton;