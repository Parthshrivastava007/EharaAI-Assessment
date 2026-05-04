const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const debugData = async (req, res) => {
  try {
    const users = await User.find({});
    const projects = await Project.find({});
    const tasks = await Task.find({});
    
    console.log('--- DEBUG DATA DUMP ---');
    console.log('Users:', users.length);
    console.log('Projects:', projects.length);
    console.log('Tasks:', tasks.length);
    console.log('-----------------------');
    
    res.json({
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email })),
      projects: projects.map(p => ({ id: p._id, name: p.name })),
      tasks: tasks.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { debugData };
