import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import type { RouteId } from '../data/catalog';

interface NavbarProps {
  activeRoute: RouteId;
  onNavigate: (route: RouteId) => void;
  bagCount: number;
  wishlistCount: number;
  onOpenBag: (initialTab?: 'bag' | 'wishlist' | 'concepts') => void;
  onOpenSearch: () => void;
}

const PRIMARY_NAV: Array<{ id: RouteId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'originals', label: 'Originals' },
  { id: 'running', label: 'Performance' },
  { id: 'story', label: 'Brand Story' },
];

const UNIVERSE_ROUTES: Array<{ id: RouteId; label: string; category: string }> = [
  { id: 'home', label: 'Home', category: '3D Experience' },
  { id: 'shop', label: 'Shop All', category: 'Product Universe' },
  { id: 'originals', label: 'Originals', category: 'Streetwear Editorial' },
  { id: 'running', label: 'Running', category: 'Adizero & Ultraboost' },
  { id: 'football', label: 'Football', category: 'Predator · Copa · F50' },
  { id: 'sports', label: 'Sports', category: 'All Disciplines' },
  { id: 'apparel', label: 'Apparel', category: 'Clothing Showroom' },
  { id: 'accessories', label: 'Accessories', category: 'Equipment & Carry' },
  { id: 'campaigns', label: 'Campaigns', category: 'Visual Storytelling' },
  { id: 'story', label: 'Brand Story', category: 'Heritage & 3D Globe' },
];

export function ThreeStripeMark({ className = 'w-6 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <polygon points="3,24 9,24 14,15 8,15" />
      <polygon points="13,24 19,24 26,9 20,9" />
      <polygon points="23,24 29,24 36,2 30,2" />
    </svg>
  );
}

export function Navbar({
  activeRoute,
  onNavigate,
  bagCount,
  wishlistCount,
  onOpenBag,
  onOpenSearch,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelectRoute = (route: RouteId) => {
    onNavigate(route);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 border-b border-white/10 bg-[#09090B]/95">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleSelectRoute('home')}
            className="flex items-center gap-2.5 text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Adidas Impossible Is Nothing Home"
          >
            <ThreeStripeMark className="w-6 h-4 text-white" />
            <span className="font-display text-2xl font-bold tracking-wider uppercase">
              ADIDAS
            </span>
          </button>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-400"
          >
            {PRIMARY_NAV.map((item) => {
              const isActive =
                activeRoute === item.id ||
                (item.id === 'running' && (activeRoute === 'football' || activeRoute === 'sports'));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectRoute(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    isActive ? 'text-white' : 'hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-white" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Compact Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center text-zinc-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenBag('bag')}
              className="flex h-10 items-center gap-2 border border-white/20 bg-white px-4 text-xs font-semibold tracking-wide text-[#09090B] hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="font-mono-tech tabular-nums">
                Bag ({bagCount})
              </span>
              {wishlistCount > 0 && (
                <span className="hidden sm:inline text-zinc-600 font-mono-tech tabular-nums">
                  · {wishlistCount} Saved
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open universe navigation menu"
              className="flex h-10 items-center gap-2 border border-white/15 px-3 text-xs font-medium text-zinc-200 hover:border-white/40 hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">Index</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full Universe Route Index Overlay */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Adidas Universe Directory"
          className="fixed inset-0 z-50 flex flex-col bg-[#09090B] text-white overflow-y-auto"
        >
          <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-8 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <ThreeStripeMark className="w-6 h-4 text-white" />
              <span className="font-display text-2xl font-bold tracking-wider uppercase">
                ADIDAS UNIVERSE
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-10 w-10 items-center justify-center border border-white/15 text-zinc-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 gap-8 px-4 py-10 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
            {UNIVERSE_ROUTES.map((route, idx) => {
              const isCurrent = activeRoute === route.id;
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => handleSelectRoute(route.id)}
                  className={`group flex flex-col justify-between border p-6 text-left transition-colors ${
                    isCurrent
                      ? 'border-white bg-[#121215]'
                      : 'border-white/10 bg-[#0d0d10] hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono-tech tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{route.category}</span>
                  </div>
                  <div className="mt-8 flex items-end justify-between">
                    <span className="font-display text-3xl font-bold tracking-tight uppercase text-white group-hover:translate-x-1 transition-transform">
                      {route.label}
                    </span>
                    <span className="text-xs text-zinc-400 group-hover:text-white">
                      Enter →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t border-white/10 px-4 py-6 text-xs text-zinc-500 sm:px-8">
            <span>Independent 3D Digital Brand Concept · Not an official store</span>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenBag('wishlist');
                }}
                className="text-zinc-300 hover:text-white"
              >
                Wishlist ({wishlistCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenBag('concepts');
                }}
                className="text-zinc-300 hover:text-white"
              >
                Saved 3D Concepts
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
