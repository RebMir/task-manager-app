import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from "sonner";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskDetails from './pages/TaskDetails';
import Tasks from './pages/Tasks';
import Trash from './pages/Trash';
import Users from './pages/Users';
import Sidebar from './components/Sidebar';
import StatusPage from './pages/Status';
import TestLogin from './pages/TestLogin';

function Layout () {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
        <Sidebar />
      </div>
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

const App = () => {
  return (
    <main className="light">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/completed/:status?" element={<Tasks />} />
          <Route path="/in-progress/:status?" element={<Tasks />} />
          <Route path="/todo/:status?" element={<Tasks />} />
          <Route path="/team/:status" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/team" element={<Users />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/test-login" element={<TestLogin />} />
          

          {/* Optional: Redirect root path to dashboard for logged-in users */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>

      <Toaster richColors position='top-center' />
    </main>
  );
};

export default App;
