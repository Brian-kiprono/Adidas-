import { BookmarkCheck, Check, Layers, RotateCcw, RotateCw, SlidersHorizontal, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  IMAGES,
  type MaterialFinish,
  PRODUCTS,
  type ProductItem,
  type ShoeConfig,
  type ShoeSilhouette,
} from '../data/catalog';
import {
  type CameraPreset,
  ShoeStageCanvas,
  type StageEnvironment,
} from '../three/ShoeStageCanvas';

export interface SavedConcept {
  id: string;
  name: string;
  createdAt: string;
  config: ShoeConfig;
}

interface ShowroomSectionProps {
  activeConfig: ShoeConfig;
  onChangeConfig: (next: ShoeConfig) => void;
  onSaveConcept: (concept: SavedConcept) => void;
  onSelectProduct: (product: ProductItem) => void;
}

interface ModelPreset {
  id: string;
  productId: string;
  name: string;
  subtitle: string;
  environment: StageEnvironment;
  image: string;
  config: ShoeConfig;
}

const SHOWROOM_MODELS: ModelPreset[] = [
  {
    id: 'runner',
    productId: 'originals-cushioned-runner',
    name: 'Originals Runner',
    subtitle: 'Originals · Thick-Tread Mesh',
    environment: 'studio',
    image: IMAGES.heroRunner,
    config: {
      silhouette: 'originals-runner',
      upperColor: '#F4EFE6',
      stripesColor: '#1B1C20',
      soleColor: '#EFE9DD',
      lacesColor: '#F4EFE6',
      accentColor: '#1B1C20',
      finish: 'knit',
      explode: 0,
    },
  },
  {
    id: 'samba',
    productId: 'samba-og',
    name: 'Samba OG',
    subtitle: 'Originals · Indoor Court',
    environment: 'concrete',
    image: IMAGES.samba,
    config: {
      silhouette: 'originals-court',
      upperColor: '#F4F4F2',
      stripesColor: '#111113',
      soleColor: '#9E6E3C',
      lacesColor: '#F4F4F2',
      accentColor: '#111113',
      finish: 'leather',
      explode: 0,
    },
  },
  {
    id: 'superstar',
    productId: 'superstar-classic',
    name: 'Superstar',
    subtitle: 'Originals · Shell Toe',
    environment: 'studio',
    image: IMAGES.superstar,
    config: {
      silhouette: 'superstar-shell',
      upperColor: '#F7F7F5',
      stripesColor: '#101012',
      soleColor: '#EAEAE6',
      lacesColor: '#F7F7F5',
      accentColor: '#101012',
      finish: 'leather',
      explode: 0,
    },
  },
  {
    id: 'adizero',
    productId: 'adizero-pro',
    name: 'Adizero Pro',
    subtitle: 'Performance · Carbon Racer',
    environment: 'track',
    image: IMAGES.adizero,
    config: {
      silhouette: 'running-racer',
      upperColor: '#F4F4F2',
      stripesColor: '#111113',
      soleColor: '#D4FF00',
      lacesColor: '#D4FF00',
      accentColor: '#111113',
      finish: 'knit',
      explode: 0,
    },
  },
  {
    id: 'predator',
    productId: 'predator-elite',
    name: 'Predator Elite',
    subtitle: 'Football · Bladed Firm Ground',
    environment: 'pitch',
    image: IMAGES.predator,
    config: {
      silhouette: 'football-boot',
      upperColor: '#141417',
      stripesColor: '#D4D4D8',
      soleColor: '#27272A',
      lacesColor: '#141417',
      accentColor: '#DC2626',
      finish: 'gloss',
      explode: 0,
    },
  },
];

const UPPER_SWATCHES = [
  { name: 'Cloud White', hex: '#F4F4F2' },
  { name: 'Obsidian Black', hex: '#141417' },
  { name: 'Basalt Grey', hex: '#3F3F46' },
  { name: 'Chalk Sand', hex: '#D6D1C4' },
  { name: 'Collegiate Cobalt', hex: '#1D4ED8' },
  { name: 'Crimson', hex: '#B91C1C' },
];

const SOLE_SWATCHES = [
  { name: 'Natural Gum', hex: '#9E6E3C' },
  { name: 'Chalk Cup', hex: '#EAEAE6' },
  { name: 'Obsidian', hex: '#18181B' },
  { name: 'Solar Volt', hex: '#D4FF00' },
  { name: 'Metallic Silver', hex: '#A1A1AA' },
];

const STRIPE_LACE_SWATCHES = [
  { name: 'Core Black', hex: '#111113' },
  { name: 'Cloud White', hex: '#F4F4F2' },
  { name: 'Silver Metallic', hex: '#D4D4D8' },
  { name: 'Solar Volt', hex: '#D4FF00' },
  { name: 'Crimson', hex: '#DC2626' },
  { name: 'Cobalt', hex: '#2563EB' },
];

