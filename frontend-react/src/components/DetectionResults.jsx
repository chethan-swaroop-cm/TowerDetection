export default function DetectionResults() {
  return (
    <div className="panel detection-panel">
      <h2>Detection Summary</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Objects</div>
          <div className="stat-value">2</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Supporting Tower</div>
          <div className="stat-value">1</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Monopole Tower</div>
          <div className="stat-value">1</div>
        </div>
      </div>
      
      <div className="confidence-bars">
        <div className="conf-item">
          <div className="conf-header">
            <span>supporting_tower</span>
            <span>98%</span>
          </div>
          <div className="conf-track">
            <div className="conf-fill" style={{width: '98%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
