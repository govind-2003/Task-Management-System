const Task = require('../models/task');
const path = require('path');
const fs = require('fs');

const taskController = {
    createTask: async (req, res) => {
        try {
            console.log('Request body:', req.body);
            console.log('Files:', req.files);

            const { title, description, priority, status, dueDate, assignedTo } = req.body;

            // Validate assignedTo
            if (!assignedTo) {
                return res.status(400).json({
                    message: 'AssignedTo field is required'
                });
            }

            // Create task object
            const taskData = {
                title,
                description,
                priority,
                status,
                dueDate,
                assignedTo,
                createdBy: req.user._id
            };

            // Update how we store file information
            if (req.files && req.files.length > 0) {
                taskData.attachments = req.files.map(file => ({
                    fileName: file.originalname,
                    // Include /pdfs in the fileUrl
                    fileUrl: `/uploads/pdfs/${file.filename}`,
                    filePath: file.path,
                    fileType: 'pdf'
                }));
            }

            const task = new Task(taskData);
            await task.save();

            // Transform the response to include full URLs
            const taskResponse = task.toObject();
            if (taskResponse.attachments) {
                taskResponse.attachments = taskResponse.attachments.map(attachment => ({
                    ...attachment,
                    fileUrl: `http://localhost:5000${attachment.fileUrl}` // Add your backend URL
                }));
            }

            res.status(201).json(taskResponse);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ 
                message: 'Error creating task',
                error: error.message
            });
        }
    },

    getTasks: async (req, res) => {
        try {
            const tasks = await Task.find({
                $or: [
                    { assignedTo: req.user._id },
                    { createdBy: req.user._id }
                ]
            }).populate('assignedTo', 'username email')
              .populate('createdBy', 'username email');
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tasks', error: error.message });
        }
    },

    getTaskById: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id)
                .populate('assignedTo', 'username email')
                .populate('createdBy', 'username email');
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching task', error: error.message });
        }
    },

    updateTask: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Check if user has permission to update
            if (task.createdBy.toString() !== req.user._id.toString() && 
                task.assignedTo.toString() !== req.user._id.toString() && 
                req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this task' });
            }

            const updatedTask = await Task.findByIdAndUpdate(
                req.params.id,
                { ...req.body },
                { new: true }
            ).populate('assignedTo', 'username email');

            res.json(updatedTask);
        } catch (error) {
            res.status(500).json({ message: 'Error updating task', error: error.message });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Check if user has permission to delete
            if (task.createdBy.toString() !== req.user._id.toString() && 
                req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this task' });
            }

            await task.deleteOne();
            res.json({ message: 'Task removed' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting task', error: error.message });
        }
    },

    updateTaskStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const task = await Task.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            ).populate('assignedTo', 'username email');

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Error updating task status', error: error.message });
        }
    },

    assignTask: async (req, res) => {
        try {
            const { assignedTo } = req.body;
            const task = await Task.findByIdAndUpdate(
                req.params.id,
                { assignedTo },
                { new: true }
            ).populate('assignedTo', 'username email');

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Error assigning task', error: error.message });
        }
    },

    addAttachment: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            const { fileName, fileUrl } = req.body;
            task.attachments.push({ fileName, fileUrl });
            await task.save();

            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Error adding attachment', error: error.message });
        }
    },

    uploadPDFs: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No PDF files uploaded' });
            }

            const taskId = req.params.taskId;
            const task = await Task.findById(taskId);

            if (!task) {
                // Delete uploaded files if task doesn't exist
                req.files.forEach(file => fs.unlinkSync(file.path));
                return res.status(404).json({ message: 'Task not found' });
            }

            // Check if adding new files would exceed the 3 PDF limit
            if (task.attachments.length + req.files.length > 3) {
                // Delete uploaded files
                req.files.forEach(file => fs.unlinkSync(file.path));
                return res.status(400).json({ message: 'Maximum 3 PDFs allowed per task' });
            }

            const newAttachments = req.files.map(file => ({
                fileName: file.filename,
                fileUrl: `/api/tasks/${taskId}/pdf/${file.filename}`,
                filePath: file.path,
                fileType: 'pdf'
            }));

            task.attachments.push(...newAttachments);
            await task.save();

            res.status(200).json({ 
                message: 'PDFs uploaded successfully',
                attachments: task.attachments 
            });
        } catch (error) {
            // Delete uploaded files if there's an error
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            res.status(500).json({ message: error.message });
        }
    },

    getPDF: async (req, res) => {
        try {
            const task = await Task.findById(req.params.taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            const attachment = task.attachments.find(
                att => att.fileName === req.params.fileName
            );

            if (!attachment) {
                return res.status(404).json({ message: 'PDF not found' });
            }

            const filePath = path.join(__dirname, '..', 'uploads', 'pdfs', attachment.fileName);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'PDF file not found on server' });
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${attachment.fileName}"`);
            
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = taskController;