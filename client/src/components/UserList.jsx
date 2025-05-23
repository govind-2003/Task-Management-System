import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import { config } from '../config/config';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdate = async (updatedUser) => {
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user._id === updatedUser._id ? updatedUser : user
            )
        );
    };

    const handleDelete = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="space-y-6">
            {error && <div className="text-red-500">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user._id} className="relative">
                        <UserProfile 
                            user={user} 
                            isAdmin={true} 
                            onUpdate={handleUpdate} 
                        />
                        <button
                            onClick={() => handleDelete(user._id)}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;