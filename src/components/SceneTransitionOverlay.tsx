import React from 'react';
import { Plane, Wind, ShieldAlert } from 'lucide-react';

interface SceneTransitionOverlayProps {
  stage: 'transition' | 'arrival';
}

export const SceneTransitionOverlay: React.FC<SceneTransitionOverlayProps> = ({ stage }) => {
  if (stage === 'transition') {
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 z-20 pointer-events-none select-none">
        {/* Top Minimal Flight Telemetry HUD */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="bg-[#1E1714]/90 backdrop-blur-md text-white px-4 py-2 rounded-xl border-2 border-white shadow-[3px_3px_0px_#FF6600] font-display font-extrabold text-xs uppercase flex items-center gap-2">
            <Plane className="w-4 h-4 text-[#FF6600] animate-pulse" />
            <span>LONG-RANGE FLIGHT INBOUND</span>
          </div>

          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-mono text-white/90 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#B9FF66]">
              <Wind className="w-3.5 h-3.5" />
              <span>SPEED: 85 KM/H (CRUISE)</span>
            </span>
            <span>ALTITUDE: 110M</span>
            <span>DISTANCE: 4.2 KM</span>
          </div>
        </div>

        {/* Floating Broadcast Card: MOVED TO LEFT SIDE (Center & Right completely open for the Drone!) */}
        <div className="my-auto self-start ml-2 md:ml-6 max-w-sm md:max-w-md pointer-events-none">
          <div className="bg-[#19120E]/90 backdrop-blur-md p-5 rounded-3xl border-2 border-white/20 shadow-2xl">
            <span className="bg-[#FF6600] text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              DEPLOYMENT PHASE · RAPID TRANSIT
            </span>
            <h2 className="font-display font-extrabold text-2xl text-white uppercase mt-2 tracking-tight">
              SilentResQ Cruising Across Long Distance
            </h2>
            <p className="text-xs font-mono text-white/80 mt-1.5 leading-relaxed">
              Fixed-wing aerofoil mode delivers 3x the range of multirotors, rushing across open sky toward the earthquake epicenter.
            </p>
          </div>
        </div>

        {/* Bottom Clean Flight Bar: Left Aligned */}
        <div className="self-start ml-2 md:ml-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 text-xs font-mono text-white/70">
          TRACKING: SILENTRESQ ORANGE QUADPLANE · CLEAR AIRCRAFT VIEW
        </div>
      </div>
    );
  }

  // stage === 'arrival'
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 z-20 pointer-events-none select-none">
      {/* Top Aircraft Badge */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#1E1714] text-white font-display font-extrabold text-sm md:text-base px-4 py-2 rounded-xl border-2 border-white shadow-[3px_3px_0px_#B9FF66] uppercase">
            SILENTRESQ
          </div>
          <div className="bg-[#FF5520] text-white font-display font-bold text-xs px-3.5 py-2 rounded-xl border-2 border-[#1E1714] uppercase animate-pulse flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>DISASTER ZONE REACHED</span>
          </div>
        </div>

        <div className="bg-[#19120E]/85 backdrop-blur-md text-[#B9FF66] font-mono text-xs px-3.5 py-2 rounded-xl border border-white/20">
          TRANSITIONING: CRUISE → VTOL HOVER SEARCH
        </div>
      </div>

      {/* Bottom Callout Card: MOVED TO LEFT SIDE (Leaves drone & rubble clear in center/right!) */}
      <div className="my-auto self-start ml-2 md:ml-6 max-w-sm md:max-w-md bg-[#FAF5EF]/95 backdrop-blur-md p-5 rounded-3xl border-3 border-[#1E1714] shadow-[6px_6px_0px_#1E1714] pointer-events-auto">
        <div className="flex items-center justify-between text-xs font-mono text-[#FF5520] font-bold uppercase tracking-wider mb-1">
          <span>Target Sector: 30-Story Collapse</span>
          <span>Altitude 45m</span>
        </div>
        <h3 className="font-display font-bold text-xl md:text-2xl text-[#1E1714] leading-tight">
          Positioning Above Leveled Concrete Rubble
        </h3>
        <p className="text-xs text-[#1E1714]/85 mt-2 font-medium leading-relaxed">
          The UAV decelerates, flares aerodynamic angle, and activates 4 VTOL motor pods, locking into precision hover directly over the destroyed 30-floor rubble.
        </p>
      </div>

      {/* Bottom Status */}
      <div className="self-start ml-2 md:ml-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/15 text-xs font-mono text-white/70">
        SENSOR APERTURE ALIGNING WITH DISASTER EPICENTER
      </div>
    </div>
  );
};
