import React from 'react';

const mockHistory = [
  { id: '10293', date: '2026-09-25 10:30', image: 'tower_001.jpg', status: 'SUCCESS', confidence: '98.5%' },
  { id: '10294', date: '2026-09-25 10:45', image: 'tower_002.jpg', status: 'REJECTED', confidence: '-' },
  { id: '10295', date: '2026-09-25 11:12', image: 'tower_003.jpg', status: 'SUCCESS', confidence: '92.1%' },
  { id: '10296', date: '2026-09-25 13:20', image: 'tower_004.jpg', status: 'SUCCESS', confidence: '95.8%' },
  { id: '10297', date: '2026-09-25 14:05', image: 'tower_005.jpg', status: 'ERROR', confidence: '-' },
];

const History = () => {
  return (
    <div className="page-container">
      <div className="workspace-header">
        <h1 className="workspace-title">INSPECTION HISTORY</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE & TIME</th>
              <th>IMAGE</th>
              <th>STATUS</th>
              <th>CONFIDENCE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((row) => (
              <tr key={row.id}>
                <td className="text-mono text-tertiary">#{row.id}</td>
                <td>{row.date}</td>
                <td className="text-mono">{row.image}</td>
                <td>
                  <span className={`status-badge ${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
                <td className="text-mono">{row.confidence}</td>
                <td>
                  <button className="btn-secondary" style={{padding: '0.25rem 0.75rem', fontSize: '0.8rem'}}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
