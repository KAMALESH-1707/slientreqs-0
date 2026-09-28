import React from 'react';
import { MapPin, Radio, WifiOff, ShieldCheck, ArrowRight } from 'lucide-react';

interface SceneLocationLoraOverlayProps {
  stage: 'location' | 'lora';
}

export const SceneLocationLoraOverlay: React.FC<SceneLocationLoraOverlayProps> = ({ stage }) => {
  const mapImage = '/src/assets/images/city_earthquake_rescue_grid_map_1790585276798.jpg';

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 z-20 pointer-events-none select-none">
      {/* Top Status Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="bg-[#1E1714] text-white px-4 py-2 rounded-xl border-2 border-white shadow-[3px_3px_0px_#B9FF66] font-display font-extrabold text-sm uppercase flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#10B981]" />
            SURVIVOR GEOLOCATION
          </div>
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1E1714]/20 text-xs font-mono text-[#1E1714]">
            SIMULATED COORDINATES: 28°36'12.4"N, 77°12'45.8"E
          </div>
        </div>

        {/* Offline Connectivity Indicators */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-[#FF5520] text-white px-3 py-1.5 rounded-xl border-2 border-[#1E1714] flex items-center gap-1.5 font-bold">
            <WifiOff className="w-3.5 h-3.5" />
            <span>CITY CELLULAR ✕ OFFLINE</span>
          </div>

          <div className="bg-[#B9FF66] text-[#1E1714] px-3 py-1.5 rounded-xl border-2 border-[#1E1714] flex items-center gap-1.5 font-bold animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>LoRa ● ACTIVE (433MHz)</span>
          </div>
        </div>
      </div>

      {/* Center Topographic Geolocation & Offline Relay Map */}
      <div className="my-auto max-w-4xl mx-auto w-full pointer-events-auto">
        <div className="bg-[#FAF5EF] p-6 md:p-8 rounded-3xl border-4 border-[#1E1714] shadow-[10px_10px_0px_#1E1714] relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Topographic Map View with Pulsing Green Pin */}
            <div className="md:col-span-7 relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#1E1714] bg-stone-900 shadow-inner">
              <img
                src={mapImage}
                alt="City Earthquake Disaster Rescue Map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
              />

              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#1E1714_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

              {/* Pulsing GREEN Survivor Pin */}
              <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#10B981]/30 animate-ping absolute -top-3 -left-3" />
                  <div className="w-6 h-6 rounded-full bg-[#10B981] border-2 border-white shadow-[0_0_16px_#10B981] flex items-center justify-center text-black font-bold text-xs">
                    ●
                  </div>
                </div>

                <div className="mt-2 bg-[#1E1714] text-white px-3 py-1 rounded-lg border border-[#10B981] text-[11px] font-mono whitespace-nowrap shadow-md">
                  <strong className="text-[#10B981]">30-STORY TOWER RUINS</strong>
                  <div>28°36'12.4"N, 77°12'45.8"E (Floor 12 Void)</div>
                </div>
              </div>

              {/* UAV Orbit Marker */}
              <div className="absolute top-[26%] left-[30%] z-20 bg-[#1E1714]/90 text-[#B9FF66] border border-white/20 px-2.5 py-1 rounded text-[10px] font-mono">
                SILENTRESQ (URBAN HOVER)
              </div>
            </div>

            {/* Offline Transmission Architecture Card */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="bg-[#B9FF66] text-[#1E1714] font-display text-xs font-bold px-2.5 py-1 rounded uppercase">
                  Offline LoRa Relay
                </span>
                <h3 className="font-display font-extrabold text-2xl text-[#1E1714] mt-2 leading-tight">
                  Zero Network. <br />
                  Direct Urban Link.
                </h3>
                <p className="text-xs text-[#1E1714]/80 mt-2 font-medium leading-relaxed">
                  When earthquake tremors sever fiber and cellular towers, SilentResQ broadcasts compressed coordinates and thermal evidence over long-range LoRa to urban emergency command.
                </p>
              </div>

              {/* Visual 3-Node Hop Path */}
              <div className="bg-[#19120E] text-white p-4 rounded-2xl border-2 border-[#1E1714] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[#B9FF66]">
                  <span className="font-bold">SILENTRESQ UAV</span>
                  <span>433 MHz LoRa TX</span>
                </div>
                <div className="flex justify-center text-white/40">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <span>URBAN RELAY HUB</span>
                  <span className="text-[#B9FF66]">PACKET ACK</span>
                </div>
                <div className="flex justify-center text-white/40">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
                <div className="flex items-center justify-between text-[#10B981] font-bold">
                  <span>DISASTER RESCUE UNIT</span>
                  <span className="bg-[#10B981] text-black px-1.5 py-0.5 rounded text-[10px]">
                    NOTIFIED ✓
                  </span>
                </div>
              </div>

              {/* Success Pill */}
              <div className="bg-[#10B981]/15 border-2 border-[#10B981] text-[#1E1714] p-3 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#10B981] shrink-0" />
                <div className="text-xs font-medium">
                  <strong className="font-bold text-[#10B981] uppercase block">
                    USAR Teams Dispatched
                  </strong>
                  Target coordinates: 12th floor structural void.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Disclaimer */}
      <div className="max-w-xl mx-auto bg-[#FAF5EF]/90 text-[#1E1714] px-4 py-2 rounded-xl border border-[#1E1714]/20 text-center text-[11px] font-mono">
        Simulated proposed coordinates and telemetry protocol. No live cellular connection required.
      </div>
    </div>
  );
};
