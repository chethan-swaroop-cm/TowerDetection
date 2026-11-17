export default function OutputViewer() {
  return (
    <div className="panel output-panel">
      <h2>AI Detection Result</h2>
      <div className="output-image-container">
        <div className="placeholder-image">Processed Image with Bounding Boxes Placeholder</div>
      </div>
      
      <table className="detection-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Confidence</th>
            <th>Bounding Box</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>supporting_tower</td>
            <td>98.5%</td>
            <td>[120, 45, 340, 600]</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
