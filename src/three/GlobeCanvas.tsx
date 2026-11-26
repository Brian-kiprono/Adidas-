import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { GlobalBrandHub } from '../data/heritage';
import { disposeObject3D } from './shoeBuilder';
import { createProceduralTextures } from './textures';

interface GlobeCanvasProps {
  hubs: GlobalBrandHub[];
  activeHubId: string;
  onSelectHub: (hubId: string) => void;
  className?: string;
}

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function GlobeCanvas({
  hubs,
  activeHubId,
  onSelectHub,
  className = '',
}: GlobeCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);

  const onSelectRef = useRef(onSelectHub);
  onSelectRef.current = onSelectHub;

  const activeHubRef = useRef(activeHubId);
  activeHubRef.current = activeHubId;

  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const pinMeshesRef = useRef<Array<{ id: string; mesh: THREE.Mesh; ring: THREE.Mesh }>>([]);

  useEffect(() => {
    const hub = hubs.find((h) => h.id === activeHubId);
    if (hub) {
      const pos = latLonToVector3(hub.lat, hub.lon, 3.6);
      targetCamPosRef.current = pos;
    }
    pinMeshesRef.current.forEach(({ id, mesh, ring }) => {
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const rMat = ring.material as THREE.MeshBasicMaterial;
      const isSelected = id === activeHubId;
      mat.color.set(isSelected ? '#d4ff00' : '#f4f4f2');
      mesh.scale.setScalar(isSelected ? 1.55 : 1.0);
      rMat.opacity = isSelected ? 0.95 : 0.35;
      ring.scale.setScalar(isSelected ? 1.45 : 1.0);
    });
  }, [activeHubId, hubs]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const testCanvas = document.createElement('canvas');
    if (!(testCanvas.getContext('webgl2') || testCanvas.getContext('webgl'))) {
      setWebglError(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 30);
    const initialHub = hubs.find((h) => h.id === activeHubRef.current) || hubs[0];
    camera.position.copy(latLonToVector3(initialHub.lat, initialHub.lon, 3.6));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 2.4;
    controls.maxDistance = 5.2;
    renderer.domElement.style.touchAction = 'pan-y';

    controls.addEventListener('start', () => {
      targetCamPosRef.current = null;
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dirLight = new THREE.DirectionalLight(0xf4f4f2, 1.4);
    dirLight.position.set(4, 3, 4);
    scene.add(dirLight);

    const textures = createProceduralTextures(renderer.capabilities.getMaxAnisotropy());
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = 1.32;
    const sphereGeo = new THREE.SphereGeometry(radius, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: textures.earthAlbedoMap,
      bumpMap: textures.earthBumpMap,
      bumpScale: 0.025,
      roughness: 0.78,
      metalness: 0.18,
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earthMesh);

    // Architectural wireframe shell
    const wireGeo = new THREE.SphereGeometry(radius * 1.008, 24, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.045,
    });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // Equatorial architectural ring
    const ringGeo = new THREE.RingGeometry(radius * 1.18, radius * 1.185, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf4f4f2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const eqRing = new THREE.Mesh(ringGeo, ringMat);
    eqRing.rotation.x = Math.PI / 2;
    globeGroup.add(eqRing);

    // Interactive Hub Pins
    const pinGeo = new THREE.SphereGeometry(0.036, 16, 16);
    const haloGeo = new THREE.RingGeometry(0.052, 0.068, 24);
    const createdPins: Array<{ id: string; mesh: THREE.Mesh; ring: THREE.Mesh }> = [];

    hubs.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, radius * 1.015);
      const isSelected = hub.id === activeHubRef.current;

      const pinMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xd4ff00 : 0xf4f4f2,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      pin.scale.setScalar(isSelected ? 1.55 : 1);
      pin.userData = { hubId: hub.id };

      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xf4f4f2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.35,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      halo.lookAt(pos.clone().multiplyScalar(2));

      globeGroup.add(pin, halo);
      createdPins.push({ id: hub.id, mesh: pin, ring: halo });
    });
    pinMeshesRef.current = createdPins;

    // Raycasting on pointer click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(createdPins.map((p) => p.mesh));
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.hubId as string;
        if (hitId) onSelectRef.current(hitId);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

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

    const animate = () => {
      if (disposed || !isInView) return;
      const dt = Math.min(clock.getDelta(), 0.08);

      if (targetCamPosRef.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPosRef.current.x, 4.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPosRef.current.y, 4.5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPosRef.current.z, 4.5, dt);
        camera.lookAt(0, 0, 0);
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.03) {
          targetCamPosRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible && !isInView) {
          isInView = true;
          clock.getDelta();
          animate();
        } else if (!visible) {
          isInView = false;
          cancelAnimationFrame(frameId);
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);
    animate();

    return () => {
      disposed = true;
      visibilityObserver.disconnect();
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      disposeObject3D(scene);
      textures.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      pinMeshesRef.current = [];
    };
  }, [hubs]);

  if (webglError) {
    return (
      <div className={`flex items-center justify-center bg-[#121215] p-8 text-center ${className}`}>
        <p className="text-sm text-zinc-400">
          3D Globe requires WebGL. Select any city from the global directory to explore its story.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D Global Brand Map"
      className={`relative w-full h-full cursor-grab active:cursor-grabbing ${className}`}
    />
  );
}
