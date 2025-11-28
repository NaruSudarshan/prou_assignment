import React, { useEffect, useState } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ name: '', email: '', position: '', department: '', phone: '', skills: '' });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        loadEmployees();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = employees.filter(emp =>
            emp.name.toLowerCase().includes(lowerTerm) ||
            emp.email.toLowerCase().includes(lowerTerm) ||
            emp.position.toLowerCase().includes(lowerTerm)
        );
        setFilteredEmployees(filtered);
    }, [searchTerm, employees]);

    const loadEmployees = async () => {
        const res = await getEmployees();
        setEmployees(res.data);
        setFilteredEmployees(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const employeeData = {
            ...newEmployee,
            skills: newEmployee.skills.split(',').map(s => s.trim()).filter(s => s)
        };
        await createEmployee(employeeData);
        setNewEmployee({ name: '', email: '', position: '', department: '', phone: '', skills: '' });
        setIsFormOpen(false);
        loadEmployees();
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this employee?')) {
            await deleteEmployee(id);
            loadEmployees();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Employees</h1>
                    <p className="text-slate-400 mt-1">Manage your team members</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field w-full md:w-64"
                    />
                    {user?.role === 'Manager' && (
                        <button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="btn-primary flex items-center space-x-2 whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>{isFormOpen ? 'Cancel' : 'Add Employee'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Add Employee Form (Collapsible) */}
            {user?.role === 'Manager' && (
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFormOpen ? 'max-h-[600px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                    <div className="card-static">
                        <h2 className="text-lg font-semibold text-white mb-4">Add New Employee</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                                <input type="text" required
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    className="input-field"
                                    pattern="[A-Za-z\s]+"
                                    title="Name should only contain letters and spaces"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                <input type="email" required
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Position</label>
                                <input type="text" required
                                    value={newEmployee.position}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Department</label>
                                <input type="text" required
                                    value={newEmployee.department}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                                <input type="tel"
                                    value={newEmployee.phone}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Skills (comma separated)</label>
                                <input type="text"
                                    value={newEmployee.skills}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, skills: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="sm:col-span-2 flex justify-end">
                                <button type="submit" className="btn-primary">
                                    Save Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Employee List */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-950">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Position</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-900 divide-y divide-slate-800">
                            {filteredEmployees.map((employee) => (
                                <tr
                                    key={employee._id}
                                    onClick={() => setSelectedEmployee(employee)}
                                    className="hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-900/30 flex items-center justify-center text-orange-500 font-bold border border-orange-500/20">
                                                {employee.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{employee.name}</div>
                                                <div className="text-sm text-slate-400">{employee.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-300">{employee.position}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/20">
                                            {employee.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {user?.role === 'Manager' && (
                                            <button onClick={(e) => handleDelete(employee._id, e)} className="text-red-400 hover:text-red-300 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Profile Modal */}
            {selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEmployee(null)}>
                    <div className="bg-slate-900 border border-orange-500/20 rounded-xl p-6 shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 rounded-full bg-orange-900/30 flex items-center justify-center text-orange-500 font-bold text-2xl border border-orange-500/20">
                                    {selectedEmployee.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedEmployee.name}</h2>
                                    <p className="text-slate-400">{selectedEmployee.position}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedEmployee(null)} className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase">Department</p>
                                    <p className="text-white font-medium">{selectedEmployee.department}</p>
                                </div>
                                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase">Joined</p>
                                    <p className="text-white font-medium">{new Date(selectedEmployee.dateJoined).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                                <p className="text-xs text-slate-500 uppercase mb-1">Email</p>
                                <p className="text-white font-medium">{selectedEmployee.email}</p>
                            </div>

                            {selectedEmployee.phone && (
                                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Phone</p>
                                    <p className="text-white font-medium">{selectedEmployee.phone}</p>
                                </div>
                            )}

                            {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                                <div>
                                    <p className="text-xs text-slate-500 uppercase mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedEmployee.skills.map((skill, index) => (
                                            <span key={index} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
