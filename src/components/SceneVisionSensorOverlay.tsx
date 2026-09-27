import React, { useState } from 'react';
import { Eye, Flame, CheckCircle, Crosshair } from 'lucide-react';

interface SceneVisionSensorOverlayProps {
  mode: 'rgb' | 'thermal' | 'split';
  onSwitchMode?: (mode: 'rgb' | 'thermal' | 'split') => void;
}

export const SceneVisionSensorOverlay: React.FC<SceneVisionSensorOverlayProps> = ({
  mode = 'thermal',
  onSwitchMode,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(mode === 'rgb' ? 100 : mode === 'thermal' ? 0 : 50);

  const rgbImage = '/src/assets/images/mountain_landslide_debris_1790529166240.jpg';
  const thermalImage = '/src/assets/images/aerial_thermal_flir_survivor_1790529179672.jpg';

  const isThermalActive = sliderPos < 90;

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8 z-20 pointer-events-none select-none">
      {/* Top Bar: Sensor Header & Mode Switcher */}
      <div className="flex items-center justify-between gap-4 flex-wrap pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="bg-[#1E1714] text-white px-4 py-2 rounded-xl border-2 border-white shadow-[3px_3px_0px_#B9FF66] font-display font-extrabold text-sm uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            LIVE SENSOR FRAME
          </div>

          <div className="hidden sm:inline-block bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1E1714]/20 text-xs font-mono text-[#1E1714]">
            ALTITUDE: 42M · NADIR -85° · FLIR LWIR CORE
          </div>
        </div>

        {/* Sensor Spectrum Buttons */}
        <div className="flex items-center bg-[#19120E]/90 backdrop-blur-md p-1.5 rounded-2xl border-2 border-white/20 gap-1">
          <button
            onClick={() => {
              setSliderPos(100);
              onSwitchMode?.('rgb');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              sliderPos > 70 ? 'bg-white text-[#1E1714] shadow-sm' : 'text-white/70 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            RGB CAMERA
          </button>

          <button
            onClick={() => {
              setSliderPos(50);
              onSwitchMode?.('split');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              sliderPos > 20 && sliderPos < 80 ? 'bg-[#FF5520] text-white shadow-sm' : 'text-white/70 hover:text-white'
            }`}
          >
            SPLIT 50/50
          </button>

          <button
            onClick={() => {
              setSliderPos(0);
              onSwitchMode?.('thermal');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              sliderPos < 30 ? 'bg-[#10B981] text-black shadow-sm' : 'text-white/70 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            THERMAL SENSOR
          </button>
        </div>
      </div>

      {/* Center Simulated Live High-Fidelity UAV Sensor Feed Viewport */}
      <div className="my-auto mx-auto w-full max-w-5xl aspect-video relative rounded-3xl overflow-hidden border-4 border-[#1E1714] shadow-[10px_10px_0px_#1E1714] pointer-events-auto bg-black">
        {/* Background Layer: FLIR Thermal Sensor Image */}
        <img
          src={thermalImage}
          alt="Thermal FLIR UAV Sensor View"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Foreground Layer: Normal Optical RGB Camera Image (Clipped by slider) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={rgbImage}
            alt="RGB Optical UAV Sensor View"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', minWidth: '100%', height: '100%' }}
          />

          {/* Label inside RGB side */}
          <div className="absolute top-4 left-4 bg-black/70 text-white font-mono text-xs px-3 py-1.5 rounded-lg border border-white/20">
            RGB OPTICAL · NORMAL SIGHT INSUFFICIENT
          </div>
        </div>

        {/* Split-Screen Draggable Slider Divider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#B9FF66] shadow-[0_0_12px_#B9FF66] cursor-ew-resize z-20"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1E1714] border-2 border-[#B9FF66] text-[#B9FF66] flex items-center justify-center text-xs font-bold shadow-md">
            ⇄
          </div>
        </div>

        {/* Label inside Thermal side */}
        <div className="absolute top-4 right-4 bg-black/80 text-[#10B981] font-mono text-xs px-3 py-1.5 rounded-lg border border-[#10B981]/40 flex items-center gap-2 z-10">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          LWIR 8-14μm IRONBOW THERMAL
        </div>

        {/* Thermal Scanline Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#10B981]/10 to-transparent h-16 pointer-events-none animate-scan z-10" />

        {/* SURVIVOR DETECTION GREEN HIGHLIGHT (Visible when thermal spectrum is engaged) */}
        {isThermalActive && (
          <div className="absolute top-[48%] right-[28%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto">
            {/* Target Reticle in GREEN */}
            <div className="relative border-2 border-[#10B981] bg-[#10B981]/20 rounded-2xl p-4 shadow-[0_0_35px_rgba(16,185,129,0.7)] animate-thermal">
              {/* Corner Crosshair Accents */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#10B981]" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#10B981]" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#10B981]" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#10B981]" />

              <div className="flex items-center gap-2">
                <span className="bg-[#10B981] text-black font-display font-extrabold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
                  SURVIVOR DETECTED
                </span>
                <span className="text-xs font-mono text-[#10B981] font-bold">
                  98.4% CONF
                </span>
              </div>

              <div className="text-xs font-mono text-white mt-1.5 space-y-0.5">
                <div>TEMP: <strong className="text-[#10B981]">36.8°C</strong> (AMBIENT 18.2°C)</div>
                <div className="text-white/70 text-[11px]">THERMAL DELTA: +18.6°C HEAT ANOMALY</div>
              </div>
            </div>
          </div>
        )}

        {/* HUD Crosshairs in Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <Crosshair className="w-16 h-16 text-white stroke-[1]" />
        </div>

        {/* Interactive Slider Input Overlay */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-x-0 bottom-0 h-8 opacity-0 cursor-ew-resize z-30"
          title="Drag slider to compare RGB vs Thermal"
        />
      </div>

      {/* Bottom Editorial Callout */}
      <div className="max-w-2xl mx-auto bg-[#FAF5EF]/95 backdrop-blur-md p-4 md:p-5 rounded-2xl border-2 border-[#1E1714] shadow-[4px_4px_0px_#1E1714] pointer-events-auto flex items-center justify-between gap-4">
        <div>
          <span className="bg-[#B9FF66] text-[#1E1714] font-display text-[11px] font-bold px-2 py-0.5 rounded uppercase">
            Thermal Advantage
          </span>
          <h4 className="font-display font-bold text-lg md:text-xl text-[#1E1714] mt-1">
            {sliderPos > 70 ? 'Normal RGB vision fails to pierce mountain debris.' : 'Thermal sensor reveals sub-surface human body heat.'}
          </h4>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#10B981] text-black flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
