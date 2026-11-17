export default function WorkflowTracker() {
  const steps = [
    { id: 1, name: 'IMAGE UPLOAD', status: 'completed' },
    { id: 2, name: 'UPLOAD PROGRESS', status: 'completed' },
    { id: 3, name: 'EXECUTE', status: 'completed' },
    { id: 4, name: 'QUALITY CHECK', status: 'active' },
    { id: 5, name: 'OBJECT DETECTION', status: 'pending' },
    { id: 6, name: 'COMPLETION', status: 'pending' },
    { id: 7, name: 'OUTPUT', status: 'pending' }
  ];

  return (
    <div className="workflow-tracker">
      {steps.map((step, idx) => (
        <div key={step.id} className="tracker-step-wrapper">
          <div className={`tracker-step ${step.status}`}>
            <span className="step-number">{step.id}</span>
            <span className="step-name">{step.name}</span>
          </div>
          {idx < steps.length - 1 && <div className="tracker-separator">→</div>}
        </div>
      ))}
    </div>
  );
}
