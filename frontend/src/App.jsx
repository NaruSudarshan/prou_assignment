import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import TaskList from './pages/TaskList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Manager Only Routes */}
            <Route element={<PrivateRoute roles={['Manager']} />}>
              <Route path="/" element={
                <>
                  <Navbar />
                  <Dashboard />
                </>
              } />
              <Route path="/employees" element={
                <>
                  <Navbar />
                  <EmployeeList />
                </>
              } />
            </Route>

            {/* Shared Routes (Manager & Employee) */}
            <Route element={<PrivateRoute roles={['Manager', 'Employee']} />}>
              <Route path="/tasks" element={
                <>
                  <Navbar />
                  <TaskList />
                </>
              } />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
