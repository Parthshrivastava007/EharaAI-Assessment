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
      pendingTasks = await Task.countDocuments({ status: { $ne: 'Completed' } });
      completedTasks = await Task.countDocuments({ status: 'Completed' });
      overdueTasks = await Task.countDocuments({
        status: { $ne: 'Completed' },
        dueDate: { $lt: now }
      });
    } else {
      const userProjects = await Project.find({
        $or: [
          { owner: req.user._id },
          { members: { $in: [req.user._id] } }
        ]
      }).select('_id');
      
      const projectIds = userProjects.map(p => p._id);

      projectCount = projectIds.length;
      taskCount = await Task.countDocuments({ project: { $in: projectIds } });
      pendingTasks = await Task.countDocuments({ 
        project: { $in: projectIds }, 
        status: { $ne: 'Completed' } 
      });
      completedTasks = await Task.countDocuments({ 
        project: { $in: projectIds }, 
        status: 'Completed' 
      });
      overdueTasks = await Task.countDocuments({
        project: { $in: projectIds },
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
