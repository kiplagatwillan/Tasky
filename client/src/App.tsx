import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Layout from './components/Layout';             // Import Layout

// Import all protected pages
import AllTasks from './pages/AllTasks';
import NewTask from './pages/NewTask';
import CompletedTasks from './pages/CompletedTasks';
import Profile from './pages/Profile';
import Trash from './pages/Trash';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - only accessible if authenticated */}
        <Route element={<ProtectedRoute />}>
          {/* Layout for authenticated users (includes Header) */}
          <Route element={<Layout />}>
            <Route path="/tasks" element={<AllTasks />} />
            <Route path="/new-task" element={<NewTask />} />
            <Route path="/completed-tasks" element={<CompletedTasks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trash" element={<Trash />} />
          </Route>
        </Route>

        {/* Catch-all for undefined routes (optional) */}
        <Route path="*" element={<p>Page Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;