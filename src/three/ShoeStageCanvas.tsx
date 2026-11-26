import { type MutableRefObject, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import type { ShoeConfig } from '../data/catalog';
import {
  applyShoeExplode,
  buildShoeAssembly,
  disposeObject3D,
  type ShoeAssembly,
  updateShoeAppearance,
} from './shoeBuilder';
import { createProceduralTextures, type ProceduralTextureSet } from './textures';

export type CameraPreset = 'hero' | 'profile' | 'top' | 'heel' | 'sole';
export type StageEnvironment = 'studio' | 'concrete' | 'track' | 'pitch';

interface ShoeStageCanvasProps {
  config: ShoeConfig;
  cameraPreset?: CameraPreset;
  environment?: StageEnvironment;
  autoRotate?: boolean;
  revealCount?: number;
  zoomScale?: number;
  scrollProgressRef?: MutableRefObject<number>;
  className?: string;
  fallbackImage?: string;
  fallbackAlt?: string;
  interactive?: boolean;
}

const PRESET_POSITIONS: Record<CameraPreset, [number, number, number]> = {
  hero: [2.25, 1.22, 2.45],
  profile: [0.12, 0.65, 3.15],
  top: [0.05, 3.25, 0.52],
  heel: [-2.85, 1.05, 1.25],
  sole: [1.65, -1.15, 2.25],
};

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function ShoeStageCanvas({
  config,
  cameraPreset = 'hero',
  environment = 'studio',
  autoRotate = true,
  revealCount = 0,
  zoomScale = 1,
  scrollProgressRef,
  className = '',
  fallbackImage,
  fallbackAlt = 'Adidas 3D footwear studio preview',
  interactive = true,
}: ShoeStageCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const configRef = useRef(config);
  configRef.current = config;

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const zoomScaleRef = useRef(zoomScale);
  zoomScaleRef.current = zoomScale;

  const basePresetPosRef = useRef(new THREE.Vector3(...PRESET_POSITIONS[cameraPreset]));
  const targetCamPosRef = useRef(new THREE.Vector3(...PRESET_POSITIONS[cameraPreset]));
  const transitioningCamRef = useRef(false);
  const revealSpinRef = useRef(0);

  const sceneRefs = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    textures: ProceduralTextureSet;
    shoeGroup: THREE.Group;
    assembly: ShoeAssembly | null;
    plinthMesh: THREE.Mesh;
    trackLinesGroup: THREE.Group;
    rimLight: THREE.DirectionalLight;
    explodeCurrent: number;
  } | null>(null);

  // Trigger camera preset or zoom-button transition
  useEffect(() => {
    const pos = PRESET_POSITIONS[cameraPreset];
    basePresetPosRef.current.set(pos[0], pos[1], pos[2]);
    const distScale = 1 / THREE.MathUtils.clamp(zoomScale, 0.6, 1.65);
    targetCamPosRef.current
      .copy(basePresetPosRef.current)
      .multiplyScalar(distScale);
    transitioningCamRef.current = true;
  }, [cameraPreset, zoomScale]);

  // Trigger reveal spin
  useEffect(() => {
    if (revealCount > 0) {
      revealSpinRef.current = Math.PI * 2;
      const distScale = 1 / THREE.MathUtils.clamp(zoomScaleRef.current, 0.6, 1.65);
      targetCamPosRef.current
        .set(...PRESET_POSITIONS.hero)
        .multiplyScalar(distScale);
      transitioningCamRef.current = true;
    }
  }, [revealCount]);

  // Initialize Three.js WebGL stage once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const testCanvas = document.createElement('canvas');
    const hasGl = !!(testCanvas.getContext('webgl2') || testCanvas.getContext('webgl'));
    if (!hasGl) {
      setWebglUnavailable(true);
      return;
    }

    const isSoftwareGl = detectSoftwareGl();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.055);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
    camera.position.set(...PRESET_POSITIONS.hero);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    // CRITICAL: Disable wheel zoom so scrolling the page never hijacks into 3D camera zoom.
    controls.enableZoom = false;
    controls.enableRotate = interactive;
    controls.minDistance = 1.75;
    controls.maxDistance = 5.5;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = Math.PI * 0.64;
    controls.target.set(0, 0.38, 0);
    controls.update();
    // Allow vertical touch scrolling on mobile while keeping horizontal drag orbit
    renderer.domElement.style.touchAction = 'pan-y';

    const cancelTransition = () => {
      transitioningCamRef.current = false;
    };
    controls.addEventListener('start', cancelTransition);

    // 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xe0e7ff, 0x18181b, 0.78);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.35);
    keyLight.position.set(3.5, 5.5, 4.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -2.6;
    keyLight.shadow.camera.right = 2.6;
    keyLight.shadow.camera.top = 2.6;
    keyLight.shadow.camera.bottom = -2.6;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4d4d8, 0.85);
    fillLight.position.set(-3.5, 2.2, 3.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf4f4f5, 1.65);
    rimLight.position.set(-4.0, 2.8, -3.5);
    scene.add(rimLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softboxTop = new THREE.RectAreaLight(0xffffff, 2.6, 4.5, 2.2);
      softboxTop.position.set(0, 4.2, 1.2);
      softboxTop.lookAt(0, 0.4, 0);
      scene.add(softboxTop);
    }

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = createProceduralTextures(maxAniso);

    // Contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(3.8, 3.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: textures.contactShadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.78,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.015;
    scene.add(shadowPlane);

    // Architectural Plinth
    const plinthGeo = new THREE.CylinderGeometry(1.78, 1.88, 0.14, 56);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x121215,
      roughness: 0.62,
      metalness: 0.22,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -0.10;
    plinthMesh.receiveShadow = true;
    scene.add(plinthMesh);

    // Track / Pitch subtle architectural accents
    const trackLinesGroup = new THREE.Group();
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xf4f4f2,
      transparent: true,
      opacity: 0.22,
    });
    for (let i = -1; i <= 1; i += 2) {
      const strip = new THREE.Mesh(new THREE.PlaneGeometry(8, 0.025), lineMat);
      strip.rotation.x = -Math.PI / 2;
      strip.position.set(0, -0.022, i * 0.92);
      trackLinesGroup.add(strip);
    }
    trackLinesGroup.visible = false;
    scene.add(trackLinesGroup);

    // Shoe Root Container
    const shoeGroup = new THREE.Group();
    scene.add(shoeGroup);

    const assembly = buildShoeAssembly(configRef.current, textures);
    shoeGroup.add(assembly.root);

    sceneRefs.current = {
      scene,
      camera,
      renderer,
      controls,
      textures,
      shoeGroup,
      assembly,
      plinthMesh,
      trackLinesGroup,
      rimLight,
      explodeCurrent: configRef.current.explode,
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 1);
        const h = Math.max(entry.contentRect.height, 1);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let isInView = true;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed || !isInView) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = () => {
      if (disposed || !isInView) return;
      const dt = Math.min(clock.getDelta(), 0.08);
      const elapsed = clock.getElapsedTime();
      const refs = sceneRefs.current;
      if (!refs) return;

      // Smoothly damp camera preset / button-zoom transitions
      if (transitioningCamRef.current) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          targetCamPosRef.current.x,
          6.0,
          dt
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          targetCamPosRef.current.y,
          6.0,
          dt
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          targetCamPosRef.current.z,
          6.0,
          dt
        );
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.015) {
          transitioningCamRef.current = false;
        }
      }

      // Smoothly damp exploded view
      refs.explodeCurrent = THREE.MathUtils.damp(
        refs.explodeCurrent,
        configRef.current.explode,
        7.0,
        dt
      );
      if (refs.assembly) {
        applyShoeExplode(refs.assembly, refs.explodeCurrent);
      }

      // Reveal spin + subtle float + scroll choreography (via ref, zero React re-renders)
      if (revealSpinRef.current > 0.001) {
        const step = Math.min(revealSpinRef.current, dt * 4.8);
        refs.shoeGroup.rotation.y += step;
        revealSpinRef.current -= step;
      } else if (autoRotateRef.current && !reducedMotion) {
        refs.shoeGroup.rotation.y += dt * 0.28;
      }

      const scrollOffset = scrollProgressRef ? scrollProgressRef.current : 0;
      refs.shoeGroup.position.y =
        (reducedMotion ? 0.03 : Math.sin(elapsed * 1.35) * 0.028 + 0.03) +
        scrollOffset * 0.2;
      refs.shoeGroup.rotation.z = THREE.MathUtils.damp(
        refs.shoeGroup.rotation.z,
        scrollOffset * 0.14,
        4.0,
        dt
      );

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible && !isInView) {
          isInView = true;
          clock.getDelta();
          tick();
        } else if (!visible) {
          isInView = false;
          cancelAnimationFrame(frameId);
          clearTimeout(frameId);
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    tick();

    return () => {
      disposed = true;
      visibilityObserver.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', cancelTransition);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      disposeObject3D(scene);
      textures.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      sceneRefs.current = null;
    };
  }, [interactive, scrollProgressRef]);

  // Update shoe geometry / materials when config changes
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs) return;

    if (!refs.assembly || refs.assembly.silhouette !== config.silhouette) {
      if (refs.assembly) {
        refs.shoeGroup.remove(refs.assembly.root);
        disposeObject3D(refs.assembly.root);
      }
      refs.assembly = buildShoeAssembly(config, refs.textures);
      refs.shoeGroup.add(refs.assembly.root);
    } else {
      updateShoeAppearance(refs.assembly, config, refs.textures);
    }
  }, [config]);

  // Update environment stage aesthetic
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs) return;
    const plinthMat = refs.plinthMesh.material as THREE.MeshStandardMaterial;

    if (environment === 'track') {
      plinthMat.color.set('#141619');
      refs.trackLinesGroup.visible = true;
      refs.rimLight.color.set('#d4ff00');
      refs.rimLight.intensity = 1.65;
    } else if (environment === 'pitch') {
      plinthMat.color.set('#0f1a14');
      refs.trackLinesGroup.visible = true;
      refs.rimLight.color.set('#ef4444');
      refs.rimLight.intensity = 1.75;
    } else if (environment === 'concrete') {
      plinthMat.color.set('#1c1c20');
      refs.trackLinesGroup.visible = false;
      refs.rimLight.color.set('#f4f4f2');
      refs.rimLight.intensity = 1.45;
    } else {
      plinthMat.color.set('#121215');
      refs.trackLinesGroup.visible = false;
      refs.rimLight.color.set('#e4e4e7');
      refs.rimLight.intensity = 1.55;
    }
  }, [environment]);

  if (webglUnavailable) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-[#121215] ${className}`}
      >
        {fallbackImage ? (
          <img
            src={fallbackImage}
            alt={fallbackAlt}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-90"
          />
        ) : (
          <div className="text-center p-8">
            <p className="font-display text-2xl uppercase tracking-tight text-zinc-200">
              Interactive 3D Studio Preview
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Hardware WebGL is currently unavailable in this browser session.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D Adidas footwear viewport"
      className={`relative w-full h-full cursor-grab active:cursor-grabbing ${className}`}
    />
  );
}
