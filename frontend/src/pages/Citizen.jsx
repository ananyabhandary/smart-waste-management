import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import BinTable from '../components/BinTable';

const TYPES = ['household', 'recyclable', 'organic', 'hazardous', 'e-waste'];

export default function Citizen() {
  const [bins, setBins] = useState([]);
  const [reqs, setReqs] = useState([]);
  const [form, setForm] = useState({ address: '', wasteType: 'household', notes: '' });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [b, r] = await Promise.all([api.get('/bins'), api.get('/requests')]);
      setBins(b.data); setReqs(r.data);
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/requests', form);
      setForm({ address: '', wasteType: 'household', notes: '' });
      setError('');
      load();
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <>
      <h2>Citizen Dashboard</h2>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Request a waste pickup</h3>
        <form className="row" onSubmit={submit}>
          <input placeholder="Pickup address" required value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <select value={form.wasteType} onChange={(e) => setForm({ ...form, wasteType: e.target.value })}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input placeholder="Notes (optional)" value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button className="btn">Submit</button>
        </form>
      </div>

      <div className="card">
        <h3>My requests</h3>
        {!reqs.length ? <p className="muted">You have not made any requests.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Address</th><th>Type</th><th>Status</th><th>Collector</th><th>Date</th></tr></thead>
              <tbody>
                {reqs.map((r) => (
                  <tr key={r._id}>
                    <td>{r.address}</td>
                    <td>{r.wasteType}</td>
                    <td><span className={`tag ${r.status}`}>{r.status}</span></td>
                    <td>{r.collector?.name || '-'}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Bins in the city</h3>
        <BinTable bins={bins} />
      </div>
    </>
  );
}
