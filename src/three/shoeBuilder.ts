import * as THREE from 'three';
import type { MaterialFinish, ShoeConfig, ShoeSilhouette } from '../data/catalog';
import type { ProceduralTextureSet } from './textures';

export interface ShoeAssembly {
  root: THREE.Group;
  parts: {
    outsoleGroup: THREE.Group;
    midsoleGroup: THREE.Group;
    upperGroup: THREE.Group;
    stripesGroup: THREE.Group;
    tongueGroup: THREE.Group;
    lacesGroup: THREE.Group;
    heelTabGroup: THREE.Group;
  };
  materials: {
    upper: THREE.MeshPhysicalMaterial;
    toeOverlay: THREE.MeshPhysicalMaterial;
    stripes: THREE.MeshPhysicalMaterial;
    midsole: THREE.MeshPhysicalMaterial;
    outsole: THREE.MeshStandardMaterial;
    laces: THREE.MeshStandardMaterial;
    accent: THREE.MeshPhysicalMaterial;
    collar: THREE.MeshStandardMaterial;
    sockliner: THREE.MeshStandardMaterial;
    metal: THREE.MeshStandardMaterial;
    stitch: THREE.MeshStandardMaterial;
  };
  silhouette: ShoeSilhouette;
}

export interface LastStation {
  x: number;
  soleBottomY: number;
  soleTopY: number;
  ridgeY: number;
  halfWidthLat: number;
  halfWidthMed: number;
  centerZ: number;
  soleFlare: number;
}

export function getLastStation(uRaw: number, silhouette: ShoeSilhouette): LastStation {
  const u = THREE.MathUtils.clamp(uRaw, 0, 1);
  const isRunner = silhouette === 'originals-runner';
  const isRacer = silhouette === 'running-racer';
  const isBoot = silhouette === 'football-boot';

  const length = isBoot ? 2.5 : 2.58;
  const x = THREE.MathUtils.lerp(-length * 0.48, length * 0.52, u);

  // Subtle anatomical foot S-curve
  const centerZ = Math.sin(u * Math.PI * 1.4) * 0.04 - 0.018 * Math.sin(u * Math.PI);

  // Width envelope: smoothly tapers to rounded heel & rounded toe
  const endTaper = Math.sin(Math.pow(u, 0.85) * Math.PI);
  const baseBody = isBoot ? 0.24 : isRunner ? 0.30 : 0.275;
  const ballWide = Math.exp(-Math.pow((u - 0.67) / 0.22, 2)) * (isRunner ? 0.165 : 0.145);
  const archWaist = -Math.exp(-Math.pow((u - 0.38) / 0.13, 2)) * 0.038;
  const halfW = Math.max(0.045, (baseBody + ballWide + archWaist) * (0.28 + 0.72 * Math.pow(endTaper, 0.42)));

  const halfWidthLat = halfW * 1.04;
  const halfWidthMed = halfW * (1 - 0.1 * Math.exp(-Math.pow((u - 0.36) / 0.14, 2)));

  // Smooth rocker curve
  const toeSpring = u > 0.7 ? Math.pow((u - 0.7) / 0.3, 2.0) * (isRacer ? 0.15 : isRunner ? 0.11 : 0.065) : 0;
  const heelBevel = u < 0.12 ? Math.pow((0.12 - u) / 0.12, 2.0) * (isRunner || isRacer ? 0.06 : 0.02) : 0;
  const soleBottomY = (isBoot ? 0.07 : 0.0) + toeSpring + heelBevel;

  // Midsole thickness (chunky contoured wave for originals-runner)
  let stackBase = 0.2;
  if (isRunner) {
    const heelCushion = 0.35 * (1 - 0.32 * u);
    const archSculpt = -0.055 * Math.exp(-Math.pow((u - 0.42) / 0.12, 2));
    stackBase = heelCushion + archSculpt;
  } else if (isRacer) {
    stackBase = THREE.MathUtils.lerp(0.32, 0.19, u);
  } else if (isBoot) {
    stackBase = THREE.MathUtils.lerp(0.13, 0.10, u);
  } else {
    stackBase = THREE.MathUtils.lerp(0.21, 0.16, u);
  }
  const soleTopY = soleBottomY + stackBase;

  // C2-smooth dorsal ridge height (no kinks or tears)
  const heelPeak = isBoot ? 0.52 : isRunner ? 0.56 : 0.58;
  const ankleDip = isBoot ? 0.43 : isRunner ? 0.47 : 0.49;
  const instepPeak = isBoot ? 0.45 : isRunner ? 0.54 : 0.53;
  const ballH = isBoot ? 0.27 : isRunner ? 0.33 : 0.31;

  let upperH = 0;
  if (u < 0.08) {
    upperH = THREE.MathUtils.lerp(0.24, heelPeak, Math.sin((u / 0.08) * Math.PI * 0.5));
  } else if (u < 0.3) {
    const t = THREE.MathUtils.smoothstep((u - 0.08) / 0.22, 0, 1);
    upperH = THREE.MathUtils.lerp(heelPeak, ankleDip, t);
  } else if (u < 0.45) {
    const t = THREE.MathUtils.smoothstep((u - 0.3) / 0.15, 0, 1);
    upperH = THREE.MathUtils.lerp(ankleDip, instepPeak, t);
  } else if (u < 0.68) {
    const t = THREE.MathUtils.smoothstep((u - 0.45) / 0.23, 0, 1);
    upperH = THREE.MathUtils.lerp(instepPeak, ballH, t);
  } else {
    const t = (u - 0.68) / 0.32;
    upperH = THREE.MathUtils.lerp(ballH, 0.05, Math.pow(t, 0.85));
  }

  const ridgeY = soleTopY + upperH;
  const soleFlare = isRunner ? 1.07 + 0.06 * Math.exp(-Math.pow((u - 0.12) / 0.16, 2)) : 1.025;

  return {
    x,
    soleBottomY,
    soleTopY,
    ridgeY,
    halfWidthLat,
    halfWidthMed,
    centerZ,
    soleFlare,
  };
}

