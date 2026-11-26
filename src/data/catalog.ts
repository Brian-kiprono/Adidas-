export type RouteId =
  | 'home'
  | 'shop'
  | 'originals'
  | 'running'
  | 'football'
  | 'sports'
  | 'apparel'
  | 'accessories'
  | 'campaigns'
  | 'story';

export type ProductDepartment = 'Footwear' | 'Clothing' | 'Accessories';

export type SportCategory =
  | 'Lifestyle'
  | 'Running'
  | 'Football'
  | 'Basketball'
  | 'Training'
  | 'Tennis'
  | 'Outdoor';

export type ShoeSilhouette =
  | 'originals-runner'
  | 'originals-court'
  | 'superstar-shell'
  | 'running-racer'
  | 'football-boot';

export type MaterialFinish = 'leather' | 'suede' | 'knit' | 'gloss';

export interface ShoeConfig {
  silhouette: ShoeSilhouette;
  upperColor: string;
  stripesColor: string;
  soleColor: string;
  lacesColor: string;
  accentColor: string;
  finish: MaterialFinish;
  explode: number;
}

export interface ProductColorway {
  name: string;
  hex: string;
  stripesHex: string;
  soleHex: string;
}

export interface ProductItem {
  id: string;
  name: string;
  family: string;
  department: ProductDepartment;
  subCategory: string;
  sport: SportCategory;
  collection: 'Originals' | 'Performance' | 'Football' | 'Sportswear';
  shortDescription: string;
  materials: string[];
  characteristics: string[];
  sizes: string[];
  colorways: ProductColorway[];
  image: string;
  secondaryImage?: string;
  has3DModel: boolean;
  silhouette?: ShoeSilhouette;
  defaultFinish?: MaterialFinish;
  referenceNote: string;
}

export const IMAGES = {
  heroRunner:
    '/assets/aistudio/Adidas_Originals_Genuine_Running_Shoes_for_Men_-_Autumn_Lightweight_Thick-Tread_Cushioned_Leisure_6bd3c1d4.jpg',
  samba: '/src/assets/images/originals_editorial_samba_1795712924187.jpg',
  campus: '/src/assets/images/originals_campus_suede_1795712924511.jpg',
  superstar: '/src/assets/images/originals_superstar_shell_1795712941884.jpg',
  adizero: '/src/assets/images/running_adizero_track_v2_1795712940838.jpg',
  predator: '/src/assets/images/football_predator_pitch_v2_1795712940881.jpg',
  trackJacket: '/src/assets/images/apparel_track_jacket_1795712926006.jpg',
  hoodie: '/src/assets/images/apparel_performance_hoodie_1795712926049.jpg',
  jersey: '/src/assets/images/apparel_jersey_court_1795712941178.jpg',
  accessories: '/src/assets/images/accessories_duffel_pack_1795712927135.jpg',
  heritage: '/src/assets/images/heritage_archive_workshop_1795712927072.jpg',
} as const;

