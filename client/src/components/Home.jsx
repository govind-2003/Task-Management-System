import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-12 transform hover:scale-[1.02] transition-transform duration-300">
            <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Welcome to Task Management System
            </h1>
            <p className="text-xl text-gray-600 text-center mb-12 leading-relaxed">
                Organize your tasks efficiently, set deadlines, and boost your productivity with our easy-to-use Task Management System.
                Register now to get started or login if you already have an account.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/register" className="w-full sm:w-[200px]">
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-lg">
                        Register
                    </button>
                </Link>
                <Link to="/login" className="w-full sm:w-[200px]">
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-lg">
                        Login
                    </button>
                </Link>
            </div>
        </div>
    </div>
);

export default Home;