export function evalUpperSurface(
  u: number,
  s: number,
  silhouette: ShoeSilhouette,
  normalOut = 0
): THREE.Vector3 {
  const st = getLastStation(u, silhouette);
  const absS = Math.abs(s);
  const sideW = s >= 0 ? st.halfWidthLat : st.halfWidthMed;

  const theta = absS * (Math.PI * 0.5);
  const zFactor = Math.sin(theta);
  const z = st.centerZ + Math.sign(s || 1) * sideW * zFactor;

  const hNorm = Math.pow(Math.cos(theta), 0.72);
  // Tuck bottom edge (-0.025) slightly inside midsole top so upper and sole form one solid whole shoe
  const y = THREE.MathUtils.lerp(st.soleTopY - 0.025, st.ridgeY, hNorm);

  const p = new THREE.Vector3(st.x, y, z);
  if (normalOut !== 0) {
    const outDir = new THREE.Vector3(
      (u - 0.5) * 0.12,
      Math.cos(theta) * 0.55,
      Math.sign(s || 0.001) * Math.sin(theta)
    ).normalize();
    p.addScaledVector(outDir, normalOut);
  }
  return p;
}

/**
 * Watertight closed upper shell with smooth ankle collar bowl (zero sharp steps or tears)
 */
export function createLoftedUpperGeometry(silhouette: ShoeSilhouette): THREE.BufferGeometry {
  const uSegs = 32;
  const sSegs = 22;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iu = 0; iu <= uSegs; iu++) {
    const u = iu / uSegs;
    for (let is = 0; is <= sSegs; is++) {
      const s = -1 + (is / sSegs) * 2;
      const p = evalUpperSurface(u, s, silhouette);

      // Smooth C2 sinusoidal collar depression (0 at edges, smooth bowl inside 0.11..0.37)
      const uCollar = THREE.MathUtils.clamp((u - 0.11) / 0.26, 0, 1);
      const sCollar = THREE.MathUtils.clamp((0.52 - Math.abs(s)) / 0.52, 0, 1);
      if (uCollar > 0 && uCollar < 1 && sCollar > 0) {
        const uBell = Math.pow(Math.sin(uCollar * Math.PI), 1.4);
        const sBell = Math.pow(Math.sin(sCollar * Math.PI * 0.5), 1.5);
        p.y -= 0.21 * uBell * sBell;
      }

      positions.push(p.x, p.y, p.z);
      uvs.push(u * 1.4, (s + 1) * 0.5);
    }
  }

  const stride = sSegs + 1;
  for (let iu = 0; iu < uSegs; iu++) {
    for (let is = 0; is < sSegs; is++) {
      const a = iu * stride + is;
      const b = (iu + 1) * stride + is;
      const c = (iu + 1) * stride + (is + 1);
      const d = iu * stride + (is + 1);
      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  // Watertight heel cap
  const heelCenterIdx = positions.length / 3;
  const heelTip = getLastStation(0, silhouette);
  positions.push(heelTip.x - 0.025, heelTip.soleTopY + 0.1, heelTip.centerZ);
  uvs.push(0, 0.5);
  for (let is = 0; is < sSegs; is++) {
    indices.push(heelCenterIdx, is, is + 1);
  }

  // Watertight toe cap
  const toeCenterIdx = positions.length / 3;
  const toeTip = getLastStation(1, silhouette);
  positions.push(toeTip.x + 0.03, toeTip.soleTopY + 0.02, toeTip.centerZ);
  uvs.push(1.4, 0.5);
  const lastRow = uSegs * stride;
  for (let is = 0; is < sSegs; is++) {
    indices.push(toeCenterIdx, lastRow + is + 1, lastRow + is);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function createLoftedSoleGeometry(
  silhouette: ShoeSilhouette,
  layer: 'midsole' | 'outsole'
): THREE.BufferGeometry {
  const uSegs = 34;
  const ringSegs = 20;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iu = 0; iu <= uSegs; iu++) {
    const u = iu / uSegs;
    const st = getLastStation(u, silhouette);
    const totalH = st.soleTopY - st.soleBottomY;
    const yBot = layer === 'outsole' ? st.soleBottomY : st.soleBottomY + totalH * 0.22;
    const yTop = layer === 'outsole' ? st.soleBottomY + totalH * 0.26 : st.soleTopY + 0.01;
    const midY = (yBot + yTop) * 0.5;
    const halfH = (yTop - yBot) * 0.5;
    const flare = layer === 'outsole' ? st.soleFlare * 1.01 : st.soleFlare;

    for (let ir = 0; ir <= ringSegs; ir++) {
      const phi = (ir / ringSegs) * Math.PI * 2;
      const sinP = Math.sin(phi);
      const cosP = Math.cos(phi);
      const halfW = (sinP >= 0 ? st.halfWidthLat : st.halfWidthMed) * flare;

      // Subtle sculpted midsole wave groove for runner silhouette
      const waveIndent =
        layer === 'midsole' && silhouette === 'originals-runner'
          ? 1 - 0.04 * Math.abs(sinP) * Math.exp(-Math.pow(cosP / 0.35, 2))
          : 1;

      const z =
        st.centerZ + Math.sign(sinP || 1) * Math.pow(Math.abs(sinP), 0.72) * halfW * waveIndent;
      const y = midY + Math.sign(cosP || 1) * Math.pow(Math.abs(cosP), 0.55) * halfH;

      positions.push(st.x, y, z);
      uvs.push(u * 2, ir / ringSegs);
    }
  }

  const stride = ringSegs + 1;
  for (let iu = 0; iu < uSegs; iu++) {
    for (let ir = 0; ir < ringSegs; ir++) {
      const a = iu * stride + ir;
      const b = (iu + 1) * stride + ir;
      const c = (iu + 1) * stride + (ir + 1);
      const d = iu * stride + (ir + 1);
      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  const heelSt = getLastStation(0, silhouette);
  const heelIdx = positions.length / 3;
  positions.push(heelSt.x - 0.03, (heelSt.soleBottomY + heelSt.soleTopY) * 0.5, heelSt.centerZ);
  uvs.push(0, 0.5);
  for (let ir = 0; ir < ringSegs; ir++) {
    indices.push(heelIdx, ir + 1, ir);
  }

  const toeSt = getLastStation(1, silhouette);
  const toeIdx = positions.length / 3;
  positions.push(toeSt.x + 0.035, (toeSt.soleBottomY + toeSt.soleTopY) * 0.5, toeSt.centerZ);
  uvs.push(1, 0.5);
  const lastRow = uSegs * stride;
  for (let ir = 0; ir < ringSegs; ir++) {
    indices.push(toeIdx, lastRow + ir, lastRow + ir + 1);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function createConformedPatchGeometry(
  silhouette: ShoeSilhouette,
  uStart: number,
  uEnd: number,
  sStart: number,
  sEnd: number,
  thickness: number,
  uSteps = 10,
  sSteps = 6,
  skewUByS = 0
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let layer = 0; layer < 2; layer++) {
    const offset = layer === 0 ? -0.002 : thickness;
    for (let iu = 0; iu <= uSteps; iu++) {
      const tu = iu / uSteps;
      for (let is = 0; is <= sSteps; is++) {
        const ts = is / sSteps;
        const s = THREE.MathUtils.lerp(sStart, sEnd, ts);
        const u = THREE.MathUtils.clamp(
          THREE.MathUtils.lerp(uStart, uEnd, tu) + (ts - 0.5) * skewUByS,
          0.02,
          0.98
        );
        const p = evalUpperSurface(u, s, silhouette, offset);
        positions.push(p.x, p.y, p.z);
        uvs.push(tu, ts);
      }
    }
  }

  const stride = sSteps + 1;
  const layerSize = (uSteps + 1) * stride;

  for (let iu = 0; iu < uSteps; iu++) {
    for (let is = 0; is < sSteps; is++) {
      const oa = layerSize + iu * stride + is;
      const ob = layerSize + (iu + 1) * stride + is;
      const oc = layerSize + (iu + 1) * stride + (is + 1);
      const od = layerSize + iu * stride + (is + 1);
      indices.push(oa, od, ob);
      indices.push(ob, od, oc);

      const ia = iu * stride + is;
      const ib = (iu + 1) * stride + is;
      const ic = (iu + 1) * stride + (is + 1);
      const id = iu * stride + (is + 1);
      indices.push(ia, ib, id);
      indices.push(ib, ic, id);
    }
  }

  for (let iu = 0; iu < uSteps; iu++) {
    const i0 = iu * stride;
    const i1 = (iu + 1) * stride;
    const o0 = layerSize + i0;
    const o1 = layerSize + i1;
    indices.push(i0, i1, o0, i1, o1, o0);

    const j0 = iu * stride + sSteps;
    const j1 = (iu + 1) * stride + sSteps;
    const p0 = layerSize + j0;
    const p1 = layerSize + j1;
    indices.push(j0, p0, j1, j1, p0, p1);
  }
  for (let is = 0; is < sSteps; is++) {
    const i0 = is;
    const i1 = is + 1;
    const o0 = layerSize + i0;
    const o1 = layerSize + i1;
    indices.push(i0, o0, i1, i1, o0, o1);

    const j0 = uSteps * stride + is;
    const j1 = uSteps * stride + is + 1;
    const p0 = layerSize + j0;
    const p1 = layerSize + j1;
    indices.push(j0, j1, p0, j1, p1, p0);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function applyFinishToMaterial(
  mat: THREE.MeshPhysicalMaterial,
  finish: MaterialFinish,
  textures: ProceduralTextureSet
) {
  if (finish === 'leather') {
    mat.bumpMap = textures.leatherBump;
    mat.bumpScale = 0.012;
    mat.roughness = 0.36;
    mat.metalness = 0.02;
    mat.clearcoat = 0.24;
    mat.clearcoatRoughness = 0.3;
    mat.sheen = 0.0;
  } else if (finish === 'suede') {
    mat.bumpMap = textures.suedeBump;
    mat.bumpScale = 0.028;
    mat.roughness = 0.88;
    mat.metalness = 0.0;
    mat.clearcoat = 0.0;
    mat.sheen = 0.78;
    mat.sheenRoughness = 0.68;
    mat.sheenColor.set('#ffffff');
  } else if (finish === 'knit') {
    mat.bumpMap = textures.knitBump;
    mat.bumpScale = 0.024;
    mat.roughness = 0.78;
    mat.metalness = 0.03;
    mat.clearcoat = 0.0;
    mat.sheen = 0.32;
    mat.sheenRoughness = 0.6;
  } else {
    mat.bumpMap = textures.knitBump;
    mat.bumpScale = 0.006;
    mat.roughness = 0.22;
    mat.metalness = 0.14;
    mat.clearcoat = 0.88;
    mat.clearcoatRoughness = 0.14;
    mat.sheen = 0.0;
  }
  mat.needsUpdate = true;
}

export function buildShoeAssembly(
  config: ShoeConfig,
  textures: ProceduralTextureSet
): ShoeAssembly {
  const root = new THREE.Group();
  const outsoleGroup = new THREE.Group();
  const midsoleGroup = new THREE.Group();
  const upperGroup = new THREE.Group();
  const stripesGroup = new THREE.Group();
  const tongueGroup = new THREE.Group();
  const lacesGroup = new THREE.Group();
  const heelTabGroup = new THREE.Group();

  root.add(
    outsoleGroup,
    midsoleGroup,
    upperGroup,
    stripesGroup,
    tongueGroup,
    lacesGroup,
    heelTabGroup
  );

  const isRunner = config.silhouette === 'originals-runner';
  const isRacer = config.silhouette === 'running-racer';
  const isBoot = config.silhouette === 'football-boot';
  const isShell = config.silhouette === 'superstar-shell';

  const materials = {
    upper: new THREE.MeshPhysicalMaterial({ color: config.upperColor }),
    toeOverlay: new THREE.MeshPhysicalMaterial({
      color: isRunner
        ? '#B8BBC0' // Dove grey overlay matching uploaded shoe
        : isShell
        ? config.soleColor
        : config.upperColor,
      roughness: isRunner ? 0.56 : isShell ? 0.52 : 0.86,
      bumpMap: isRunner || isShell ? textures.leatherBump : textures.suedeBump,
      bumpScale: isRunner || isShell ? 0.01 : 0.024,
      sheen: isRunner || isShell ? 0 : 0.65,
      sheenColor: new THREE.Color('#ffffff'),
    }),
    stripes: new THREE.MeshPhysicalMaterial({
      color: config.stripesColor,
      roughness: isBoot ? 0.22 : 0.36,
      metalness: isBoot ? 0.55 : 0.05,
      clearcoat: 0.25,
      bumpMap: textures.leatherBump,
      bumpScale: 0.008,
    }),
    midsole: new THREE.MeshPhysicalMaterial({
      color: config.soleColor,
      roughness: isRunner || isRacer ? 0.46 : 0.58,
      metalness: isBoot ? 0.78 : 0.02,
      clearcoat: isBoot ? 0.88 : 0.08,
      bumpMap: textures.leatherBump,
      bumpScale: 0.005,
    }),
    outsole: new THREE.MeshStandardMaterial({
      color: isRunner ? '#16171a' : config.soleColor,
      roughness: 0.76,
      metalness: 0.05,
      bumpMap: textures.soleTreadBump,
      bumpScale: 0.028,
    }),
    laces: new THREE.MeshStandardMaterial({
      color: config.lacesColor,
      roughness: 0.82,
      bumpMap: textures.knitBump,
      bumpScale: 0.016,
    }),
    accent: new THREE.MeshPhysicalMaterial({
      color: config.accentColor,
      roughness: 0.34,
      metalness: 0.14,
      clearcoat: 0.28,
    }),
    collar: new THREE.MeshStandardMaterial({
      color: '#18181b',
      roughness: 0.86,
      bumpMap: textures.knitBump,
      bumpScale: 0.015,
    }),
    sockliner: new THREE.MeshStandardMaterial({
      color: '#141417',
      roughness: 0.9,
      bumpMap: textures.knitBump,
      bumpScale: 0.012,
    }),
    metal: new THREE.MeshStandardMaterial({
      color: isRunner ? '#18181b' : '#e4e4e7',
      roughness: isRunner ? 0.72 : 0.2,
      metalness: isRunner ? 0.1 : 0.92,
    }),
    stitch: new THREE.MeshStandardMaterial({
      color: '#d4d4d8',
      roughness: 0.75,
    }),
  };

  applyFinishToMaterial(materials.upper, config.finish, textures);

  // 1. SCULPTED OUTSOLE + TOE BUMPER (for Originals Runner) / STUDS (for Boot)
  const outsoleMesh = new THREE.Mesh(
    createLoftedSoleGeometry(config.silhouette, 'outsole'),
    materials.outsole
  );
  outsoleMesh.castShadow = true;
  outsoleMesh.receiveShadow = true;
  outsoleGroup.add(outsoleMesh);

  if (isRunner) {
    // Black rubber upturned toe bumper tip from the uploaded image
    const bumperGeo = createConformedPatchGeometry(
      config.silhouette,
      0.935,
      0.99,
      -0.5,
      0.5,
      0.022,
      6,
      8,
      0
    );
    const bumperMesh = new THREE.Mesh(bumperGeo, materials.outsole);
    bumperMesh.castShadow = true;
    outsoleGroup.add(bumperMesh);
  }

  if (isBoot) {
    const studCoords: Array<[number, number]> = [
      [0.10, -0.17],
      [0.10, 0.17],
      [0.22, -0.19],
      [0.22, 0.19],
      [0.58, -0.23],
      [0.58, 0.23],
      [0.72, -0.24],
      [0.72, 0.0],
      [0.72, 0.24],
      [0.86, -0.15],
      [0.86, 0.15],
    ];
    const studGeo = new THREE.CylinderGeometry(0.028, 0.044, 0.11, 12);
    const studInst = new THREE.InstancedMesh(studGeo, materials.accent, studCoords.length);
    const dummy = new THREE.Object3D();
    studCoords.forEach(([u, zOff], idx) => {
      const st = getLastStation(u, config.silhouette);
      dummy.position.set(st.x, st.soleBottomY - 0.03, st.centerZ + zOff);
      dummy.updateMatrix();
      studInst.setMatrixAt(idx, dummy.matrix);
    });
    studInst.instanceMatrix.needsUpdate = true;
    studInst.computeBoundingSphere();
    studInst.castShadow = true;
    outsoleGroup.add(studInst);
  }

  // 2. SCULPTED MIDSOLE + ARCH STABILIZER POD / CARBON RODS
  const midsoleMesh = new THREE.Mesh(
    createLoftedSoleGeometry(config.silhouette, 'midsole'),
    materials.midsole
  );
  midsoleMesh.castShadow = true;
  midsoleMesh.receiveShadow = true;
  midsoleGroup.add(midsoleMesh);

  if (isRunner) {
    // Charcoal-black arch/heel midsole stabilizer insert visible on the outer side of the uploaded shoe
    const podLatCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.72, 0.13, 0.34),
      new THREE.Vector3(-0.28, 0.21, 0.35),
      new THREE.Vector3(0.02, 0.12, 0.34),
    ]);
    const podMedCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.72, 0.13, -0.34),
      new THREE.Vector3(-0.28, 0.21, -0.35),
      new THREE.Vector3(0.02, 0.12, -0.34),
    ]);
    const podLat = new THREE.Mesh(
      new THREE.TubeGeometry(podLatCurve, 16, 0.068, 10, false),
      materials.outsole
    );
    podLat.scale.set(1, 0.65, 0.65);
    const podMed = new THREE.Mesh(
      new THREE.TubeGeometry(podMedCurve, 16, 0.068, 10, false),
      materials.outsole
    );
    podMed.scale.set(1, 0.65, 0.65);
    midsoleGroup.add(podLat, podMed);
  }

  if (isRacer) {
    const carbonMat = new THREE.MeshPhysicalMaterial({
      map: textures.carbonMap,
      roughness: 0.25,
      metalness: 0.35,
      clearcoat: 0.9,
    });
    const rodLatCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.78, 0.18, 0.31),
      new THREE.Vector3(0.05, 0.14, 0.36),
      new THREE.Vector3(0.85, 0.19, 0.26),
    ]);
    const rodMedCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.78, 0.18, -0.31),
      new THREE.Vector3(0.05, 0.14, -0.36),
      new THREE.Vector3(0.85, 0.19, -0.26),
    ]);
    const rodLat = new THREE.Mesh(new THREE.TubeGeometry(rodLatCurve, 22, 0.02, 10, false), carbonMat);
    const rodMed = new THREE.Mesh(new THREE.TubeGeometry(rodMedCurve, 22, 0.02, 10, false), carbonMat);
    midsoleGroup.add(rodLat, rodMed);
  }

  // 3. SOLID WATERTIGHT UPPER BODY + SOCKLINER + PADDED COLLAR
  const upperMesh = new THREE.Mesh(
    createLoftedUpperGeometry(config.silhouette),
    materials.upper
  );
  upperMesh.castShadow = true;
  upperMesh.receiveShadow = true;
  upperGroup.add(upperMesh);

  // Recessed dark interior sockliner inside collar opening
  const linerPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 10; i++) {
    const u = THREE.MathUtils.lerp(0.13, 0.36, i / 10);
    const st = getLastStation(u, config.silhouette);
    linerPts.push(new THREE.Vector3(st.x, st.soleTopY + 0.28, st.centerZ));
  }
  const linerMesh = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(linerPts), 14, 0.14, 10, false),
    materials.sockliner
  );
  linerMesh.scale.set(1, 0.42, 1.12);
  upperGroup.add(linerMesh);

  // Sculpted Padded Collar Ring seating cleanly on the rim
  const collarPts: THREE.Vector3[] = [];
  const collarAngles = 22;
  for (let i = 0; i < collarAngles; i++) {
    const a = (i / collarAngles) * Math.PI * 2;
    const u = 0.24 + Math.cos(a) * 0.14;
    const s = Math.sin(a) * 0.52;
    const p = evalUpperSurface(u, s, config.silhouette, 0.008);
    collarPts.push(p);
  }
  const collarMesh = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(collarPts, true),
      40,
      isBoot ? 0.032 : 0.044,
      10,
      true
    ),
    materials.collar
  );
  collarMesh.castShadow = true;
  upperGroup.add(collarMesh);

  // Forefoot Mudguard & Heel Cage Overlays
  if (isRunner) {
    // Dove-grey sculpted mudguard around forefoot (matching uploaded photo)
    const mudguard = new THREE.Mesh(
      createConformedPatchGeometry(config.silhouette, 0.68, 0.975, -0.96, 0.96, 0.014, 8, 12, 0),
      materials.toeOverlay
    );
    mudguard.castShadow = true;
    upperGroup.add(mudguard);

    // Charcoal-black structural saddle border framing the forefoot mesh
    const trimLat = new THREE.Mesh(
      createConformedPatchGeometry(config.silhouette, 0.64, 0.72, 0.25, 0.95, 0.017, 4, 8, 0.04),
      materials.accent
    );
    const trimMed = new THREE.Mesh(
      createConformedPatchGeometry(config.silhouette, 0.64, 0.72, -0.95, -0.25, 0.017, 4, 8, -0.04),
      materials.accent
    );
    upperGroup.add(trimLat, trimMed);

    // Dove-grey heel stabilizer cage
    const heelCage = new THREE.Mesh(
      createConformedPatchGeometry(config.silhouette, 0.02, 0.22, -0.92, 0.92, 0.014, 8, 12, 0),
      materials.toeOverlay
    );
    heelCage.castShadow = true;
    upperGroup.add(heelCage);

    // Sweeping dark heel/quarter accent arc (as seen under collar in uploaded photo)
    const arcLat = new THREE.Mesh(
      createConformedPatchGeometry(config.silhouette, 0.14, 0.40, 0.45, 0.60, 0.018, 8, 4, -0.03),
      materials.accent
    );
    const arcMed = new THREE.Mesh(
      createConformedPatchGeometry(config.silhouette, 0.14, 0.40, -0.60, -0.45, 0.018, 8, 4, 0.03),
      materials.accent
    );
    upperGroup.add(arcLat, arcMed);
  } else if (isShell) {
    const shellMesh = new THREE.Mesh(
      createConformedPatchGeometry(config.silhouette, 0.74, 0.98, -0.95, 0.95, 0.022, 8, 12, 0),
      materials.toeOverlay
    );
    shellMesh.castShadow = true;
    upperGroup.add(shellMesh);

    for (let r = -3; r <= 3; r++) {
      const sRidge = r * 0.23;
      const rCurve = new THREE.CatmullRomCurve3([
        evalUpperSurface(0.75, sRidge, config.silhouette, 0.026),
        evalUpperSurface(0.86, sRidge * 0.85, config.silhouette, 0.028),
        evalUpperSurface(0.96, sRidge * 0.5, config.silhouette, 0.024),
      ]);
      upperGroup.add(
        new THREE.Mesh(new THREE.TubeGeometry(rCurve, 10, 0.01, 6, false), materials.toeOverlay)
      );
    }
  } else if (!isBoot) {
    const tToeMesh = new THREE.Mesh(
      createConformedPatchGeometry(config.silhouette, 0.74, 0.975, -0.95, 0.95, 0.015, 8, 12, 0),
      materials.toeOverlay
    );
    tToeMesh.castShadow = true;
    upperGroup.add(tToeMesh);
  }

  // Eyestay / Lace Guard Panels
  const eyestayMat = isRunner ? materials.toeOverlay : materials.upper;
  const eyestayLat = new THREE.Mesh(
    createConformedPatchGeometry(config.silhouette, 0.35, 0.7, 0.24, 0.5, 0.016, 10, 5, 0.03),
    eyestayMat
  );
  const eyestayMed = new THREE.Mesh(
    createConformedPatchGeometry(config.silhouette, 0.35, 0.7, -0.5, -0.24, 0.016, 10, 5, -0.03),
    eyestayMat
  );
  eyestayLat.castShadow = true;
  eyestayMed.castShadow = true;
  upperGroup.add(eyestayLat, eyestayMed);

  if (isBoot) {
    const finGeo = new THREE.BoxGeometry(0.14, 0.018, 0.028);
    const finInst = new THREE.InstancedMesh(finGeo, materials.accent, 6);
    const fDummy = new THREE.Object3D();
    for (let i = 0; i < 6; i++) {
      const uPos = 0.52 + i * 0.055;
      const p = evalUpperSurface(uPos, 0.45, config.silhouette, 0.018);
      fDummy.position.copy(p);
      fDummy.rotation.set(0.25, 0.35, -0.3);
      fDummy.updateMatrix();
      finInst.setMatrixAt(i, fDummy.matrix);
    }
    finInst.instanceMatrix.needsUpdate = true;
    finInst.computeBoundingSphere();
    upperGroup.add(finInst);
  }

  // 4. CONTOURED THREE STRIPES (hugging side quarters seamlessly)
  const stripeCenters = [0.36, 0.47, 0.58];
  stripeCenters.forEach((uCenter) => {
    const stripeLat = new THREE.Mesh(
      createConformedPatchGeometry(
        config.silhouette,
        uCenter - 0.03,
        uCenter + 0.03,
        0.46,
        0.95,
        0.017,
        5,
        8,
        0.12
      ),
      materials.stripes
    );
    const stripeMed = new THREE.Mesh(
      createConformedPatchGeometry(
        config.silhouette,
        uCenter - 0.03,
        uCenter + 0.03,
        -0.95,
        -0.46,
        0.017,
        5,
        8,
        -0.12
      ),
      materials.stripes
    );
    stripeLat.castShadow = true;
    stripeMed.castShadow = true;
    stripesGroup.add(stripeLat, stripeMed);
  });

  // 5. SCULPTED HEEL TAB + WOVEN PULL-TAB LOOP (matching uploaded runner photo)
  const heelTabMesh = new THREE.Mesh(
    createConformedPatchGeometry(config.silhouette, 0.015, 0.14, -0.42, 0.42, 0.02, 6, 8, 0),
    materials.accent
  );
  heelTabMesh.castShadow = true;
  heelTabGroup.add(heelTabMesh);

  if (isRunner) {
    const pTop = evalUpperSurface(0.08, 0, config.silhouette, 0.015);
    const loopCurve = new THREE.CatmullRomCurve3([
      pTop.clone().add(new THREE.Vector3(0.02, -0.02, 0.03)),
      pTop.clone().add(new THREE.Vector3(-0.12, 0.08, 0.02)),
      pTop.clone().add(new THREE.Vector3(-0.14, 0.11, 0)),
      pTop.clone().add(new THREE.Vector3(-0.12, 0.08, -0.02)),
      pTop.clone().add(new THREE.Vector3(0.02, -0.02, -0.03)),
    ]);
    const pullLoop = new THREE.Mesh(
      new THREE.TubeGeometry(loopCurve, 18, 0.018, 8, false),
      materials.accent
    );
    pullLoop.castShadow = true;
    heelTabGroup.add(pullLoop);
  }

  // 6. PADDED CURVED TONGUE & ADIDAS MOUNTAIN CREST LABEL
  const tongueMesh = new THREE.Mesh(
    createConformedPatchGeometry(config.silhouette, 0.3, 0.66, -0.25, 0.25, 0.026, 10, 8, 0),
    materials.upper
  );
  tongueMesh.position.y += 0.018;
  tongueMesh.castShadow = true;
  tongueGroup.add(tongueMesh);

  const labelPos = evalUpperSurface(0.35, 0, config.silhouette, 0.052);
  const labelGeo = new THREE.PlaneGeometry(0.15, 0.15);
  const labelMat = new THREE.MeshStandardMaterial({
    map: textures.tongueLabelMap,
    roughness: 0.62,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.position.copy(labelPos);
  labelMesh.lookAt(labelPos.x + 0.45, labelPos.y + 0.88, labelPos.z);
  tongueGroup.add(labelMesh);

  // 7. EYELETS & TUBULAR LACES
  const eyeletCount = 6;
  const eyeletGeo = new THREE.TorusGeometry(0.019, 0.006, 8, 14);
  const eyeletInst = new THREE.InstancedMesh(eyeletGeo, materials.metal, eyeletCount * 2);
  const eDummy = new THREE.Object3D();
  const lacePointsLeft: THREE.Vector3[] = [];
  const lacePointsRight: THREE.Vector3[] = [];

  for (let i = 0; i < eyeletCount; i++) {
    const t = i / (eyeletCount - 1);
    const u = THREE.MathUtils.lerp(0.68, 0.38, t);
    const pLat = evalUpperSurface(u, 0.29, config.silhouette, 0.02);
    const pMed = evalUpperSurface(u, -0.29, config.silhouette, 0.02);

    eDummy.position.copy(pLat);
    eDummy.rotation.set(Math.PI / 2 - 0.38, 0, 0);
    eDummy.updateMatrix();
    eyeletInst.setMatrixAt(i * 2, eDummy.matrix);

    eDummy.position.copy(pMed);
    eDummy.rotation.set(Math.PI / 2 + 0.38, 0, 0);
    eDummy.updateMatrix();
    eyeletInst.setMatrixAt(i * 2 + 1, eDummy.matrix);

    lacePointsLeft.push(pLat.clone().add(new THREE.Vector3(0, 0.012, 0)));
    lacePointsRight.push(pMed.clone().add(new THREE.Vector3(0, 0.012, 0)));
  }
  eyeletInst.instanceMatrix.needsUpdate = true;
  eyeletInst.computeBoundingSphere();
  upperGroup.add(eyeletInst);

  for (let i = 0; i < eyeletCount - 1; i++) {
    const pL = lacePointsLeft[i];
    const pRNext = lacePointsRight[i + 1];
    const mid1 = pL.clone().lerp(pRNext, 0.5).add(new THREE.Vector3(0, 0.022, 0));
    const m1 = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3([pL, mid1, pRNext]), 12, 0.015, 7, false),
      materials.laces
    );
    m1.castShadow = true;

    const pR = lacePointsRight[i];
    const pLNext = lacePointsLeft[i + 1];
    const mid2 = pR.clone().lerp(pLNext, 0.5).add(new THREE.Vector3(0, 0.028, 0));
    const m2 = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3([pR, mid2, pLNext]), 12, 0.015, 7, false),
      materials.laces
    );
    m2.castShadow = true;

    lacesGroup.add(m1, m2);
  }

  const topLeft = lacePointsLeft[eyeletCount - 1];
  const topRight = lacePointsRight[eyeletCount - 1];
  const bowCurve = new THREE.CatmullRomCurve3([
    topLeft,
    topLeft.clone().add(new THREE.Vector3(-0.07, 0.09, 0.14)),
    topLeft.clone().add(new THREE.Vector3(-0.01, 0.04, 0)),
    topRight.clone().add(new THREE.Vector3(-0.01, 0.04, 0)),
    topRight.clone().add(new THREE.Vector3(-0.07, 0.09, -0.14)),
    topRight,
  ]);
  const bowMesh = new THREE.Mesh(
    new THREE.TubeGeometry(bowCurve, 26, 0.015, 7, false),
    materials.laces
  );
  bowMesh.castShadow = true;
  lacesGroup.add(bowMesh);

  root.position.y = 0;

  return {
    root,
    parts: {
      outsoleGroup,
      midsoleGroup,
      upperGroup,
      stripesGroup,
      tongueGroup,
      lacesGroup,
      heelTabGroup,
    },
    materials,
    silhouette: config.silhouette,
  };
}

