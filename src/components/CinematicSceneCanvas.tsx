import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { StorySceneId } from '../types/story';

interface CinematicSceneCanvasProps {
  currentScene: StorySceneId;
  sceneProgress: number; // 0 to 1
  visionMode?: 'rgb' | 'thermal' | 'split';
  className?: string;
}

export const CinematicSceneCanvas: React.FC<CinematicSceneCanvasProps> = ({
  currentScene,
  sceneProgress,
  visionMode = 'rgb',
  className = 'w-full h-full',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Group references
  const standingTowerGroupRef = useRef<THREE.Group | null>(null);
  const collapsedRubbleGroupRef = useRef<THREE.Group | null>(null);
  const citySkylineRef = useRef<THREE.Group | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const seismicRingsRef = useRef<THREE.Mesh[]>([]);
  const uavFlightRef = useRef<THREE.Group | null>(null);
  const uavRotorsRef = useRef<THREE.Group[]>([]);
  const survivorGlowRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Atmospheric color palette
    const citySkyColor = 0xa4b6c6;
    const cityFogColor = 0x889ba8;
    scene.background = new THREE.Color(citySkyColor);
    scene.fog = new THREE.FogExp2(cityFogColor, 0.007);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 550);
    camera.position.set(0, 24, 52);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xd9e4ed, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff6e8, 2.9);
    sunLight.position.set(45, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 220;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.85);
    fillLight.position.set(-45, 30, -35);
    scene.add(fillLight);

    // 3. Ground & Asphalt City Grid
    const groundGeo = new THREE.PlaneGeometry(320, 320);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // City Roads with asphalt texture
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 });
    const roadGeo = new THREE.PlaneGeometry(18, 320);
    roadGeo.rotateX(-Math.PI / 2);
    const road1 = new THREE.Mesh(roadGeo, roadMat);
    road1.position.set(0, 0.02, 0);
    scene.add(road1);

    const road2 = new THREE.Mesh(roadGeo, roadMat);
    road2.rotateY(Math.PI / 2);
    road2.position.set(0, 0.03, 0);
    scene.add(road2);

    // SEISMIC SHOCKWAVE EXPANDING RINGS ON THE GROUND
    seismicRingsRef.current = [];
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(1.0, 2.2, 48);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff3b11,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      const sRing = new THREE.Mesh(ringGeo, ringMat);
      sRing.position.set(0, 0.08, 0);
      scene.add(sRing);
      seismicRingsRef.current.push(sRing);
    }

    // 4. Metropolitan City Skyline (Surrounding High-Rise Skyscrapers)
    const skylineGroup = new THREE.Group();
    citySkylineRef.current = skylineGroup;

    const buildingGlassMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.15, metalness: 0.8 });
    const concreteBuildingMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7, metalness: 0.2 });
    const darkTowerMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.6 });

    const surroundingBuildings = [
      { x: -38, z: -34, w: 16, d: 16, h: 58, mat: buildingGlassMat },
      { x: 40, z: -28, w: 18, d: 15, h: 66, mat: darkTowerMat },
      { x: -46, z: 24, w: 14, d: 18, h: 48, mat: concreteBuildingMat },
      { x: 44, z: 28, w: 15, d: 16, h: 54, mat: buildingGlassMat },
      { x: -26, z: -66, w: 20, d: 20, h: 74, mat: darkTowerMat },
      { x: 28, z: -70, w: 22, d: 18, h: 72, mat: buildingGlassMat },
      { x: -62, z: -48, w: 16, d: 14, h: 46, mat: concreteBuildingMat },
      { x: 62, z: -44, w: 18, d: 16, h: 58, mat: buildingGlassMat },
    ];

    surroundingBuildings.forEach((b) => {
      const bGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const bMesh = new THREE.Mesh(bGeo, b.mat);
      bMesh.position.set(b.x, b.h / 2, b.z);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      skylineGroup.add(bMesh);

      // Window strips
      const winGeo = new THREE.BoxGeometry(b.w + 0.1, 0.75, b.d + 0.1);
      const winMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.15 });
      for (let y = 3; y < b.h - 2; y += 3) {
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(b.x, y, b.z);
        skylineGroup.add(win);
      }
    });
    scene.add(skylineGroup);

    // 5. THE STANDING 30-STORY COMMERCIAL TOWER (Scene 1 & Pre-Collapse)
    const standingTowerGroup = new THREE.Group();
    standingTowerGroupRef.current = standingTowerGroup;
    standingTowerGroup.position.set(0, 0, 0);

    const numFloors = 30;
    const floorHeight = 1.0;
    const towerWidth = 14;
    const towerDepth = 14;

    const slabMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.85, metalness: 0.1 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.6,
    });

    for (let f = 0; f < numFloors; f++) {
      const floorY = (f + 0.5) * floorHeight;

      // Concrete floor slab
      const slab = new THREE.Mesh(new THREE.BoxGeometry(towerWidth, 0.22, towerDepth), slabMat);
      slab.position.set(0, floorY, 0);
      slab.castShadow = true;
      standingTowerGroup.add(slab);

      // Glass windows (leave 12th floor f=11 open for viewing person working on PC)
      if (f !== 11) {
        const glass = new THREE.Mesh(new THREE.BoxGeometry(towerWidth - 0.2, 0.75, towerDepth - 0.2), glassMat);
        glass.position.set(0, floorY + 0.48, 0);
        standingTowerGroup.add(glass);
      }
    }

    // 12th Floor Office Setup
    const floor12Y = 11 * floorHeight + 0.22;
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.4 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.2), deskMat);
    desk.position.set(0, floor12Y + 0.75, 0);
    standingTowerGroup.add(desk);

    // PC Monitor with glowing screen
    const monitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.55, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x18181b })
    );
    monitor.position.set(0, floor12Y + 1.2, 0.3);
    standingTowerGroup.add(monitor);

    const monitorScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.48, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    monitorScreen.position.set(0, floor12Y + 1.2, 0.26);
    standingTowerGroup.add(monitorScreen);

    // Person working in GREEN (GREEN = SURVIVOR / PERSON)
    const greenPersonMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.8,
      roughness: 0.35,
    });
    const standingPerson = new THREE.Group();
    standingPerson.position.set(0, floor12Y + 0.6, -0.45);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.58, 0.28), greenPersonMat);
    torso.position.set(0, 0.42, 0);
    standingPerson.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), greenPersonMat);
    head.position.set(0, 0.85, 0.05);
    standingPerson.add(head);

    standingTowerGroup.add(standingPerson);
    scene.add(standingTowerGroup);

    // 6. THE EARTHQUAKE COLLAPSED RUBBLE MOUND (Permanent Post-Disaster Zone)
    const collapsedRubbleGroup = new THREE.Group();
    collapsedRubbleGroupRef.current = collapsedRubbleGroup;
    collapsedRubbleGroup.visible = false;
    scene.add(collapsedRubbleGroup);

    const rubbleConcreteMat = new THREE.MeshStandardMaterial({
      color: 0x57534e,
      roughness: 0.95,
      metalness: 0.1,
      flatShading: true,
    });
    const crushedDebrisMat = new THREE.MeshStandardMaterial({
      color: 0x44403c,
      roughness: 0.95,
      flatShading: true,
    });
    const rebarMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.5,
      metalness: 0.8,
    });

    // 60+ Tilted, shattered concrete slabs and structural pillars
    for (let i = 0; i < 60; i++) {
      const slabW = 6.0 + Math.random() * 8.0;
      const slabD = 6.0 + Math.random() * 8.0;
      const slabH = 0.35 + Math.random() * 0.4;

      const slab = new THREE.Mesh(new THREE.BoxGeometry(slabW, slabH, slabD), rubbleConcreteMat);
      slab.castShadow = true;
      slab.receiveShadow = true;

      const distFromCenter = Math.random() * 13.0;
      const angle = Math.random() * Math.PI * 2;
      const rx = Math.cos(angle) * distFromCenter;
      const rz = Math.sin(angle) * distFromCenter;
      const ry = Math.max(0.3, 4.5 - (distFromCenter / 13.0) * 4.0 + (Math.random() - 0.5) * 1.2);

      slab.position.set(rx, ry, rz);
      slab.rotation.set(
        (Math.random() - 0.5) * 0.75,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.75
      );
      collapsedRubbleGroup.add(slab);
    }

    // Crushed concrete boulders
    for (let i = 0; i < 75; i++) {
      const bRad = 0.5 + Math.random() * 1.4;
      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(bRad, 1), crushedDebrisMat);
      boulder.castShadow = true;
      boulder.receiveShadow = true;

      const dist = Math.random() * 16.0;
      const ang = Math.random() * Math.PI * 2;
      boulder.position.set(
        Math.cos(ang) * dist,
        Math.random() * 3.8,
        Math.sin(ang) * dist
      );
      boulder.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      collapsedRubbleGroup.add(boulder);
    }

    // Protruding twisted steel rebar beams
    for (let i = 0; i < 26; i++) {
      const rebar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 4.5 + Math.random() * 3.0, 8),
        rebarMat
      );
      rebar.position.set(
        (Math.random() - 0.5) * 15.0,
        2.0 + Math.random() * 3.0,
        (Math.random() - 0.5) * 15.0
      );
      rebar.rotation.set(
        (Math.random() - 0.5) * 1.5,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 1.5
      );
      collapsedRubbleGroup.add(rebar);
    }

    // GREEN Thermal Ground Target Beacon (Survivor buried underneath 12th floor slab void)
    const ringGeo = new THREE.RingGeometry(1.4, 2.2, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const targetRing = new THREE.Mesh(ringGeo, ringMat);
    targetRing.position.set(0, 0.15, 0);
    collapsedRubbleGroup.add(targetRing);
    survivorGlowRef.current = targetRing;

    // 7. EARTHQUAKE DUST PLUME PARTICLE SYSTEM
    const dustCount = 450;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 40;
      dustPositions[i * 3 + 1] = Math.random() * 26;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xab9f93,
      size: 3.8,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // Smoke over ruins
    const smokeCount = 200;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = (Math.random() - 0.5) * 22;
      smokePositions[i * 3 + 1] = 1.0 + Math.random() * 14;
      smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0x52525b,
      size: 4.8,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    collapsedRubbleGroup.add(smokeParticles);
    smokeParticlesRef.current = smokeParticles;

    // 8. EXACT SILENTRESQ ORANGE QUADPLANE IN THE SKY (WITH JETSON NANO)
    const uavFlightGroup = new THREE.Group();
    uavFlightRef.current = uavFlightGroup;

    const orangeFlightMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.3 });
    const darkMetalFlightMat = new THREE.MeshStandardMaterial({ color: 0x1f2327, roughness: 0.4 });
    const propFlightMat = new THREE.MeshStandardMaterial({ color: 0xff7700, roughness: 0.3 });

    // Fuselage
    const uavFuselage = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.24, 2.8), orangeFlightMat);
    uavFlightGroup.add(uavFuselage);

    // Front Nose & Camera Sensor
    const uavNose = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.7, 4), orangeFlightMat);
    uavNose.rotateX(Math.PI / 2);
    uavNose.rotateY(Math.PI / 4);
    uavNose.position.set(0, 0, 1.6);
    uavFlightGroup.add(uavNose);

    const uavCam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 16), darkMetalFlightMat);
    uavCam.position.set(0, -0.06, 1.95);
    uavCam.rotateX(Math.PI / 2);
    uavFlightGroup.add(uavCam);

    // Main Wing
    const uavMainWing = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 0.48), orangeFlightMat);
    uavMainWing.position.set(0, 0.12, -0.32);
    uavFlightGroup.add(uavMainWing);

    // Twin Tailfins
    const leftFin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.65, 0.45), orangeFlightMat);
    leftFin.position.set(-0.25, 0.34, -1.4);
    uavFlightGroup.add(leftFin);

    const rightFin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.65, 0.45), orangeFlightMat);
    rightFin.position.set(0.25, 0.34, -1.4);
    uavFlightGroup.add(rightFin);

    // 4 Diagonal Booms & VTOL Motors
    const flightBoomGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    flightBoomGeo.rotateZ(Math.PI / 2);

    const boomAngles = [
      { x: -0.75, z: 0.7, rot: -0.55 },
      { x: 0.75, z: 0.7, rot: 0.55 },
      { x: -0.85, z: -0.85, rot: 0.45 },
      { x: 0.85, z: -0.85, rot: -0.45 },
    ];
    boomAngles.forEach((b) => {
      const bm = new THREE.Mesh(flightBoomGeo, orangeFlightMat);
      bm.position.set(b.x, 0.04, b.z);
      bm.rotation.y = b.rot;
      uavFlightGroup.add(bm);
    });

    const flightPodPositions = [
      { x: -1.35, y: 0.06, z: 1.05 },
      { x: 1.35, y: 0.06, z: 1.05 },
      { x: -1.45, y: 0.06, z: -1.15 },
      { x: 1.45, y: 0.06, z: -1.15 },
    ];
    uavRotorsRef.current = [];
    flightPodPositions.forEach((pos) => {
      const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.28, 12), darkMetalFlightMat);
      pod.position.set(pos.x, pos.y, pos.z);
      uavFlightGroup.add(pod);

      const propGroup = new THREE.Group();
      propGroup.position.set(pos.x, pos.y + 0.18, pos.z);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.015, 0.07), propFlightMat);
      propGroup.add(blade);
      uavFlightGroup.add(propGroup);
      uavRotorsRef.current.push(propGroup);
    });

    uavFlightGroup.position.set(15, 42, 25);
    uavFlightGroup.scale.set(1.4, 1.4, 1.4);
    scene.add(uavFlightGroup);

    camera.lookAt(0, floor12Y + 2, 0);

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Spin UAV rotors
      uavRotorsRef.current.forEach((r, idx) => {
        r.rotation.y += (idx % 2 === 0 ? 1 : -1) * 0.45;
      });

      // Pulse survivor green ground beacon
      if (survivorGlowRef.current) {
        const pulse = 1.0 + Math.sin(elapsed * 4.0) * 0.18;
        survivorGlowRef.current.scale.set(pulse, pulse, pulse);
      }

      // Drift lingering smoke particles
      if (smokeParticlesRef.current) {
        smokeParticlesRef.current.rotation.y = elapsed * 0.04;
      }

      // Master State Logic
      if (cameraRef.current && standingTowerGroupRef.current && collapsedRubbleGroupRef.current && uavFlightRef.current) {
        const cam = cameraRef.current;
        const standing = standingTowerGroupRef.current;
        const rubble = collapsedRubbleGroupRef.current;
        const uav = uavFlightRef.current;
        const skyline = citySkylineRef.current;

        switch (currentScene) {
          case 'opening':
          case 'journey': {
            // SCENE 1: THE 30-STORY TOWER - 12TH FLOOR OFFICE
            standing.visible = true;
            standing.position.set(0, 0, 0);
            standing.rotation.set(0, 0, 0);
            standing.scale.set(1, 1, 1);

            rubble.visible = false;
            dustMat.opacity = 0;
            seismicRingsRef.current.forEach((sr) => { (sr.material as THREE.MeshBasicMaterial).opacity = 0; });

            if (skyline) {
              skyline.position.set(0, 0, 0);
              skyline.rotation.set(0, 0, 0);
            }

            uav.position.set(25, 55, 35);

            // Orbit around 12th floor office window
            const camAngle = elapsed * 0.2;
            cam.position.x = Math.sin(camAngle) * 16.0;
            cam.position.y = floor12Y + 2.5 + Math.sin(elapsed * 0.5) * 0.4;
            cam.position.z = Math.cos(camAngle) * 16.0;
            cam.lookAt(0, floor12Y + 1.2, 0);
            break;
          }

          case 'landslide': {
            // SCENE 2: REALISTIC VIOLENT EARTHQUAKE EFFECTS & 4-SECOND DESTRUCTION DELAY
            const prog = Math.min(1, Math.max(0, sceneProgress));

            if (prog < 0.22) {
              // 1. FIRST 1.9s: VIOLENT P-WAVE & S-WAVE MULTI-AXIS SEISMIC COLLAPSE
              const pWave = Math.sin(prog * 110) * 2.2;
              const sWave = Math.cos(prog * 85) * 1.6;
              const microJitter = (Math.random() - 0.5) * 0.8;

              standing.visible = true;
              standing.position.x = pWave + microJitter;
              standing.position.z = sWave + microJitter;

              // Tower collapses downward, buckling floors & shearing columns
              const collapseSink = prog / 0.22;
              standing.scale.y = Math.max(0.05, 1.0 - collapseSink * 0.95);
              standing.position.y = -collapseSink * 18.0;
              standing.rotation.z = collapseSink * 0.18; // structural lean before catastrophic plunge

              // Surrounding city skyscrapers sway and tilt under seismic shear!
              if (skyline) {
                skyline.position.x = pWave * 0.45;
                skyline.rotation.z = Math.sin(prog * 45) * 0.06;
              }

              // Expanding red seismic ground shockwave rings radiating from epicenter
              seismicRingsRef.current.forEach((sr, idx) => {
                const ringProgress = (prog * 4.5 + idx * 0.3) % 1.0;
                const ringScale = 1.0 + ringProgress * 36.0;
                sr.scale.set(ringScale, ringScale, ringScale);
                (sr.material as THREE.MeshBasicMaterial).opacity = (1.0 - ringProgress) * 0.9;
              });

              // Explosive dust storm billows upwards
              rubble.visible = prog > 0.08;
              dustMat.opacity = Math.sin((prog / 0.22) * Math.PI) * 0.98;

              // Intense camera shaking impact
              cam.position.x = 18.0 + (pWave + microJitter) * 2.4;
              cam.position.y = 12.0 - prog * 5 + (sWave * 0.6);
              cam.position.z = 24.0 + microJitter * 2.2;
              cam.lookAt(0, 8.0, 0);
            } else {
              // 2. FULL 4-SECOND DELAY EMPHASIZING DESTRUCTION (prog 0.22 to 0.70)
              // Building is COMPLETELY DESTROYED AND LEVELED TO THE GROUND
              standing.visible = false;
              rubble.visible = true;
              dustMat.opacity = Math.max(0.12, (1.0 - (prog - 0.22) / 0.78) * 0.8);

              seismicRingsRef.current.forEach((sr) => {
                (sr.material as THREE.MeshBasicMaterial).opacity = 0;
              });

              if (skyline) {
                skyline.position.set(0, 0, 0);
                skyline.rotation.set(0, 0, 0);
              }

              // SMOOTH ASCENT INTO 90° OVERHEAD TOP VIEW
              // Holds for the full 4 seconds slowly orbiting around the ruins
              const topProg = Math.min(1, (prog - 0.22) / 0.25);
              const orbitAngle = elapsed * 0.12;

              cam.position.x = THREE.MathUtils.lerp(18.0, Math.sin(orbitAngle) * 6.0, topProg);
              cam.position.y = THREE.MathUtils.lerp(10.0, 52.0, topProg); // High altitude overhead nadir
              cam.position.z = THREE.MathUtils.lerp(24.0, Math.cos(orbitAngle) * 6.0 + 0.1, topProg);
              cam.lookAt(0, 0, 0); // Looking straight down at the leveled rubble pile
            }
            break;
          }

          case 'transition': {
            // SCENE 3: SHOW CLEARLY ONLY THE DRONE TRAVELING FROM LONG DISTANCE
            // Background city/disaster is not in focus; camera tracks ONLY the orange drone in open sky!
            standing.visible = false;
            rubble.visible = false; // focus entirely on drone flight
            dustMat.opacity = 0;

            const tProg = Math.min(1, Math.max(0, sceneProgress));

            // Drone travels across long distance: from far horizon (-110, 65, -130) rushing forward to (-15, 38, 10)
            const uavStartX = -95;
            const uavStartY = 62;
            const uavStartZ = -130;

            const uavEndX = -10;
            const uavEndY = 36;
            const uavEndZ = 15;

            uav.position.x = THREE.MathUtils.lerp(uavStartX, uavEndX, tProg);
            uav.position.y = THREE.MathUtils.lerp(uavStartY, uavEndY, tProg) + Math.sin(tProg * Math.PI) * 4;
            uav.position.z = THREE.MathUtils.lerp(uavStartZ, uavEndZ, tProg);

            // Aerodynamic high-speed cruising bank angle & pitch
            uav.rotation.x = 0.08;
            uav.rotation.y = -0.7 + Math.sin(elapsed * 1.5) * 0.04;
            uav.rotation.z = -0.32; // Banking left as it turns toward city

            // CAMERA DEDICATED TRACKING SHOT: Sits alongside & slightly behind the drone
            // Showing clearly ONLY the orange drone, spinning props, and aerodynamic airframe!
            cam.position.x = uav.position.x - 7.0;
            cam.position.y = uav.position.y + 2.2;
            cam.position.z = uav.position.z + 11.5;
            cam.lookAt(uav.position.x + 2.0, uav.position.y, uav.position.z - 2.0);
            break;
          }

          case 'uav_arrival': {
            // SCENE 4: DRONE ENTERS THE DISASTER ZONE & TRANSITIONS OVER THE RUBBLE
            standing.visible = false; // Building is permanently destroyed
            rubble.visible = true;    // Collapsed earthquake rubble is now revealed beneath!
            dustMat.opacity = 0.15;

            const arrProg = Math.min(1, Math.max(0, sceneProgress));

            // Drone completes approach from city perimeter into precision hover above rubble
            const approachX = THREE.MathUtils.lerp(-10, 0, arrProg);
            const approachY = THREE.MathUtils.lerp(36, 16.0, arrProg);
            const approachZ = THREE.MathUtils.lerp(15, 5.0, arrProg);

            uav.position.set(approachX, approachY, approachZ);

            // Flaring nose up to decelerate from 85 km/h cruise into VTOL hover
            uav.rotation.x = THREE.MathUtils.lerp(0.35, 0.04, arrProg);
            uav.rotation.y = THREE.MathUtils.lerp(-0.7, -Math.PI / 2, arrProg);
            uav.rotation.z = THREE.MathUtils.lerp(-0.32, 0.0, arrProg);

            // Wide camera sweep revealing the drone entering the disaster zone over the rubble
            cam.position.x = THREE.MathUtils.lerp(-15, 16, arrProg);
            cam.position.y = THREE.MathUtils.lerp(28, 22, arrProg);
            cam.position.z = THREE.MathUtils.lerp(32, 28, arrProg);
            cam.lookAt(0, 2.5, 0); // Focus on the disaster rubble mound
            break;
          }

          case 'rgb_sensor':
          case 'thermal_sensor':
          case 'edge_processing':
          case 'location_map':
          case 'lora_comm':
          case 'rescue_verified': {
            // SENSING & RESCUE: THE BUILDING IS PERMANENTLY COLLAPSED RUBBLE!
            standing.visible = false;
            rubble.visible = true;

            // UAV hovers directly over the collapsed 30-story rubble mound
            uav.position.set(0, 15.5 + Math.sin(elapsed * 1.5) * 0.2, 5.0);
            uav.rotation.set(0.04, -Math.PI / 2, 0);

            // Overhead aerial sensor camera angle targeting the disaster ruins
            cam.position.x = Math.sin(elapsed * 0.1) * 3;
            cam.position.y = 22.0;
            cam.position.z = 20.0;
            cam.lookAt(0, 2.0, 0); // Looking directly at the collapsed rubble pile
            break;
          }

          default:
            break;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentScene, sceneProgress]);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      <div ref={mountRef} className="w-full h-full" />

      {/* SENSOR CAMERA OVERLAY (When in RGB or Thermal view) */}
      {(currentScene === 'rgb_sensor' || currentScene === 'thermal_sensor' || currentScene === 'edge_processing') && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-20">
          {/* Top Sensor HUD Bar */}
          <div className="flex items-center justify-between bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${currentScene === 'thermal_sensor' || visionMode === 'thermal' ? 'bg-[#10B981] animate-ping' : 'bg-[#FF5520]'}`} />
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-white/90">
                {currentScene === 'thermal_sensor' || visionMode === 'thermal' ? 'FLIR LWIR THERMAL CORE · 8-14μm' : 'RGB OPTICAL SENSOR · 4K UHD'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-white/70">
              <span>FOV: 58°</span>
              <span>ALT: 45m AGL</span>
              <span>GPS: 28°36'12.4"N, 77°12'45.8"E</span>
            </div>
          </div>

          {/* Central Crosshair & Detection Box */}
          <div className="relative flex-1 flex items-center justify-center">
            <div className="w-16 h-16 border border-white/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
            </div>

            {/* Survivor Thermal Detection Box in GREEN */}
            {(currentScene === 'thermal_sensor' || currentScene === 'edge_processing' || visionMode === 'thermal') && (
              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 border-2 border-[#10B981] bg-[#10B981]/15 rounded-xl p-3 shadow-[0_0_24px_rgba(16,185,129,0.6)] animate-thermal pointer-events-auto">
                <div className="flex items-center justify-between gap-3 text-xs font-mono text-[#10B981] font-bold">
                  <span className="bg-[#10B981] text-black px-1.5 py-0.5 rounded text-[10px]">
                    SURVIVOR DETECTED
                  </span>
                  <span>98.6% CONF</span>
                </div>
                <div className="text-[11px] font-mono text-white/90 mt-1">
                  CORE TEMP: <span className="text-[#10B981] font-bold">36.8°C</span> (DELTA +16.4°C)
                </div>
                <div className="text-[10px] font-mono text-white/60">
                  LOCATION: 12TH FLOOR SLAB VOID · 2.1m UNDER CONCRETE
                </div>
              </div>
            )}
          </div>

          {/* Bottom Sensor Footer */}
          <div className="flex items-center justify-between text-xs font-mono text-white/80 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <div>MODE: {currentScene === 'thermal_sensor' ? 'IRONBOW THERMAL' : 'VISIBLE SPECTRUM'}</div>
            <div>SILENTRESQ ONBOARD JETSON NANO SENSING</div>
          </div>
        </div>
      )}
    </div>
  );
};
