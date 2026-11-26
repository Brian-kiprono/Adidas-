import type { RouteId } from '../data/catalog';
import { ThreeStripeMark } from './Navbar';

interface FooterProps {
  onNavigate: (route: RouteId) => void;
}

const ROUTES_COL_1: Array<{ id: RouteId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop Universe' },
  { id: 'originals', label: 'Adidas Originals' },
  { id: 'running', label: 'Running & Adizero' },
  { id: 'football', label: 'Football Arena' },
];

const ROUTES_COL_2: Array<{ id: RouteId; label: string }> = [
  { id: 'sports', label: 'Sports Categories' },
  { id: 'apparel', label: 'Apparel & Fashion' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'campaigns', label: 'Visual Campaigns' },
  { id: 'story', label: 'Brand Story & Globe' },
];

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#09090B] text-zinc-400">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <ThreeStripeMark className="w-6 h-4" />
              <span className="font-display text-2xl font-bold tracking-wider uppercase">
                ADIDAS
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-zinc-400">
              IMPOSSIBLE IS NOTHING — An independent 3D digital brand showcase, interactive footwear configurator, and visual product study.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Destinations
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              {ROUTES_COL_1.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Collections & Heritage
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              {ROUTES_COL_2.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Independent non-commercial concept project. Original code MIT Licensed. Not affiliated with adidas AG.
          </p>
          <p>Three Stripes & product family names remain trademarks of adidas AG.</p>
        </div>
      </div>
    </footer>
  );
}
