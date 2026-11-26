import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import {
  PRODUCTS,
  type ProductDepartment,
  type ProductItem,
  type SportCategory,
} from '../data/catalog';

interface ShopViewProps {
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: ProductItem) => void;
}

const DEPARTMENTS: Array<'All' | ProductDepartment> = [
  'All',
  'Footwear',
  'Clothing',
  'Accessories',
];

const SPORTS: Array<'All' | SportCategory> = [
  'All',
  'Lifestyle',
  'Running',
  'Football',
  'Basketball',
  'Training',
  'Tennis',
  'Outdoor',
];

export function ShopView({
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
}: ShopViewProps) {
  const [department, setDepartment] = useState<'All' | ProductDepartment>('All');
  const [sport, setSport] = useState<'All' | SportCategory>('All');
  const [only3D, setOnly3D] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (department !== 'All' && p.department !== department) return false;
      if (sport !== 'All' && p.sport !== sport) return false;
      if (only3D && !p.has3DModel) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.family.toLowerCase().includes(q) &&
        !p.subCategory.toLowerCase().includes(q) &&
        !p.collection.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [department, sport, only3D, search]);

  return (
    <div className="min-h-screen bg-[#09090B] pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="border-b border-white/10 pb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
            Adidas Product Universe
          </p>
          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="font-display text-5xl font-bold tracking-tight uppercase text-white sm:text-6xl">
              Complete Archive & Catalog
            </h1>
            <p className="text-xs text-zinc-400 font-mono-tech tabular-nums">
              {filtered.length} of {PRODUCTS.length} product families
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 space-y-4 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              {DEPARTMENTS.map((dep) => (
                <button
                  key={dep}
                  type="button"
                  onClick={() => setDepartment(dep)}
                  className={`h-9 px-4 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    department === dep
                      ? 'bg-white text-[#09090B]'
                      : 'border border-white/15 text-zinc-300 hover:border-white/40'
                  }`}
                >
                  {dep}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setOnly3D((v) => !v)}
                className={`ml-2 h-9 border px-4 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  only3D
                    ? 'border-white bg-white/10 text-white'
                    : 'border-white/15 text-zinc-400 hover:text-white'
                }`}
              >
                Interactive 3D Only
              </button>
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by silhouette or family..."
                aria-label="Filter catalog"
                className="h-10 w-full border border-white/15 bg-[#121215] pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 mr-1">Sport:</span>
            {SPORTS.map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => setSport(sp)}
                className={`h-8 px-3 text-xs transition-colors whitespace-nowrap shrink-0 ${
                  sport === sp
                    ? 'bg-zinc-200 text-[#09090B] font-semibold'
                    : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="mt-12 border border-white/10 bg-[#121215] p-12 text-center">
            <p className="font-display text-2xl uppercase text-white">
              No matching entries
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Clear active filters to inspect the full product universe.
            </p>
            <button
              type="button"
              onClick={() => {
                setDepartment('All');
                setSport('All');
                setOnly3D(false);
                setSearch('');
              }}
              className="mt-5 border border-white/25 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-white hover:text-[#09090B]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
