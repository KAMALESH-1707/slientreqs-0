import React from 'react';

interface SceneTransitionOverlayProps {
  stage: 'transition' | 'arrival';
}

export const SceneTransitionOverlay: React.FC<SceneTransitionOverlayProps> = ({ stage }) => {
  if (stage === 'transition') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 z-20 pointer-events-none bg-[#19120E]/85 backdrop-blur-md transition-all duration-700">
        <div className="max-w-4xl text-center space-y-6">
          <div className="inline-block bg-[#FF5520] text-white font-display font-extrabold text-sm uppercase px-4 py-1.5 rounded-md border-2 border-white">
            The Solution
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-6xl md:text-8xl text-white tracking-tight leading-none uppercase">
            THERE IS <br />
            <span className="text-[#B9FF66]">ANOTHER WAY.</span>
          </h2>

          <div className="pt-4">
            <span className="inline-block bg-white text-[#1E1714] font-display font-extrabold text-2xl sm:text-4xl md:text-5xl px-8 py-3 rounded-2xl border-2 border-[#1E1714] shadow-[6px_6px_0px_#B9FF66] tracking-tight uppercase">
              SILENTRESQ
            </span>
          </div>

          <p className="text-sm md:text-lg font-mono tracking-widest uppercase text-white/80">
            Autonomous Disaster Response Hybrid VTOL
          </p>
        </div>
      </div>
    );
  }

  // stage === 'arrival'
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-14 z-20 pointer-events-none">
      {/* Top Aircraft Badge */}
      <div className="flex items-center gap-3">
        <div className="bg-[#1E1714] text-white font-display font-extrabold text-xl px-5 py-2.5 rounded-2xl border-2 border-white shadow-[4px_4px_0px_#B9FF66] uppercase">
          SILENTRESQ
        </div>
        <div className="bg-[#B9FF66] text-[#1E1714] font-display font-bold text-sm px-4 py-2 rounded-xl border-2 border-[#1E1714] uppercase animate-pulse">
          SEARCH MODE ENGAGED
        </div>
      </div>

      {/* Center Minimal Callout */}
      <div className="max-w-md bg-[#FAF5EF]/90 backdrop-blur-md p-6 rounded-3xl border-2 border-[#1E1714] shadow-[6px_6px_0px_#1E1714] pointer-events-auto">
        <div className="text-xs font-mono font-bold text-[#FF5520] uppercase tracking-wider mb-1">
          Sector 4-Bravo Reached
        </div>
        <h3 className="font-display font-bold text-2xl text-[#1E1714]">
          Approaching Disaster Zone
        </h3>
        <p className="text-xs text-[#1E1714]/80 mt-2 font-medium">
          Fixed-wing cruise transitioned to VTOL precision search. Aligning optical and thermal multi-spectral payload.
        </p>
      </div>
    </div>
  );
};