export function updateShoeAppearance(
  assembly: ShoeAssembly,
  config: ShoeConfig,
  textures: ProceduralTextureSet
) {
  const isRunner = config.silhouette === 'originals-runner';
  assembly.materials.upper.color.set(config.upperColor);
  applyFinishToMaterial(assembly.materials.upper, config.finish, textures);

  assembly.materials.toeOverlay.color.set(
    isRunner
      ? '#B8BBC0'
      : config.silhouette === 'superstar-shell'
      ? config.soleColor
      : config.upperColor
  );
  assembly.materials.stripes.color.set(config.stripesColor);
  assembly.materials.midsole.color.set(config.soleColor);
  assembly.materials.outsole.color.set(isRunner ? '#16171a' : config.soleColor);
  assembly.materials.laces.color.set(config.lacesColor);
  assembly.materials.accent.color.set(config.accentColor);
}

export function applyShoeExplode(assembly: ShoeAssembly, explodeAmount: number) {
  const e = THREE.MathUtils.clamp(explodeAmount, 0, 1);
  assembly.parts.outsoleGroup.position.y = -0.32 * e;
  assembly.parts.midsoleGroup.position.y = -0.14 * e;
  assembly.parts.upperGroup.position.y = 0.08 * e;
  assembly.parts.stripesGroup.position.y = 0.16 * e;
  assembly.parts.tongueGroup.position.set(-0.18 * e, 0.34 * e, 0);
  assembly.parts.lacesGroup.position.set(0.06 * e, 0.46 * e, 0);
  assembly.parts.heelTabGroup.position.set(-0.24 * e, 0.22 * e, 0);
}

export function disposeObject3D(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if ((child as THREE.InstancedMesh).isInstancedMesh) {
      (child as THREE.InstancedMesh).dispose();
    }
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material?.dispose();
      }
    }
  });
}