const FINISH_OPTIONS: Array<{ id: MaterialFinish; label: string }> = [
  { id: 'leather', label: 'Full-Grain Leather' },
  { id: 'suede', label: 'Brushed Suede' },
  { id: 'knit', label: 'Engineered Knit' },
  { id: 'gloss', label: 'Speed Gloss' },
];

export function ShowroomSection({
  activeConfig,
  onChangeConfig,
  onSaveConcept,
  onSelectProduct,
}: ShowroomSectionProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>('runner');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('hero');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [autoRotate, setAutoRotate] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    const matchBySilhouette = SHOWROOM_MODELS.find(
      (m) => m.config.silhouette === activeConfig.silhouette
    );
    if (matchBySilhouette && matchBySilhouette.id !== selectedModelId) {
      setSelectedModelId(matchBySilhouette.id);
    }
  }, [activeConfig.silhouette, selectedModelId]);

  const activePreset =
    SHOWROOM_MODELS.find((m) => m.id === selectedModelId) ||
    SHOWROOM_MODELS[0];

  const handleSelectModel = (model: ModelPreset) => {
    setSelectedModelId(model.id);
    onChangeConfig({ ...model.config });
    setCameraPreset('hero');
  };

  const handleReset = () => {
    onChangeConfig({ ...activePreset.config });
  };

  const handleSave = () => {
    const concept: SavedConcept = {
      id: `concept-${Date.now()}`,
      name: `${activePreset.name} Studio Concept`,
      createdAt: new Date().toLocaleDateString(),
      config: { ...activeConfig },
    };
    onSaveConcept(concept);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleInspectProduct = () => {
    const product = PRODUCTS.find((p) => p.id === activePreset.productId);
    if (product) onSelectProduct(product);
  };

  const updateField = <K extends keyof ShoeConfig>(key: K, value: ShoeConfig[K]) => {
    onChangeConfig({ ...activeConfig, [key]: value });
  };

  const handleSilhouetteChange = (silhouette: ShoeSilhouette) => {
    const match = SHOWROOM_MODELS.find((m) => m.config.silhouette === silhouette);
    if (match) {
      handleSelectModel(match);
    } else {
      updateField('silhouette', silhouette);
    }
  };

  return (
    <section
      id="showroom-configurator"
      className="border-t border-white/10 bg-[#09090B] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
              3D Footwear Showroom & Concept Customizer
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight uppercase text-white sm:text-6xl text-balance">
              Sculpted In Real Time
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-zinc-400">
            Interactive concept studio. Rotate, inspect exploded layers, and customize materials in WebGL. Not an official Adidas ordering service.
          </p>
        </div>

        {/* Silhouette Switcher Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {SHOWROOM_MODELS.map((model) => {
            const isSelected = activePreset.id === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => handleSelectModel(model)}
                className={`flex flex-col items-start border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-white bg-[#121215]'
                    : 'border-white/10 bg-[#0c0c0f] hover:border-white/30'
                }`}
              >
                <span className="text-xs text-zinc-400">{model.subtitle}</span>
                <span className="mt-1 font-display text-2xl font-bold uppercase text-white">
                  {model.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Showroom Split: Interactive 3D Viewport + Configurator Panel */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          {/* Left 7 Cols: 3D Stage */}
          <div className="relative flex flex-col justify-between border border-white/10 bg-[#121215] lg:col-span-7 min-h-[460px] sm:min-h-[580px]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-zinc-400">
              <span>{activePreset.name} · Interactive 3D Model</span>
              <button
                type="button"
                onClick={handleInspectProduct}
                className="font-medium text-white underline underline-offset-4 hover:text-zinc-300"
              >
                View Product Details
              </button>
            </div>

            <div className="relative flex-1 min-h-[380px]">
              <ShoeStageCanvas
                config={activeConfig}
                cameraPreset={cameraPreset}
                zoomScale={zoomScale}
                environment={activePreset.environment}
                autoRotate={autoRotate}
                fallbackImage={activePreset.image}
                fallbackAlt={activePreset.name}
              />
            </div>

            {/* Bottom Viewport Dock */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0e0e11] px-4 py-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'hero', label: '3/4' },
                    { id: 'profile', label: 'Side' },
                    { id: 'top', label: 'Top' },
                    { id: 'heel', label: 'Heel' },
                    { id: 'sole', label: 'Sole' },
                  ] as const
                ).map((cam) => (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setCameraPreset(cam.id)}
                    className={`h-8 px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      cameraPreset === cam.id
                        ? 'bg-white text-[#09090B]'
                        : 'text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
                <div className="ml-1 flex items-center gap-1 border-l border-white/15 pl-2">
                  <button
                    type="button"
                    aria-label="Zoom out showroom model"
                    onClick={() => setZoomScale((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
                    className="flex h-8 w-8 items-center justify-center border border-white/15 text-zinc-300 hover:border-white/50 hover:text-white"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Zoom in showroom model"
                    onClick={() => setZoomScale((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))))}
                    className="flex h-8 w-8 items-center justify-center border border-white/15 text-zinc-300 hover:border-white/50 hover:text-white"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAutoRotate((v) => !v)}
                className={`flex h-8 items-center gap-1.5 border px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  autoRotate
                    ? 'border-white text-white'
                    : 'border-white/15 text-zinc-400 hover:text-white'
                }`}
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>{autoRotate ? 'Auto-Spin On' : 'Auto-Spin Off'}</span>
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Real-Time Configurator Controls */}
          <div className="flex flex-col justify-between border border-white/10 bg-[#121215] p-6 lg:col-span-5">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-zinc-300" />
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-white">
                    Material & Color Studio
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Upper Material Finish */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2.5">
                  Upper Finish
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FINISH_OPTIONS.map((fin) => (
                    <button
                      key={fin.id}
                      type="button"
                      onClick={() => updateField('finish', fin.id)}
                      className={`h-9 border px-3 text-xs font-medium transition-colors text-left ${
                        activeConfig.finish === fin.id
                          ? 'border-white bg-white text-[#09090B]'
                          : 'border-white/15 text-zinc-300 hover:border-white/40'
                      }`}
                    >
                      {fin.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upper Color */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-zinc-400">Upper Color</span>
                  <span className="font-mono-tech text-zinc-300">
                    {UPPER_SWATCHES.find((s) => s.hex === activeConfig.upperColor)?.name ||
                      activeConfig.upperColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {UPPER_SWATCHES.map((sw) => (
                    <button
                      key={sw.hex}
                      type="button"
                      title={sw.name}
                      aria-label={`Upper color ${sw.name}`}
                      onClick={() => updateField('upperColor', sw.hex)}
                      className={`h-9 w-9 border transition-transform ${
                        activeConfig.upperColor === sw.hex
                          ? 'border-white scale-110 ring-2 ring-white/50'
                          : 'border-white/25 hover:scale-105'
                      }`}
                      style={{ backgroundColor: sw.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Stripes & Laces */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <span className="block text-xs font-medium text-zinc-400 mb-2">
                    Three Stripes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {STRIPE_LACE_SWATCHES.map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        title={sw.name}
                        aria-label={`Stripes color ${sw.name}`}
                        onClick={() => updateField('stripesColor', sw.hex)}
                        className={`h-7 w-7 border ${
                          activeConfig.stripesColor === sw.hex
                            ? 'border-white ring-2 ring-white/50'
                            : 'border-white/25'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-medium text-zinc-400 mb-2">
                    Laces
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {STRIPE_LACE_SWATCHES.map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        title={sw.name}
                        aria-label={`Laces color ${sw.name}`}
                        onClick={() => updateField('lacesColor', sw.hex)}
                        className={`h-7 w-7 border ${
                          activeConfig.lacesColor === sw.hex
                            ? 'border-white ring-2 ring-white/50'
                            : 'border-white/25'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sole & Accent */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <span className="block text-xs font-medium text-zinc-400 mb-2">
                    Sole Tooling
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SOLE_SWATCHES.map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        title={sw.name}
                        aria-label={`Sole color ${sw.name}`}
                        onClick={() => updateField('soleColor', sw.hex)}
                        className={`h-7 w-7 border ${
                          activeConfig.soleColor === sw.hex
                            ? 'border-white ring-2 ring-white/50'
                            : 'border-white/25'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-medium text-zinc-400 mb-2">
                    Heel / Stud Accent
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {STRIPE_LACE_SWATCHES.map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        title={sw.name}
                        aria-label={`Accent color ${sw.name}`}
                        onClick={() => updateField('accentColor', sw.hex)}
                        className={`h-7 w-7 border ${
                          activeConfig.accentColor === sw.hex
                            ? 'border-white ring-2 ring-white/50'
                            : 'border-white/25'
                        }`}
                        style={{ backgroundColor: sw.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Exploded Assembly Inspection */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                    <Layers className="h-3.5 w-3.5" />
                    Exploded Assembly Inspection
                  </span>
                  <span className="font-mono-tech tabular-nums text-zinc-400">
                    {Math.round(activeConfig.explode * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={activeConfig.explode}
                  onChange={(e) => updateField('explode', parseFloat(e.target.value))}
                  aria-label="Exploded view separation"
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>

            {/* Save Concept CTA */}
            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                className="flex h-11 flex-1 items-center justify-center gap-2 bg-white px-5 text-xs font-semibold tracking-wider uppercase text-[#09090B] hover:bg-zinc-200 transition-colors"
              >
                {savedFeedback ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Concept Saved</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    <span>Save Visual Concept</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSilhouetteChange(
                    activeConfig.silhouette === 'running-racer'
                      ? 'originals-court'
                      : 'running-racer'
                  )
                }
                className="flex h-11 items-center justify-center border border-white/20 px-4 text-xs font-medium text-zinc-200 hover:border-white transition-colors whitespace-nowrap shrink-0"
              >
                Switch Chassis
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
