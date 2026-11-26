# ADIDAS — Impossible Is Nothing (3D Digital Brand Experience)

An interactive 3D digital brand showcase, footwear showroom, real-time concept sneaker configurator, and editorial product universe built with React, TypeScript, Three.js, React Three Fiber, Drei, GSAP, and Tailwind CSS.

> **Concept Notice:** This application is an independent portfolio and creative engineering concept. It is not an official Adidas store and does not process real orders or payments.

---

## Features

- **Interactive 3D Hero World:** Dark architectural stage featuring a real-time WebGL sneaker with OrbitControls, studio lighting, procedural PBR materials, camera angle presets, and scroll-choreographed GSAP transitions.
- **3D Footwear Showroom & Configurator:** Inspect distinct 3D footwear silhouettes (Court Originals, Shell-Toe Classic, Marathon Carbon Racer, and Bladed Football Boot) with real-time customization for upper material finishes (Leather, Suede, Knit, Gloss), upper color, stripes, sole, laces, heel accents, exploded-view assembly inspection, and local concept saving.
- **Complete Product Universe & Filtering:** Browse Footwear, Clothing, Accessories, and Sports categories (`Football`, `Running`, `Basketball`, `Training`, `Tennis`, `Outdoor`, `Lifestyle`) with live search, category/sport filters, and product detail views clearly distinguishing interactive 3D viewers from studio photography.
- **Originals, Performance & Football Destinations:** Dedicated editorial environments for Adidas Originals street culture, Adizero/Ultraboost track speed, and Predator/Copa/F50 football engineering.
- **Interactive 3D Global Brand Map:** Explore verifiable Adidas global hubs and sporting milestones on an interactive 3D WebGL globe with smooth camera rotation.
- **Brand Heritage & Conceptual Campaigns:** Verified historical timeline from Adi Dassler's 1949 workshop in Herzogenaurach to modern material innovation, alongside clearly labeled conceptual campaign stories.
- **Local Wishlist & Bag Demonstration:** Persistent `localStorage` wishlist, shopping bag with quantity controls, and saved custom 3D concepts.

---

## Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **3D & WebGL:** Three.js (`MeshPhysicalMaterial`, `RoomEnvironment`, procedural Canvas2D PBR maps, `OrbitControls`), `@react-three/fiber`, `@react-three/drei`
- **Motion & Scroll Choreography:** GSAP (`ScrollTrigger`) + Framer Motion (`motion`)
- **Styling & Icons:** Tailwind CSS v4 + Lucide React

---

## Installation Instructions

1. Clone the repository and navigate to the project root.
2. Install dependencies:

```bash
npm install
```

---

## Development Commands

Start the development server on port `3000`:

```bash
npm run dev
```

Run TypeScript type-checking and linting:

```bash
npm run lint
```

---

## Build Instructions

Create an optimized production bundle in `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```text
├── index.html                  # Document entry, editorial fonts, metadata
├── metadata.json               # Applet metadata
├── LICENSE                     # MIT license & third-party IP notice
├── README.md                   # Project documentation
├── .gitignore                  # Git exclusion rules
└── src/
    ├── App.tsx                 # Main application shell & view routing
    ├── index.css               # Global Tailwind v4 styles & typography
    ├── data/
    │   ├── catalog.ts          # Verified product families, apparel & accessories
    │   └── heritage.ts         # Verified brand timeline, global hubs & campaigns
    ├── three/
    │   ├── textures.ts         # Procedural Canvas2D PBR textures & Earth map
    │   ├── shoeBuilder.ts      # Multi-part procedural 3D footwear silhouettes
    │   ├── ShoeStageCanvas.tsx # Reusable WebGL 3D shoe viewport with RoomEnvironment
    │   └── GlobeCanvas.tsx     # Interactive 3D WebGL global brand map
    ├── components/
    │   ├── Navbar.tsx          # 3-zone top navigation & universe drawer
    │   ├── HeroSection.tsx     # Interactive 3D hero world & scroll choreography
    │   ├── ShowroomSection.tsx # 3D Sneaker Showroom & real-time configurator
    │   ├── ProductCard.tsx     # Editorial product card with zero-broken-image fallback
    │   ├── ProductModal.tsx    # Detailed PDP view (3D / Studio Gallery + Specs)
    │   ├── BagDrawer.tsx       # Slide-over Bag, Wishlist & Saved Concepts drawer
    │   └── Footer.tsx          # Editorial footer & full route index
    └── pages/
        ├── UniverseViews.tsx   # Originals, Running, Football, Apparel, Accessories, Sports
        ├── ShopView.tsx        # Full filterable & searchable product catalog
        └── StoryViews.tsx      # Campaigns & Brand Story timeline + 3D Globe
```

---

## Asset Attribution

- **3D Footwear & Globe Models:** 100% procedurally constructed in TypeScript via Three.js (`ExtrudeGeometry`, `TubeGeometry`, `LatheGeometry`, and procedural Canvas2D normal/roughness/albedo maps).
- **Editorial & Studio Imagery:** Custom high-contrast studio and architectural product visuals generated locally under `/src/assets/images/` for this portfolio concept.
- **Trademarks:** All Adidas product family names and brand marks remain the property of adidas AG.
