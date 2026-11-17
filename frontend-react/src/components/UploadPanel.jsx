export default function UploadPanel() {
  return (
    <div className="panel upload-panel">
      <h2>Upload Inspection Image</h2>
      <div className="drop-zone">
        <div className="upload-icon">📁</div>
        <p>Drag and drop image here or click to select</p>
        <button className="btn-outline">SELECT IMAGE</button>
      </div>
    </div>
  );
}
