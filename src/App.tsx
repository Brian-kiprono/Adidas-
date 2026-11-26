import { Component, type ErrorInfo, lazy, type ReactNode, Suspense, useEffect, useState } from 'react';
import { type BagEntry } from './components/BagDrawer';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { type SavedConcept, ShowroomSection } from './components/ShowroomSection';
import { type ProductItem, type RouteId, type ShoeConfig } from './data/catalog';

const ShopView = lazy(() => import('./pages/ShopView').then((m) => ({ default: m.ShopView })));
const CampaignsView = lazy(() => import('./pages/StoryViews').then((m) => ({ default: m.CampaignsView })));
const BrandStorySection = lazy(() =>
  import('./pages/StoryViews').then((m) => ({ default: m.BrandStorySection }))
);
const OriginalsSection = lazy(() =>
  import('./pages/UniverseViews').then((m) => ({ default: m.OriginalsSection }))
);
const RunningSection = lazy(() =>
  import('./pages/UniverseViews').then((m) => ({ default: m.RunningSection }))
);
const FootballSection = lazy(() =>
  import('./pages/UniverseViews').then((m) => ({ default: m.FootballSection }))
);
const SportsView = lazy(() =>
  import('./pages/UniverseViews').then((m) => ({ default: m.SportsView }))
);
const ApparelSection = lazy(() =>
  import('./pages/UniverseViews').then((m) => ({ default: m.ApparelSection }))
);
const AccessoriesView = lazy(() =>
  import('./pages/UniverseViews').then((m) => ({ default: m.AccessoriesView }))
);
const ProductModal = lazy(() =>
  import('./components/ProductModal').then((m) => ({ default: m.ProductModal }))
);
const BagDrawer = lazy(() =>
  import('./components/BagDrawer').then((m) => ({ default: m.BagDrawer }))
);
const SearchOverlay = lazy(() =>
  import('./components/SearchOverlay').then((m) => ({ default: m.SearchOverlay }))
);

class ViewportErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] p-8 text-center text-white">
          <h1 className="font-display text-4xl font-bold uppercase">
            Display Recovery
          </h1>
          <p className="mt-3 max-w-md text-sm text-zinc-400">
            A rendering interruption occurred. Reload the experience to restore the 3D studio.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#09090B]"
          >
            Reload Studio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const VALID_ROUTES: RouteId[] = [
  'home',
  'shop',
  'originals',
  'running',
  'football',
  'sports',
  'apparel',
  'accessories',
  'campaigns',
  'story',
];

function getInitialRoute(): RouteId {
  const hash = window.location.hash.replace('#', '') as RouteId;
  return VALID_ROUTES.includes(hash) ? hash : 'home';
}

function readLocalJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_STUDIO_CONFIG: ShoeConfig = {
  silhouette: 'originals-runner',
  upperColor: '#F4EFE6',
  stripesColor: '#1B1C20',
  soleColor: '#EFE9DD',
  lacesColor: '#F4EFE6',
  accentColor: '#1B1C20',
  finish: 'knit',
  explode: 0,
};

