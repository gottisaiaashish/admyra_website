import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

export function AiMentor() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 min-h-[80dvh] flex items-center justify-center">
      <div className="w-full rounded-[2.5rem] border border-border-subtle bg-card/50 p-8 sm:p-16 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-start/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.32em] font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-start to-accent-cyan">Coming Soon</p>
          
          <h1 className="text-4xl sm:text-6xl font-bold mb-8 text-text-main tracking-tight">
            AI Mentor is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-start to-accent-cyan">Leveling Up</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-muted mb-12">
            We're building a smarter, more personalized AI guidance system to help you with college choices, career paths, and life opportunities. 
            Stay tuned for the most advanced student mentor!
          </p>

          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="h-13 px-8 rounded-2xl"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
