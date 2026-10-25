import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="card auth">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submit}>
        <input placeholder="Email" type="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn">Login</button>
      </form>
      <p className="muted">No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
