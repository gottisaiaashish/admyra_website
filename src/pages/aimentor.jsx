import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

export function AiMentor() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <div className="rounded-[2.5rem] border border-border-subtle bg-card/80 p-12 text-center shadow-[0_30px_70px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.32em] text-accent-cyan mb-4">Coming soon</p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-text-main">AI Mentor is on the way</h1>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-text-muted">
          We are building the AI Mentor experience to help you choose the right colleges, plan your career path, and get smart guidance for exam preparation.
          For now, you can explore colleges or use the rank predictor while we complete this feature.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
          <Button onClick={() => navigate('/predictor')}>Open Predictor</Button>
        </div>
      </div>
    </div>
  );
}