export const PRODUCTS: ProductItem[] = [
  // FOOTWEAR — ORIGINALS
  {
    id: 'originals-cushioned-runner',
    name: 'Originals Cushion Runner',
    family: 'Originals',
    department: 'Footwear',
    subCategory: 'Originals',
    sport: 'Lifestyle',
    collection: 'Originals',
    shortDescription:
      'Breathable cream honeycomb mesh runner framed by dove-grey overlays, charcoal structural three-stripe cage, and a sculpted thick-tread EVA midsole.',
    materials: [
      'Open-cell breathable mesh upper',
      'Matte synthetic leather overlays',
      'Sculpted EVA cushioned midsole',
      'Lugged carbon-rubber outsole',
    ],
    characteristics: [
      'Multi-layer midfoot stripe cage',
      'Sculpted heel bevel & wave midsole',
      'Woven heel pull-tab loop',
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colorways: [
      {
        name: 'Warm Cream / Dove Grey / Charcoal',
        hex: '#F4EFE6',
        stripesHex: '#1B1C20',
        soleHex: '#EFE9DD',
      },
      {
        name: 'Obsidian / Slate / Chalk',
        hex: '#18181B',
        stripesHex: '#D4D4D8',
        soleHex: '#E5E2D9',
      },
      {
        name: 'Concrete Grey / Core Black',
        hex: '#9CA3AF',
        stripesHex: '#141417',
        soleHex: '#F4F4F2',
      },
    ],
    image: IMAGES.heroRunner,
    secondaryImage: IMAGES.campus,
    has3DModel: true,
    silhouette: 'originals-runner',
    defaultFinish: 'knit',
    referenceNote: 'Interactive 3D hero runner reconstruction inspired by the featured reference.',
  },
  {
    id: 'samba-og',
    name: 'Samba OG',
    family: 'Samba',
    department: 'Footwear',
    subCategory: 'Originals',
    sport: 'Lifestyle',
    collection: 'Originals',
    shortDescription:
      'Low-profile indoor pitch silhouette defined by its suede T-toe overlay, serrated leather three stripes, and natural gum rubber cupsole.',
    materials: ['Full-grain leather upper', 'Suede T-toe overlay', 'Synthetic lining', 'Gum rubber outsole'],
    characteristics: ['Low-top court profile', 'Reinforced toe geometry', 'Heritage indoor traction tread'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colorways: [
      { name: 'Cloud White / Core Black / Gum', hex: '#F4F4F2', stripesHex: '#111113', soleHex: '#9E6E3C' },
      { name: 'Core Black / Cloud White / Gum', hex: '#141417', stripesHex: '#F4F4F2', soleHex: '#9E6E3C' },
      { name: 'Chalk Pearl / Slate', hex: '#DCDAD3', stripesHex: '#27272A', soleHex: '#C8B89A' },
    ],
    image: IMAGES.samba,
    secondaryImage: IMAGES.campus,
    has3DModel: true,
    silhouette: 'originals-court',
    defaultFinish: 'leather',
    referenceNote: 'Conceptual 3D reconstruction & studio archive reference. Official regional stock varies.',
  },
  {
    id: 'superstar-classic',
    name: 'Superstar',
    family: 'Superstar',
    department: 'Footwear',
    subCategory: 'Originals',
    sport: 'Basketball',
    collection: 'Originals',
    shortDescription:
      'Born on the 1969 hardwood court and adopted by street culture, anchored by its unmistakable ribbed rubber shell toe.',
    materials: ['Coated leather upper', 'Molded rubber shell toe', 'Herringbone rubber cupsole'],
    characteristics: ['Protective ribbed shell toe', 'Serrated three-stripe quarter', 'Padded heel collar'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
    colorways: [
      { name: 'Footwear White / Core Black', hex: '#F7F7F5', stripesHex: '#101012', soleHex: '#EAEAE6' },
      { name: 'Core Black / Chalk White', hex: '#141416', stripesHex: '#F4F4F2', soleHex: '#1C1C20' },
      { name: 'Silver Metallic / Bone', hex: '#A1A1AA', stripesHex: '#18181B', soleHex: '#E4E4E7' },
    ],
    image: IMAGES.superstar,
    secondaryImage: IMAGES.samba,
    has3DModel: true,
    silhouette: 'superstar-shell',
    defaultFinish: 'leather',
    referenceNote: 'Interactive 3D shell-toe reconstruction. Official specs & availability depend on regional release.',
  },
  {
    id: 'gazelle-indoor',
    name: 'Gazelle',
    family: 'Gazelle',
    department: 'Footwear',
    subCategory: 'Originals',
    sport: 'Lifestyle',
    collection: 'Originals',
    shortDescription:
      'Streamlined 1960s multi-purpose trainer crafted in supple brushed suede with contrast leather three-stripe branding.',
    materials: ['Brushed suede upper', 'Leather heel tab & stripes', 'Semi-translucent rubber outsole'],
    characteristics: ['Featherweight suede build', 'T-toe stitching line', 'Low-cut ankle collar'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colorways: [
      { name: 'Charcoal / Chalk White', hex: '#27272A', stripesHex: '#F4F4F2', soleHex: '#A67B4B' },
      { name: 'Collegiate Cobalt / White', hex: '#1D4ED8', stripesHex: '#F4F4F2', soleHex: '#9E6E3C' },
      { name: 'Shadow Olive / Gum', hex: '#3F4A3C', stripesHex: '#ECECE8', soleHex: '#9E6E3C' },
    ],
    image: IMAGES.campus,
    secondaryImage: IMAGES.samba,
    has3DModel: true,
    silhouette: 'originals-court',
    defaultFinish: 'suede',
    referenceNote: 'Conceptual 3D suede finish model. Verify current colorways on regional Adidas portals.',
  },
  {
    id: 'campus-00s',
    name: 'Campus',
    family: 'Campus',
    department: 'Footwear',
    subCategory: 'Originals',
    sport: 'Lifestyle',
    collection: 'Originals',
    shortDescription:
      'Heavy-gauge suede proportions, padded tongue geometry, and wide flat woven laces rooted in skate and street heritage.',
    materials: ['Heavy brushed suede', 'Terry textile collar lining', 'Wide flat laces', 'Off-white rubber cupsole'],
    characteristics: ['Amplified tongue cushioning', 'Broad three-stripe panels', 'Cupsole boardfeel'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colorways: [
      { name: 'Core Black / Cloud White', hex: '#1A1A1E', stripesHex: '#F4F4F2', soleHex: '#E5E2D9' },
      { name: 'Dark Slate / Chalk', hex: '#374151', stripesHex: '#F4F4F2', soleHex: '#E5E2D9' },
      { name: 'Bone / Charcoal', hex: '#D6D3CB', stripesHex: '#18181B', soleHex: '#E5E2D9' },
    ],
    image: IMAGES.campus,
    secondaryImage: IMAGES.superstar,
    has3DModel: true,
    silhouette: 'originals-court',
    defaultFinish: 'suede',
    referenceNote: 'Interactive 3D showcase concept. Pricing intentionally omitted where unverified.',
  },
  {
    id: 'stan-smith-heritage',
    name: 'Stan Smith',
    family: 'Stan Smith',
    department: 'Footwear',
    subCategory: 'Originals',
    sport: 'Tennis',
    collection: 'Originals',
    shortDescription:
      'Clean perforated-stripe minimalism originally engineered for the tennis court, celebrated for timeless architectural restraint.',
    materials: ['Smooth leather upper', 'Perforated three-stripe quarter', 'Contrast heel tab', 'Rubber cupsole'],
    characteristics: ['Perforated ventilation stripes', 'Minimalist monochromatic upper', 'Court-balanced profile'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colorways: [
      { name: 'Cloud White / Court Green', hex: '#F7F7F5', stripesHex: '#F7F7F5', soleHex: '#EDEDEA' },
      { name: 'Cloud White / Obsidian', hex: '#F7F7F5', stripesHex: '#F7F7F5', soleHex: '#141416' },
    ],
    image: IMAGES.superstar,
    secondaryImage: IMAGES.samba,
    has3DModel: true,
    silhouette: 'originals-court',
    defaultFinish: 'leather',
    referenceNote: 'Tennis heritage conceptual model.',
  },
  {
    id: 'forum-low',
    name: 'Forum',
    family: 'Forum',
    department: 'Footwear',
    subCategory: 'Originals',
    sport: 'Basketball',
    collection: 'Originals',
    shortDescription:
      '1984 basketball architecture blending layered leather panels, criss-cross ankle structure, and responsive court cushioning.',
    materials: ['Layered full-grain leather', 'Molded midsole frame', 'Rubber basketball outsole'],
    characteristics: ['Crisp layered quarter overlays', 'Court stability frame', 'High-abrasion outsole'],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
    colorways: [
      { name: 'Chalk White / Royal Blue', hex: '#F4F4F2', stripesHex: '#1D4ED8', soleHex: '#E4E4E7' },
      { name: 'Obsidian / Silver', hex: '#141417', stripesHex: '#A1A1AA', soleHex: '#27272A' },
    ],
    image: IMAGES.superstar,
    secondaryImage: IMAGES.campus,
    has3DModel: true,
    silhouette: 'superstar-shell',
    defaultFinish: 'leather',
    referenceNote: 'Hardwood archive study.',
  },

  // FOOTWEAR — RUNNING & PERFORMANCE
  {
    id: 'adizero-pro',
    name: 'Adizero',
    family: 'Adizero',
    department: 'Footwear',
    subCategory: 'Running',
    sport: 'Running',
    collection: 'Performance',
    shortDescription:
      'Engineered marathon geometry pairing sculpted dual-layer foam cushioning, carbon-infused propulsion rods, and featherweight breathable mesh.',
    materials: ['Ultralight engineered mesh', 'Dual-density sculpted midsole', 'Carbon-infused torsion elements', 'High-grip rubber outsole'],
    characteristics: ['Aggressive forefoot rocker', 'Breathable race-weight upper', 'Propulsive heel-to-toe transition'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colorways: [
      { name: 'Chalk White / Solar Volt / Core Black', hex: '#F4F4F2', stripesHex: '#111113', soleHex: '#D4FF00' },
      { name: 'Core Black / Silver Metallic', hex: '#121215', stripesHex: '#E4E4E7', soleHex: '#27272A' },
      { name: 'Pulse Crimson / Chalk', hex: '#DC2626', stripesHex: '#F4F4F2', soleHex: '#F4F4F2' },
    ],
    image: IMAGES.adizero,
    secondaryImage: IMAGES.heritage,
    has3DModel: true,
    silhouette: 'running-racer',
    defaultFinish: 'knit',
    referenceNote: 'Interactive 3D performance racer concept. Check official Adidas Running specs per generation.',
  },
  {
    id: 'ultraboost-light',
    name: 'Ultraboost',
    family: 'Ultraboost',
    department: 'Footwear',
    subCategory: 'Running',
    sport: 'Running',
    collection: 'Performance',
    shortDescription:
      'Adaptive Primeknit foot-wrapping upper combined with high-volume energy-return midsole architecture for daily road mileage.',
    materials: ['Adaptive Primeknit textile', 'External heel counter', 'Energy-return beaded foam', 'Traction outsole'],
    characteristics: ['Sock-like midfoot lockdown', 'Responsive heel cushioning', 'All-surface road grip'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
    colorways: [
      { name: 'Obsidian Black / Metallic Silver', hex: '#141417', stripesHex: '#A1A1AA', soleHex: '#F4F4F2' },
      { name: 'Cloud White / Solar Volt', hex: '#F4F4F2', stripesHex: '#18181B', soleHex: '#D4FF00' },
    ],
    image: IMAGES.adizero,
    secondaryImage: IMAGES.hoodie,
    has3DModel: true,
    silhouette: 'running-racer',
    defaultFinish: 'knit',
    referenceNote: 'Daily distance running showcase model.',
  },

  // FOOTWEAR — FOOTBALL
  {
    id: 'predator-elite',
    name: 'Predator',
    family: 'Predator',
    department: 'Footwear',
    subCategory: 'Football',
    sport: 'Football',
    collection: 'Football',
    shortDescription:
      'Precision-textured strike-zone upper with tactile grip fins, stretch-knit collar, and split-tooling bladed outsole built for ball control.',
    materials: ['Textured synthetic upper', 'Tactile rubber strike fins', 'Primeknit collar', 'Metallic split soleplate'],
    characteristics: ['Instep swerve grip fins', 'Bladed firm-ground stud geometry', 'Anatomical heel lock'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colorways: [
      { name: 'Core Black / Silver / Crimson', hex: '#121215', stripesHex: '#D4D4D8', soleHex: '#DC2626' },
      { name: 'Cloud White / Solar Volt / Black', hex: '#F4F4F2', stripesHex: '#121215', soleHex: '#D4FF00' },
    ],
    image: IMAGES.predator,
    secondaryImage: IMAGES.jersey,
    has3DModel: true,
    silhouette: 'football-boot',
    defaultFinish: 'gloss',
    referenceNote: 'Interactive 3D football boot geometry. Official match-tier variants vary by season.',
  },
  {
    id: 'copa-pure',
    name: 'Copa',
    family: 'Copa',
    department: 'Footwear',
    subCategory: 'Football',
    sport: 'Football',
    collection: 'Football',
    shortDescription:
      'Quilted leather forefoot craft paired with modern torsional soleplate stability for composed first touch on the pitch.',
    materials: ['Supple leather vamp', 'Quilted damping foam pods', 'Lightweight TPU outsole'],
    characteristics: ['Cushioned ball touch', 'Conical pivot studs', 'Classic folded or low collar fit'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colorways: [
      { name: 'Obsidian / Chalk White', hex: '#141417', stripesHex: '#F4F4F2', soleHex: '#A1A1AA' },
      { name: 'Chalk White / Crimson', hex: '#F4F4F2', stripesHex: '#141417', soleHex: '#DC2626' },
    ],
    image: IMAGES.predator,
    secondaryImage: IMAGES.heritage,
    has3DModel: true,
    silhouette: 'football-boot',
    defaultFinish: 'leather',
    referenceNote: 'Heritage touch football boot model.',
  },
  {
    id: 'f50-speed',
    name: 'F50',
    family: 'F50',
    department: 'Footwear',
    subCategory: 'Football',
    sport: 'Football',
    collection: 'Football',
    shortDescription:
      'Low-cut aerodynamic speed chassis designed for rapid directional acceleration and minimal upper weight.',
    materials: ['Thin-film synthetic upper', 'Compression-fit tunnel tongue', 'Sprint soleplate'],
    characteristics: ['Ultralight speed chassis', 'Directional forefoot traction studs', 'Minimalist heel cup'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colorways: [
      { name: 'Silver Metallic / Volt', hex: '#D4D4D8', stripesHex: '#121215', soleHex: '#D4FF00' },
      { name: 'Obsidian / Crimson', hex: '#141417', stripesHex: '#DC2626', soleHex: '#18181B' },
    ],
    image: IMAGES.predator,
    secondaryImage: IMAGES.adizero,
    has3DModel: true,
    silhouette: 'football-boot',
    defaultFinish: 'gloss',
    referenceNote: 'Speed football boot conceptual 3D study.',
  },

  // CLOTHING / APPAREL
  {
    id: 'firebird-track-jacket',
    name: 'Originals Tricot Track Jacket',
    family: 'Tracksuits',
    department: 'Clothing',
    subCategory: 'Tracksuits',
    sport: 'Lifestyle',
    collection: 'Originals',
    shortDescription:
      'Structured double-knit tricot track jacket featuring stand-up architectural collar, crisp three-stripe sleeves, and full-zip front.',
    materials: ['Recycled polyester tricot', 'Ribbed cuffs & hem', 'Two-way metal zipper'],
    characteristics: ['Tailored stand collar', 'Signature shoulder-to-cuff piping', 'Zippered welt pockets'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colorways: [
      { name: 'Jet Black / Crisp White', hex: '#111113', stripesHex: '#F4F4F2', soleHex: '#111113' },
      { name: 'Collegiate Navy / Bone', hex: '#1E293B', stripesHex: '#F4F4F2', soleHex: '#1E293B' },
    ],
    image: IMAGES.trackJacket,
    secondaryImage: IMAGES.hoodie,
    has3DModel: false,
    referenceNote: 'Editorial studio photography presentation.',
  },
  {
    id: 'heavyweight-fleece-hoodie',
    name: 'Studio Heavyweight Fleece Hoodie & Shell',
    family: 'Hoodies',
    department: 'Clothing',
    subCategory: 'Hoodies',
    sport: 'Training',
    collection: 'Sportswear',
    shortDescription:
      'Architectural 460gsm brushed cotton fleece hoodie paired with weather-resistant woven training outer layers.',
    materials: ['Heavyweight cotton French terry', 'Double-lined structured hood', 'Ripstop nylon outer weave'],
    characteristics: ['Dropped shoulder silhouette', 'Kangaroo pocket reinforcement', 'Breathable matte finish'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colorways: [
      { name: 'Heather Concrete', hex: '#9CA3AF', stripesHex: '#18181B', soleHex: '#9CA3AF' },
      { name: 'Carbon Black', hex: '#18181B', stripesHex: '#F4F4F2', soleHex: '#18181B' },
    ],
    image: IMAGES.hoodie,
    secondaryImage: IMAGES.trackJacket,
    has3DModel: false,
    referenceNote: 'Editorial studio photography presentation.',
  },
  {
    id: 'training-mesh-jersey',
    name: 'Engineered Mesh Training Jersey',
    family: 'Jerseys',
    department: 'Clothing',
    subCategory: 'Jerseys',
    sport: 'Football',
    collection: 'Football',
    shortDescription:
      'Zoned open-hole breathable jacquard jersey with flat-knit polo collar and ergonomic underarm gussets for high-tempo sessions.',
    materials: ['Moisture-wicking jacquard mesh', 'Rib-knit collar trim', 'Heat-applied shoulder stripes'],
    characteristics: ['Zoned airflow paneling', 'Athletic tailored cut', 'Lightweight quick-dry weave'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colorways: [
      { name: 'Charcoal / Bone', hex: '#27272A', stripesHex: '#EAE7DC', soleHex: '#27272A' },
    ],
    image: IMAGES.jersey,
    secondaryImage: IMAGES.predator,
    has3DModel: false,
    referenceNote: 'Editorial studio photography presentation. No team affiliation.',
  },
  {
    id: 'adizero-running-windbreaker',
    name: 'Running Technical Windbreaker',
    family: 'Jackets',
    department: 'Clothing',
    subCategory: 'Running apparel',
    sport: 'Running',
    collection: 'Performance',
    shortDescription:
      'Ultralight water-repellent woven shell engineered with articulated elbows and laser-perforated back ventilation.',
    materials: ['DWR-treated ripstop nylon', 'Laser-cut back vents', 'Reflective trim piping'],
    characteristics: ['Packable chest pocket', 'Articulated running sleeves', 'Wind-blocking storm collar'],
    sizes: ['S', 'M', 'L', 'XL'],
    colorways: [
      { name: 'Obsidian Black', hex: '#141417', stripesHex: '#D4FF00', soleHex: '#141417' },
    ],
    image: IMAGES.hoodie,
    secondaryImage: IMAGES.adizero,
    has3DModel: false,
    referenceNote: 'Editorial studio photography presentation.',
  },
  {
    id: 'outdoor-terrex-shell',
    name: 'Outdoor Alpine Technical Layer',
    family: 'Jackets',
    department: 'Clothing',
    subCategory: 'Training apparel',
    sport: 'Outdoor',
    collection: 'Performance',
    shortDescription:
      'Abrasion-resistant alpine utility layer crafted for unpredictable mountain weather and high-output trail ascents.',
    materials: ['3-layer weather shell', 'Sealed interior seams', 'Adjustable storm hood'],
    characteristics: ['All-weather membrane protection', 'Underarm ventilation zips', 'Articulated trail fit'],
    sizes: ['S', 'M', 'L', 'XL'],
    colorways: [
      { name: 'Basalt Black / Silver', hex: '#1C1C20', stripesHex: '#A1A1AA', soleHex: '#1C1C20' },
    ],
    image: IMAGES.trackJacket,
    secondaryImage: IMAGES.accessories,
    has3DModel: false,
    referenceNote: 'Editorial studio photography presentation.',
  },

  // ACCESSORIES
  {
    id: 'ripstop-sports-duffel',
    name: 'Endurance Ripstop Sports Duffel',
    family: 'Sports bags',
    department: 'Accessories',
    subCategory: 'Sports bags',
    sport: 'Training',
    collection: 'Performance',
    shortDescription:
      'Structured 40L ballistic ripstop duffel featuring coated water-resistant base, ventilated footwear compartment, and padded shoulder strap.',
    materials: ['Ballistic ripstop polyester', 'TPE-coated wipeable base', 'Anodized metal hardware'],
    characteristics: ['40L main volume', 'Isolated shoe tunnel', 'Padded ergonomic carry handles'],
    sizes: ['One Size (40L)'],
    colorways: [
      { name: 'Matte Black / Stealth', hex: '#111113', stripesHex: '#3F3F46', soleHex: '#111113' },
    ],
    image: IMAGES.accessories,
    has3DModel: false,
    referenceNote: 'Editorial studio photography presentation.',
  },
  {
    id: 'monolith-cap-socks-kit',
    name: 'Structured Six-Panel Cap & Crew Socks',
    family: 'Caps & Socks',
    department: 'Accessories',
    subCategory: 'Caps',
    sport: 'Lifestyle',
    collection: 'Originals',
    shortDescription:
      'Heavyweight cotton twill six-panel cap paired with arch-compressed cushioned athletic crew socks.',
    materials: ['Brushed cotton twill', 'Combed cotton-elastane knit', 'Ribbed ankle support'],
    characteristics: ['Pre-curved architectural brim', 'Moisture-absorbing sweatband', 'Targeted footbed cushioning'],
    sizes: ['OSFA', 'M (UK 5.5–8)', 'L (UK 8.5–11)'],
    colorways: [
      { name: 'Obsidian Black', hex: '#111113', stripesHex: '#52525B', soleHex: '#111113' },
    ],
    image: IMAGES.accessories,
    has3DModel: false,
    referenceNote: 'Editorial studio photography presentation.',
  },
];
