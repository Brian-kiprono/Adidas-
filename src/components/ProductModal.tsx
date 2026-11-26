import { Box, Camera, Check, Heart, ShoppingBag, Sliders, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  PRODUCTS,
  type ProductColorway,
  type ProductItem,
  type ShoeConfig,
} from '../data/catalog';
import { type CameraPreset, ShoeStageCanvas } from '../three/ShoeStageCanvas';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToBag: (product: ProductItem, colorway: string, size: string) => void;
  onCustomizeInStudio: (config: ShoeConfig) => void;
  onSelectRelated: (product: ProductItem) => void;
}

export function ProductModal({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToBag,
  onCustomizeInStudio,
  onSelectRelated,
}: ProductModalProps) {
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('photo');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('hero');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [selectedColorway, setSelectedColorway] = useState<ProductColorway | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (!product) return;
    setViewMode(product.has3DModel ? '3d' : 'photo');
    setCameraPreset('hero');
    setZoomScale(1);
    setSelectedColorway(product.colorways[0] || null);
    setSelectedSize(product.sizes[2] || product.sizes[0] || 'OSFA');
    setActivePhotoIndex(0);
    setAddedFeedback(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const cw = selectedColorway || product.colorways[0];
  const photos = [product.image, ...(product.secondaryImage ? [product.secondaryImage] : [])];

  const shoeConfig: ShoeConfig = {
    silhouette: product.silhouette || 'originals-court',
    upperColor: cw?.hex || '#F4F4F2',
    stripesColor: cw?.stripesHex || '#111113',
    soleColor: cw?.soleHex || '#EAEAE6',
    lacesColor: cw?.hex || '#F4F4F2',
    accentColor: cw?.stripesHex || '#111113',
    finish: product.defaultFinish || 'leather',
    explode: 0,
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.sport === product.sport || p.collection === product.collection)
  ).slice(0, 3);

  const handleAdd = () => {
    onAddToBag(product, cw?.name || 'Default', selectedSize);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} product detail`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 sm:p-6 overflow-y-auto"
    >
      <div className="relative flex w-full max-w-6xl flex-col border border-white/15 bg-[#09090B] text-white max-h-[100svh] sm:max-h-[92vh] overflow-y-auto">
        {/* Top Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#09090B]/95 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>{product.department}</span>
            <span aria-hidden="true">·</span>
            <span>{product.collection}</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-200">{product.name}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-zinc-300 hover:border-white hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 7 Cols: Interactive 3D Viewer OR Studio Photography */}
          <div className="flex flex-col border-b border-white/10 bg-[#121215] lg:col-span-7 lg:border-b-0 lg:border-r">
            {product.has3DModel && (
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`flex h-8 items-center gap-1.5 px-3 text-xs font-medium transition-colors ${
                      viewMode === '3d'
                        ? 'bg-white text-[#09090B]'
                        : 'text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <Box className="h-3.5 w-3.5" />
                    <span>3D Interactive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('photo')}
                    className={`flex h-8 items-center gap-1.5 px-3 text-xs font-medium transition-colors ${
                      viewMode === 'photo'
                        ? 'bg-white text-[#09090B]'
                        : 'text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Studio Gallery</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onCustomizeInStudio(shoeConfig);
                    onClose();
                  }}
                  className="flex h-8 items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Open in Customizer</span>
                </button>
              </div>
            )}

            <div className="relative h-[380px] sm:h-[480px] w-full">
              {product.has3DModel && viewMode === '3d' ? (
                <>
                  <ShoeStageCanvas
                    config={shoeConfig}
                    cameraPreset={cameraPreset}
                    zoomScale={zoomScale}
                    environment={
                      product.sport === 'Running'
                        ? 'track'
                        : product.sport === 'Football'
                        ? 'pitch'
                        : 'concrete'
                    }
                    autoRotate={false}
                    fallbackImage={product.image}
                    fallbackAlt={product.name}
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                    <div className="flex items-center gap-1 bg-[#09090B]/90 border border-white/15 p-1 pointer-events-auto">
                      {(
                        [
                          { id: 'hero', label: '3/4' },
                          { id: 'profile', label: 'Side' },
                          { id: 'top', label: 'Top' },
                          { id: 'sole', label: 'Sole' },
                        ] as const
                      ).map((cam) => (
                        <button
                          key={cam.id}
                          type="button"
                          onClick={() => setCameraPreset(cam.id)}
                          className={`h-7 px-2.5 text-[11px] font-medium transition-colors ${
                            cameraPreset === cam.id
                              ? 'bg-white text-[#09090B]'
                              : 'text-zinc-300 hover:bg-white/10'
                          }`}
                        >
                          {cam.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 bg-[#09090B]/90 border border-white/15 p-1 pointer-events-auto">
                      <button
                        type="button"
                        aria-label="Zoom out product model"
                        onClick={() => setZoomScale((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
                        className="flex h-7 w-7 items-center justify-center text-zinc-300 hover:text-white"
                      >
                        <ZoomOut className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Zoom in product model"
                        onClick={() => setZoomScale((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))))}
                        className="flex h-7 w-7 items-center justify-center text-zinc-300 hover:text-white"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative h-full w-full bg-[#16161a]">
                  <img
                    src={photos[activePhotoIndex] || product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  {photos.length > 1 && (
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {photos.map((src, idx) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setActivePhotoIndex(idx)}
                          className={`h-12 w-16 overflow-hidden border ${
                            activePhotoIndex === idx ? 'border-white' : 'border-white/25 opacity-70'
                          }`}
                        >
                          <img
                            src={src}
                            alt={`${product.name} view ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right 5 Cols: Product Specification & Actions */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>{product.collection}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.sport}</span>
                </div>
                <h2 className="mt-1 font-display text-4xl font-bold tracking-tight uppercase text-white">
                  {product.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {product.shortDescription}
                </p>
              </div>

              {/* Verified Colorways */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-medium text-zinc-400">Colorway</span>
                  <span className="text-zinc-200">{cw?.name}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colorways.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedColorway(item)}
                      aria-label={`Select colorway ${item.name}`}
                      className={`h-9 w-9 border transition-transform ${
                        cw?.name === item.name
                          ? 'border-white scale-110 ring-2 ring-white/40'
                          : 'border-white/25 hover:scale-105'
                      }`}
                      style={{ backgroundColor: item.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <span className="block text-xs font-medium text-zinc-400 mb-2.5">
                  Reference Size Range
                </span>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-9 border px-2 text-xs font-mono-tech transition-colors ${
                        selectedSize === size
                          ? 'border-white bg-white text-[#09090B] font-semibold'
                          : 'border-white/15 text-zinc-300 hover:border-white/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials & Characteristics */}
              <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Materials
                  </h3>
                  <ul className="mt-2 space-y-1 text-xs text-zinc-300">
                    {product.materials.map((m) => (
                      <li key={m}>· {m}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Characteristics
                  </h3>
                  <ul className="mt-2 space-y-1 text-xs text-zinc-300">
                    {product.characteristics.map((c) => (
                      <li key={c}>· {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex h-12 flex-1 items-center justify-center gap-2 bg-white px-5 text-xs font-semibold tracking-wider uppercase text-[#09090B] hover:bg-zinc-200 transition-colors"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added to Bag Demo</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Collection Bag</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="Toggle wishlist"
                  className={`flex h-12 w-12 items-center justify-center border transition-colors ${
                    isWishlisted
                      ? 'border-white bg-white text-[#09090B]'
                      : 'border-white/25 text-white hover:border-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">{product.referenceNote}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-white/10 bg-[#0d0d10] p-6 sm:p-8">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
              Related From The Universe
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {relatedProducts.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onSelectRelated(rel)}
                  className="flex items-center gap-4 border border-white/10 bg-[#121215] p-3 text-left hover:border-white/35 transition-colors"
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    referrerPolicy="no-referrer"
                    className="h-16 w-20 object-cover shrink-0 bg-[#18181B]"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] text-zinc-400 truncate">
                      {rel.collection} · {rel.sport}
                    </p>
                    <p className="font-display text-lg font-bold uppercase text-white truncate">
                      {rel.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
