import React, { useState, useEffect } from 'react';
import { soundManager } from '../audio/soundManager';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioToggle: React.FC = () => {
  const [muted, setMuted] = useState(soundManager.getMuted());

  useEffect(() => {
    // Sync initial state
    setMuted(soundManager.getMuted());
  }, []);

  const handleToggle = () => {
    const isNowActive = soundManager.toggleMute();
    setMuted(!isNowActive);
  };

  return (
    <button
      onClick={handleToggle}
      className="audio-toggle-btn"
      aria-label={muted ? "Unmute audio experience" : "Mute audio"}
      title={muted ? "Turn music & sound on" : "Turn sound off"}
    >
      {muted ? (
        <VolumeX size={18} className="audio-icon-muted" />
      ) : (
        <div className="audio-icon-active-wrap">
          <Volume2 size={18} className="audio-icon-playing" />
          <span className="sound-wave-dot dot-1" />
          <span className="sound-wave-dot dot-2" />
        </div>
      )}
      <span className="audio-toggle-label">{muted ? "Sound Off" : "Sound On"}</span>
    </button>
  );
};
