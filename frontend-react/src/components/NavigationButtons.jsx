import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = ({ primaryLabel, onPrimary, secondaryLabel, onSecondary, primaryDisabled = false }) => {
  return (
    <div className="navigation-buttons">
      {secondaryLabel && (
        <button className="btn-secondary" onClick={onSecondary}>
          {secondaryLabel}
        </button>
      )}
      <button className="btn-primary" onClick={onPrimary} disabled={primaryDisabled}>
        {primaryLabel}
      </button>
    </div>
  );
};

export default NavigationButtons;
