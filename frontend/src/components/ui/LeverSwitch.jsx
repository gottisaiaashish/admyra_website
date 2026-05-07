import React from 'react';
import './LeverSwitch.css';

export const LeverSwitch = ({ onToggle, disabled }) => {
  return (
    <div className={`lever-wrapper ${disabled ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
      <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.3em] mb-6 text-center animate-pulse">
        Pull Lever to Submit
      </p>
      
      <div className="toggle-container">
        <input 
          className="toggle-input" 
          type="checkbox" 
          onChange={(e) => {
            if (e.target.checked) {
              setTimeout(() => onToggle(), 600);
            }
          }}
          disabled={disabled}
        />
        <div className="toggle-handle-wrapper">
          <div className="toggle-handle">
            <div className="toggle-handle-knob"></div>
            <div className="toggle-handle-bar-wrapper">
              <div className="toggle-handle-bar"></div>
            </div>
          </div>
        </div>
        <div className="toggle-base">
          <div className="toggle-base-inside"></div>
        </div>
      </div>
    </div>
  );
};
