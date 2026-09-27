import React, { useEffect, useRef } from 'react';
import { ThreeSceneController, QualityProfile } from './ThreeSceneController';

interface CinematicCanvasProps {
  sceneIndex: number;
  quality: QualityProfile;
  corridorScrollProgress?: number;
  onControllerReady?: (controller: ThreeSceneController) => void;
}

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({
  sceneIndex,
  quality,
  corridorScrollProgress = 0,
  onControllerReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ThreeSceneController | null>(null);
  const [webGLError, setWebGLError] = React.useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Check WebGL availability
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLError(true);
        return;
      }

      const controller = new ThreeSceneController(containerRef.current, quality);
      controllerRef.current = controller;
      if (onControllerReady) {
        onControllerReady(controller);
      }

      return () => {
        controller.destroy();
        controllerRef.current = null;
      };
    } catch (err) {
      console.error('Failed to initialize 3D scene:', err);
      setWebGLError(true);
    }
  }, []);

  // Update scene & quality changes
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setQuality(quality);
      controllerRef.current.updateScene(sceneIndex, corridorScrollProgress);
    }
  }, [sceneIndex, quality, corridorScrollProgress]);

  if (webGLError) {
    // Elegant 2D CSS ambient fallback as required by Section 32
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#09080e]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(217,180,115,0.15),transparent_70%)] animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl filter" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-stone-700/15 rounded-full blur-3xl filter" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
