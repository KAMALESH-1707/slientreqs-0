import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Wind } from 'lucide-react';
import { UavModel3D } from './UavModel3D';

interface WhySilentResqSectionProps {
  onReplay: () => void;
  onGoToFinal: () => void;
}

export const WhySilentResqSection: React.FC<WhySilentResqSectionProps> = ({
  onReplay,
  onGoToFinal,
}) => {
  const [flightMode, setFlightMode] = useState<'hover' | 'cruise'>('cruise');

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF5EF] text-[#1E1714] p-4 md:p-6 lg:p-8 flex flex-col justify-between select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b-2 border-[#1E1714]/15 pb-3 shrink-0">
        <div>
          <span className="bg-[#B9FF66] text-[#1E1714] font-display text-[11px] font-bold px-2.5 py-0.5 rounded uppercase">
            Architectural Advantage
          </span>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#1E1714] tracking-tight mt-1">
            WHY SILENTRESQ? · ONE AIRCRAFT, TWO FLIGHT MODES
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReplay}
            className="border-2 border-[#1E1714] bg-white px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase hover:bg-[#1E1714] hover:text-white transition-all shadow-[2px_2px_0px_#1E1714]"
          >
            ↻ Replay Simulation
          </button>
          <button
            onClick={onGoToFinal}
            className="bg-[#1E1714] text-white px-4 py-1.5 rounded-xl font-display font-extrabold text-xs uppercase border-2 border-[#1E1714] hover:bg-[#B9FF66] hover:text-[#1E1714] transition-all shadow-[2px_2px_0px_#FF6600]"
          >
            Summary →
          </button>
        </div>
      </header>

      {/* Main Full-Screen Split View (No Scroll Downs!) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch my-auto py-2 min-h-0">
        {/* Left Column: Side-by-Side Multirotor vs SilentResQ Energy Comparison */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-3">
          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
            {/* Conventional Multirotor */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#1E1714] shadow-[3px_3px_0px_#1E1714] flex flex-col justify-between">
              <div>
                <span className="bg-gray-200 text-gray-800 font-display font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                  Conventional Drone
                </span>
                <h3 className="font-display font-bold text-base text-[#1E1714] mt-1.5">
                  Standard Multirotor
                </h3>
                <p className="text-[11px] text-[#1E1714]/70 mt-1 leading-snug">
                  Continuously uses all 4 motors to fight gravity during forward transit across valleys.
                </p>
              </div>

              <div className="space-y-1 font-mono text-[10px] my-2">
                <div className="p-1 rounded bg-gray-100 flex justify-between">
                  <span>Takeoff</span>
                  <span>Vertical</span>
                </div>
                <div className="p-1 rounded bg-gray-100 flex justify-between">
                  <span>Transit</span>
                  <span className="text-red-500 font-bold">Continuous Drag</span>
                </div>
                <div className="p-1 rounded bg-gray-100 flex justify-between">
                  <span>Search</span>
                  <span>Low Battery</span>
                </div>
              </div>

              <div className="bg-stone-100 p-2.5 rounded-xl border border-stone-300">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span>ENERGY DRAIN</span>
                  <strong className="font-bold">100%</strong>
                </div>
                <div className="h-2.5 bg-stone-300 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-700 w-full" />
                </div>
              </div>
            </div>

            {/* SilentResQ Hybrid VTOL */}
            <div className="bg-[#19120E] text-white p-4 rounded-2xl border-2 border-[#1E1714] shadow-[3px_3px_0px_#FF6600] flex flex-col justify-between">
              <div>
                <span className="bg-[#FF6600] text-white font-display font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                  Our Proposed Design
                </span>
                <h3 className="font-display font-bold text-base text-white mt-1.5">
                  SilentResQ Hybrid VTOL
                </h3>
                <p className="text-[11px] text-white/70 mt-1 leading-snug">
                  VTOL liftoff without runways, wing-borne aerodynamic cruise, and hover search.
                </p>
              </div>

              <div className="space-y-1 font-mono text-[10px] my-2">
                <div className="p-1 rounded bg-white/10 flex justify-between">
                  <span>Takeoff</span>
                  <span className="text-[#B9FF66]">Vertical</span>
                </div>
                <div className="p-1 rounded bg-[#FF6600]/20 text-[#FF6600] flex justify-between">
                  <span>Transit</span>
                  <span className="font-bold">Wing Cruise</span>
                </div>
                <div className="p-1 rounded bg-white/10 flex justify-between">
                  <span>Search</span>
                  <span className="text-[#10B981]">Hover</span>
                </div>
              </div>

              <div className="bg-black/40 p-2.5 rounded-xl border border-white/20">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span>ENERGY DRAIN</span>
                  <strong className="text-[#B9FF66] font-bold">60%</strong>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#B9FF66] w-[60%]" />
                </div>
              </div>
            </div>
          </div>

          {/* 40% Lower Energy Callout */}
          <div className="bg-[#B9FF66] p-3 rounded-2xl border-2 border-[#1E1714] shadow-[3px_3px_0px_#1E1714] flex items-center justify-between">
            <div>
              <div className="font-display font-extrabold text-xl text-[#1E1714]">
                40% LOWER SIMULATED MISSION ENERGY
              </div>
              <p className="text-[10px] font-mono text-[#1E1714]/80">
                Fixed-wing glide drastically reduces motor power draw during long mountain transits.
              </p>
            </div>
            <span className="bg-[#1E1714] text-white px-2.5 py-1 rounded text-xs font-mono font-bold">
              3x RANGE
            </span>
          </div>

          {/* Three Key Architectural Pillars */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-2.5 rounded-xl border border-[#1E1714]/20 text-center">
              <span className="font-display font-bold text-xs block text-[#1E1714]">VERTICAL LIFT</span>
              <span className="text-[10px] font-mono text-[#1E1714]/70">Zero Runway Needed</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#1E1714]/20 text-center">
              <span className="font-display font-bold text-xs block text-[#FF6600]">EFFICIENT TRANSIT</span>
              <span className="text-[10px] font-mono text-[#1E1714]/70">Fixed-Wing Lift</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#1E1714]/20 text-center">
              <span className="font-display font-bold text-xs block text-[#10B981]">PRECISE SEARCH</span>
              <span className="text-[10px] font-mono text-[#1E1714]/70">Hover Thermal AI</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Orange UAV Model Inspector */}
        <div className="lg:col-span-6 bg-[#19120E] text-white p-4 rounded-3xl border-2 border-[#1E1714] shadow-[6px_6px_0px_#1E1714] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="bg-[#FF6600] text-white font-display font-bold text-[10px] uppercase px-2.5 py-0.5 rounded">
                3D CAD Interactive Inspector
              </span>
              <h4 className="font-display font-bold text-lg mt-0.5">
                Our Actual SilentResQ Quadplane
              </h4>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFlightMode('hover')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  flightMode === 'hover' ? 'bg-[#10B981] text-black' : 'bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <RotateCw className="w-3 h-3 inline mr-1" />
                HOVER
              </button>
              <button
                onClick={() => setFlightMode('cruise')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  flightMode === 'cruise' ? 'bg-[#B9FF66] text-black' : 'bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Wind className="w-3 h-3 inline mr-1" />
                CRUISE
              </button>
            </div>
          </div>

          {/* 3D Model Canvas */}
          <div className="w-full flex-1 rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative min-h-[260px]">
            <UavModel3D interactive={true} flightMode={flightMode} />
          </div>

          <div className="mt-2 text-[10px] font-mono text-white/60 text-center">
            Features: Orange aerofoil fuselage, exposed Jetson Nano with heatsink, GPS mast, twin vertical tailfins, and 4 corner VTOL motor pods.
          </div>
        </div>
      </main>

      {/* Subtle Bottom Disclaimer */}
      <footer className="border-t border-[#1E1714]/10 pt-2 text-[10px] font-mono text-[#1E1714]/60 flex items-center justify-between shrink-0">
        <div>Demonstration target. Actual energy consumption depends on aircraft mass, payload, wind, speed, battery, propulsion system and mission profile.</div>
        <div className="font-bold text-[#FF6600]">SMART INDIA HACKATHON 2026</div>
      </footer>
    </div>
  );
};
