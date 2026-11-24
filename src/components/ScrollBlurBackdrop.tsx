import { useEffect, useRef } from 'react';

interface ScrollBlurBackdropProps {
  coverSrc: string;
}

export function ScrollBlurBackdrop({ coverSrc }: ScrollBlurBackdropProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;

    const updateBlur = () => {
      const el = containerRef.current;
      if (!el) return;

      const y = window.scrollY || 0;
      const progress = Math.min(1, Math.max(0, y / 340));

      const blurPx = (14 + progress * 32).toFixed(1);
      const sat = (1.15 + progress * 0.25).toFixed(2);
      const opacity = (0.24 + progress * 0.22).toFixed(2);
      const scale = (1.04 + progress * 0.08).toFixed(3);
      const veilBlur = (progress * 18).toFixed(1);
      const veilAlpha = (0.14 + progress * 0.42).toFixed(2);

      el.style.setProperty('--scroll-blur', `${blurPx}px`);
      el.style.setProperty('--scroll-sat', sat);
      el.style.setProperty('--scroll-opacity', opacity);
      el.style.setProperty('--scroll-scale', scale);
      el.style.setProperty('--veil-blur', `${veilBlur}px`);
      el.style.setProperty('--veil-alpha', veilAlpha);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateBlur);
    };

    updateBlur();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f2f2f2]"
    >
      {/* Ambient cover artwork layer that smoothly blurs on scroll */}
      <img
        src={coverSrc}
        alt=""
        referrerPolicy="no-referrer"
        className="rp-scroll-backdrop absolute inset-0 w-full h-full object-cover"
      />
      {/* Progressive frosted veil over the background only (never affects #rp-bar) */}
      <div className="rp-scroll-veil absolute inset-0" />
    </div>
  );
}
