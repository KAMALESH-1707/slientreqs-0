import React, { useEffect, useState } from 'react';
import { EyeOff, AlertTriangle, Building, WifiOff, HelpCircle, UserX, Clock } from 'lucide-react';

interface SceneLandslideOverlayProps {
  progress: number; // 0 to 1 over 8.5 seconds total
}

export const SceneLandslideOverlay: React.FC<SceneLandslideOverlayProps> = ({ progress }) => {
  const [stage, setStage] = useState<'collapsing' | 'destruction_pause' | 'no_internet' | 'no_help' | 'unidentifiable'>('collapsing');

  // Breakdown of 8.5 seconds:
  // 0.00 to 0.22 (0.0s - 1.9s): Collapse animation
  // 0.22 to 0.70 (1.9s - 6.0s): EXACT 4-SECOND DELAY to emphasize the destruction!
  // 0.70 to 0.80 (6.0s - 6.8s): Trigger 'NO INTERNET' pop-up (on left side)
  // 0.80 to 0.90 (6.8s - 7.6s): Trigger 'NO HELP' pop-up (on left side)
  // 0.90 to 1.00 (7.6s - 8.5s): Trigger 'SURVIVOR UNIDENTIFIABLE' pop-up (on left side)
  useEffect(() => {
    if (progress < 0.22) {
      setStage('collapsing');
    } else if (progress < 0.70) {
      setStage('destruction_pause'); // 4-second pause to emphasize destruction
    } else if (progress < 0.80) {
      setStage('no_internet');
    } else if (progress < 0.90) {
      setStage('no_help');
    } else {
      setStage('unidentifiable');
    }
  }, [progress]);

  const isCollapsed = progress >= 0.20;
  const isTopView = progress >= 0.28;

  // Calculate remaining seconds of the 4-second destruction pause
  const pauseProgress = Math.max(0, Math.min(1, (progress - 0.22) / 0.48));
  const remainingPauseSec = Math.max(0, 4 - Math.floor(pauseProgress * 4));

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 z-20 pointer-events-none select-none transition-colors duration-700">
      {/* Top Banner */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 bg-[#FF5520] text-white px-4 py-2 rounded-xl border-2 border-[#1E1714] shadow-[3px_3px_0px_#1E1714] font-display font-extrabold text-xs uppercase animate-pulse">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span>7.8 Mw Catastrophic Earthquake · 30-Story Tower Collapses</span>
        </div>

        {/* Top View Notice when looking straight down */}
        {isTopView && (
          <div className="inline-flex items-center gap-2 bg-black/90 text-white px-4 py-2 rounded-xl border-2 border-white/20 text-xs font-mono font-bold shadow-lg">
            <EyeOff className="w-4 h-4 text-[#FF5520]" />
            <span className="text-[#FF5520]">AERIAL 90° NADIR TOP VIEW:</span>
            <span>SURVIVOR BURIED UNDER 30 FLOORS OF CONCRETE DEBRIS · NOT VISIBLE</span>
          </div>
        )}
      </div>

      {/* Main Content Area:
          DURING THE 4-SECOND DESTRUCTION PAUSE: Emphasize the destruction on the LEFT SIDE.
          AFTER 4 SECONDS: Pop-up warnings appear on the LEFT SIDE (keeping center & right unobstructed).
      */}
      <div className="my-auto self-start ml-2 md:ml-6 max-w-sm md:max-w-md w-full space-y-3 pointer-events-none">
        {/* 4-SECOND DESTRUCTION EMPHASIS CARD */}
        {stage === 'destruction_pause' && (
          <div className="bg-[#19120E]/95 backdrop-blur-md p-5 rounded-3xl border-3 border-[#FF5520] shadow-[8px_8px_0px_#FF5520] animate-fade-in space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold">
              <span className="text-[#FF5520] uppercase tracking-widest flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                DISASTER IMPACT CONFIRMED
              </span>
              <span className="text-white/70 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3 text-[#B9FF66]" />
                {remainingPauseSec}s
              </span>
            </div>

            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white uppercase leading-tight">
              30-Story Tower Completely Destroyed
            </h2>

            <p className="text-xs font-mono text-white/80 leading-relaxed">
              All 30 concrete floor slabs and pillars sheared into ground rubble. The 12th floor office worker is trapped under tons of concrete ruins with zero line-of-sight.
            </p>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-[#B9FF66]">
              <span>STRUCTURAL COLLAPSE: 100%</span>
              <span>SURFACE SURVIVOR VISIBILITY: 0%</span>
            </div>
          </div>
        )}

        {/* AFTER 4 SECONDS: THE POP-UP WARNINGS TRIGGER ON THE LEFT SIDE */}
        {(stage === 'no_internet' || stage === 'no_help' || stage === 'unidentifiable') && (
          <div className="space-y-3 animate-fade-in">
            {/* Pop-up 1: NO INTERNET */}
            <div className="transform transition-all duration-300 ease-out translate-y-0 opacity-100">
              <div className="inline-flex items-center gap-3 bg-[#1E1714] text-white font-display font-extrabold text-3xl sm:text-4xl md:text-5xl px-6 py-2.5 rounded-2xl border-2 border-white shadow-[6px_6px_0px_#FF5520] uppercase tracking-tight">
                <WifiOff className="w-8 h-8 text-[#FF5520]" />
                <span>NO INTERNET</span>
              </div>
            </div>

            {/* Pop-up 2: NO HELP */}
            {(stage === 'no_help' || stage === 'unidentifiable') && (
              <div className="transform transition-all duration-300 ease-out translate-y-0 opacity-100">
                <div className="inline-flex items-center gap-3 bg-[#FF5520] text-white font-display font-extrabold text-3xl sm:text-4xl md:text-5xl px-6 py-2.5 rounded-2xl border-2 border-[#1E1714] shadow-[6px_6px_0px_#1E1714] uppercase tracking-tight">
                  <HelpCircle className="w-8 h-8 text-white" />
                  <span>NO HELP</span>
                </div>
              </div>
            )}

            {/* Pop-up 3: SURVIVOR UNIDENTIFIABLE */}
            {stage === 'unidentifiable' && (
              <div className="transform transition-all duration-300 ease-out translate-y-0 opacity-100">
                <div className="inline-flex items-center gap-3 bg-[#FAF5EF] text-[#1E1714] font-display font-extrabold text-2xl sm:text-3xl md:text-4xl px-6 py-2.5 rounded-2xl border-2 border-[#1E1714] shadow-[6px_6px_0px_#1E1714] uppercase tracking-tight">
                  <UserX className="w-7 h-7 text-[#FF5520]" />
                  <span>SURVIVOR UNIDENTIFIABLE</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Subtitle Caption: Left-Aligned */}
      <div className="self-start ml-2 md:ml-6 max-w-md bg-[#19120E]/95 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
        <p className="text-xs font-mono tracking-wider uppercase text-white/90">
          {stage === 'collapsing'
            ? 'Violent earthquake tremors shatter the building columns, causing full structural collapse.'
            : stage === 'destruction_pause'
            ? 'Top view inspection confirms: 30 floors of concrete slabs and steel completely leveled.'
            : 'City infrastructure severed. No cellular, no GPS beacon, trapped survivor undetectable by eye.'}
        </p>
      </div>
    </div>
  );
};
