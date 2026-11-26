import { ArrowRight, Box } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import {
  IMAGES,
  PRODUCTS,
  type ProductItem,
  type RouteId,
  type ShoeConfig,
  type SportCategory,
} from '../data/catalog';
import { ShoeStageCanvas } from '../three/ShoeStageCanvas';

interface UniverseSectionProps {
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onNavigate?: (route: RouteId) => void;
  standalone?: boolean;
}

export function OriginalsSection({
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onNavigate,
  standalone = false,
}: UniverseSectionProps) {
  const originalsProducts = PRODUCTS.filter((p) => p.collection === 'Originals');

  return (
    <section
      className={`border-t border-white/10 bg-[#0d0d10] ${
        standalone ? 'pt-24 pb-20 min-h-screen' : 'py-16 sm:py-24'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        {/* Editorial Concrete Streetwear Hero Split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          <div className="flex flex-col justify-between border border-white/10 bg-[#121215] p-8 sm:p-12 lg:col-span-5">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
                Adidas Originals · Urban Concrete Study
              </p>
              <h2 className="mt-3 font-display text-5xl font-bold leading-[0.94] tracking-tight uppercase text-white sm:text-6xl text-balance">
                Born For Sport. Adopted By Street.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-300">
                Samba, Superstar, Gazelle, Campus, and Stan Smith—court geometry stripped to full-grain leather, brushed suede, and serrated three-stripe rhythm.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
              {!standalone && onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('originals')}
                  className="flex h-11 items-center gap-2 bg-white px-6 text-xs font-semibold tracking-wider uppercase text-[#09090B] hover:bg-zinc-200 transition-colors"
                >
                  <span>Enter Originals</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const samba = PRODUCTS.find((p) => p.id === 'samba-og');
                  if (samba) onSelectProduct(samba);
                }}
                className="flex h-11 items-center border border-white/25 px-5 text-xs font-semibold tracking-wider uppercase text-white hover:border-white transition-colors"
              >
                Inspect Samba 3D
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-[#16161a]">
              <img
                src={IMAGES.samba}
                alt="White leather court sneakers with gum sole on concrete steps"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5">
                <p className="text-xs text-zinc-300">Samba OG</p>
                <p className="font-display text-2xl font-bold uppercase text-white">
                  Indoor Court Heritage
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative flex-1 overflow-hidden border border-white/10 bg-[#16161a]">
                <img
                  src={IMAGES.superstar}
                  alt="Shell toe white leather sneaker on concrete pedestal"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4">
                  <p className="text-xs text-zinc-300">Superstar · 1969</p>
                  <p className="font-display text-xl font-bold uppercase text-white">
                    The Shell Toe
                  </p>
                </div>
              </div>
              <div className="relative flex-1 overflow-hidden border border-white/10 bg-[#16161a]">
                <img
                  src={IMAGES.campus}
                  alt="Charcoal suede sneaker on basalt rock"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4">
                  <p className="text-xs text-zinc-300">Campus & Gazelle</p>
                  <p className="font-display text-xl font-bold uppercase text-white">
                    Brushed Suede Craft
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Originals Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(standalone ? originalsProducts : originalsProducts.slice(0, 3)).map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isWishlisted={wishlistIds.includes(item.id)}
              onToggleWishlist={onToggleWishlist}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const RUNNING_SHOE_3D: ShoeConfig = {
  silhouette: 'running-racer',
  upperColor: '#F4F4F2',
  stripesColor: '#111113',
  soleColor: '#D4FF00',
  lacesColor: '#D4FF00',
  accentColor: '#111113',
  finish: 'knit',
  explode: 0,
};

export function RunningSection({
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onNavigate,
  standalone = false,
}: UniverseSectionProps) {
  const [mount3d, setMount3d] = useState(standalone);
  const runningProducts = PRODUCTS.filter((p) => p.sport === 'Running' || p.sport === 'Training');

  return (
    <section
      className={`border-t border-white/10 bg-[#09090B] ${
        standalone ? 'pt-24 pb-20 min-h-screen' : 'py-16 sm:py-24'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        {/* Full-Width Track Campaign Banner */}
        <div className="relative overflow-hidden border border-white/10 bg-[#121215]">
          <img
            src={IMAGES.adizero}
            alt="Ultralight white and solar lime marathon shoes on dark Olympic track"
            referrerPolicy="no-referrer"
            className="h-[340px] sm:h-[460px] w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090B]/95 via-[#09090B]/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
            <p className="text-xs font-medium tracking-widest uppercase text-[#D4FF00]">
              Performance & Running · Adizero & Ultraboost
            </p>
            <h2 className="mt-2 max-w-xl font-display text-4xl font-bold leading-[0.95] uppercase text-white sm:text-6xl text-balance">
              Engineered For Marathon Velocity
            </h2>
            <p className="mt-3 max-w-md text-sm text-zinc-300">
              Carbon-infused propulsion geometry paired with sculpted high-return foam and featherweight race mesh.
            </p>
            {!standalone && onNavigate && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onNavigate('running')}
                  className="flex h-11 items-center gap-2 bg-[#D4FF00] px-6 text-xs font-semibold tracking-wider uppercase text-[#09090B] hover:bg-[#e2ff4d] transition-colors"
                >
                  <span>Explore Performance Lab</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3D Running Shoe Track Stage + Feature Breakdown */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          <div className="relative border border-white/10 bg-[#121215] lg:col-span-7 min-h-[380px] sm:min-h-[440px]">
            {mount3d ? (
              <ShoeStageCanvas
                config={RUNNING_SHOE_3D}
                environment="track"
                autoRotate
                fallbackImage={IMAGES.adizero}
                fallbackAlt="Adizero 3D Performance Runner"
              />
            ) : (
              <div className="relative h-full min-h-[380px] sm:min-h-[440px] w-full overflow-hidden">
                <img
                  src={IMAGES.adizero}
                  alt="Adizero 3D Performance Runner studio preview"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/90 via-[#09090B]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#D4FF00]">
                      Adizero Carbon Chassis
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold uppercase text-white">
                      Interactive 3D Track Stage
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMount3d(true)}
                    className="flex h-10 items-center gap-2 bg-[#D4FF00] px-5 text-xs font-semibold uppercase tracking-wider text-[#09090B] hover:bg-[#e2ff4d] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Box className="h-4 w-4" />
                    <span>Launch 3D Model</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between border border-white/10 bg-[#121215] p-6 sm:p-8 lg:col-span-5">
            <div className="space-y-5">
              <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
                3D Running Architecture
              </p>
              <h3 className="font-display text-3xl font-bold uppercase text-white">
                Adizero & Ultraboost Systems
              </h3>
              <div className="space-y-4 border-t border-white/10 pt-5 text-xs leading-relaxed text-zinc-300">
                <div>
                  <p className="font-semibold text-white">01. Rockered Foam Geometry</p>
                  <p className="mt-1 text-zinc-400">
                    Dual-density sculpted cushioning guides forward transition from heel strike to toe-off.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">02. Carbon Torsion Structure</p>
                  <p className="mt-1 text-zinc-400">
                    Anatomically aligned carbon-composite rods embedded beneath the midfoot minimize energy loss.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">03. Breathable Race Mesh</p>
                  <p className="mt-1 text-zinc-400">
                    Micro-perforated engineered knit provides targeted lockdown without excess mass.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const adizero = PRODUCTS.find((p) => p.id === 'adizero-pro');
                if (adizero) onSelectProduct(adizero);
              }}
              className="mt-6 h-11 w-full border border-white/25 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-[#09090B] transition-colors"
            >
              Inspect Adizero Specifications
            </button>
          </div>
        </div>

        {/* Running Products */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {runningProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isWishlisted={wishlistIds.includes(item.id)}
              onToggleWishlist={onToggleWishlist}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const FOOTBALL_BOOT_3D: ShoeConfig = {
  silhouette: 'football-boot',
  upperColor: '#141417',
  stripesColor: '#D4D4D8',
  soleColor: '#27272A',
  lacesColor: '#141417',
  accentColor: '#DC2626',
  finish: 'gloss',
  explode: 0,
};

export function FootballSection({
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onNavigate,
  standalone = false,
}: UniverseSectionProps) {
  const [mount3d, setMount3d] = useState(standalone);
  const footballProducts = PRODUCTS.filter((p) => p.sport === 'Football');

  return (
    <section
      className={`border-t border-white/10 bg-[#0d0d10] ${
        standalone ? 'pt-24 pb-20 min-h-screen' : 'py-16 sm:py-24'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        {/* Dramatic Pitch Banner */}
        <div className="relative overflow-hidden border border-white/10 bg-[#121215]">
          <img
            src={IMAGES.predator}
            alt="Black silver and crimson football cleats on damp stadium turf under floodlights"
            referrerPolicy="no-referrer"
            className="h-[340px] sm:h-[460px] w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
            <p className="text-xs font-medium tracking-widest uppercase text-red-400">
              Football Arena · Predator · Copa · F50
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-4xl font-bold leading-[0.95] uppercase text-white sm:text-6xl text-balance">
              Precision Under The Floodlights
            </h2>
            <p className="mt-3 max-w-lg text-sm text-zinc-300">
              Seventy-five years of pitch engineering—from 1954 screw-in cleats to tactile Predator strike fins and ultralight F50 speed plates.
            </p>
            {!standalone && onNavigate && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onNavigate('football')}
                  className="flex h-11 items-center gap-2 bg-white px-6 text-xs font-semibold tracking-wider uppercase text-[#09090B] hover:bg-zinc-200 transition-colors"
                >
                  <span>Enter Football Arena</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Interactive 3D Football Boot Viewer */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          <div className="flex flex-col justify-between border border-white/10 bg-[#121215] p-6 sm:p-8 lg:col-span-5">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
                Interactive 3D Football Boot
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold uppercase text-white">
                Predator Strike Anatomy
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-zinc-300">
                Rotate the 3D cleat to examine the insteps’ raised rubber strike fins, stretch-knit ankle collar, metallic split soleplate, and 11-stud firm-ground configuration.
              </p>
              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs text-zinc-400">
                <p>· Predator: High-friction instep strike fins & control geometry</p>
                <p>· Copa: Quilted leather forefoot touch & conical pivot traction</p>
                <p>· F50: Ultralight speed-last chassis for linear acceleration</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const pred = PRODUCTS.find((p) => p.id === 'predator-elite');
                if (pred) onSelectProduct(pred);
              }}
              className="mt-6 h-11 w-full bg-white text-xs font-semibold uppercase tracking-wider text-[#09090B] hover:bg-zinc-200 transition-colors"
            >
              Inspect Predator Details
            </button>
          </div>

          <div className="relative border border-white/10 bg-[#121215] lg:col-span-7 min-h-[380px] sm:min-h-[440px]">
            {mount3d ? (
              <ShoeStageCanvas
                config={FOOTBALL_BOOT_3D}
                environment="pitch"
                autoRotate
                fallbackImage={IMAGES.predator}
                fallbackAlt="Predator 3D Football Boot"
              />
            ) : (
              <div className="relative h-full min-h-[380px] sm:min-h-[440px] w-full overflow-hidden">
                <img
                  src={IMAGES.predator}
                  alt="Predator 3D Football Boot studio preview"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/90 via-[#09090B]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-red-400">
                      11-Stud Bladed Outsole
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold uppercase text-white">
                      Interactive 3D Pitch Stage
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMount3d(true)}
                    className="flex h-10 items-center gap-2 bg-white px-5 text-xs font-semibold uppercase tracking-wider text-[#09090B] hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Box className="h-4 w-4" />
                    <span>Launch 3D Model</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {footballProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isWishlisted={wishlistIds.includes(item.id)}
              onToggleWishlist={onToggleWishlist}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApparelSection({
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onNavigate,
  standalone = false,
}: UniverseSectionProps) {
  const [filter, setFilter] = useState<string>('All');
  const apparel = PRODUCTS.filter((p) => p.department === 'Clothing');
  const categories = ['All', 'Tracksuits', 'Hoodies', 'Jerseys', 'Jackets'];

  const visible =
    filter === 'All' ? apparel : apparel.filter((p) => p.family === filter);

  return (
    <section
      className={`border-t border-white/10 bg-[#09090B] ${
        standalone ? 'pt-24 pb-20 min-h-screen' : 'py-16 sm:py-24'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
              Apparel & Fashion Showroom
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase text-white sm:text-6xl">
              Tailored For Movement
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`h-9 px-4 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  filter === cat
                    ? 'bg-white text-[#09090B]'
                    : 'border border-white/15 text-zinc-300 hover:border-white/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Lookbook Split */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:col-span-5 overflow-hidden border border-white/10 bg-[#121215]">
            <img
              src={IMAGES.trackJacket}
              alt="Model wearing black tricot three-stripe track jacket against concrete wall"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            {visible.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isWishlisted={wishlistIds.includes(item.id)}
                onToggleWishlist={onToggleWishlist}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>

        {!standalone && onNavigate && (
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => onNavigate('apparel')}
              className="flex h-10 items-center gap-2 border border-white/25 px-5 text-xs font-semibold uppercase tracking-wider text-white hover:border-white"
            >
              <span>Full Apparel Showroom</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function AccessoriesView({
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
}: UniverseSectionProps) {
  const accessories = PRODUCTS.filter((p) => p.department === 'Accessories');

  return (
    <div className="min-h-screen bg-[#09090B] pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch border-b border-white/10 pb-12">
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
                Accessories & Utility Equipment
              </p>
              <h1 className="mt-2 font-display text-5xl font-bold uppercase text-white sm:text-6xl">
                Carry & Essentials
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                Ballistic ripstop sports bags, structured backpacks, six-panel twill caps, and arch-support athletic crew socks engineered for transit between pitch, track, and studio.
              </p>
            </div>
          </div>
          <div className="overflow-hidden border border-white/10 bg-[#121215] lg:col-span-7">
            <img
              src={IMAGES.accessories}
              alt="Black ripstop duffel bag, cap, and athletic socks on dark concrete plinth"
              referrerPolicy="no-referrer"
              className="h-[340px] sm:h-[420px] w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accessories.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isWishlisted={wishlistIds.includes(item.id)}
              onToggleWishlist={onToggleWishlist}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SportsView({
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
}: UniverseSectionProps) {
  const [selectedSport, setSelectedSport] = useState<SportCategory>('Football');
  const disciplines: Array<{ sport: SportCategory; summary: string }> = [
    { sport: 'Football', summary: 'Predator control, Copa touch, and F50 speed boots built for pitch geometry.' },
    { sport: 'Running', summary: 'Adizero marathon racers and Ultraboost cushioning engineered for road and track.' },
    { sport: 'Basketball', summary: 'Hardwood heritage silhouettes including Superstar and Forum court builds.' },
    { sport: 'Training', summary: 'Heavyweight fleece, ripstop bags, and resilient session layers.' },
    { sport: 'Tennis', summary: 'Clean perforated-stripe court minimalism rooted in Stan Smith heritage.' },
    { sport: 'Outdoor', summary: 'Weather-sealed alpine shells designed for mountain elevation and trail utility.' },
    { sport: 'Lifestyle', summary: 'Originals terrace and skate icons connecting athletic craft with street style.' },
  ];

  const items = PRODUCTS.filter((p) => p.sport === selectedSport);

  return (
    <div className="min-h-screen bg-[#09090B] pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="border-b border-white/10 pb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
            Sports Disciplines
          </p>
          <h1 className="mt-2 font-display text-5xl font-bold uppercase text-white sm:text-6xl">
            Every Arena. Zero Compromise.
          </h1>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {disciplines.map((d) => (
            <button
              key={d.sport}
              type="button"
              onClick={() => setSelectedSport(d.sport)}
              className={`h-10 px-5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                selectedSport === d.sport
                  ? 'bg-white text-[#09090B]'
                  : 'border border-white/15 text-zinc-300 hover:border-white/40'
              }`}
            >
              {d.sport}
            </button>
          ))}
        </div>

        <div className="mt-6 border border-white/10 bg-[#121215] p-6">
          <p className="text-xs text-zinc-400">{selectedSport} Discipline</p>
          <p className="mt-1 text-base text-white">
            {disciplines.find((d) => d.sport === selectedSport)?.summary}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isWishlisted={wishlistIds.includes(item.id)}
              onToggleWishlist={onToggleWishlist}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
