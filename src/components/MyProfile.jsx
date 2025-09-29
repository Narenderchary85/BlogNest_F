import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import AddBlog from './AddBlog';
import BlogCard from './BlogCard';
import Cookies from "js-cookie";
import EditBlog from './EditBlog';
import EditProfile from './EditProfile';
import { GrNotes } from "react-icons/gr";
import { RiErrorWarningFill } from "react-icons/ri";

const MyProfile = ({fetchBlogs}) => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [userBlogs, setUserBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditProfileOpen,setIsEditProfileOpen]=useState(false)
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user/${userId}`);
          
          if (response.data.success) {
            setUserData(response.data.author);
            setUserBlogs(response.data.blogs || []);
          } else {
            setError(response.data.message || 'Failed to fetch user profile');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
          setIsLoading(false);
        }
      };
  
      if (userId) {
        fetchUserProfile();
      }
    }, [userId]);

    const handleEditBlog = (blog) => {
      setEditingBlog(blog);
      setIsEditModalOpen(true);
    };
  
    const handleDeleteBlog = async (blogId) => {
      try {
        setIsDeleting(true);
          const token = Cookies.get("token");
        
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/blog/delete/${blogId}`,
          {headers: {
            Authorization: `Bearer ${token}`,
          },
            withCredentials:true
          }
        );
  
        if (response.data.success) {
          fetchBlogs();
          setUserBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
      } finally {
        setIsDeleting(false);
      }
    };
  
    const handleUpdateBlog = async (updatedData) => {
        try {
          const token = Cookies.get("token");
          const formData = new FormData();

          Object.entries(updatedData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (value instanceof FileList) {
                Array.from(value).forEach(file => formData.append(key, file));
              } else {
                formData.append(key, value);
              }
            }
          });
      
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/blog/edit/${editingBlog._id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              },
              withCredentials: true
            }
          );
      
          if (response.data.success) {
            setUserBlogs(prevBlogs => 
              prevBlogs.map(blog => 
                blog._id === editingBlog._id ? response.data.blog : blog
              )
            );
            setIsEditModalOpen(false);
            setEditingBlog(null);
          }
        } catch (error) {
          console.error('Error updating blog:', error.response?.data || error.message);
        }
      };
      
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-4"><RiErrorWarningFill/></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Link 
              to="/blog"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      );
    }
  
    if (!userData) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User not found</h2>
            <Link 
              to="/"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      );
    }
  console.log(userData)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                {userData.image ? (
                <img src={userData.image} alt={userData.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                userData.name?.charAt(0).toUpperCase() || 'U'
                )}
            </div>

            <button
                onClick={() => setIsEditProfileOpen(true)}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors border-4 border-white dark:border-gray-800"
                title="Edit Profile"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>
            </div>

            <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {userData.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{userData.email}</p>
            {userData.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">"{userData.bio}"</p>
            )}
 
            <div className="flex justify-center md:justify-start space-x-6">
                <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userBlogs.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Blogs</div>
                </div>
                <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {userBlogs.reduce((total, blog) => total + (blog.likes || 0), 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
                </div>
                <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {userBlogs.reduce((total, blog) => total + (blog.comments?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Comments</div>
                </div>
            </div>
            </div>

            <button
            onClick={() => setIsAddBlogOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Write New Blog</span>
            </button>
        </div>
        </motion.div>
  

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Blogs
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {userBlogs.length} {userBlogs.length === 1 ? 'blog' : 'blogs'}
              </span>
            </div>
  
            {userBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 flex justify-center items-center text-white"><GrNotes/></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No blogs yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start your writing journey by publishing your first blog post!
                </p>
                <div
                  onClick={() => setIsAddBlogOpen(true)}
                  className="inline-flex cursor-pointer items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Create Your First Blog
                </div>
              </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBlogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group"
                  >
  
                    <div className="absolute top-3 right-3 flex space-x-2 z-10">
                 
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBlog(blog);
                        }}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
                        title="Edit Blog"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlog(blog._id);
                        }}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                        title="Delete Blog"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
              
                    <div onClick={() => setSelectedBlog(blog)}>
                      <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                        {blog.image && (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                          {blog.content}
                        </p>
                    
                        {blog.tags && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {blog.tags.split(',').slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                              >
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
              
                     
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{blog.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{blog.comments?.length || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{blog.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
         <AddBlog isOpen={isAddBlogOpen} onClose={() => setIsAddBlogOpen(false)} fetchBlogs={fetchBlogs}/>
         {selectedBlog && (
        <BlogCard blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
       <EditBlog
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBlog(null);
        }}
        blog={editingBlog}
        onUpdate={handleUpdateBlog}
      />
      {isEditProfileOpen && (
        <EditProfile
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            userData={userData}
            onUpdate={(updatedUser) => {
            setUserData(updatedUser);
            }}
        />
        )}
      </div>
    );
}

export default MyProfile
