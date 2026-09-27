import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface SceneRescueVerifiedOverlayProps {
  onExploreWhyHybrid: () => void;
}

export const SceneRescueVerifiedOverlay: React.FC<SceneRescueVerifiedOverlayProps> = ({
  onExploreWhyHybrid,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-14 z-20 pointer-events-none select-none">
      {/* Top Quiet Minimal Title */}
      <div className="flex items-center gap-3">
        <span className="bg-[#10B981] text-black font-display font-extrabold text-sm px-4 py-1.5 rounded-xl border-2 border-[#1E1714] shadow-[3px_3px_0px_#1E1714] uppercase">
          MISSION SUCCESSFUL
        </span>
      </div>

      {/* Center Grand Editorial Banner */}
      <div className="my-auto max-w-2xl mx-auto w-full bg-[#19120E]/95 text-white backdrop-blur-md p-8 md:p-10 rounded-3xl border-4 border-white shadow-[12px_12px_0px_#10B981] pointer-events-auto">
        <span className="bg-[#B9FF66] text-[#1E1714] font-display text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
          Disaster Outcome
        </span>

        <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight mt-3 mb-6 uppercase">
          SURVIVOR <br />
          <span className="text-[#10B981]">LOCATED.</span>
        </h2>

        {/* 3 Prominent Checkmarks */}
        <div className="space-y-3 font-mono text-sm md:text-base border-t border-b border-white/20 py-5">
          <div className="flex items-center gap-3 text-white">
            <div className="w-6 h-6 rounded-full bg-[#10B981] text-black flex items-center justify-center font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-bold tracking-wide">LOCATION IDENTIFIED ✓</span>
          </div>

          <div className="flex items-center gap-3 text-white">
            <div className="w-6 h-6 rounded-full bg-[#10B981] text-black flex items-center justify-center font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-bold tracking-wide">EVIDENCE CAPTURED ✓</span>
          </div>

          <div className="flex items-center gap-3 text-white">
            <div className="w-6 h-6 rounded-full bg-[#10B981] text-black flex items-center justify-center font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-bold tracking-wide">RESCUE TEAM NOTIFIED ✓</span>
          </div>
        </div>

        {/* Next Step Call To Action */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/70 max-w-xs font-mono">
            Ground rescue team is en route. Detection to notification latency: under 4 minutes.
          </p>

          <button
            onClick={onExploreWhyHybrid}
            className="group flex items-center gap-3 bg-[#B9FF66] text-[#1E1714] px-6 py-3 rounded-2xl font-display font-extrabold text-sm uppercase border-2 border-white hover:bg-white transition-all shadow-[4px_4px_0px_#10B981] active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>Why Our Hybrid UAV?</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Minimal */}
      <div className="text-center font-mono text-xs text-white/70">
        SILENTRESQ AUTONOMOUS DISASTER RESPONSE · SIH 2026
      </div>
    </div>
  );
};
