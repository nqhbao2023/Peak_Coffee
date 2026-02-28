import React, { useRef } from 'react';
import useScrollEdgeEffect from '../../hooks/useScrollEdgeEffect';

/**
 * ScrollEdgeEffect — renders two fixed glow overlays (top + bottom).
 * Triggered by overscroll intent (wheel at boundary / touch at boundary).
 * Purely visual, pointer-events-none, no text.
 */
const ScrollEdgeEffect = () => {
  const topGlowRef = useRef(null);
  const bottomGlowRef = useRef(null);

  useScrollEdgeEffect({ topGlowRef, bottomGlowRef });

  return (
    <>
      {/* Top edge glow */}
      <div
        ref={topGlowRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-10 z-50 pointer-events-none opacity-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(194, 94, 0, 0.18), transparent)',
        }}
      />

      {/* Bottom edge glow */}
      <div
        ref={bottomGlowRef}
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 h-10 z-50 pointer-events-none opacity-0"
        style={{
          background: 'linear-gradient(to top, rgba(194, 94, 0, 0.18), transparent)',
        }}
      />
    </>
  );
};

export default ScrollEdgeEffect;
