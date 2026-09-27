import React from 'react';
import { RotateCcw, ArrowUpRight, Sparkles } from 'lucide-react';

interface FinalHeroProps {
  onReplay: () => void;
  onExploreTech: () => void;
}

export const FinalHero: React.FC<FinalHeroProps> = ({ onReplay, onExploreTech }) => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF5EF] text-[#1E1714] p-4 md:p-6 lg:p-8 flex flex-col justify-between select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b-2 border-[#1E1714]/15 pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="font-display font-extrabold text-2xl tracking-tighter text-[#1E1714]">
            SILENTRESQ
          </span>
          <span className="bg-[#B9FF66] text-[#1E1714] font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#1E1714]/20 uppercase">
            SIH 2026
          </span>
        </div>

        <button
          onClick={onReplay}
          className="border-2 border-[#1E1714] bg-white px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase hover:bg-[#1E1714] hover:text-white transition-all shadow-[2px_2px_0px_#1E1714] flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>↻ Replay Experience</span>
        </button>
      </header>

      {/* Main Massive Editorial Typography (Fitted inside 100vh) */}
      <main className="flex-1 flex flex-col justify-center items-center text-center my-auto py-2 space-y-4 max-w-5xl mx-auto min-h-0">
        <div className="inline-block bg-[#10B981] text-black font-display font-extrabold text-xs uppercase px-3.5 py-1 rounded-full border-2 border-[#1E1714] shadow-[2px_2px_0px_#1E1714]">
          Mission Accomplished · Survivor Located
        </div>

        <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tighter uppercase text-[#1E1714]">
          FROM ALERT <br />
          <span className="text-[#FF6600] underline decoration-[#1E1714] decoration-6 underline-offset-4">
            TO SURVIVOR.
          </span>
        </h1>

        <div>
          <span className="inline-block bg-[#1E1714] text-white font-display font-extrabold text-2xl sm:text-4xl px-7 py-2.5 rounded-2xl border-2 border-[#1E1714] shadow-[6px_6px_0px_#B9FF66] tracking-tight uppercase">
            SILENTRESQ
          </span>
        </div>

        {/* 4 Pillars in Editorial Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl w-full pt-2">
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#1E1714] shadow-[2px_2px_0px_#1E1714] text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase">PILLAR 01</div>
            <div className="font-display font-extrabold text-base text-[#1E1714] mt-0.5">
              AUTONOMOUS
            </div>
            <p className="text-[10px] text-[#1E1714]/70 font-mono mt-0.5">
              Auto flight plan & search orbit
            </p>
          </div>

          <div className="bg-[#B9FF66] p-3.5 rounded-2xl border-2 border-[#1E1714] shadow-[2px_2px_0px_#1E1714] text-center">
            <div className="text-[10px] font-mono text-[#1E1714]/60 uppercase">PILLAR 02</div>
            <div className="font-display font-extrabold text-base text-[#1E1714] mt-0.5">
              AI-POWERED
            </div>
            <p className="text-[10px] text-[#1E1714]/80 font-mono mt-0.5">
              Jetson Orin Nano thermal net
            </p>
          </div>

          <div className="bg-[#19120E] text-white p-3.5 rounded-2xl border-2 border-[#1E1714] shadow-[2px_2px_0px_#1E1714] text-center">
            <div className="text-[10px] font-mono text-white/50 uppercase">PILLAR 03</div>
            <div className="font-display font-extrabold text-base text-white mt-0.5">
              OFFLINE
            </div>
            <p className="text-[10px] text-white/70 font-mono mt-0.5">
              Direct LoRa radio mesh telemetry
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#1E1714] shadow-[2px_2px_0px_#1E1714] text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase">PILLAR 04</div>
            <div className="font-display font-extrabold text-base text-[#1E1714] mt-0.5">
              GEO-TAGGED
            </div>
            <p className="text-[10px] text-[#1E1714]/70 font-mono mt-0.5">
              Simulated coordinates for rescue
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onReplay}
            className="group flex items-center gap-2.5 bg-[#1E1714] text-white px-7 py-3.5 rounded-2xl font-display font-extrabold text-base uppercase border-2 border-[#1E1714] hover:bg-[#B9FF66] hover:text-[#1E1714] transition-all shadow-[5px_5px_0px_#10B981] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" />
            <span>↻ REPLAY EXPERIENCE</span>
          </button>

          <button
            onClick={onExploreTech}
            className="group flex items-center gap-1.5 text-xs font-bold text-[#1E1714] hover:text-[#FF6600] transition-colors py-2"
          >
            <span className="underline underline-offset-4 font-mono uppercase">Review Orange CAD Airframe Specs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#1E1714]/15 pt-2 flex items-center justify-between text-[11px] font-mono text-[#1E1714]/60 flex-wrap shrink-0">
        <div>SMART INDIA HACKATHON 2026 · DISASTER RESPONSE</div>
        <div>TEAM SILENTRESQ · PROTOTYPE DEMONSTRATION</div>
      </footer>
    </div>
  );
};
