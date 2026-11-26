import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PRODUCTS, type ProductItem } from '../data/catalog';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export function SearchOverlay({ open, onClose, onSelectProduct }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = query.trim().toLowerCase();
  const matches = trimmed
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.family.toLowerCase().includes(trimmed) ||
          p.collection.toLowerCase().includes(trimmed) ||
          p.sport.toLowerCase().includes(trimmed) ||
          p.subCategory.toLowerCase().includes(trimmed)
      )
    : PRODUCTS.slice(0, 6);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Adidas Product Universe"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 p-4 pt-20 overflow-y-auto"
    >
      <div className="w-full max-w-3xl border border-white/15 bg-[#09090B]">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Samba, Superstar, Adizero, Predator, Hoodies, Running..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6">
          <p className="mb-4 text-xs text-zinc-400">
            {trimmed
              ? `${matches.length} result${matches.length === 1 ? '' : 's'} for "${query}"`
              : 'Featured Silhouettes & Collections'}
          </p>

          {matches.length === 0 ? (
            <div className="border border-white/10 bg-[#121215] p-8 text-center text-sm text-zinc-400">
              No matching product families found. Try Samba, Adizero, Predator, or Tracksuits.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {matches.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-4 border border-white/10 bg-[#121215] p-3 text-left hover:border-white/40 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="h-16 w-20 object-cover bg-[#18181B] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] text-zinc-400">
                      {product.department} · {product.sport}
                    </p>
                    <p className="font-display text-xl font-bold uppercase text-white truncate">
                      {product.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
