const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'Manager') {
            tasks = await Task.find()
                .populate('assignedTo', 'name email')
                .populate('comments.createdBy', 'name');
        } else {
            tasks = await Task.find({ assignedTo: req.user._id })
                .populate('assignedTo', 'name email')
                .populate('comments.createdBy', 'name');
        }
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTask = async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        assignedTo: req.body.assignedTo,
        status: req.body.status,
        priority: req.body.priority,
        dueDate: req.body.dueDate
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // If Employee, only allow status update
        if (req.user.role === 'Employee') {
            if (req.body.status) {
                task.status = req.body.status;
                await task.save();
                return res.json(task);
            } else {
                return res.status(403).json({ message: 'Employees can only update task status' });
            }
        }

        if (req.body.title) task.title = req.body.title;
        if (req.body.description) task.description = req.body.description;
        if (req.body.assignedTo) task.assignedTo = req.body.assignedTo;
        if (req.body.status) task.status = req.body.status;
        if (req.body.dueDate) task.dueDate = req.body.dueDate;
        if (req.body.priority) task.priority = req.body.priority;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addTaskComment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const comment = {
            text: req.body.text,
            createdBy: req.user._id,
            createdAt: new Date()
        };

        task.comments.push(comment);
        await task.save();

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('comments.createdBy', 'name');

        res.status(201).json(populatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { taskId, commentId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const comment = task.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (req.user.role !== 'Manager' && comment.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        comment.deleteOne();
        await task.save();

        const populatedTask = await Task.findById(taskId)
            .populate('assignedTo', 'name email')
            .populate('comments.createdBy', 'name');

        res.json(populatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

