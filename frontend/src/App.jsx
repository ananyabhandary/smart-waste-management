import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Collector from './pages/Collector';
import Citizen from './pages/Citizen';

function Home() {
  const { user } = useAuth();
  if (user.role === 'admin') return <Admin />;
  if (user.role === 'collector') return <Collector />;
  return <Citizen />;
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={<Protected><Home /></Protected>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
