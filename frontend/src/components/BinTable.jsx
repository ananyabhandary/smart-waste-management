import { useState } from 'react';

function Row({ bin, onLevel, onDelete }) {
  const [level, setLevel] = useState(bin.fillLevel);
  return (
    <tr>
      <td><b>{bin.name}</b><br /><small>{bin.address}</small></td>
      <td style={{ minWidth: 140 }}>
        <div className="bar"><div className={`fill ${bin.status}`} style={{ width: `${bin.fillLevel}%` }} /></div>
        <small>{bin.fillLevel}%</small>
      </td>
      <td><span className={`tag ${bin.status}`}>{bin.status}</span></td>
      {onLevel && (
        <td>
          <input type="number" min="0" max="100" value={level} className="num"
            onChange={(e) => setLevel(e.target.value)} />
          <button className="btn small" onClick={() => onLevel(bin._id, level)}>Update</button>
        </td>
      )}
      {onDelete && (
        <td><button className="btn small danger" onClick={() => onDelete(bin._id)}>Delete</button></td>
      )}
    </tr>
  );
}

export default function BinTable({ bins, onLevel, onDelete }) {
  if (!bins.length) return <p className="muted">No bins yet.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Bin</th><th>Fill level</th><th>Status</th>
            {onLevel && <th>Update level</th>}
            {onDelete && <th></th>}
          </tr>
        </thead>
        <tbody>
          {bins.map((b) => <Row key={b._id + b.fillLevel} bin={b} onLevel={onLevel} onDelete={onDelete} />)}
        </tbody>
      </table>
    </div>
  );
}
