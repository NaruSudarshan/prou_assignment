import React, { useEffect, useState } from 'react';
import { getEmployees, getTasks } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        highPriorityTasks: 0,
        completionRate: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeesRes, tasksRes] = await Promise.all([getEmployees(), getTasks()]);
                const employees = employeesRes.data;
                const tasks = tasksRes.data;

                const completed = tasks.filter(t => t.status === 'Completed').length;
                const total = tasks.length;
                const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

                setStats({
                    totalEmployees: employees.length,
                    totalTasks: total,
                    pendingTasks: tasks.filter(t => t.status === 'Pending').length,
                    completedTasks: completed,
                    highPriorityTasks: tasks.filter(t => t.priority === 'High').length,
                    completionRate: rate
                });
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        fetchData();
    }, []);

    const StatCard = ({ title, value, color, icon, suffix = '' }) => (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
                <div className={`p-3 rounded-lg bg-slate-800 ${color}`}>
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-bold text-white">{value}{suffix}</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-1">Welcome back to your project overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    color="text-orange-500"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    }
                />
                <StatCard
                    title="Completion Rate"
                    value={stats.completionRate}
                    suffix="%"
                    color="text-emerald-500"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    }
                />
                <StatCard
                    title="High Priority"
                    value={stats.highPriorityTasks}
                    color="text-red-500"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    }
                />
                <StatCard
                    title="Total Tasks"
                    value={stats.totalTasks}
                    color="text-blue-500"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                    }
                />
            </div>
        </div>
    );
};

export default Dashboard;
