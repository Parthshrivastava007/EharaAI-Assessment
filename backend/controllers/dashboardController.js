const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    let projectCount, taskCount, pendingTasks, completedTasks, overdueTasks;

    const now = new Date();

    if (req.user.role === 'Admin') {
      projectCount = await Project.countDocuments();
      taskCount = await Task.countDocuments();
      pendingTasks = await Task.countDocuments({ status: 'In Progress' }); // Specifically 'In Progress'
      completedTasks = await Task.countDocuments({ status: 'Completed' });
      overdueTasks = await Task.countDocuments({
        status: { $ne: 'Completed' },
        dueDate: { $lt: now }
      });
    } else {
      projectCount = await Project.countDocuments({
        $or: [
          { owner: req.user._id },
          { members: { $in: [req.user._id] } }
        ]
      });
      
      taskCount = await Task.countDocuments({ assignedTo: req.user._id });
      pendingTasks = await Task.countDocuments({ 
        assignedTo: req.user._id, 
        status: 'In Progress' 
      });
      completedTasks = await Task.countDocuments({ 
        assignedTo: req.user._id, 
        status: 'Completed' 
      });
      overdueTasks = await Task.countDocuments({
        assignedTo: req.user._id,
        status: { $ne: 'Completed' },
        dueDate: { $lt: now }
      });
    }

    // Get task status distribution for chart
    const statusStats = await Task.aggregate([
      { $match: req.user.role === 'Admin' ? {} : { assignedTo: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      projectCount,
      taskCount,
      activeTasks: pendingTasks, // Rename internally if helpful, but keep keys consistent with frontend
      pendingTasks, 
      completedTasks,
      overdueTasks,
      statusStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
