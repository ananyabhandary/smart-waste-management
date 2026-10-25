import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="nav">
      <Link to="/" className="brand">♻ Smart Waste Management</Link>
      {user && (
        <div className="nav-right">
          <span>{user.name} <span className="badge">{user.role}</span></span>
          <button className="btn small ghost" onClick={logout}>Logout</button>
        </div>
      )}
    </header>
  );
}
