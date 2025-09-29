import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BlogCard = ({ blog, onClose }) => {
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/blog/getAuthor/${blog.userId}`
        );
        if (res.data.success) {
          setAuthor(res.data.author);
        }
      } catch (err) {
        console.error("Error fetching author:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (blog?.userId) fetchAuthor();
  }, [blog]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white dark:bg-gray-900 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ height: "80vh" }}
      >

        <div className="flex flex-col md:flex-row h-full relative">
        <button
          onClick={onClose}
          className="absolute top-4  cursor-pointer right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ✕
        </button>
          <div className="md:w-1/2 h-1/2 md:h-full">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-1/2 h-1/2 md:h-full flex flex-col p-6 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {blog.title}
            </h1>

            <div className="flex items-center mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : author ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {author.name ? author.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {author.name || "Unknown Author"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {author.email || "No email available"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Author information not available</p>
              )}
            </div>

            <div className="mb-6 flex-1 overflow-y-auto">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {blog.content}
              </p>
            </div>

            {blog.tags && blog.tags.trim() !== "" && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.split(",").map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published on {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogCard;