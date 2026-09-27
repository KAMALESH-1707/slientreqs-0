import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { SCENES, StorySceneId } from '../types/story';

interface StoryControllerProps {
  currentScene: StorySceneId;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectScene: (sceneId: StorySceneId) => void;
  onNextScene: () => void;
  onPrevScene: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  progressPercent: number; // 0 to 100
}

export const StoryController: React.FC<StoryControllerProps> = ({
  currentScene,
  isPlaying,
  onTogglePlay,
  onSelectScene,
  onNextScene,
  onPrevScene,
  onRestart,
  isMuted,
  onToggleMute,
  progressPercent,
}) => {
  const currentSceneIndex = SCENES.findIndex((s) => s.id === currentScene);
  const currentSceneMeta = SCENES[currentSceneIndex] || SCENES[0];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl pointer-events-auto">
      {/* Floating Compact Neo-Brutalist HUD Container - Full screen fitted */}
      <div className="bg-[#19120E]/95 text-white backdrop-blur-md border-2 border-white/20 rounded-2xl px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3">
        {/* Left: Active Scene Indicator (No seconds timeline!) */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="bg-[#B9FF66] text-[#1E1714] font-display text-xs font-extrabold px-2.5 py-1 rounded uppercase tracking-wider shrink-0">
            SCENE {currentSceneIndex + 1}/{SCENES.length}
          </span>
          <span className="text-xs font-mono font-medium text-white/90 truncate hidden sm:inline-block">
            {currentSceneMeta.title}
          </span>
        </div>

        {/* Center: Explicit < Previous, Pause/Play, Next > Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Previous Button */}
          <button
            onClick={onPrevScene}
            disabled={currentSceneIndex <= 1}
            className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/25 disabled:opacity-30 disabled:hover:bg-white/10 text-white font-mono text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:cursor-not-allowed"
            title="Previous Scene"
            aria-label="Previous Scene"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Previous</span>
          </button>

          {/* Pause / Play Button */}
          <button
            onClick={onTogglePlay}
            className="px-4 py-1.5 rounded-xl bg-[#B9FF66] text-[#1E1714] font-display font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#a5f34d] transition-all shadow-[2px_2px_0px_#1E1714] cursor-pointer"
            title={isPlaying ? 'Pause Experience' : 'Resume Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                <span>RESUME</span>
              </>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={onNextScene}
            disabled={currentSceneIndex >= SCENES.length - 1}
            className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/25 disabled:opacity-30 disabled:hover:bg-white/10 text-white font-mono text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:cursor-not-allowed"
            title="Next Scene"
            aria-label="Next Scene"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Audio Mute & Restart */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#B9FF66]" />}
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            title="Restart Experience"
            aria-label="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
