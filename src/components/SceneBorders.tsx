import React from 'react';

/**
 * Decorative vertical side rails — desktop only (hidden below 900px).
 * Rendered once at the app-root level so they persist across scene transitions.
 */
export const SceneBorders: React.FC = () => (
  <>
    {/* Left rail */}
    <div className="scene-border scene-border--left" aria-hidden>
      <div className="sb-line" />
      <div className="sb-orb sb-orb--top" />
      <div className="sb-orb sb-orb--mid" />
      <div className="sb-orb sb-orb--bot" />
      <div className="sb-diamonds">
        <span className="sb-diamond" />
        <span className="sb-diamond" />
        <span className="sb-diamond" />
      </div>
      <div className="sb-vert-text">✦ HAPPY BIRTHDAY ✦</div>
    </div>

    {/* Right rail */}
    <div className="scene-border scene-border--right" aria-hidden>
      <div className="sb-line" />
      <div className="sb-orb sb-orb--top" />
      <div className="sb-orb sb-orb--mid" />
      <div className="sb-orb sb-orb--bot" />
      <div className="sb-diamonds">
        <span className="sb-diamond" />
        <span className="sb-diamond" />
        <span className="sb-diamond" />
      </div>
      <div className="sb-vert-text">✦ WITH LOVE ✦</div>
    </div>
  </>
);
