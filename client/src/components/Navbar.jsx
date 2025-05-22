import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ username, role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg w-full">
            <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12"> {/* Increased padding */}
                <div className="flex justify-between h-20"> {/* Increased height */}
                    <div className="flex items-center gap-6"> {/* Increased gap */}
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                            Task Management System
                        </h1>
                        <span className="px-4 py-2 rounded-full text-base font-medium bg-indigo-100 text-indigo-800">
                            {role?.charAt(0).toUpperCase() + role?.slice(1)}
                        </span>
                    </div>
                    <div className="flex items-center gap-6"> {/* Increased gap */}
                        <span className="text-lg text-gray-700">Welcome, {username}</span> {/* Increased font size */}
                        <button
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 text-base font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;