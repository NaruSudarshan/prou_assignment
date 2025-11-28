import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/api';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passwordData);
            setMessage({ text: 'Password updated successfully', type: 'success' });
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setMessage({ text: '', type: '' });
                setPasswordData({ currentPassword: '', newPassword: '' });
            }, 2000);
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Failed to update password', type: 'error' });
        }
    };

    return (
        <>
            <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2 group">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300">
                                    <span className="text-white font-bold text-lg">P</span>
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                    ProU
                                </span>
                            </Link>
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-4">
                                    {user?.role === 'Manager' && (
                                        <>
                                            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/') ? 'text-white bg-slate-800 shadow-sm border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>Dashboard</Link>
                                            <Link to="/employees" className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/employees') ? 'text-white bg-slate-800 shadow-sm border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>Employees</Link>
                                        </>
                                    )}
                                    <Link to="/tasks" className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive('/tasks') ? 'text-white bg-slate-800 shadow-sm border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>Tasks</Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-white">{user?.name}</span>
                                <span className="text-xs text-slate-500 uppercase">{user?.role}</span>
                            </div>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
                                title="Change Password"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                </svg>
                                <span className="hidden md:inline text-sm font-medium">Change Password</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
                                title="Logout"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 0 013-3h4a3 0 013 3v1"></path>
                                </svg>
                                <span className="hidden md:inline text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-slate-950/80 transition-opacity" onClick={() => setIsPasswordModalOpen(false)}></div>

                    {/* Modal Panel */}
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-slate-900 border border-slate-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-white mb-4" id="modal-title">Change Password</h3>
                                    {message.text && (
                                        <div className={`mb-4 p-2 rounded text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {message.text}
                                        </div>
                                    )}
                                    <form onSubmit={handleChangePassword}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="input-field w-full"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="input-field w-full"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                            <button
                                                type="submit"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:col-start-2 sm:text-sm"
                                            >
                                                Update Password
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-700 shadow-sm px-4 py-2 bg-slate-800 text-base font-medium text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                                onClick={() => setIsPasswordModalOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