export default function App() {
  const [route, setRoute] = useState<RouteId>(getInitialRoute);
  const [studioConfig, setStudioConfig] = useState<ShoeConfig>(DEFAULT_STUDIO_CONFIG);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'bag' | 'wishlist' | 'concepts'>('bag');

  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    readLocalJson<string[]>('adidas_universe_wishlist', ['samba-og', 'adizero-pro'])
  );
  const [bagItems, setBagItems] = useState<BagEntry[]>(() =>
    readLocalJson<BagEntry[]>('adidas_universe_bag', [])
  );
  const [savedConcepts, setSavedConcepts] = useState<SavedConcept[]>(() =>
    readLocalJson<SavedConcept[]>('adidas_universe_concepts', [])
  );

  useEffect(() => {
    try {
      localStorage.setItem('adidas_universe_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('adidas_universe_bag', JSON.stringify(bagItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [bagItems]);

  useEffect(() => {
    try {
      localStorage.setItem('adidas_universe_concepts', JSON.stringify(savedConcepts));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedConcepts]);

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash.replace('#', '') as RouteId;
      if (VALID_ROUTES.includes(next)) {
        setRoute(next);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (next: RouteId) => {
    setRoute(next);
    window.location.hash = next === 'home' ? '' : next;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToShowroom = () => {
    if (route !== 'home') {
      setRoute('home');
      window.location.hash = '';
      setTimeout(() => {
        document
          .getElementById('showroom-configurator')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      document
        .getElementById('showroom-configurator')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addToBag = (product: ProductItem, colorway: string, size: string) => {
    const key = `${product.id}::${colorway}::${size}`;
    setBagItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { key, productId: product.id, colorway, size, quantity: 1 }];
    });
  };

  const updateBagQty = (key: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeBagItem = (key: string) => {
    setBagItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSaveConcept = (concept: SavedConcept) => {
    setSavedConcepts((prev) => [concept, ...prev]);
  };

  const handleDeleteConcept = (id: string) => {
    setSavedConcepts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLoadConceptIntoStudio = (config: ShoeConfig) => {
    setStudioConfig({ ...config });
    scrollToShowroom();
  };

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ViewportErrorBoundary>
      <div className="min-h-screen bg-[#09090B] text-[#F4F4F2]">
        <Navbar
          activeRoute={route}
          onNavigate={navigateTo}
          bagCount={totalBagCount}
          wishlistCount={wishlistIds.length}
          onOpenBag={(tab = 'bag') => {
            setDrawerTab(tab);
            setDrawerOpen(true);
          }}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main>
          <Suspense
            fallback={
              <div className="min-h-[260px] border-t border-white/10 bg-[#09090B]" />
            }
          >
            {route === 'home' && (
              <>
                <HeroSection
                  onExploreShowroom={scrollToShowroom}
                  onJumpToConfigurator={scrollToShowroom}
                />
                <ShowroomSection
                  activeConfig={studioConfig}
                  onChangeConfig={setStudioConfig}
                  onSaveConcept={handleSaveConcept}
                  onSelectProduct={setSelectedProduct}
                />
                <OriginalsSection
                  wishlistIds={wishlistIds}
                  onToggleWishlist={toggleWishlist}
                  onSelectProduct={setSelectedProduct}
                  onNavigate={navigateTo}
                />
                <RunningSection
                  wishlistIds={wishlistIds}
                  onToggleWishlist={toggleWishlist}
                  onSelectProduct={setSelectedProduct}
                  onNavigate={navigateTo}
                />
                <FootballSection
                  wishlistIds={wishlistIds}
                  onToggleWishlist={toggleWishlist}
                  onSelectProduct={setSelectedProduct}
                  onNavigate={navigateTo}
                />
                <ApparelSection
                  wishlistIds={wishlistIds}
                  onToggleWishlist={toggleWishlist}
                  onSelectProduct={setSelectedProduct}
                  onNavigate={navigateTo}
                />
                <CampaignsView />
                <BrandStorySection />
              </>
            )}

            {route === 'shop' && (
              <ShopView
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onSelectProduct={setSelectedProduct}
              />
            )}

            {route === 'originals' && (
              <OriginalsSection
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onSelectProduct={setSelectedProduct}
                standalone
              />
            )}

            {route === 'running' && (
              <RunningSection
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onSelectProduct={setSelectedProduct}
                standalone
              />
            )}

            {route === 'football' && (
              <FootballSection
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onSelectProduct={setSelectedProduct}
                standalone
              />
            )}

            {route === 'sports' && (
              <SportsView
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onSelectProduct={setSelectedProduct}
              />
            )}

            {route === 'apparel' && (
              <ApparelSection
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onSelectProduct={setSelectedProduct}
                standalone
              />
            )}

            {route === 'accessories' && (
              <AccessoriesView
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onSelectProduct={setSelectedProduct}
              />
            )}

            {route === 'campaigns' && <CampaignsView standalone />}

            {route === 'story' && <BrandStorySection standalone />}
          </Suspense>
        </main>

        <Footer onNavigate={navigateTo} />

        <Suspense fallback={null}>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              isWishlisted={wishlistIds.includes(selectedProduct.id)}
              onToggleWishlist={toggleWishlist}
              onAddToBag={addToBag}
              onCustomizeInStudio={handleLoadConceptIntoStudio}
              onSelectRelated={setSelectedProduct}
            />
          )}

          {drawerOpen && (
            <BagDrawer
              open={drawerOpen}
              tab={drawerTab}
              onChangeTab={setDrawerTab}
              onClose={() => setDrawerOpen(false)}
              bagItems={bagItems}
              onUpdateQty={updateBagQty}
              onRemoveBagItem={removeBagItem}
              wishlistIds={wishlistIds}
              onToggleWishlist={toggleWishlist}
              savedConcepts={savedConcepts}
              onLoadConcept={handleLoadConceptIntoStudio}
              onDeleteConcept={handleDeleteConcept}
              onSelectProduct={setSelectedProduct}
            />
          )}

          {searchOpen && (
            <SearchOverlay
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              onSelectProduct={setSelectedProduct}
            />
          )}
        </Suspense>
      </div>
    </ViewportErrorBoundary>
  );
}
