import { IMAGES } from './catalog';

export interface TimelineMilestone {
  year: string;
  title: string;
  location: string;
  summary: string;
  detail: string;
  image: string;
}

export interface GlobalBrandHub {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  category: 'Heritage' | 'Innovation' | 'Street Culture' | 'Football' | 'Running';
  title: string;
  story: string;
  highlightYear: string;
}

export interface CampaignStory {
  id: string;
  label: 'Conceptual Brand Editorial' | 'Heritage Archive';
  title: string;
  subtitle: string;
  collection: string;
  heroImage: string;
  secondaryImage: string;
  lead: string;
  paragraphs: string[];
  credits: string[];
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    year: '1949',
    title: 'Founding in Herzogenaurach & the Three Stripes',
    location: 'Herzogenaurach, Germany',
    summary: 'Adi Dassler registers Sportschuhfabrik adidas AG and patents the iconic three-stripe structural support bands.',
    detail:
      'Originally engineered as functional lateral reinforcement straps sewn onto leather uppers to stabilize an athlete’s midfoot, the three stripes rapidly became one of the most recognizable signatures in sport.',
    image: IMAGES.heritage,
  },
  {
    year: '1954',
    title: 'Interchangeable Screw-In Cleats',
    location: 'Bern, Switzerland',
    summary: 'Lightweight leather football boots with replaceable screw-in studs adapt to rain-soaked turf.',
    detail:
      'By allowing players to swap stud lengths for wet pitch conditions, Adidas transformed footwear from static gear into adaptable athletic equipment.',
    image: IMAGES.predator,
  },
  {
    year: '1967',
    title: 'Apparel & the Franz Beckenbauer Tracksuit',
    location: 'Munich, Germany',
    summary: 'Adidas expands beyond footwear into tailored athletic apparel, introducing the three-stripe tricot tracksuit.',
    detail:
      'The sleek zippered track silhouette bridged stadium warm-ups and everyday urban wardrobes, setting the foundation for modern sportswear.',
    image: IMAGES.trackJacket,
  },
  {
    year: '1969',
    title: 'The Superstar Shell Toe',
    location: 'North America Courts',
    summary: 'A low-top leather basketball shoe with a molded rubber shell toe changes court protection and later hip-hop style.',
    detail:
      'Adopted by professional players in the early 1970s and later celebrated in 1980s New York street culture, the Superstar cemented sport-to-street crossover.',
    image: IMAGES.superstar,
  },
  {
    year: '1994',
    title: 'Predator Football Innovation',
    location: 'European Pitch',
    summary: 'Ridged rubber forefoot elements engineered to increase friction, swerve, and ball control.',
    detail:
      'Predator introduced textured upper zones directly tailored to striking mechanics—establishing a lineage of tactile boot engineering that continues today.',
    image: IMAGES.predator,
  },
  {
    year: '2001',
    title: 'Adidas Originals & Avant-Garde Collaborations',
    location: 'Global Cultural Capitals',
    summary: 'Heritage archive silhouettes enter contemporary fashion, followed by landmark design partnerships such as Y-3.',
    detail:
      'By elevating archival court models like Samba, Gazelle, and Stan Smith alongside architectural fashion direction, Adidas Originals shaped global streetwear.',
    image: IMAGES.samba,
  },
  {
    year: '2013',
    title: 'Boost Energy-Return Cushioning',
    location: 'Herzogenaurach & Berlin',
    summary: 'Expanded thermoplastic polyurethane (eTPU) midsole beads redefine cushioning and long-distance responsiveness.',
    detail:
      'Developed with materials science partners, Boost transitioned rapidly from marathon podiums to everyday lifestyle icons.',
    image: IMAGES.adizero,
  },
  {
    year: '2020s',
    title: 'Adizero Carbon & Lightweight Engineering',
    location: 'International Marathon Courses',
    summary: 'Anatomically tuned carbon-infused rods and ultralight foams push modern distance running efficiency.',
    detail:
      'Focused on minimizing mass while maximizing propulsion geometry, the modern Adizero platform continues Adi Dassler’s founding obsession with athlete advantage.',
    image: IMAGES.adizero,
  },
];

