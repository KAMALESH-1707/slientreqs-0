import React from 'react';
import { Compass } from 'lucide-react';

export const SceneJourneyOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10 z-20">
      {/* Top Quiet Minimal Title */}
      <div className="max-w-md">
        <div className="inline-flex items-center gap-2 bg-[#FAF5EF]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border-2 border-[#1E1714] shadow-[2px_2px_0px_#1E1714]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E1714]">
            Ladakh Mountain Pass · Sector 4
          </span>
        </div>
      </div>

      {/* Center Cinematic Editorial Text */}
      <div className="max-w-2xl bg-[#FAF5EF]/95 backdrop-blur-md p-6 rounded-3xl border-3 border-[#1E1714] shadow-[6px_6px_0px_#1E1714] pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="bg-[#B9FF66] text-[#1E1714] font-display text-xs font-extrabold px-2.5 py-0.5 rounded uppercase">
            01 · The Journey
          </span>
          <span className="text-xs font-mono text-[#1E1714]/70">Speed ~65 km/h</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-[#1E1714] mt-2 leading-tight">
          A traveler rides a motorbike fast through a remote Himalayan mountain pass.
        </h2>
        <div className="mt-3 flex items-center gap-3 text-xs font-mono text-[#1E1714]/80">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[#10B981]" />
            <strong className="text-[#10B981] font-bold">GREEN</strong> = Motorbike Rider / Person
          </span>
          <span>·</span>
          <span>Elevation 4,180m</span>
          <span>·</span>
          <span>Zero Cell Signal</span>
        </div>
      </div>
    </div>
  );
};
