import React, { useState } from 'react';
import { config } from '../config/config';

const TaskCard = ({ task, onDelete, onEdit, isAdmin }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await onEdit(task._id, editedTask);
            setIsEditing(false);
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const handlePdfView = (pdf) => {
        // Make sure we're using the full URL from the backend and include /pdfs in the path
        const pdfUrl = pdf.fileUrl.startsWith('http') 
            ? pdf.fileUrl 
            : `http://localhost:5000${pdf.fileUrl}`;
        
        window.open(pdfUrl, '_blank');
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={editedTask.title}
                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={editedTask.description}
                            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            rows="3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={editedTask.status}
                                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
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
                                value={editedTask.priority}
                                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
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
                            value={editedTask.dueDate.split('T')[0]}
                            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
            </div>
            <p className="text-gray-600 mb-4">{task.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
            </div>
            <div className="mt-4">
                {task.attachments && task.attachments.length > 0 && (
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h4>
                        <div className="flex flex-wrap gap-2">
                            {task.attachments.map((pdf, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePdfView(pdf)}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4v12h12V4H4zm11 11H5V5h10v10z"/>
                                    </svg>
                                    {pdf.fileName}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Assigned to: {task.assignedTo?.username || 'Unassigned'}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>
            {showPdfModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{selectedPdf.fileName}</h3>
                            <button
                                onClick={() => setShowPdfModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <iframe
                            src={`http://localhost:5000${selectedPdf.fileUrl}`}
                            className="w-full h-[80vh]"
                            title={selectedPdf.fileName}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCard;