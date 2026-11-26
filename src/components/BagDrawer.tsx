import { Bookmark, Heart, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { PRODUCTS, type ProductItem, type ShoeConfig } from '../data/catalog';
import type { SavedConcept } from './ShowroomSection';

export interface BagEntry {
  key: string;
  productId: string;
  colorway: string;
  size: string;
  quantity: number;
}

interface BagDrawerProps {
  open: boolean;
  tab: 'bag' | 'wishlist' | 'concepts';
  onChangeTab: (tab: 'bag' | 'wishlist' | 'concepts') => void;
  onClose: () => void;
  bagItems: BagEntry[];
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveBagItem: (key: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  savedConcepts: SavedConcept[];
  onLoadConcept: (config: ShoeConfig) => void;
  onDeleteConcept: (id: string) => void;
  onSelectProduct: (product: ProductItem) => void;
}

export function BagDrawer({
  open,
  tab,
  onChangeTab,
  onClose,
  bagItems,
  onUpdateQty,
  onRemoveBagItem,
  wishlistIds,
  onToggleWishlist,
  savedConcepts,
  onLoadConcept,
  onDeleteConcept,
  onSelectProduct,
}: BagDrawerProps) {
  if (!open) return null;

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Collection Bag, Wishlist, and Saved Concepts"
      className="fixed inset-0 z-50 flex justify-end bg-black/75"
    >
      <div className="flex h-full w-full max-w-md flex-col border-l border-white/15 bg-[#09090B] text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <span className="font-display text-xl font-bold tracking-wide uppercase">
            Studio Collection
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-zinc-300 hover:border-white hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-white/10 bg-[#121215]">
          <button
            type="button"
            onClick={() => onChangeTab('bag')}
            className={`flex h-11 items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
              tab === 'bag' ? 'border-b-2 border-white text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Bag ({bagItems.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('wishlist')}
            className={`flex h-11 items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
              tab === 'wishlist'
                ? 'border-b-2 border-white text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            <span>Wishlist ({wishlistProducts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('concepts')}
            className={`flex h-11 items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
              tab === 'concepts'
                ? 'border-b-2 border-white text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>3D ({savedConcepts.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'bag' && (
            <>
              {bagItems.length === 0 ? (
                <div className="border border-white/10 bg-[#121215] p-8 text-center">
                  <p className="text-sm text-zinc-300">Your collection bag is empty.</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Explore any product card to add items to your local demonstration bag.
                  </p>
                </div>
              ) : (
                bagItems.map((entry) => {
                  const product = PRODUCTS.find((p) => p.id === entry.productId);
                  if (!product) return null;
                  return (
                    <div
                      key={entry.key}
                      className="flex gap-4 border border-white/10 bg-[#121215] p-4"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="h-20 w-24 object-cover bg-[#18181B] shrink-0"
                      />
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display text-lg font-bold uppercase text-white truncate">
                              {product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveBagItem(entry.key)}
                              aria-label={`Remove ${product.name}`}
                              className="text-zinc-500 hover:text-white"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-zinc-400 truncate">
                            {entry.colorway} · {entry.size}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(entry.key, -1)}
                            aria-label="Decrease quantity"
                            className="flex h-7 w-7 items-center justify-center border border-white/15 text-zinc-300 hover:border-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono-tech tabular-nums">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(entry.key, 1)}
                            aria-label="Increase quantity"
                            className="flex h-7 w-7 items-center justify-center border border-white/15 text-zinc-300 hover:border-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {tab === 'wishlist' && (
            <>
              {wishlistProducts.length === 0 ? (
                <div className="border border-white/10 bg-[#121215] p-8 text-center">
                  <p className="text-sm text-zinc-300">No saved wishlist items yet.</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Tap the heart icon on any item to save it locally in your browser.
                  </p>
                </div>
              ) : (
                wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 border border-white/10 bg-[#121215] p-4"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex items-center gap-4 text-left min-w-0 flex-1"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="h-16 w-20 object-cover bg-[#18181B] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] text-zinc-400">
                          {product.collection} · {product.sport}
                        </p>
                        <p className="font-display text-xl font-bold uppercase text-white truncate">
                          {product.name}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="flex h-8 w-8 items-center justify-center border border-white/15 text-zinc-400 hover:text-white shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {tab === 'concepts' && (
            <>
              {savedConcepts.length === 0 ? (
                <div className="border border-white/10 bg-[#121215] p-8 text-center">
                  <p className="text-sm text-zinc-300">No custom 3D concepts saved yet.</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Customize a sneaker in the 3D Showroom and click “Save Visual Concept”.
                  </p>
                </div>
              ) : (
                savedConcepts.map((concept) => (
                  <div
                    key={concept.id}
                    className="border border-white/10 bg-[#121215] p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-lg font-bold uppercase text-white">
                          {concept.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Finish: {concept.config.finish} · Saved {concept.createdAt}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteConcept(concept.id)}
                        aria-label="Delete saved concept"
                        className="text-zinc-500 hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {[
                        concept.config.upperColor,
                        concept.config.stripesColor,
                        concept.config.soleColor,
                        concept.config.lacesColor,
                      ].map((hex, i) => (
                        <span
                          key={`${concept.id}-${i}`}
                          className="h-4 w-4 border border-white/25"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onLoadConcept(concept.config);
                        onClose();
                      }}
                      className="w-full border border-white/20 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-white hover:text-[#09090B] transition-colors"
                    >
                      Load into 3D Studio
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer Notice */}
        <div className="border-t border-white/10 bg-[#121215] p-6">
          <p className="text-xs leading-relaxed text-zinc-400">
            Interactive demonstration only. Selections are persisted locally in your browser. No orders or payments are processed.
          </p>
        </div>
      </div>
    </div>
  );
}
