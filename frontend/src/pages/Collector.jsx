import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import BinTable from '../components/BinTable';

export default function Collector() {
  const [bins, setBins] = useState([]);
  const [reqs, setReqs] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [b, r] = await Promise.all([api.get('/bins'), api.get('/requests')]);
      setBins(b.data); setReqs(r.data);
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

  const run = async (fn) => {
    try { await fn(); setError(''); load(); } catch (e) { setError(errMsg(e)); }
  };

  return (
    <>
      <h2>Collector Dashboard</h2>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>My assigned pickups</h3>
        {!reqs.length ? <p className="muted">No pickups assigned to you.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Citizen</th><th>Address</th><th>Type</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {reqs.map((r) => (
                  <tr key={r._id}>
                    <td>{r.user?.name}</td>
                    <td>{r.address}<br /><small>{r.notes}</small></td>
                    <td>{r.wasteType}</td>
                    <td><span className={`tag ${r.status}`}>{r.status}</span></td>
                    <td>
                      {r.status !== 'collected' && (
                        <button className="btn small"
                          onClick={() => run(() => api.patch(`/requests/${r._id}/collect`))}>
                          Mark collected
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Bin monitoring (fullest first)</h3>
        <BinTable bins={bins}
          onLevel={(id, level) => run(() => api.patch(`/bins/${id}/level`, { fillLevel: level }))} />
      </div>
    </>
  );
}
