import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import BlogCard from "./BlogCard";
import BookMarkButton from "./BookMarkButton";
import { Link } from "react-router";
import { FaBookmark } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";

const BookmarkCard = () => {
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [authors, setAuthors] = useState({});

  const fetchBookmarkedBlogs = async () => {
    try {
            const token = Cookies.get("token");
      if (!token) {
        setError("Please log in to view bookmarks");
        setLoading(false);
        return;
      }
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials:true
        }
      );

      if (userResponse.data.success) {
        const bookmarkIds = userResponse.data.user.bookmarks || [];
        
        if (bookmarkIds.length === 0) {
          setBookmarkedBlogs([]);
          setLoading(false);
          return;
        }
        
        const blogPromises = bookmarkIds.map(blogId =>
          axios.get(`${import.meta.env.VITE_API_URL}/blog/get/${blogId}`)
        );

        const blogResponses = await Promise.all(blogPromises);
        const blogs = blogResponses
          .filter(response => response.data.success)
          .map(response => response.data.blog);

        setBookmarkedBlogs(blogs);
        fetchAuthorsForBlogs(blogs);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorsForBlogs = async (blogsData) => {
    try {
      const uniqueUserIds = [...new Set(blogsData.map(blog => blog.userId))];

      const authorPromises = uniqueUserIds.map(async (userId) => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/blog/getAuthor/${userId}`
          );
          if (res.data.success) {
            return { userId, author: res.data.author };
          }
        } catch (err) {
          console.error(`Error fetching author for userId ${userId}:`, err);
          return { userId, author: null };
        }
      });

      const authorResults = await Promise.all(authorPromises);

      const authorsMap = {};
      authorResults.forEach(result => {
        if (result && result.author) {
          authorsMap[result.userId] = result.author;
        }
      });
      
      setAuthors(authorsMap);
    } catch (err) {
      console.error("Error fetching authors:", err);
    }
  };

  const handleBookmarkUpdate = (blogId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarkedBlogs(prevBlogs => 
        prevBlogs.filter(blog => blog._id !== blogId)
      );
    }
  };

  useEffect(() => {
    fetchBookmarkedBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading bookmarks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 text-xl mb-4"><RiErrorWarningFill/></div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{error}</h3>
        <button
          onClick={fetchBookmarkedBlogs}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Bookmarks
          </h1>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              {bookmarkedBlogs.length} {bookmarkedBlogs.length === 1 ? 'bookmark' : 'bookmarks'}
            </span>
          </div>
        </div>

        {bookmarkedBlogs.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4 flex justify-center items-center text-white"><FaBookmark/></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No bookmarks yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Save your favorite blogs by clicking the bookmark icon on any blog post.
            </p>
          <Link to='/blog'>
          <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Blogs
            </button>
          </Link>
          </div>
        )}
      </div>

      {bookmarkedBlogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedBlogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => setSelectedBlog(blog)}
              className="bg-white dark:bg-gray-800 cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 group relative"
            >
              <BookMarkButton 
                blog={blog} 
                onBookmarkUpdate={handleBookmarkUpdate}
              />

        
              {blog.image ? (
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              )}

          
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {blog.content}
                </p>
                
         
                {authors[blog.userId] && (
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                      {authors[blog.userId].name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {authors[blog.userId].name}
                    </span>
                  </div>
                )}

          
                {blog.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog.tags.split(',').slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBlog && (
        <BlogCard blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
    </div>
  );
};

export default BookmarkCard;