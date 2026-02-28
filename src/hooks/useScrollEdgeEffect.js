import { useEffect, useRef, useCallback } from 'react';

const GLOW_DURATION = 350; // ms total glow cycle
const BOUNCE_OUT = 150; // ms bounce out
const BOUNCE_BACK = 200; // ms bounce return
const BOUNCE_PX = 6; // px translate
const COOLDOWN = 400; // ms between triggers

/**
 * Hook to detect overscroll intent and trigger edge glow + bounce.
 * - Desktop: wheel events at scroll boundaries
 * - Mobile: touchmove direction at scroll boundaries
 * - Uses rAF throttle, respects prefers-reduced-motion
 *
 * @param {Object} opts
 * @param {React.RefObject} opts.topGlowRef - ref to top glow element
 * @param {React.RefObject} opts.bottomGlowRef - ref to bottom glow element
 * @param {React.RefObject} [opts.containerRef] - optional scroll container ref (defaults to window)
 */
const useScrollEdgeEffect = ({ topGlowRef, bottomGlowRef, containerRef }) => {
  const cooldownRef = useRef({ top: false, bottom: false });
  const reducedMotionRef = useRef(false);
  const touchStartYRef = useRef(0);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;
    const handler = (e) => { reducedMotionRef.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const getScrollInfo = useCallback(() => {
    if (containerRef?.current) {
      const el = containerRef.current;
      return {
        scrollTop: el.scrollTop,
        maxScroll: el.scrollHeight - el.clientHeight,
      };
    }
    return {
      scrollTop: window.scrollY,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight,
    };
  }, [containerRef]);

  const flashGlow = useCallback((edge) => {
    const ref = edge === 'top' ? topGlowRef : bottomGlowRef;
    const el = ref?.current;
    if (!el || cooldownRef.current[edge]) return;

    cooldownRef.current[edge] = true;

    // Animate glow: opacity 0 → 1 → 0
    el.style.transition = `opacity ${GLOW_DURATION / 2}ms ease-out`;
    el.style.opacity = '1';

    setTimeout(() => {
      el.style.transition = `opacity ${GLOW_DURATION / 2}ms ease-in`;
      el.style.opacity = '0';
    }, GLOW_DURATION / 2);

    // Bounce (skip if reduced motion)
    if (!reducedMotionRef.current) {
      const root = document.getElementById('app-root') || document.body;
      const ty = edge === 'top' ? BOUNCE_PX : -BOUNCE_PX;

      root.style.transition = `transform ${BOUNCE_OUT}ms cubic-bezier(0.22, 0.61, 0.36, 1)`;
      root.style.transform = `translateY(${ty}px)`;

      setTimeout(() => {
        root.style.transition = `transform ${BOUNCE_BACK}ms cubic-bezier(0.22, 0.61, 0.36, 1)`;
        root.style.transform = 'translateY(0)';
      }, BOUNCE_OUT);
    }

    // Cooldown
    setTimeout(() => { cooldownRef.current[edge] = false; }, COOLDOWN + GLOW_DURATION);
  }, [topGlowRef, bottomGlowRef]);

  // Desktop: wheel events
  useEffect(() => {
    let ticking = false;

    const onWheel = (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const { scrollTop, maxScroll } = getScrollInfo();

        if (e.deltaY < 0 && scrollTop <= 0) {
          flashGlow('top');
        } else if (e.deltaY > 0 && maxScroll > 0 && scrollTop >= maxScroll - 1) {
          flashGlow('bottom');
        }

        ticking = false;
      });
    };

    const target = containerRef?.current || window;
    target.addEventListener('wheel', onWheel, { passive: true });
    return () => target.removeEventListener('wheel', onWheel);
  }, [getScrollInfo, flashGlow, containerRef]);

  // Mobile: touch events
  useEffect(() => {
    const onTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    let ticking = false;
    const onTouchMove = (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = e.touches[0]?.clientY ?? touchStartYRef.current;
        const deltaY = touchStartYRef.current - currentY; // positive = scrolling down
        const { scrollTop, maxScroll } = getScrollInfo();

        if (deltaY < -10 && scrollTop <= 0) {
          flashGlow('top');
        } else if (deltaY > 10 && maxScroll > 0 && scrollTop >= maxScroll - 1) {
          flashGlow('bottom');
        }

        ticking = false;
      });
    };

    const target = containerRef?.current || window;
    target.addEventListener('touchstart', onTouchStart, { passive: true });
    target.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      target.removeEventListener('touchstart', onTouchStart);
      target.removeEventListener('touchmove', onTouchMove);
    };
  }, [getScrollInfo, flashGlow, containerRef]);
};

export default useScrollEdgeEffect;
