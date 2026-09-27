/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SCENES, StorySceneId } from './types/story';
import { OpeningScreen } from './components/OpeningScreen';
import { CinematicSceneCanvas } from './components/CinematicSceneCanvas';
import { StoryController } from './components/StoryController';
import { SceneJourneyOverlay } from './components/SceneJourneyOverlay';
import { SceneLandslideOverlay } from './components/SceneLandslideOverlay';
import { SceneTransitionOverlay } from './components/SceneTransitionOverlay';
import { SceneVisionSensorOverlay } from './components/SceneVisionSensorOverlay';
import { SceneEdgeProcessingOverlay } from './components/SceneEdgeProcessingOverlay';
import { SceneLocationLoraOverlay } from './components/SceneLocationLoraOverlay';
import { SceneRescueVerifiedOverlay } from './components/SceneRescueVerifiedOverlay';
import { WhySilentResqSection } from './components/WhySilentResqSection';
import { FinalHero } from './components/FinalHero';
import { sound } from './components/AudioEngine';

export default function App() {
  const [currentScene, setCurrentScene] = useState<StorySceneId>('opening');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [visionMode, setVisionMode] = useState<'rgb' | 'thermal' | 'split'>('thermal');

  // Animation frame reference
  const animRef = useRef<number | null>(null);
  const sceneStartTimeRef = useRef<number>(Date.now());
  const elapsedInSceneRef = useRef<number>(0);

  // Play sound when entering dramatic scenes
  useEffect(() => {
    if (currentScene === 'landslide') {
      sound.playRumble();
    } else if (currentScene === 'thermal_sensor') {
      sound.playDetectionChime();
    } else if (currentScene === 'lora_comm') {
      sound.playLoraPulse();
    }
  }, [currentScene]);

  // Handle scene advance
  const goToNextScene = useCallback(() => {
    const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
    if (currentIndex < SCENES.length - 1) {
      const nextScene = SCENES[currentIndex + 1].id;
      setCurrentScene(nextScene);
      setSceneProgress(0);
      elapsedInSceneRef.current = 0;
      sceneStartTimeRef.current = Date.now();
      sound.playClick();
    } else {
      setIsPlaying(false);
    }
  }, [currentScene]);

  const goToPrevScene = useCallback(() => {
    const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
    if (currentIndex > 0) {
      const prevScene = SCENES[currentIndex - 1].id;
      setCurrentScene(prevScene);
      setSceneProgress(0);
      elapsedInSceneRef.current = 0;
      sceneStartTimeRef.current = Date.now();
      sound.playClick();
    }
  }, [currentScene]);

  // Main playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const currentMeta = SCENES.find((s) => s.id === currentScene);
    const duration = currentMeta?.durationMs || 6000;

    // Do not auto-advance on interactive screens (Opening, Why Hybrid, Final Hero)
    if (duration === 0) {
      return;
    }

    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) * playbackSpeed;
      lastTime = now;

      elapsedInSceneRef.current += delta;
      const progress = Math.min(1, elapsedInSceneRef.current / duration);
      setSceneProgress(progress);

      if (progress >= 1) {
        goToNextScene();
      } else {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [currentScene, isPlaying, playbackSpeed, goToNextScene]);

  // Start Experience from Opening Screen
  const handleStartExperience = () => {
    sound.playClick();
    setCurrentScene('journey');
    setSceneProgress(0);
    elapsedInSceneRef.current = 0;
    sceneStartTimeRef.current = Date.now();
    setIsPlaying(true);
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentScene('journey');
    setSceneProgress(0);
    elapsedInSceneRef.current = 0;
    sceneStartTimeRef.current = Date.now();
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    sound.playClick();
    setIsPlaying((prev) => !prev);
  };

  const handleSelectScene = (sceneId: StorySceneId) => {
    sound.playClick();
    setCurrentScene(sceneId);
    setSceneProgress(0);
    elapsedInSceneRef.current = 0;
    sceneStartTimeRef.current = Date.now();
  };

  const handleToggleSpeed = () => {
    sound.playClick();
    setPlaybackSpeed((prev) => (prev === 1.0 ? 1.5 : prev === 1.5 ? 2.0 : 1.0));
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
    if (!nextMuted) sound.playClick();
  };

  // Overall timeline progress percent
  const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
  const totalScenes = SCENES.length;
  const progressPercent = Math.min(100, Math.round(((currentIndex + sceneProgress) / totalScenes) * 100));

  // Render Full Screen Views for Opening, Why Hybrid, and Final Hero
  if (currentScene === 'opening') {
    return (
      <OpeningScreen
        onStartExperience={handleStartExperience}
        onExploreDesign={() => handleSelectScene('why_hybrid')}
      />
    );
  }

  if (currentScene === 'why_hybrid') {
    return (
      <WhySilentResqSection
        onReplay={handleRestart}
        onGoToFinal={() => handleSelectScene('final_hero')}
      />
    );
  }

  if (currentScene === 'final_hero') {
    return (
      <FinalHero
        onReplay={handleRestart}
        onExploreTech={() => handleSelectScene('why_hybrid')}
      />
    );
  }

  // CINEMATIC SIMULATION VIEWPORT (Scenes 1 through 10)
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#1E1714] select-none font-sans">
      {/* Three.js 3D Himalayan Landscape, Landslide & UAV Flight Canvas */}
      <CinematicSceneCanvas
        currentScene={currentScene}
        sceneProgress={sceneProgress}
        visionMode={visionMode}
        className="absolute inset-0 z-0"
      />

      {/* Narrative Scene Overlays based on Current Story Moment */}
      {currentScene === 'journey' && <SceneJourneyOverlay />}

      {currentScene === 'landslide' && (
        <SceneLandslideOverlay progress={sceneProgress} />
      )}

      {currentScene === 'transition' && (
        <SceneTransitionOverlay stage="transition" />
      )}

      {currentScene === 'uav_arrival' && (
        <SceneTransitionOverlay stage="arrival" />
      )}

      {currentScene === 'rgb_sensor' && (
        <SceneVisionSensorOverlay
          mode="rgb"
          onSwitchMode={(mode) => setVisionMode(mode)}
        />
      )}

      {currentScene === 'thermal_sensor' && (
        <SceneVisionSensorOverlay
          mode="thermal"
          onSwitchMode={(mode) => setVisionMode(mode)}
        />
      )}

      {currentScene === 'edge_processing' && (
        <SceneEdgeProcessingOverlay progress={sceneProgress} />
      )}

      {currentScene === 'location_map' && (
        <SceneLocationLoraOverlay stage="location" />
      )}

      {currentScene === 'lora_comm' && (
        <SceneLocationLoraOverlay stage="lora" />
      )}

      {currentScene === 'rescue_verified' && (
        <SceneRescueVerifiedOverlay
          onExploreWhyHybrid={() => handleSelectScene('why_hybrid')}
        />
      )}

      {/* Floating Story Controller HUD Bar */}
      <StoryController
        currentScene={currentScene}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSelectScene={handleSelectScene}
        onNextScene={goToNextScene}
        onPrevScene={goToPrevScene}
        onRestart={handleRestart}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        progressPercent={progressPercent}
      />
    </div>
  );
}
