import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="card auth">
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submit}>
        <input placeholder="Full name" required value={form.name} onChange={set('name')} />
        <input placeholder="Email" type="email" required value={form.email} onChange={set('email')} />
        <input placeholder="Password (min 6 characters)" type="password" required value={form.password}
          onChange={set('password')} />
        <select value={form.role} onChange={set('role')}>
          <option value="citizen">Citizen</option>
          <option value="collector">Waste Collector</option>
        </select>
        <button className="btn">Register</button>
      </form>
      <p className="muted">Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}
