import React from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';

interface Props {
  currentStep: number;
}

const DEFAULT_STEPS = [
  { label: 'WISH & CAKE', emoji: '🎂' },
  { label: 'BLESSINGS', emoji: '🎡' },
  { label: 'MEMORIES', emoji: '📸' },
  { label: 'LETTER', emoji: '💌' },
];

export const StepProgress: React.FC<Props> = ({ currentStep }) => {
  const steps = BIRTHDAY_CONFIG.steps && BIRTHDAY_CONFIG.steps.length === 4
    ? BIRTHDAY_CONFIG.steps
    : DEFAULT_STEPS;

  return (
    <nav className="step-progress-bar" aria-label="Celebration Journey Progress">
      <div className="step-progress-track">
        <div
          className="step-progress-fill"
          style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;
          return (
            <div
              key={idx}
              className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
            >
              <div className="step-dot">
                <span className="step-emoji">{step.emoji}</span>
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
