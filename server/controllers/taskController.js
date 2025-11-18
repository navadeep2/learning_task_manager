 
// server/controllers/taskController.js
const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

// --- Helper function for fetching tasks based on role and date filter ---
const buildTaskQuery = async (user, dateFilter) => {
  const baseQuery = {};

  // 1. Role-Based Access Query
if (user.role === 'student') {
    // Students only see their own tasks
    baseQuery.userId = user.userId;
  } else if (user.role === 'teacher') {
    // Teachers see tasks created by themselves OR tasks belonging to their assigned students
    const assignedStudents = await User.find({ teacherId: user.userId }).select('_id');
    const studentIds = assignedStudents.map(s => s._id);

    // Tasks created by the teacher OR tasks created by one of their students
    baseQuery.$or = [
      { userId: user.userId }, // Tasks created by the teacher
      { userId: { $in: studentIds } } // Tasks created by assigned students
    ];
  }

  // 2. Date Filtering Logic (Bonus Feature)
  if (dateFilter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateQuery = {};

    if (dateFilter === 'overdue') {
      // Overdue: dueDate is less than today's date AND progress is NOT 'completed'
      dateQuery.dueDate = { $lt: today };
      dateQuery.progress = { $ne: 'completed' };
    } else if (dateFilter === 'this-week') {
      // This Week: dueDate between now and the end of the next 7 days
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + 7); 
      dateQuery.dueDate = { $gte: today, $lte: endOfWeek };
    }
    
    // Combine baseQuery and dateQuery using $and for date filters
    if (Object.keys(dateQuery).length > 0) {
      baseQuery.$and = baseQuery.$and || [];
      baseQuery.$and.push(dateQuery);
    }
  }
  
  return baseQuery;
};

// GET /tasks - Get tasks based on role access rules
exports.getTasks = async (req, res) => {
  try {
    const { dateFilter } = req.query; // Get filter from query params
    const query = await buildTaskQuery(req.user, dateFilter);

    // Populate the userId field to get creator details (like email for display)
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'email role'); // Fetch email and role from the User model

    // Map tasks to include creator's role and email for the frontend TaskCard
    const tasksWithCreatorInfo = tasks.map(task => ({
      _id: task._id,
      userId: task.userId._id, // Owner's ID
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      progress: task.progress,
      createdAt: task.createdAt,
      creatorName: task.userId.email, // Use email as creator name for simplicity
      role: task.userId.role // Owner's role
    }));

    res.json(tasksWithCreatorInfo);
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ success: false, message: 'Failed to load tasks.' });
  }
};

// POST /tasks - Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const newTask = new Task({
      userId: req.user.userId, // Must match the logged-in user's ID
      title,
      description,
      dueDate: dueDate || null,
      progress: 'not-started'
    });
    await newTask.save();
    res.status(201).json({ success: true, task: newTask, message: 'Task created successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
};

// PUT /tasks/:id - Update an existing task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    // 1. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // 2. Authorization: Only the task owner can update it
    if (task.userId.toString() !== req.user.userId.toString()) {
      // NOTE: Teachers can only CRUD their *own* tasks, regardless of whose task it is.
      // This strict check enforces the "Only the task owner can update" rule.
      return res.status(403).json({ success: false, message: 'Forbidden. You can only update tasks you own.' });
    }
    
    // 3. Apply updates and save
    const updatedTask = await Task.findByIdAndUpdate(
      taskId, 
      { $set: updates }, 
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );
    res.json({ success: true, task: updatedTask, message: 'Task updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
};

// DELETE /tasks/:id - Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    // 1. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    
    // 2. Authorization: Only the task owner can delete it
    if (task.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only delete tasks you own.' });
    }

    // 3. Delete the task
    await Task.findByIdAndDelete(taskId);
    // Status 204: No Content (successful deletion)
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
};
