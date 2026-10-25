import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import BinTable from '../components/BinTable';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [bins, setBins] = useState([]);
  const [reqs, setReqs] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', fillLevel: 0 });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [s, b, r, c] = await Promise.all([
        api.get('/stats'), api.get('/bins'), api.get('/requests'), api.get('/users/collectors'),
      ]);
      setStats(s.data); setBins(b.data); setReqs(r.data); setCollectors(c.data);
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

  const run = async (fn) => {
    try { await fn(); setError(''); load(); } catch (e) { setError(errMsg(e)); }
  };

  const addBin = (e) => {
    e.preventDefault();
    run(async () => {
      await api.post('/bins', form);
      setForm({ name: '', address: '', fillLevel: 0 });
    });
  };

  return (
    <>
      <h2>Admin Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {stats && (
        <div className="stats">
          <div className="card stat"><h3>{stats.totalBins}</h3><p>Total bins</p></div>
          <div className="card stat"><h3>{stats.fullBins}</h3><p>Full bins</p></div>
          <div className="card stat"><h3>{stats.pending}</h3><p>Open requests</p></div>
          <div className="card stat"><h3>{stats.collected}</h3><p>Collected</p></div>
          <div className="card stat"><h3>{stats.collectors}</h3><p>Collectors</p></div>
          <div className="card stat"><h3>{stats.citizens}</h3><p>Citizens</p></div>
        </div>
      )}

      <div className="card">
        <h3>Add bin</h3>
        <form className="row" onSubmit={addBin}>
          <input placeholder="Bin name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Address" required value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input type="number" min="0" max="100" className="num" value={form.fillLevel}
            onChange={(e) => setForm({ ...form, fillLevel: e.target.value })} />
          <button className="btn">Add</button>
        </form>
      </div>

      <div className="card">
        <h3>Bins</h3>
        <BinTable bins={bins}
          onLevel={(id, level) => run(() => api.patch(`/bins/${id}/level`, { fillLevel: level }))}
          onDelete={(id) => window.confirm('Delete this bin?') && run(() => api.delete(`/bins/${id}`))} />
      </div>

      <div className="card">
        <h3>Pickup requests</h3>
        {!reqs.length ? <p className="muted">No requests yet.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Citizen</th><th>Address</th><th>Type</th><th>Status</th><th>Collector</th></tr></thead>
              <tbody>
                {reqs.map((r) => (
                  <tr key={r._id}>
                    <td>{r.user?.name}</td>
                    <td>{r.address}<br /><small>{r.notes}</small></td>
                    <td>{r.wasteType}</td>
                    <td><span className={`tag ${r.status}`}>{r.status}</span></td>
                    <td>
                      {r.status === 'collected' ? (r.collector?.name || '-') : (
                        <select value={r.collector?._id || ''}
                          onChange={(e) => e.target.value &&
                            run(() => api.patch(`/requests/${r._id}/assign`, { collectorId: e.target.value }))}>
                          <option value="">Assign...</option>
                          {collectors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
