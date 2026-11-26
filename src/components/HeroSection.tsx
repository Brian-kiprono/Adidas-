import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, Eye, Layers, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { IMAGES, type ShoeConfig } from '../data/catalog';
import { type CameraPreset, ShoeStageCanvas } from '../three/ShoeStageCanvas';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onExploreShowroom: () => void;
  onJumpToConfigurator: () => void;
}

const HERO_SHOE: ShoeConfig = {
  silhouette: 'originals-runner',
  upperColor: '#F4EFE6',
  stripesColor: '#1B1C20',
  soleColor: '#EFE9DD',
  lacesColor: '#F4EFE6',
  accentColor: '#1B1C20',
  finish: 'knit',
  explode: 0,
};

export function HeroSection({
  onExploreShowroom,
  onJumpToConfigurator,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(0);

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('hero');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [revealCount, setRevealCount] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current.children,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const currentShoeConfig: ShoeConfig = {
    ...HERO_SHOE,
    explode: exploded ? 0.85 : 0,
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Impossible Is Nothing 3D Hero"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#09090B] pt-16"
    >
      {/* Subtle architectural floor glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 55% 50%, rgba(244,244,242,0.14) 0%, rgba(9,9,11,0) 60%)',
        }}
      />

      {/* Full-Viewport 3D Sneaker Stage */}
      <div className="relative flex-1 min-h-[540px] w-full">
        <div className="absolute inset-0">
          <ShoeStageCanvas
            config={currentShoeConfig}
            cameraPreset={cameraPreset}
            zoomScale={zoomScale}
            environment="studio"
            autoRotate={autoRotate}
            revealCount={revealCount}
            scrollProgressRef={scrollProgressRef}
            fallbackImage={IMAGES.heroRunner}
            fallbackAlt="Adidas Originals cushioned mesh runner 3D"
          />
        </div>

        {/* Top-Left Minimal Editorial Headline (Zero Obstruction of Center 3D Model) */}
        <div
          ref={headlineRef}
          className="pointer-events-none relative z-10 mx-auto max-w-[1440px] px-4 pt-8 sm:px-8 sm:pt-12"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
            Adidas 3D Brand Universe · Studio 01
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-5xl font-bold leading-[0.94] tracking-tight uppercase text-white sm:text-7xl lg:text-8xl text-balance">
            IMPOSSIBLE IS NOTHING.
          </h1>
          <p className="mt-4 max-w-md text-sm text-zinc-300 sm:text-base">
            Designed for movement. Built for expression.
          </p>

          <div className="pointer-events-auto mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExploreShowroom}
              className="flex h-11 items-center gap-2 bg-white px-6 text-xs font-semibold tracking-wider uppercase text-[#09090B] hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Explore 3D Showroom</span>
              <ArrowDownRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onJumpToConfigurator}
              className="flex h-11 items-center gap-2 border border-white/25 bg-[#09090B]/85 px-5 text-xs font-semibold tracking-wider uppercase text-white hover:border-white transition-colors whitespace-nowrap shrink-0"
            >
              <span>Customize Model</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unified Bottom Control Dock */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-[#121215]/95 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-zinc-400">Angle</span>
            {(
              [
                { id: 'hero', label: '3/4 View' },
                { id: 'profile', label: 'Profile' },
                { id: 'top', label: 'Top' },
                { id: 'sole', label: 'Outsole' },
              ] as const
            ).map((angle) => (
              <button
                key={angle.id}
                type="button"
                onClick={() => setCameraPreset(angle.id)}
                className={`h-8 px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  cameraPreset === angle.id
                    ? 'bg-white text-[#09090B]'
                    : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {angle.label}
              </button>
            ))}

            <div className="ml-2 flex items-center gap-1 border-l border-white/15 pl-3">
              <button
                type="button"
                aria-label="Zoom out 3D model"
                onClick={() => setZoomScale((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
                className="flex h-8 w-8 items-center justify-center border border-white/15 text-zinc-300 hover:border-white/50 hover:text-white"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Zoom in 3D model"
                onClick={() => setZoomScale((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))))}
                className="flex h-8 w-8 items-center justify-center border border-white/15 text-zinc-300 hover:border-white/50 hover:text-white"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setRevealCount((c) => c + 1)}
              className="flex h-8 items-center gap-1.5 border border-white/15 px-3 text-xs font-medium text-zinc-200 hover:border-white/50 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Cinematic Reveal</span>
            </button>

            <button
              type="button"
              onClick={() => setExploded((v) => !v)}
              className={`flex h-8 items-center gap-1.5 border px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                exploded
                  ? 'border-white bg-white text-[#09090B]'
                  : 'border-white/15 text-zinc-200 hover:border-white/50'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{exploded ? 'Assemble' : 'Explode Layers'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAutoRotate((v) => !v)}
              className={`flex h-8 items-center gap-1.5 border px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                autoRotate
                  ? 'border-white/40 text-white'
                  : 'border-white/15 text-zinc-400 hover:text-white'
              }`}
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>{autoRotate ? 'Orbit On' : 'Orbit Off'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