export const GLOBAL_HUBS: GlobalBrandHub[] = [
  {
    id: 'herzo',
    city: 'Herzogenaurach',
    country: 'Germany',
    lat: 49.57,
    lon: 10.88,
    category: 'Heritage',
    title: 'World of Sports & Adi Dassler Workshop',
    story:
      'Global headquarters since 1949. Home to biomechanics laboratories, footwear prototyping workshops, and the historical product archive.',
    highlightYear: '1949',
  },
  {
    id: 'berlin',
    city: 'Berlin',
    country: 'Germany',
    lat: 52.52,
    lon: 13.4,
    category: 'Running',
    title: 'Flat-Course Marathon Innovation',
    story:
      'One of the fastest marathon courses in the world, serving as a historic proving ground for Adizero racing footwear and distance breakthroughs.',
    highlightYear: '2014–Present',
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.68,
    lon: 139.69,
    category: 'Street Culture',
    title: 'Avant-Garde Design & Harajuku Originals',
    story:
      'Epicenter of sculptural sportswear tailoring, architectural footwear collaborations, and minimalist Japanese streetwear culture.',
    highlightYear: '2002',
  },
  {
    id: 'nyc',
    city: 'New York City',
    country: 'USA',
    lat: 40.71,
    lon: -74.0,
    category: 'Street Culture',
    title: 'Superstar & Streetwear Genesis',
    story:
      'Where the 1969 leather shell-toe basketball sneaker transcended the court to become an enduring emblem of hip-hop and urban style.',
    highlightYear: '1986',
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5,
    lon: -0.12,
    category: 'Football',
    title: 'Terrace & Court Culture',
    story:
      'Decades of British football terrace culture turned indoor trainers like Samba and Gazelle into permanent streetwear fixtures.',
    highlightYear: '1970s–Present',
  },
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    lat: 48.85,
    lon: 2.35,
    category: 'Innovation',
    title: 'Fashion Week & Global Stadium Stage',
    story:
      'Bridging high-fashion runway collaborations with international track and football competitions across Parisian arenas.',
    highlightYear: '2024',
  },
  {
    id: 'portland',
    city: 'Portland',
    country: 'USA',
    lat: 45.51,
    lon: -122.67,
    category: 'Innovation',
    title: 'North America Footwear Design Studio',
    story:
      'Advanced basketball, outdoor, and performance footwear creation hub driving material experimentation and athlete testing.',
    highlightYear: '1993',
  },
];

export const CAMPAIGNS: CampaignStory[] = [
  {
    id: 'concrete-monolith',
    label: 'Conceptual Brand Editorial',
    title: 'Concrete & Leather',
    subtitle: 'Architectural Originals Study',
    collection: 'Adidas Originals',
    heroImage: IMAGES.samba,
    secondaryImage: IMAGES.campus,
    lead: 'An independent visual study examining how indoor pitch leather, brushed suede, and gum rubber interact with brutalist urban geometry.',
    paragraphs: [
      'Before lifestyle silhouettes became global streetwear staples, every line on the Samba, Gazelle, and Superstar served a mechanical purpose on hardwood or indoor turf.',
      'Set against poured concrete stairs and raw basalt stone, this conceptual editorial strips away ornamentation to isolate silhouette proportion, serrated three-stripe rhythm, and tactile material contrast.',
    ],
    credits: ['Conceptual Art Direction: Independent Studio', 'Featured Families: Samba · Superstar · Campus', 'Environment: Brutalist Concrete Study'],
  },
  {
    id: 'velocity-dawn',
    label: 'Conceptual Brand Editorial',
    title: 'Before Dawn on Lane Four',
    subtitle: 'Performance Running Study',
    collection: 'Adizero & Ultraboost',
    heroImage: IMAGES.adizero,
    secondaryImage: IMAGES.hoodie,
    lead: 'Exploring the quiet engineering discipline of long-distance running—where every gram of mesh and every millimeter of foam geometry matters.',
    paragraphs: [
      'Modern marathon footwear balances extreme lightness with controlled longitudinal stiffness. Sculpted midsole rockers guide footstrike efficiency over 42.195 kilometers.',
      'This conceptual visual chapter pairs high-contrast solar volt accents with volcanic charcoal track textures to highlight energy return and motion.',
    ],
    credits: ['Conceptual Art Direction: Independent Studio', 'Featured Families: Adizero · Ultraboost', 'Surface: Olympic Track & Anodized Aluminum'],
  },
  {
    id: 'night-turf-precision',
    label: 'Heritage Archive',
    title: 'Under the Floodlights',
    subtitle: '75 Years of Pitch Engineering',
    collection: 'Predator · Copa · F50',
    heroImage: IMAGES.predator,
    secondaryImage: IMAGES.jersey,
    lead: 'From Adi Dassler’s 1954 interchangeable leather studs to contemporary textured strike zones and bladed speed soleplates.',
    paragraphs: [
      'Football footwear has always demanded traction without compromising touch. Over seven decades, leather craftsmanship evolved alongside synthetic grip fins and split-tooling plates.',
      'Presented as a tribute to football engineering heritage without fabricated club sponsorships, this study focuses purely on the anatomy of the boot.',
    ],
    credits: ['Archive Focus: 1954–Present', 'Featured Families: Predator · Copa · F50', 'Focus: Traction Geometry & Strike Texture'],
  },
];
