const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /api/tasks/stats — Aggregate statistics (must be before /:id)
router.get('/stats', async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'pending' });
    const inProgress = await Task.countDocuments({ status: 'in-progress' });
    const completed = await Task.countDocuments({ status: 'completed' });

    const highPriority = await Task.countDocuments({ priority: 'high' });
    const mediumPriority = await Task.countDocuments({ priority: 'medium' });
    const lowPriority = await Task.countDocuments({ priority: 'low' });

    const overdue = await Task.countDocuments({
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date(), $ne: null },
    });

    // Recently completed (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyCompleted = await Task.countDocuments({
      status: 'completed',
      updatedAt: { $gte: sevenDaysAgo },
    });

    res.json({
      total,
      pending,
      inProgress,
      completed,
      highPriority,
      mediumPriority,
      lowPriority,
      overdue,
      recentlyCompleted,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks — List all tasks
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sort } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 }; // newest first by default
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'priority') sortOption = { priority: -1 };

    const tasks = await Task.find(filter).sort(sortOption);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks/:id — Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks — Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = new Task({ title, description, status, priority, dueDate });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tasks/:id — Update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id — Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully', task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
