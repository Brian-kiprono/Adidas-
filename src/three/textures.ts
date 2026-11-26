import * as THREE from 'three';

export interface ProceduralTextureSet {
  leatherBump: THREE.CanvasTexture;
  suedeBump: THREE.CanvasTexture;
  knitBump: THREE.CanvasTexture;
  carbonMap: THREE.CanvasTexture;
  soleTreadBump: THREE.CanvasTexture;
  tongueLabelMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  earthAlbedoMap: THREE.CanvasTexture;
  earthBumpMap: THREE.CanvasTexture;
  dispose: () => void;
}

function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function configureTexture(
  canvas: HTMLCanvasElement,
  isColor: boolean,
  repeatX = 1,
  repeatY = 1,
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = Math.min(maxAnisotropy, 4);
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createProceduralTextures(maxAnisotropy = 4): ProceduralTextureSet {
  // 1. Tumbled Full-Grain Leather Bump (compact 128x128 for fast GPU upload)
  const [lCanvas, lCtx] = createCanvas(128, 128);
  lCtx.fillStyle = '#808080';
  lCtx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 1200; i++) {
    const x = (i * 53) % 128;
    const y = (i * 97 + Math.floor(i / 13) * 11) % 128;
    const r = 1.0 + ((i * 19) % 7) * 0.14;
    const v = 110 + ((i * 41) % 40);
    lCtx.fillStyle = `rgb(${v},${v},${v})`;
    lCtx.beginPath();
    lCtx.arc(x, y, r, 0, Math.PI * 2);
    lCtx.fill();
  }
  const leatherBump = configureTexture(lCanvas, false, 4, 4, maxAnisotropy);

  // 2. Brushed Suede Nap Bump
  const [sCanvas, sCtx] = createCanvas(128, 128);
  sCtx.fillStyle = '#7c7c7c';
  sCtx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 1800; i++) {
    const x = (i * 71) % 128;
    const y = (i * 113) % 128;
    const v = 92 + ((i * 37) % 68);
    sCtx.strokeStyle = `rgb(${v},${v},${v})`;
    sCtx.lineWidth = 1;
    sCtx.beginPath();
    sCtx.moveTo(x, y);
    sCtx.lineTo(x + 2, y + 1);
    sCtx.stroke();
  }
  const suedeBump = configureTexture(sCanvas, false, 6, 6, maxAnisotropy);

  // 3. Open-Cell Honeycomb Mesh / Primeknit Bump (matches uploaded runner mesh)
  const [kCanvas, kCtx] = createCanvas(128, 128);
  kCtx.fillStyle = '#505050';
  kCtx.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 8) {
    for (let x = 0; x < 128; x += 8) {
      const offset = (y / 8) % 2 === 0 ? 0 : 4;
      kCtx.fillStyle = '#e0e0e0';
      kCtx.beginPath();
      kCtx.arc(x + offset, y, 3.2, 0, Math.PI * 2);
      kCtx.fill();
      kCtx.fillStyle = '#262626';
      kCtx.beginPath();
      kCtx.arc(x + offset, y, 1.4, 0, Math.PI * 2);
      kCtx.fill();
    }
  }
  const knitBump = configureTexture(kCanvas, false, 9, 9, maxAnisotropy);

  // 4. Carbon Fiber Weave (Color)
  const [cCanvas, cCtx] = createCanvas(64, 64);
  cCtx.fillStyle = '#141416';
  cCtx.fillRect(0, 0, 64, 64);
  for (let y = 0; y < 64; y += 8) {
    for (let x = 0; x < 64; x += 8) {
      const alt = ((x + y) / 8) % 2 === 0;
      cCtx.fillStyle = alt ? '#27272c' : '#18181b';
      cCtx.fillRect(x, y, 7, 4);
      cCtx.fillStyle = alt ? '#18181b' : '#303036';
      cCtx.fillRect(x, y + 4, 4, 4);
    }
  }
  const carbonMap = configureTexture(cCanvas, true, 6, 6, maxAnisotropy);

  // 5. Sculpted Rubber Tread Bump
  const [tCanvas, tCtx] = createCanvas(128, 128);
  tCtx.fillStyle = '#555555';
  tCtx.fillRect(0, 0, 128, 128);
  tCtx.strokeStyle = '#dcdcdc';
  tCtx.lineWidth = 3;
  for (let y = -8; y < 140; y += 12) {
    tCtx.beginPath();
    for (let x = 0; x <= 128; x += 12) {
      const py = y + ((x / 12) % 2 === 0 ? 0 : 6);
      if (x === 0) tCtx.moveTo(x, py);
      else tCtx.lineTo(x, py);
    }
    tCtx.stroke();
  }
  const soleTreadBump = configureTexture(tCanvas, false, 3, 6, maxAnisotropy);

  // 6. Woven Tongue Crest Label (Cream & Charcoal Adidas 3-Bar Mountain Mark)
  const [lblCanvas, lblCtx] = createCanvas(128, 128);
  lblCtx.fillStyle = '#efe9dd';
  lblCtx.fillRect(0, 0, 128, 128);
  lblCtx.strokeStyle = '#1b1c20';
  lblCtx.lineWidth = 3;
  lblCtx.strokeRect(8, 8, 112, 112);
  // Subtle curved topographic lines
  lblCtx.strokeStyle = 'rgba(27,28,32,0.22)';
  lblCtx.lineWidth = 1.5;
  for (let r = 14; r < 54; r += 9) {
    lblCtx.beginPath();
    lblCtx.arc(64, 30, r, 0, Math.PI);
    lblCtx.stroke();
  }
  // Three diagonal mountain bars
  lblCtx.fillStyle = '#1b1c20';
  lblCtx.fillRect(28, 66, 16, 22);
  lblCtx.fillRect(54, 52, 16, 36);
  lblCtx.fillRect(80, 38, 16, 50);
  lblCtx.font = '700 18px sans-serif';
  lblCtx.textAlign = 'center';
  lblCtx.fillText('adidas', 64, 110);
  const tongueLabelMap = configureTexture(lblCanvas, true, 1, 1, maxAnisotropy);
  tongueLabelMap.wrapS = THREE.ClampToEdgeWrapping;
  tongueLabelMap.wrapT = THREE.ClampToEdgeWrapping;

  // 7. Radial Contact Shadow Map
  const [shCanvas, shCtx] = createCanvas(128, 128);
  const grad = shCtx.createRadialGradient(64, 64, 6, 64, 64, 62);
  grad.addColorStop(0, 'rgba(0,0,0,0.72)');
  grad.addColorStop(0.45, 'rgba(0,0,0,0.32)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  shCtx.fillStyle = grad;
  shCtx.fillRect(0, 0, 128, 128);
  const contactShadowMap = configureTexture(shCanvas, true, 1, 1, maxAnisotropy);

  // 8. Procedural Equirectangular Earth Map (lightweight 512x256)
  const [eCanvas, eCtx] = createCanvas(512, 256);
  eCtx.fillStyle = '#09090d';
  eCtx.fillRect(0, 0, 512, 256);

  eCtx.strokeStyle = 'rgba(255,255,255,0.06)';
  eCtx.lineWidth = 1;
  for (let x = 0; x <= 512; x += 32) {
    eCtx.beginPath();
    eCtx.moveTo(x, 0);
    eCtx.lineTo(x, 256);
    eCtx.stroke();
  }
  for (let y = 0; y <= 256; y += 32) {
    eCtx.beginPath();
    eCtx.moveTo(0, y);
    eCtx.lineTo(512, y);
    eCtx.stroke();
  }

  const plotPoly = (coords: Array<[number, number]>, fill: string) => {
    eCtx.fillStyle = fill;
    eCtx.beginPath();
    coords.forEach(([lon, lat], idx) => {
      const px = ((lon + 180) / 360) * 512;
      const py = ((90 - lat) / 180) * 256;
      if (idx === 0) eCtx.moveTo(px, py);
      else eCtx.lineTo(px, py);
    });
    eCtx.closePath();
    eCtx.fill();
  };

  const landColor = '#27272e';
  plotPoly([[-165, 65], [-130, 70], [-95, 68], [-65, 52], [-72, 42], [-81, 25], [-95, 19], [-105, 22], [-118, 33], [-126, 48], [-152, 60]], landColor);
  plotPoly([[-80, 11], [-60, 10], [-35, -6], [-40, -23], [-54, -35], [-68, -54], [-75, -45], [-71, -18], [-80, -3]], landColor);
  plotPoly([[-10, 36], [-9, 43], [-3, 48], [4, 53], [10, 58], [24, 68], [32, 62], [28, 46], [22, 38], [12, 42], [3, 42]], landColor);
  plotPoly([[-17, 15], [-5, 36], [11, 37], [32, 31], [43, 12], [51, 11], [40, -10], [32, -28], [20, -35], [14, -22], [9, 4], [-8, 5]], landColor);
  plotPoly([[28, 42], [45, 42], [65, 68], [110, 73], [160, 66], [142, 46], [130, 35], [120, 24], [105, 10], [95, 16], [78, 8], [67, 24], [48, 28], [35, 34]], landColor);
  plotPoly([[130, 31], [136, 35], [142, 43], [145, 43], [139, 34], [132, 31]], '#3a3a44');
  plotPoly([[-6, 50], [-5, 58], [0, 58], [1, 51]], '#3a3a44');
  plotPoly([[114, -22], [129, -12], [144, -14], [153, -27], [147, -38], [130, -32], [115, -34]], landColor);

  const earthAlbedoMap = configureTexture(eCanvas, true, 1, 1, maxAnisotropy);
  earthAlbedoMap.wrapS = THREE.ClampToEdgeWrapping;
  earthAlbedoMap.wrapT = THREE.ClampToEdgeWrapping;

  const [ebCanvas, ebCtx] = createCanvas(256, 128);
  ebCtx.drawImage(eCanvas, 0, 0, 256, 128);
  const earthBumpMap = configureTexture(ebCanvas, false, 1, 1, maxAnisotropy);
  earthBumpMap.wrapS = THREE.ClampToEdgeWrapping;
  earthBumpMap.wrapT = THREE.ClampToEdgeWrapping;

  return {
    leatherBump,
    suedeBump,
    knitBump,
    carbonMap,
    soleTreadBump,
    tongueLabelMap,
    contactShadowMap,
    earthAlbedoMap,
    earthBumpMap,
    dispose: () => {
      leatherBump.dispose();
      suedeBump.dispose();
      knitBump.dispose();
      carbonMap.dispose();
      soleTreadBump.dispose();
      tongueLabelMap.dispose();
      contactShadowMap.dispose();
      earthAlbedoMap.dispose();
      earthBumpMap.dispose();
    },
  };
}
