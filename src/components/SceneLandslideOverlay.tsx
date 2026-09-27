import React, { useEffect, useState } from 'react';
import { EyeOff, AlertTriangle } from 'lucide-react';

interface SceneLandslideOverlayProps {
  progress: number; // 0 to 1
}

export const SceneLandslideOverlay: React.FC<SceneLandslideOverlayProps> = ({ progress }) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (progress < 0.35) {
      setStep(0); // Landslide impact on bike
    } else if (progress < 0.55) {
      setStep(1); // Top view & NO INTERNET
    } else if (progress < 0.78) {
      setStep(2); // NO HELP
    } else {
      setStep(3); // SURVIVOR UNIDENTIFIABLE
    }
  }, [progress]);

  const isTopView = progress >= 0.5;

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 z-20 pointer-events-none select-none transition-colors duration-700">
      {/* Top Banner */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 bg-[#FF5520] text-white px-3.5 py-1.5 rounded-xl border-2 border-[#1E1714] shadow-[3px_3px_0px_#1E1714] font-display font-extrabold text-xs uppercase animate-pulse">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span>Catastrophic Mountain Landslide</span>
        </div>

        {/* Top View Aerial Notice when camera looks down */}
        {isTopView && (
          <div className="inline-flex items-center gap-2 bg-black/85 text-white px-4 py-1.5 rounded-xl border-2 border-white/20 text-xs font-mono font-bold shadow-lg animate-fade-in">
            <EyeOff className="w-4 h-4 text-[#FF5520]" />
            <span className="text-[#FF5520]">AERIAL TOP VIEW:</span>
            <span>SURVIVOR BURIED UNDER ROCK DEBRIS · NOT VISIBLE</span>
          </div>
        )}
      </div>

      {/* Main Stark Messages */}
      <div className="my-auto max-w-4xl mx-auto w-full text-center space-y-3">
        {step >= 1 && (
          <div className="transform transition-all duration-500 ease-out translate-y-0 opacity-100">
            <span className="inline-block bg-[#1E1714] text-white font-display font-extrabold text-4xl sm:text-6xl md:text-7xl px-6 py-2.5 rounded-2xl border-2 border-white shadow-[6px_6px_0px_#FF5520] uppercase tracking-tight">
              NO INTERNET
            </span>
          </div>
        )}

        {step >= 2 && (
          <div className="transform transition-all duration-500 ease-out translate-y-0 opacity-100">
            <span className="inline-block bg-[#FF5520] text-white font-display font-extrabold text-4xl sm:text-6xl md:text-7xl px-6 py-2.5 rounded-2xl border-2 border-[#1E1714] shadow-[6px_6px_0px_#1E1714] uppercase tracking-tight">
              NO HELP
            </span>
          </div>
        )}

        {step >= 3 && (
          <div className="transform transition-all duration-500 ease-out translate-y-0 opacity-100">
            <span className="inline-block bg-[#FAF5EF] text-[#1E1714] font-display font-extrabold text-3xl sm:text-5xl md:text-6xl px-6 py-2.5 rounded-2xl border-2 border-[#1E1714] shadow-[6px_6px_0px_#1E1714] uppercase tracking-tight">
              SURVIVOR UNIDENTIFIABLE
            </span>
          </div>
        )}
      </div>

      {/* Bottom Subtitle Caption */}
      <div className="max-w-xl mx-auto bg-[#19120E]/95 text-white backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-center">
        <p className="text-xs font-mono tracking-wider uppercase text-white/90">
          {isTopView
            ? 'Top view confirms: the rider and bike are completely submerged under rock rubble.'
            : 'Falling boulders and soil collapse directly onto the hairpin road.'}
        </p>
      </div>
    </div>
  );
};
