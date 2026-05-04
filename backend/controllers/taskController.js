const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });
  res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

  const projectExists = await Project.findById(project);
  if (!projectExists) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const task = new Task({
    title,
    description,
    project,
    assignedTo,
    status,
    priority,
    dueDate,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

const updateTask = async (req, res) => {
  const { title, description, assignedTo, status, priority, dueDate } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

const getMyTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id })
    .populate('project', 'name')
    .sort({ dueDate: 1 });
  res.json(tasks);
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
};
