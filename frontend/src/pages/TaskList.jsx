import React, { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, getEmployees, updateTask, addTaskComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', status: 'Pending', priority: 'Medium', dueDate: '' });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [selectedTask, setSelectedTask] = useState(null);
    const [newComment, setNewComment] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        loadTasks();
        loadEmployees();
    }, []);

    useEffect(() => {
        let filtered = tasks;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(lowerTerm) ||
                task.description.toLowerCase().includes(lowerTerm)
            );
        }

        if (priorityFilter !== 'All') {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        setFilteredTasks(filtered);
    }, [searchTerm, priorityFilter, tasks]);

    const loadTasks = async () => {
        const res = await getTasks();
        setTasks(res.data);
        setFilteredTasks(res.data);
    };

    const loadEmployees = async () => {
        const res = await getEmployees();
        setEmployees(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTask(newTask);
        setNewTask({ title: '', description: '', assignedTo: '', status: 'Pending', priority: 'Medium', dueDate: '' });
        setIsFormOpen(false);
        loadTasks();
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Delete this task?')) {
            await deleteTask(id);
            loadTasks();
            if (selectedTask && selectedTask._id === id) setSelectedTask(null);
        }
    };

    const handleStatusChange = async (task, newStatus, e) => {
        e.stopPropagation();
        await updateTask(task._id, { ...task, status: newStatus });
        loadTasks();
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const res = await addTaskComment(selectedTask._id, newComment);
        setSelectedTask(res.data);
        setNewComment('');
        loadTasks();
    };

    const handleDeleteComment = async (taskId, commentId) => {
        if (window.confirm('Delete this comment?')) {
            const res = await deleteComment(taskId, commentId);
            setSelectedTask(res.data);
            loadTasks();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-900/20 text-amber-500 border-amber-500/20';
            case 'In Progress': return 'bg-blue-900/20 text-blue-500 border-blue-500/20';
            case 'Completed': return 'bg-emerald-900/20 text-emerald-500 border-emerald-500/20';
            default: return 'bg-slate-800 text-slate-400';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-500 bg-red-900/20 border-red-500/20';
            case 'Medium': return 'text-orange-500 bg-orange-900/20 border-orange-500/20';
            case 'Low': return 'text-slate-400 bg-slate-800 border-slate-700';
            default: return 'text-slate-400 bg-slate-800';
        }
    };

    const TaskCard = ({ task }) => (
        <div
            onClick={() => setSelectedTask(task)}
            className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 mb-4 hover:-translate-y-1 hover:border-orange-500/30 cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-200">{task.title}</h3>
                {user?.role === 'Manager' && (
                    <button onClick={(e) => handleDelete(task._id, e)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{task.description}</p>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-orange-900/30 flex items-center justify-center text-xs font-bold text-orange-500 border border-orange-500/20">
                        {task.assignedTo ? task.assignedTo.name.charAt(0) : '?'}
                    </div>
                    <span className="text-xs text-slate-500">{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
                </div>
                <div className="text-xs text-slate-500">
                    {new Date(task.dueDate).toLocaleDateString()}
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center text-slate-500 text-xs space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                    <span>{task.comments?.length || 0} Comments</span>
                </div>
                <button className="text-xs font-medium text-orange-500 hover:text-orange-400 flex items-center transition-colors bg-orange-500/10 px-3 py-1.5 rounded-full hover:bg-orange-500/20">
                    View Details
                </button>
            </div>

            {/* Status Switcher */}
            <div className="mt-3 flex space-x-1">
                {['Pending', 'In Progress', 'Completed'].map((s) => (
                    <button
                        key={s}
                        onClick={(e) => handleStatusChange(task, s, e)}
                        className={`flex-1 text-[10px] py-1 rounded-md transition-colors border ${task.status === s ? getStatusColor(s) : 'bg-slate-900 text-slate-500 border-transparent hover:bg-slate-950'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tasks</h1>
                    <p className="text-slate-400 mt-1">Track project progress</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field w-full sm:w-48"
                    />
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="input-field w-full sm:w-32"
                    >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    {user?.role === 'Manager' && (
                        <button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="btn-primary flex items-center space-x-2 whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>{isFormOpen ? 'Cancel' : 'New Task'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Add Task Form */}
            {user?.role === 'Manager' && (
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFormOpen ? 'max-h-[600px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                    <div className="card-static">
                        <h2 className="text-lg font-semibold text-white mb-4">Create New Task</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                                <input type="text" required
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                                <textarea rows={3} required
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Assign To</label>
                                <select
                                    value={newTask.assignedTo}
                                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="">Unassigned</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                                <input type="date" required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="sm:col-span-2 flex justify-end">
                                <button type="submit" className="btn-primary">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Pending', 'In Progress', 'Completed'].map((status) => (
                    <div key={status} className="card-sm">
                        <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center space-x-2 ${status === 'Pending' ? 'text-amber-500' :
                            status === 'In Progress' ? 'text-blue-500' : 'text-emerald-500'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${status === 'Pending' ? 'bg-amber-500' :
                                status === 'In Progress' ? 'bg-blue-500' : 'bg-emerald-500'
                                }`}></span>
                            <span>{status}</span>
                            <span className="ml-auto bg-slate-800 text-slate-400 py-0.5 px-2 rounded-full text-xs">
                                {filteredTasks.filter(t => t.status === status).length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {filteredTasks.filter(t => t.status === status).map(task => (
                                <TaskCard key={task._id} task={task} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Task Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
                    <div className="bg-slate-900 border border-orange-500/20 rounded-xl p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-white">{selectedTask.title}</h2>
                                    <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(selectedTask.priority)}`}>
                                        {selectedTask.priority}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    Due: {new Date(selectedTask.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-slate-300 mb-2">Description</h3>
                                <p className="text-slate-400 bg-slate-950 p-4 rounded-lg border border-slate-800">
                                    {selectedTask.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-300 mb-2">Assigned To</h3>
                                    <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                                        <div className="w-8 h-8 rounded-full bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-500 border border-orange-500/20">
                                            {selectedTask.assignedTo ? selectedTask.assignedTo.name.charAt(0) : '?'}
                                        </div>
                                        <span className="text-slate-300">{selectedTask.assignedTo ? selectedTask.assignedTo.name : 'Unassigned'}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-300 mb-2">Status</h3>
                                    <div className={`p-3 rounded-lg border flex items-center justify-center ${getStatusColor(selectedTask.status)}`}>
                                        {selectedTask.status}
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-300 mb-4">Comments</h3>
                                <div className="space-y-4 mb-4 max-h-48 overflow-y-auto">
                                    {selectedTask.comments && selectedTask.comments.length > 0 ? (
                                        selectedTask.comments.map((comment, index) => (
                                            <div key={index} className="bg-slate-950 p-3 rounded-lg border border-slate-800 group relative">
                                                <p className="text-slate-300 text-sm pr-6">{comment.text}</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs font-medium text-orange-500">
                                                        {comment.createdBy ? comment.createdBy.name : 'Unknown'}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                {(user?.role === 'Manager' || (comment.createdBy && comment.createdBy._id === user?._id)) && (
                                                    <button
                                                        onClick={() => handleDeleteComment(selectedTask._id, comment._id)}
                                                        className="absolute top-2 right-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Delete Comment"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm italic">No comments yet.</p>
                                    )}
                                </div>
                                <form onSubmit={handleAddComment} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="input-field flex-1"
                                    />
                                    <button type="submit" className="btn-primary px-4">
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
