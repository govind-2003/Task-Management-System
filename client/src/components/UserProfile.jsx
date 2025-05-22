import React, { useState, useEffect } from 'react';

const UserProfile = ({ user, isAdmin, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState(user);
    const [error, setError] = useState('');

    useEffect(() => {
        setProfile(user);
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/users/${isAdmin ? user._id : 'profile'}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            onUpdate(updatedUser);
            setEditing(false);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}
            
            {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={profile.username}
                            onChange={(e) => setProfile({...profile, username: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {isAdmin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <select
                                value={profile.role}
                                onChange={(e) => setProfile({...profile, role: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-blue-700 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{profile.username}</h3>
                        <p className="text-gray-600 mb-2">{profile.email}</p>
                        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 mb-6">
                            {profile.role}
                        </span>
                        <button
                            onClick={() => setEditing(true)}
                            className="px-6 py-2 bg-indigo-600 text-blue-700 rounded-lg hover:bg-indigo-700 transition-colors w-full max-w-xs"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;