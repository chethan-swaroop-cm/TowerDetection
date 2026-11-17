import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { path: '/upload', label: 'Upload' },
  { path: '/upload-progress', label: 'Progress' },
  { path: '/execute', label: 'Execute' },
  { path: '/quality-check', label: 'Quality' },
  { path: '/object-detection', label: 'Detection' },
  { path: '/complete', label: 'Complete' },
  { path: '/output', label: 'Output' }
];

const WorkflowStepper = ({ currentPath }) => {
  const currentIndex = steps.findIndex(s => s.path === currentPath) || 0;

  return (
    <div className="workflow-stepper">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'pending';

        return (
          <React.Fragment key={step.path}>
            <div className={`stepper-item ${statusClass}`}>
              <div className="stepper-circle">
                {isCompleted ? <Check size={14} /> : index + 1}
              </div>
              <span className="stepper-label">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default WorkflowStepper;
