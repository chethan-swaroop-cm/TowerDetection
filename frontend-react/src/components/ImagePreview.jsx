export default function ImagePreview() {
  return (
    <div className="panel preview-panel">
      <div className="file-info-header">
        <span className="filename">example_tower.jpg</span>
        <span className="filesize">2.4 MB</span>
      </div>
      <div className="image-preview-container">
        <div className="placeholder-image">Image Preview Placeholder</div>
      </div>
      <button className="btn-primary" style={{marginTop: '1rem'}}>EXECUTE DETECTION</button>
    </div>
  );
}
