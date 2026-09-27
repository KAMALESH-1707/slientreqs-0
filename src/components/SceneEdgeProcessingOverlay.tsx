import React, { useState, useEffect } from 'react';
import { Camera, Cpu, Zap, CheckCircle2, MapPin, Radio } from 'lucide-react';

interface SceneEdgeProcessingOverlayProps {
  progress: number;
}

export const SceneEdgeProcessingOverlay: React.FC<SceneEdgeProcessingOverlayProps> = ({ progress }) => {
  const [activeStep, setActiveStep] = useState(0);

  // Progressive steps: 0=Camera, 1=Jetson, 2=AI Inference, 3=Survivor Detected, 4=Location, 5=Rescue Team
  useEffect(() => {
    const step = Math.min(5, Math.floor(progress * 6));
    setActiveStep(step);
  }, [progress]);

  const pipeline = [
    { label: 'CAMERA IMAGE', sub: 'FLIR LWIR Raw Frame (640x512)', icon: Camera },
    { label: 'JETSON ORIN NANO', sub: 'Onboard Edge Computer (40 TOPS)', icon: Cpu },
    { label: 'EDGE AI PROCESSING', sub: 'Quantized YOLO-Thermal TensorRT', icon: Zap },
    { label: 'SURVIVOR DETECTED', sub: 'Green Target Bounding Box (98.4%)', icon: CheckCircle2, highlight: true },
    { label: 'LOCATION IDENTIFIED', sub: '34°10\'42.1"N, 77°35\'18.4"E', icon: MapPin },
    { label: 'RESCUE TEAM DISPATCH', sub: 'Telemetry Packet Encoded', icon: Radio },
  ];

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 z-20 pointer-events-none select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="bg-[#1E1714] text-white px-5 py-2.5 rounded-2xl border-2 border-white shadow-[4px_4px_0px_#B9FF66] font-display font-extrabold text-sm uppercase flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#B9FF66]" />
          JETSON ORIN NANO · ONBOARD EDGE-AI
        </div>

        <div className="bg-[#FAF5EF]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#1E1714]/20 text-xs font-mono text-[#1E1714] font-bold">
          LOCAL PROCESSING · ZERO CLOUD LATENCY
        </div>
      </div>

      {/* Main Center Cinematic Processing Sequence */}
      <div className="my-auto max-w-4xl mx-auto w-full pointer-events-auto">
        <div className="bg-[#FAF5EF] p-6 md:p-8 rounded-3xl border-4 border-[#1E1714] shadow-[8px_8px_0px_#1E1714] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1E1714]/15 pb-4">
            <div>
              <span className="bg-[#B9FF66] text-[#1E1714] font-display text-xs font-bold px-2.5 py-1 rounded uppercase">
                Step-By-Step Edge Pipeline
              </span>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#1E1714] mt-1.5">
                From Raw Sensor Feed to Ground Rescue
              </h3>
            </div>
            <div className="text-right font-mono text-xs text-[#1E1714]/70">
              SIMULATED PROPOSED WORKFLOW
            </div>
          </div>

          {/* Sequential Pipeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pipeline.map((item, idx) => {
              const Icon = item.icon;
              const isPast = idx < activeStep;
              const isCurrent = idx === activeStep;

              let cardBg = 'bg-white border-[#1E1714]/20 text-[#1E1714]/50 opacity-60';
              let badgeColor = 'bg-gray-100 text-gray-500';

              if (isPast) {
                cardBg = 'bg-[#19120E] text-white border-[#1E1714] shadow-sm';
                badgeColor = 'bg-[#B9FF66] text-black font-bold';
              } else if (isCurrent) {
                cardBg = item.highlight
                  ? 'bg-[#10B981] text-black border-2 border-[#1E1714] shadow-[4px_4px_0px_#1E1714] scale-[1.02] transition-transform'
                  : 'bg-[#FF5520] text-white border-2 border-[#1E1714] shadow-[4px_4px_0px_#1E1714] scale-[1.02] transition-transform';
                badgeColor = 'bg-white text-black font-extrabold';
              }

              return (
                <div
                  key={item.label}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[110px] ${cardBg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${badgeColor}`}>
                      0{idx + 1}
                    </span>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="font-display font-extrabold text-sm md:text-base leading-tight mt-2">
                      {item.label}
                    </h4>
                    <p className="text-[11px] font-mono mt-1 opacity-80 truncate">
                      {item.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Stage Callout Box */}
          <div className="bg-[#19120E] text-white p-4 rounded-2xl border-2 border-[#1E1714] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
              <div>
                <span className="font-display font-bold text-sm text-[#B9FF66]">
                  CURRENT STATUS: {pipeline[activeStep]?.label}
                </span>
                <p className="text-xs text-white/70 font-mono">
                  {pipeline[activeStep]?.sub}
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right font-mono text-xs text-white/60">
              INFERENCE SPEED: 24 FPS
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer & Note */}
      <div className="max-w-xl mx-auto bg-[#FAF5EF]/90 text-[#1E1714] px-4 py-2 rounded-xl border border-[#1E1714]/20 text-center text-[11px] font-mono">
        Simulation of the proposed onboard Jetson Orin Nano edge-AI architecture for SIH 2026.
      </div>
    </div>
  );
};
