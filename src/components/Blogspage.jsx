import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import BlogCard from "./BlogCard";
import BookMarkButton from "./BookMarkButton";
import { RiErrorWarningFill } from "react-icons/ri";
import { GrNotes } from "react-icons/gr";

const Blogspage = ({blogs,fetchBlogs}) => {
  const [bloggs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");  
  const [author, setAuthor] = useState(null);

  const fetchBloggs = async () => {
    try {
        setBlogs(blogs);
        setFilteredBlogs(blogs);
        fetchAuthorsForBlogs(blogs);
    } catch (err) {
      setError("Failed to load blogs");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchBloggs();
  }, []);

  
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
      
      setAuthor(authorsMap);
    } catch (err) {
      console.error("Error fetching authors:", err);
    }
  };


  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBlogs(blogs);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    
    const filtered = blogs.filter(blog => {
      const auth = author[blog.userId];
 
      switch (searchCategory) {
        case "title":
          return blog.title?.toLowerCase().includes(query);
        
        case "author":
          if (!auth) return false;
          return (
            auth.name?.toLowerCase().includes(query) ||
            auth.email?.toLowerCase().includes(query) ||
            auth._id?.toLowerCase().includes(query)
          );
        
        case "content":
          return blog.content?.toLowerCase().includes(query);
        
        case "tags":
          return blog.tags?.toLowerCase().includes(query);
        
        case "date":
          const blogDate = new Date(blog.createdAt).toLocaleDateString();
          return blogDate.toLowerCase().includes(query);
        
        case "all":
        default:
          return (
            blog.title?.toLowerCase().includes(query) ||
            blog.content?.toLowerCase().includes(query) ||
            blog.tags?.toLowerCase().includes(query) ||
            (blog.authorName?.toLowerCase().includes(query)) ||
            (blog.author?.name?.toLowerCase().includes(query)) ||
            new Date(blog.createdAt).toLocaleDateString().toLowerCase().includes(query)
          );
      }
    });

    setFilteredBlogs(filtered);
  }, [searchQuery, searchCategory, blogs]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchCategory("all");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading blogs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 text-xl mb-4"><RiErrorWarningFill/></div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{error}</h3>
        <button
          onClick={fetchBlogs}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Discover Blogs
          </h1>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'blog' : 'blogs'} found
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search blogs..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <select
              value={searchCategory}
              onChange={handleCategoryChange}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
            >
              <option value="all">All Fields</option>
              <option value="title">Title</option>
              <option value="content">Content</option>
              <option value="tags">Tags</option>
              <option value="date">Date</option>
            </select>
          </div>

          {/* Search Tips */}
          {searchQuery && filteredBlogs.length === 0 && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                No blogs found matching "<span className="font-semibold">{searchQuery}</span>" in {searchCategory}.
                Try different keywords or search in all fields.
              </p>
            </div>
          )}
        </div>
      </div>

      {filteredBlogs.length === 0 && !searchQuery ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4"><GrNotes/></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No blogs yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Be the first to share your story!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            onClick={() => setSelectedBlog(blog)}
            className="bg-white dark:bg-gray-800 cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 group relative"
          >
            <BookMarkButton 
              blog={blog} 
              onBookmarkUpdate={(blogId, isBookmarked) => {
                setFilteredBlogs(prevBlogs => 
                  prevBlogs.map(b => 
                    b._id === blogId ? { ...b, isBookMark: isBookmarked } : b
                  )
                );
              }}
            />

            {blog.image ? (
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-48 w-full object-cover "
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
                  {blog.tags.split(',').length > 2 && (
                    <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                      +{blog.tags.split(',').length - 2} more
                    </span>
                  )}
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

export default Blogspage;