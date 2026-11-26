import { Heart } from 'lucide-react';
import { useState } from 'react';
import type { ProductItem } from '../data/catalog';

interface ProductCardProps {
  product: ProductItem;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelect: (product: ProductItem) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelect,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group flex flex-col border border-white/10 bg-[#121215] transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/30">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#18181B]">
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {!imgError ? (
            <img
              src={product.image}
              alt={`${product.name} — ${product.collection}`}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1c1c22] to-[#09090b] p-6 text-center">
              <span className="font-display text-2xl font-bold uppercase text-white">
                {product.name}
              </span>
              <span className="mt-1 text-xs text-zinc-400">{product.subCategory}</span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={
            isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`
          }
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center border transition-colors ${
            isWishlisted
              ? 'border-white bg-white text-[#09090B]'
              : 'border-white/20 bg-[#09090B]/85 text-zinc-200 hover:border-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSelect(product)}
        className="flex flex-1 flex-col justify-between p-5 text-left"
      >
        <div>
          {/* Unboxed clean metadata with middot separator (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
            <span>{product.collection}</span>
            <span aria-hidden="true">·</span>
            <span>{product.sport}</span>
            {product.has3DModel && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-zinc-200">3D Viewer</span>
              </>
            )}
          </div>
          <h3 className="mt-1.5 font-display text-2xl font-bold tracking-tight uppercase text-white">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            {product.colorways.slice(0, 4).map((cw) => (
              <span
                key={cw.name}
                title={cw.name}
                className="h-3 w-3 border border-white/25"
                style={{ backgroundColor: cw.hex }}
              />
            ))}
          </div>
          <span className="font-medium text-zinc-300 group-hover:text-white">
            Inspect →
          </span>
        </div>
      </button>
    </article>
  );
}
