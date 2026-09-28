import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface UavModel3DProps {
  className?: string;
  interactive?: boolean; // allow drag to rotate
  flightMode?: 'hover' | 'cruise' | 'landing' | 'display';
  rotorSpeed?: number;
  highlightSensor?: boolean;
}

export const UavModel3D: React.FC<UavModel3DProps> = ({
  className = 'w-full h-full min-h-[320px]',
  interactive = true,
  flightMode = 'hover',
  rotorSpeed = 1,
  highlightSensor = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0.32, y: -0.75 });
  const targetRotRef = useRef({ x: 0.32, y: -0.75 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 380;

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff7700, 1.5);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(0, -2, 4);
    scene.add(fillLight);

    // UAV Root Group
    const uavGroup = new THREE.Group();
    scene.add(uavGroup);

    // --- MATERIALS MATCHING THE SCREENSHOT CAD MODEL ---
    // Vibrant Bright Safety Orange
    const orangeMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      roughness: 0.3,
      metalness: 0.1,
    });

    const lightOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xff7b1a,
      roughness: 0.35,
      metalness: 0.1,
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1f2327,
      roughness: 0.4,
      metalness: 0.75,
    });

    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.25,
      metalness: 0.85,
    });

    const jetsonPcbMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Green PCB
      roughness: 0.5,
    });

    const heatSinkMat = new THREE.MeshStandardMaterial({
      color: 0x111827, // Black heatsink fins
      roughness: 0.3,
      metalness: 0.7,
    });

    const propMat = new THREE.MeshStandardMaterial({
      color: 0xff7700, // Orange 2-blade propellers from CAD screenshot
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    });

    const sensorGlowMat = new THREE.MeshStandardMaterial({
      color: highlightSensor ? 0x10b981 : 0x0284c7,
      emissive: highlightSensor ? 0x059669 : 0x0369a1,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.8,
    });

    // 1. Central Aerodynamic Orange Fuselage
    // Long wedge-shaped front to aft fuselage matching screenshot
    const fuselageGeo = new THREE.BoxGeometry(0.32, 0.22, 2.7);
    const fuselage = new THREE.Mesh(fuselageGeo, orangeMat);
    fuselage.castShadow = true;
    fuselage.position.set(0, 0, 0);
    uavGroup.add(fuselage);

    // Tapered Nose Section
    const noseGeo = new THREE.ConeGeometry(0.24, 0.7, 4);
    noseGeo.rotateX(Math.PI / 2);
    noseGeo.rotateY(Math.PI / 4);
    noseGeo.scale(0.9, 0.65, 1);
    const nose = new THREE.Mesh(noseGeo, orangeMat);
    nose.position.set(0, 0, 1.6);
    uavGroup.add(nose);

    // Front Cylindrical Camera Sensor Unit (at nose tip)
    const cameraGimbal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.22, 24),
      darkMetalMat
    );
    cameraGimbal.position.set(0, -0.06, 1.95);
    cameraGimbal.rotateX(Math.PI / 2);
    uavGroup.add(cameraGimbal);

    // Sensor lens (optical + thermal FLIR aperture)
    const lensRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.04, 24),
      sensorGlowMat
    );
    lensRing.position.set(0, -0.06, 2.06);
    lensRing.rotateX(Math.PI / 2);
    uavGroup.add(lensRing);

    // 2. Exposed Avionics Deck & Jetson Nano Board
    // Avionics Tray
    const trayGeo = new THREE.BoxGeometry(0.28, 0.04, 1.2);
    const avionicsTray = new THREE.Mesh(trayGeo, lightOrangeMat);
    avionicsTray.position.set(0, 0.12, 0.1);
    uavGroup.add(avionicsTray);

    // Jetson Nano Edge AI Module
    const jetsonPcb = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.02, 0.28),
      jetsonPcbMat
    );
    jetsonPcb.position.set(0, 0.14, 0.45);
    uavGroup.add(jetsonPcb);

    // Black heatsink pin array on Jetson
    const heatSinkBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.05, 0.22),
      heatSinkMat
    );
    heatSinkBase.position.set(0, 0.17, 0.45);
    uavGroup.add(heatSinkBase);

    // Heatsink fins
    for (let f = -0.07; f <= 0.07; f += 0.035) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.04, 0.012),
        heatSinkMat
      );
      fin.position.set(0, 0.21, 0.45 + f);
      uavGroup.add(fin);
    }

    // Battery / Power Module
    const battery = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.08, 0.38),
      silverMetalMat
    );
    battery.position.set(0, 0.15, -0.15);
    uavGroup.add(battery);

    // Central GPS Mast & Circular Disc Puck (as seen in screenshot)
    const gpsMast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.32, 12),
      silverMetalMat
    );
    gpsMast.position.set(0, 0.26, -0.45);
    uavGroup.add(gpsMast);

    const gpsDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.03, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    gpsDisc.position.set(0, 0.42, -0.45);
    uavGroup.add(gpsDisc);

    // 3. High-Mounted Straight Rectangular Main Wing (Bright Orange)
    const mainWingGeo = new THREE.BoxGeometry(2.8, 0.04, 0.45);
    const mainWing = new THREE.Mesh(mainWingGeo, orangeMat);
    mainWing.castShadow = true;
    mainWing.position.set(0, 0.12, -0.32);
    uavGroup.add(mainWing);

    // Wingtips
    const leftTip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.44), lightOrangeMat);
    leftTip.position.set(-1.4, 0.14, -0.32);
    uavGroup.add(leftTip);

    const rightTip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.44), lightOrangeMat);
    rightTip.position.set(1.4, 0.14, -0.32);
    uavGroup.add(rightTip);

    // 4. Twin Vertical Stabilizer Fins (H-Tail in Bright Orange)
    const leftFinGeo = new THREE.BoxGeometry(0.03, 0.65, 0.42);
    const leftTailFin = new THREE.Mesh(leftFinGeo, orangeMat);
    leftTailFin.position.set(-0.25, 0.34, -1.35);
    uavGroup.add(leftTailFin);

    const rightFinGeo = new THREE.BoxGeometry(0.03, 0.65, 0.42);
    const rightTailFin = new THREE.Mesh(rightFinGeo, orangeMat);
    rightTailFin.position.set(0.25, 0.34, -1.35);
    uavGroup.add(rightTailFin);

    // Horizontal Tail Stabilizer
    const hTailGeo = new THREE.BoxGeometry(0.55, 0.03, 0.35);
    const hTail = new THREE.Mesh(hTailGeo, orangeMat);
    hTail.position.set(0, 0.08, -1.32);
    uavGroup.add(hTail);

    // Underbelly Ventral Skid / Landing Fin
    const ventralSkid = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.28, 0.25),
      orangeMat
    );
    ventralSkid.position.set(0, -0.22, -0.2);
    uavGroup.add(ventralSkid);

    // 5. Rear Cruise Pusher Motor
    const pusherMotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.08, 0.22, 16),
      darkMetalMat
    );
    pusherMotor.position.set(0, 0.16, -0.85);
    pusherMotor.rotateX(Math.PI / 2);
    uavGroup.add(pusherMotor);

    // 6. Four Long Tubular Diagonal VTOL Boom Arms
    // In screenshot: 4 orange tubular arms extending outward from fuselage
    const boomRadius = 0.03;
    const boomGeo = new THREE.CylinderGeometry(boomRadius, boomRadius, 1.45, 12);
    boomGeo.rotateZ(Math.PI / 2);

    // Front-Left Boom
    const flBoom = new THREE.Mesh(boomGeo, orangeMat);
    flBoom.position.set(-0.75, 0.04, 0.7);
    flBoom.rotation.y = -0.55;
    uavGroup.add(flBoom);

    // Front-Right Boom
    const frBoom = new THREE.Mesh(boomGeo, orangeMat);
    frBoom.position.set(0.75, 0.04, 0.7);
    frBoom.rotation.y = 0.55;
    uavGroup.add(frBoom);

    // Rear-Left Boom
    const rlBoom = new THREE.Mesh(boomGeo, orangeMat);
    rlBoom.position.set(-0.85, 0.04, -0.85);
    rlBoom.rotation.y = 0.45;
    uavGroup.add(rlBoom);

    // Rear-Right Boom
    const rrBoom = new THREE.Mesh(boomGeo, orangeMat);
    rrBoom.position.set(0.85, 0.04, -0.85);
    rrBoom.rotation.y = -0.45;
    uavGroup.add(rrBoom);

    // 7. 4 VTOL Motor Pods & Orange 2-Blade Propellers (at boom tips)
    const podPositions = [
      { x: -1.35, y: 0.06, z: 1.05 },  // Front Left
      { x: 1.35, y: 0.06, z: 1.05 },   // Front Right
      { x: -1.45, y: 0.06, z: -1.15 }, // Rear Left
      { x: 1.45, y: 0.06, z: -1.15 },  // Rear Right
    ];

    const propellerMeshes: THREE.Group[] = [];

    podPositions.forEach((pos) => {
      const podGroup = new THREE.Group();
      podGroup.position.set(pos.x, pos.y, pos.z);

      // Dark lower motor stator base
      const motorBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.18, 16),
        darkMetalMat
      );
      podGroup.add(motorBase);

      // Orange upper motor bell
      const motorBell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.082, 0.082, 0.12, 16),
        orangeMat
      );
      motorBell.position.set(0, 0.12, 0);
      podGroup.add(motorBell);

      // 2-Blade Orange Propeller (Exact match to CAD screenshot)
      const propGroup = new THREE.Group();
      propGroup.position.set(0, 0.2, 0);

      const bladeGeo = new THREE.BoxGeometry(0.85, 0.012, 0.065);
      const blade = new THREE.Mesh(bladeGeo, propMat);
      blade.castShadow = true;
      propGroup.add(blade);

      // Central prop nut
      const propNut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12),
        silverMetalMat
      );
      propGroup.add(propNut);

      podGroup.add(propGroup);
      propellerMeshes.push(propGroup);

      uavGroup.add(podGroup);
    });

    // Initial positioning & orientation
    uavGroup.rotation.x = rotRef.current.x;
    uavGroup.rotation.y = rotRef.current.y;

    // Pointer Interaction Handlers for 360° Drag Inspection
    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive || !isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      targetRotRef.current.y += dx * 0.008;
      targetRotRef.current.x += dy * 0.008;
      targetRotRef.current.x = Math.max(-0.6, Math.min(0.8, targetRotRef.current.x));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!interactive || !isDraggingRef.current || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - prevMouseRef.current.x;
      const dy = e.touches[0].clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      targetRotRef.current.y += dx * 0.01;
      targetRotRef.current.x += dy * 0.01;
      targetRotRef.current.x = Math.max(-0.6, Math.min(0.8, targetRotRef.current.x));
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 380;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Spin propellers
      const speed = rotorSpeed * (flightMode === 'cruise' ? 0.4 : 26.0);
      propellerMeshes.forEach((prop, idx) => {
        const direction = idx % 2 === 0 ? 1 : -1;
        prop.rotation.y += speed * 0.03 * direction;
      });

      // Subtle float / hover dynamics
      if (flightMode === 'hover' && !isDraggingRef.current) {
        uavGroup.position.y = Math.sin(elapsed * 2.2) * 0.035;
        uavGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.018;
      } else if (flightMode === 'cruise' && !isDraggingRef.current) {
        uavGroup.position.y = Math.sin(elapsed * 3) * 0.02;
        uavGroup.rotation.z = -0.05;
      }

      // Smooth damped rotation interpolation
      rotRef.current.x += (targetRotRef.current.x - rotRef.current.x) * 0.08;
      rotRef.current.y += (targetRotRef.current.y - rotRef.current.y) * 0.08;

      uavGroup.rotation.x = rotRef.current.x;
      uavGroup.rotation.y = rotRef.current.y;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [flightMode, highlightSensor, interactive, rotorSpeed]);

  return (
    <div className={`relative ${className} select-none overflow-hidden rounded-3xl cursor-grab active:cursor-grabbing`}>
      <div ref={containerRef} className="w-full h-full" />
      {interactive && (
        <div className="absolute bottom-3 right-4 z-10 pointer-events-none flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[#1E1714]/80 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-black/10 shadow-sm">
          <span>Drag to inspect 360°</span>
        </div>
      )}
    </div>
  );
};
