import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import TaskList from './TaskList';
import UserList from './UserList';
import UserProfile from './UserProfile';
import api from '../utils/axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [userResponse, tasksResponse] = await Promise.all([
                    api.get('/users/profile'),
                    api.get('/tasks')
                ]);

                setUser(userResponse.data);
                setTasks(tasksResponse.data);

                // Fetch all users if admin
                if (userResponse.data.role === 'admin') {
                    const usersResponse = await api.get('/users');
                    setAllUsers(usersResponse.data);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    console.error('Error fetching data:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleTaskCreate = async (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const handleTaskEdit = async (taskId, updatedTask) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task._id === taskId ? updatedTask : task
            )
        );
    };

    const handleTaskDelete = async (taskId) => {
        setTasks(prevTasks => 
            prevTasks.filter(task => task._id !== taskId)
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username={user?.username} role={user?.role} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <div className="flex gap-4 border-b border-gray-200">
                        <button
                            className={`px-4 py-2 ${activeTab === 'tasks' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('tasks')}
                        >
                            Tasks
                        </button>
                        <button
                            className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        {user?.role === 'admin' && (
                            <button
                                className={`px-4 py-2 ${activeTab === 'users' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('users')}
                            >
                                Users
                            </button>
                        )}
                    </div>
                </div>

                {activeTab === 'tasks' && (
                    <TaskList 
                        tasks={tasks}
                        onTaskCreate={handleTaskCreate}
                        onTaskDelete={handleTaskDelete}
                        onTaskEdit={handleTaskEdit}
                        isAdmin={user?.role === 'admin'}
                    />
                )}

                {activeTab === 'profile' && (
                    <UserProfile 
                        user={user}
                        isAdmin={false}
                        onUpdate={(updatedUser) => setUser(updatedUser)}
                    />
                )}

                {activeTab === 'users' && user?.role === 'admin' && (
                    <UserList />
                )}
            </main>
        </div>
    );
};

export default Dashboard;