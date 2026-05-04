const Project = require('../models/Project');

const getProjects = async (req, res) => {
  // Admins see all, Members see only where they are members or owner
  let projects;
  if (req.user.role === 'Admin') {
    projects = await Project.find({}).populate('owner', 'name email').populate('members', 'name email');
  } else {
    projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: { $in: [req.user._id] } }
      ]
    }).populate('owner', 'name email').populate('members', 'name email');
  }
  res.json(projects);
};

const createProject = async (req, res) => {
  const { name, description, members } = req.body;

  const project = new Project({
    name,
    description,
    owner: req.user._id,
    members: members || [],
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members', 'name email');

  if (project) {
    // Check if user has access
    if (
      req.user.role === 'Admin' ||
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(m => m._id.toString() === req.user._id.toString())
    ) {
      res.json(project);
    } else {
      res.status(403).json({ message: 'Not authorized to view this project' });
    }
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

const updateProject = async (req, res) => {
  const { name, description, members } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.name = name || project.name;
    project.description = description || project.description;
    project.members = members || project.members;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
