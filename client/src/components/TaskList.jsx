import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import { config } from '../config/config';

const TaskList = ({ tasks, onTaskCreate, onTaskDelete, onTaskEdit, isAdmin }) => {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date().toISOString().split('T')[0],
        assignedTo: '',
        attachments: []
    });
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (isAdmin) {
                    const response = await fetch('http://localhost:5000/api/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    setUsers(data);
                } else {
                    const response = await fetch('http://localhost:5000/api/users/profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    setUsers([data]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users');
            }
        };
        fetchUsers();
    }, [isAdmin]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            setError('Maximum 3 PDF files allowed');
            e.target.value = '';
            return;
        }

        const invalidFiles = files.filter(file => file.type !== 'application/pdf');
        if (invalidFiles.length > 0) {
            setError('Only PDF files are allowed');
            e.target.value = '';
            return;
        }

        if (files.some(file => file.size > 5 * 1024 * 1024)) {
            setError('Each file must be less than 5MB');
            e.target.value = '';
            return;
        }

        setNewTask(prev => ({...prev, attachments: files}));
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
    });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newTask.title);
            formData.append('description', newTask.description);
            formData.append('priority', newTask.priority);
            formData.append('status', newTask.status);
            formData.append('dueDate', newTask.dueDate);
            
            // Auto-assign to current user if not admin
            if (isAdmin) {
                if (!newTask.assignedTo) {
                    setError('Please select a user to assign the task');
                    return;
                }
                formData.append('assignedTo', newTask.assignedTo);
            } else {
                // For regular users, use their own ID from the users array
                formData.append('assignedTo', users[0]?._id);
            }

            // Handle file attachments
            if (newTask.attachments && newTask.attachments.length > 0) {
                Array.from(newTask.attachments).forEach(file => {
                    formData.append('pdfs', file);
                });
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create task');
            }

            const data = await response.json();
            onTaskCreate(data);
            setShowCreateModal(false);
            resetForm();
        } catch (error) {
            console.error('Error creating task:', error);
            setError(error.message);
        }
    };

    const resetForm = () => {
        setNewTask({
            title: '',
            description: '',
            priority: 'medium',
            status: 'pending',
            dueDate: new Date().toISOString().split('T')[0],
            assignedTo: '',
            attachments: []
        });
        setError('');
    };

    const handleDelete = async (taskId) => {
        try {
            if (window.confirm('Are you sure you want to delete this task?')) {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete task');
                }

                onTaskDelete(taskId); // Call the parent's handler
            }
        } catch (error) {
            setError('Failed to delete task');
        }
    };

    const handleEdit = async (taskId, updatedTask) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedTask)
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            const data = await response.json();
            onTaskEdit(taskId, data); // Call the parent's handler
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <select
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Tasks</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="dueDate">Sort by Due Date</option>
                        <option value="priority">Sort by Priority</option>
                    </select>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                    Create New Task
                </button>
            </div>

            {/* Create Task Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                    minLength={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            {isAdmin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                                    <select
                                        value={newTask.assignedTo}
                                        onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    >
                                        <option value="">Select User</option>
                                        {users.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {sortedTasks.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No tasks found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedTasks.map(task => (
                        <TaskCard 
                            key={task._id} 
                            task={task} 
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;