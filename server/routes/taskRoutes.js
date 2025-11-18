// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTaskCreation, validateTaskUpdate } = require('../validation/taskValidation');

// All task routes require authentication
router.use(authMiddleware);

// GET /tasks - Get tasks (Role-based access & Date filtering)
router.get('/', taskController.getTasks);

// POST /tasks - Create task (Any authenticated user)
router.post('/', validateTaskCreation, taskController.createTask);

// PUT /tasks/:id - Update task (Owner only)
router.put('/:id', validateTaskUpdate, taskController.updateTask);

// DELETE /tasks/:id - Delete task (Owner only)
router.delete('/:id', taskController.deleteTask);

module.exports = router;
