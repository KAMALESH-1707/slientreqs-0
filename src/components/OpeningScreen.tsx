import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, MousePointer, ShieldCheck, Clock } from 'lucide-react';
import { UavModel3D } from './UavModel3D';

interface OpeningScreenProps {
  onStartExperience: () => void;
  onExploreDesign: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  onStartExperience,
  onExploreDesign,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const [autoRunProgress, setAutoRunProgress] = useState<number>(0);
  const hasTriggeredRef = useRef<boolean>(false);

  // 5-second auto-run timer:
  // If user doesn't click within 5 seconds, it automatically runs!
  // If user clicks, it opens immediately!
  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = 5000; // 5 seconds

    const interval = setInterval(() => {
      if (hasTriggeredRef.current) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / totalDuration) * 100);
      const remaining = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));

      setAutoRunProgress(progress);
      setSecondsRemaining(remaining);

      if (elapsed >= totalDuration) {
        hasTriggeredRef.current = true;
        clearInterval(interval);
        onStartExperience();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onStartExperience]);

  const handleManualPlay = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    onStartExperience();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF5EF] text-[#1E1714] flex flex-col justify-between p-6 md:p-8 select-none relative">
      {/* Top Clean Header */}
      <header className="flex items-center justify-between border-b-2 border-[#1E1714]/15 pb-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <span className="font-display font-extrabold text-2xl tracking-tighter text-[#1E1714]">
            SILENTRESQ
          </span>
          <span className="bg-[#FF6600] text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border border-[#1E1714]/20">
            SIH 2026
          </span>
          <span className="inline-flex items-center gap-1.5 bg-[#B9FF66] text-[#1E1714] font-display font-extrabold text-xs px-3 py-1 rounded-md border border-[#1E1714]/25 uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#1E1714]" />
            VERY INTERACTIVE WEBPAGE
          </span>
        </div>

        <button
          onClick={onExploreDesign}
          className="border-2 border-[#1E1714] bg-white px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider hover:bg-[#1E1714] hover:text-white transition-all shadow-[2px_2px_0px_#1E1714] cursor-pointer"
        >
          View 3D Airframe →
        </button>
      </header>

      {/* Main Center Area: Perfectly Centered Big Play Button Without Any Overlap */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-auto z-20 space-y-5">
        {/* Main Highlight Requested by User */}
        <div className="inline-block bg-[#B9FF66] text-[#1E1714] border-2 border-[#1E1714] shadow-[4px_4px_0px_#1E1714] px-5 py-2 rounded-xl">
          <span className="font-display font-extrabold text-sm md:text-base tracking-wide uppercase">
            ★ EXPLORE THE BEST EXPERIENCE BY OUR PROJECT ★
          </span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#1E1714] leading-[1.02]">
          AUTONOMOUS DISASTER <br />
          <span className="text-[#FF6600] underline decoration-[#1E1714] decoration-4 underline-offset-8">
            EARTHQUAKE RESCUE
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#1E1714]/80 max-w-2xl font-medium">
          Hybrid VTOL UAV with onboard Jetson Nano thermal AI detecting survivors trapped under collapsed 30-story buildings with zero cellular network.
        </p>

        {/* Big Center Play Button with Immediate Click & 5-Second Auto-Run Progress */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <button
            onClick={handleManualPlay}
            className="group relative inline-flex items-center gap-4 bg-[#1E1714] text-white px-10 py-5 rounded-3xl border-3 border-[#1E1714] hover:bg-[#B9FF66] hover:text-[#1E1714] transition-all duration-200 shadow-[8px_8px_0px_#FF6600] active:translate-x-1 active:translate-y-1 cursor-pointer overflow-hidden"
          >
            {/* 5-Second Auto-Run Fill Bar Behind Button */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#FF6600]/25 pointer-events-none transition-all duration-100 ease-linear"
              style={{ width: `${autoRunProgress}%` }}
            />

            <div className="w-14 h-14 rounded-full bg-[#B9FF66] text-[#1E1714] flex items-center justify-center group-hover:bg-[#1E1714] group-hover:text-white transition-colors shadow-md relative z-10">
              <Play className="w-7 h-7 fill-current translate-x-0.5" />
            </div>

            <div className="text-left relative z-10">
              <div className="font-display font-extrabold text-3xl tracking-tight uppercase flex items-center gap-2">
                <span>▶ PLAY</span>
                <span className="text-xs font-mono bg-[#B9FF66] text-[#1E1714] px-2 py-0.5 rounded font-bold">
                  {secondsRemaining}s
                </span>
              </div>
              <div className="text-xs font-mono tracking-widest uppercase opacity-85">
                CLICK TO OPEN IMMEDIATELY OR AUTO-RUNS IN {secondsRemaining}S
              </div>
            </div>
          </button>

          {/* Clean Auto-Run Notice Pill */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#1E1714]/75 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#1E1714]/20 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#FF6600] animate-spin" />
            <span>
              Auto-starting in <strong>{secondsRemaining}s</strong> · Click <strong>▶ PLAY</strong> to start immediately
            </span>
          </div>
        </div>

        {/* Small Clean User Guide */}
        <div className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-2xl border-2 border-[#1E1714] shadow-[3px_3px_0px_#1E1714] max-w-xl text-xs font-mono text-[#1E1714]/85 flex items-center gap-3 justify-center">
          <MousePointer className="w-4 h-4 text-[#FF6600] shrink-0" />
          <span>
            <strong>Controls:</strong> 2.8s auto-play · Use <strong>&lt; Previous</strong> & <strong>Next &gt;</strong> or <strong>Pause</strong> · Toggle <strong>FLIR Thermal</strong>
          </span>
        </div>
      </main>

      {/* Floating 3D UAV Preview Card */}
      <div className="hidden lg:block absolute bottom-6 right-6 w-80 h-44 bg-[#19120E] text-white p-3 rounded-2xl border-2 border-[#1E1714] shadow-[4px_4px_0px_#1E1714] z-10 overflow-hidden">
        <div className="flex justify-between items-center text-[10px] font-mono text-[#B9FF66] mb-1">
          <span className="font-bold">OUR ACTUAL ORANGE CAD DRONE</span>
          <span>DRAG 360°</span>
        </div>
        <div className="w-full h-32 relative">
          <UavModel3D interactive={true} flightMode="hover" />
        </div>
      </div>

      {/* Clean Bottom Footer */}
      <footer className="border-t-2 border-[#1E1714]/15 pt-3 flex items-center justify-between text-xs font-mono text-[#1E1714]/70 shrink-0 z-20">
        <div>SMART INDIA HACKATHON 2026 · URBAN EARTHQUAKE DISASTER MANAGEMENT</div>
        <div className="flex items-center gap-1.5 font-bold text-[#FF6600]">
          <ShieldCheck className="w-4 h-4 text-[#FF6600]" />
          OFFLINE JETSON NANO THERMAL AI UAV
        </div>
      </footer>
    </div>
  );
};
