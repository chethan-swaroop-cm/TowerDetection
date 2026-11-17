export default function QualityCheck() {
  return (
    <div className="panel quality-panel">
      <h2>Image Quality Analysis</h2>
      <div className="quality-status accepted">✓ IMAGE ACCEPTED</div>
      <div className="quality-metrics">
        <div className="metric">
          <span>Blur Score:</span> <span>145.2</span>
        </div>
        <div className="metric">
          <span>Overexposed:</span> <span>2.1%</span>
        </div>
        <div className="metric">
          <span>Underexposed:</span> <span>0.5%</span>
        </div>
      </div>
    </div>
  );
}
