const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// CRUD routes for tasks
router.post('/', 
    authMiddleware.protect,
    upload.array('pdfs', 3),
    taskController.createTask
);
router.get('/', authMiddleware.protect, taskController.getTasks);
router.get('/:id', authMiddleware.protect, taskController.getTaskById);
router.put('/:id', authMiddleware.protect, taskController.updateTask);
router.delete('/:id', authMiddleware.protect, taskController.deleteTask);

// Additional task routes
router.put('/:id/status', authMiddleware.protect, taskController.updateTaskStatus);
router.put('/:id/assign', authMiddleware.protect, taskController.assignTask);
router.post('/:id/attachments', authMiddleware.protect, taskController.addAttachment);

// Upload PDFs for a task
router.post(
    '/:taskId/upload-pdf',
    authMiddleware.protect,
    upload.array('pdfs', 3),
    taskController.uploadPDFs
);

// Get PDF file
router.get('/:taskId/pdf/:fileName', authMiddleware.protect, taskController.getPDF);

module.exports = router;