import React, { useEffect, useRef, useState } from 'react';
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

  // References to animated elements
  const bikeRiderGroupRef = useRef<THREE.Group | null>(null);
  const bikeWheelsRef = useRef<THREE.Mesh[]>([]);
  const rocksRef = useRef<THREE.Group | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
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

    const skyColor = 0xc8d5e0;
    const groundFogColor = 0xb7c3cf;
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.FogExp2(groundFogColor, 0.009);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 350);
    camera.position.set(0, 18, 42);
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

    // 2. Realistic Himalayan Lighting
    const ambientLight = new THREE.AmbientLight(0xdde3ea, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.9);
    sunLight.position.set(25, 50, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 130;
    sunLight.shadow.camera.left = -35;
    sunLight.shadow.camera.right = 35;
    sunLight.shadow.camera.top = 35;
    sunLight.shadow.camera.bottom = -35;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.85);
    fillLight.position.set(-30, 20, -20);
    scene.add(fillLight);

    // 3. Terrain Generation (Himalayan Mountain Pass)
    const terrainGeo = new THREE.PlaneGeometry(180, 180, 100, 100);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);

      let h = (vx * -0.38) + (vz * -0.22);
      h += Math.sin(vx * 0.11) * Math.cos(vz * 0.11) * 4.5;
      h += Math.sin(vx * 0.035) * 8.5;

      // Carve out flat mountain road bench
      const roadCurve = Math.sin(vz * 0.08) * 12.0;
      const distToRoad = Math.abs(vx - roadCurve);
      if (distToRoad < 4.8) {
        h = h * 0.12 + 2.5;
      }

      posAttr.setY(i, h);
    }
    terrainGeo.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x82746a,
      roughness: 0.95,
      metalness: 0.1,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, rockMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Hairpin Road Surface
    const roadPoints: THREE.Vector3[] = [];
    for (let z = -60; z <= 60; z += 1.5) {
      const x = Math.sin(z * 0.08) * 12.0;
      roadPoints.push(new THREE.Vector3(x, 2.7, z));
    }
    const roadCurve = new THREE.CatmullRomCurve3(roadPoints);
    const roadGeo = new THREE.TubeGeometry(roadCurve, 90, 2.8, 6, false);
    roadGeo.scale(1, 0.035, 1);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x383431,
      roughness: 0.8,
      metalness: 0.15,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.receiveShadow = true;
    scene.add(roadMesh);

    // Distant Snow Peaks
    const distantPeaksGeo = new THREE.ConeGeometry(40, 52, 5);
    const peakMat = new THREE.MeshStandardMaterial({ color: 0xdde6ed, roughness: 0.8 });
    const peak1 = new THREE.Mesh(distantPeaksGeo, peakMat);
    peak1.position.set(-70, 14, -80);
    scene.add(peak1);

    const peak2 = new THREE.Mesh(distantPeaksGeo, peakMat);
    peak2.position.set(40, 20, -90);
    peak2.scale.set(1.25, 1.25, 1.25);
    scene.add(peak2);

    // 4. MOTORBIKE / MOTORCYCLE WITH HUMAN RIDER IN GREEN (Riding fast!)
    const bikeRiderGroup = new THREE.Group();
    bikeRiderGroupRef.current = bikeRiderGroup;

    // Materials
    const darkBikeMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.8 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.2, metalness: 0.9 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const redTailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    // Green Human Rider Material (GREEN = SURVIVOR / PERSON)
    const greenHumanMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.75,
      roughness: 0.35,
    });
    const greenJacketMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x047857,
      emissiveIntensity: 0.6,
      roughness: 0.4,
    });

    // --- Motorbike Chassis ---
    const bikeFrame = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 1.4), darkBikeMat);
    bikeFrame.position.set(0, 0.65, 0);
    bikeRiderGroup.add(bikeFrame);

    // Fuel Tank
    const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.6, 12), darkBikeMat);
    fuelTank.rotateX(Math.PI / 2);
    fuelTank.position.set(0, 0.88, 0.15);
    bikeRiderGroup.add(fuelTank);

    // Wheels (Front & Rear)
    const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.16, 24);
    wheelGeo.rotateZ(Math.PI / 2);

    const rearWheel = new THREE.Mesh(wheelGeo, tireMat);
    rearWheel.position.set(0, 0.34, -0.65);
    bikeRiderGroup.add(rearWheel);

    const frontWheel = new THREE.Mesh(wheelGeo, tireMat);
    frontWheel.position.set(0, 0.34, 0.75);
    bikeRiderGroup.add(frontWheel);

    bikeWheelsRef.current = [rearWheel, frontWheel];

    // Handlebars
    const handleBar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.05, 0.05), chromeMat);
    handleBar.position.set(0, 1.1, 0.45);
    bikeRiderGroup.add(handleBar);

    // Headlight
    const headlight = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), headlightMat);
    headlight.rotateX(Math.PI / 2);
    headlight.position.set(0, 0.88, 0.8);
    bikeRiderGroup.add(headlight);

    // Taillight
    const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, 0.04), redTailMat);
    taillight.position.set(0, 0.75, -0.72);
    bikeRiderGroup.add(taillight);

    // Exhaust Pipe
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.8, 12), chromeMat);
    exhaust.rotateX(Math.PI / 2);
    exhaust.position.set(0.22, 0.35, -0.2);
    bikeRiderGroup.add(exhaust);

    // --- Human Rider Structure in Green (Anatomical riding posture) ---
    // Rider Pelvis / Seat
    const riderPelvis = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.3), greenHumanMat);
    riderPelvis.position.set(0, 0.95, -0.15);
    bikeRiderGroup.add(riderPelvis);

    // Rider Torso (Leaning forward into the wind)
    const riderTorso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.26), greenJacketMat);
    riderTorso.position.set(0, 1.35, 0.05);
    riderTorso.rotation.x = 0.35; // forward aggressive racing lean
    bikeRiderGroup.add(riderTorso);

    // Rider Neck & Helmet/Head
    const riderHead = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), greenHumanMat);
    riderHead.position.set(0, 1.82, 0.22);
    bikeRiderGroup.add(riderHead);

    // Rider Arms (reaching forward to handlebars)
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.65, 8), greenHumanMat);
    leftArm.position.set(-0.28, 1.32, 0.28);
    leftArm.rotation.set(0.65, 0, -0.3);
    bikeRiderGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.65, 8), greenHumanMat);
    rightArm.position.set(0.28, 1.32, 0.28);
    rightArm.rotation.set(0.65, 0, 0.3);
    bikeRiderGroup.add(rightArm);

    // Rider Legs (tucked in riding position)
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.65, 8), greenHumanMat);
    leftLeg.position.set(-0.24, 0.72, 0.05);
    leftLeg.rotation.set(-0.4, 0, -0.2);
    bikeRiderGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.65, 8), greenHumanMat);
    rightLeg.position.set(0.24, 0.72, 0.05);
    rightLeg.rotation.set(-0.4, 0, 0.2);
    bikeRiderGroup.add(rightLeg);

    // Ground Target Beacon Ring
    const ringGeo = new THREE.RingGeometry(1.0, 1.45, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const targetRing = new THREE.Mesh(ringGeo, ringMat);
    targetRing.position.y = 0.05;
    bikeRiderGroup.add(targetRing);
    survivorGlowRef.current = targetRing;

    bikeRiderGroup.position.set(4.5, 2.7, 5.0);
    scene.add(bikeRiderGroup);

    // 5. REALISTIC LANDSLIDE: BOULDERS & FALLING MOUNTAIN DEBRIS
    const rocksGroup = new THREE.Group();
    rocksRef.current = rocksGroup;

    const rockColors = [0x4d423b, 0x61544a, 0x3d352f, 0x736458, 0x54473e];
    const rockMeshes: {
      mesh: THREE.Mesh;
      origY: number;
      origX: number;
      origZ: number;
      targetY: number;
      targetX: number;
      targetZ: number;
      rotSpeed: { x: number; y: number; z: number };
    }[] = [];

    // Create 85 varied boulders
    for (let i = 0; i < 85; i++) {
      const isGiantBoulder = i < 12;
      const rockRadius = isGiantBoulder ? 1.5 + Math.random() * 1.8 : 0.5 + Math.random() * 1.2;

      const rockMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(rockRadius, 1),
        new THREE.MeshStandardMaterial({
          color: rockColors[i % rockColors.length],
          roughness: 0.95,
          flatShading: true,
        })
      );
      rockMesh.castShadow = true;
      rockMesh.receiveShadow = true;

      const startX = -14 + (Math.random() - 0.5) * 10;
      const startY = 24 + Math.random() * 18;
      const startZ = 4 + (Math.random() - 0.5) * 14;

      const targetX = 4.2 + (Math.random() - 0.5) * 7.5;
      const targetY = 2.8 + Math.random() * 2.8;
      const targetZ = 4.8 + (Math.random() - 0.5) * 8.0;

      rockMesh.position.set(startX, startY, startZ);
      rocksGroup.add(rockMesh);
      rockMeshes.push({
        mesh: rockMesh,
        origX: startX,
        origY: startY,
        origZ: startZ,
        targetX,
        targetY,
        targetZ,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.12,
          y: (Math.random() - 0.5) * 0.12,
          z: (Math.random() - 0.5) * 0.12,
        },
      });
    }
    scene.add(rocksGroup);

    // Dust Cloud Particles
    const dustCount = 240;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = 4.5 + (Math.random() - 0.5) * 20;
      dustPositions[i * 3 + 1] = 2.5 + Math.random() * 10;
      dustPositions[i * 3 + 2] = 5.0 + (Math.random() - 0.5) * 20;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xbdb0a2,
      size: 2.2,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // 6. EXACT SILENTRESQ ORANGE QUADPLANE IN THE SKY
    const uavFlightGroup = new THREE.Group();
    uavFlightRef.current = uavFlightGroup;

    const orangeFlightMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.3 });
    const darkMetalFlightMat = new THREE.MeshStandardMaterial({ color: 0x1f2327, roughness: 0.4 });
    const propFlightMat = new THREE.MeshStandardMaterial({ color: 0xff7700, roughness: 0.3 });

    // Fuselage
    const uavFuselage = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.24, 2.8), orangeFlightMat);
    uavFlightGroup.add(uavFuselage);

    // Front Nose & Camera
    const uavNose = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.7, 4), orangeFlightMat);
    uavNose.rotateX(Math.PI / 2);
    uavNose.rotateY(Math.PI / 4);
    uavNose.position.set(0, 0, 1.6);
    uavFlightGroup.add(uavNose);

    const uavCam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 16), darkMetalFlightMat);
    uavCam.position.set(0, -0.06, 1.95);
    uavCam.rotateX(Math.PI / 2);
    uavFlightGroup.add(uavCam);

    // Main Rectangular Orange Wing
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
    boomAngles.forEach(b => {
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

    uavFlightGroup.position.set(15, 32, 25);
    uavFlightGroup.scale.set(1.4, 1.4, 1.4);
    scene.add(uavFlightGroup);

    // Initial camera
    camera.lookAt(4.5, 3.0, 5.0);

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Master Animation Loop
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

      // Spin bike wheels when riding fast
      if (currentScene === 'journey' || (currentScene === 'landslide' && sceneProgress < 0.4)) {
        bikeWheelsRef.current.forEach(w => {
          w.rotation.x -= 0.35; // fast forward rotation
        });
      }

      // Camera & Scene State Choreography
      if (cameraRef.current && bikeRiderGroupRef.current && uavFlightRef.current) {
        const cam = cameraRef.current;
        const bike = bikeRiderGroupRef.current;
        const uav = uavFlightRef.current;

        switch (currentScene) {
          case 'opening':
          case 'journey': {
            // FAST RIDING ALONG THE MOUNTAIN ROAD
            bike.visible = true;
            bike.rotation.set(0, -Math.PI / 2, 0); // facing forward

            // High speed traversal along road curve
            const speed = elapsed * 3.8;
            const bikeZ = 5.0 + Math.cos(speed * 0.5) * 16.0;
            const bikeX = Math.sin(bikeZ * 0.08) * 12.0;
            bike.position.set(bikeX, 2.7, bikeZ);

            // Natural motorcycle lean into curves
            const lean = Math.cos(bikeZ * 0.08) * 0.28;
            bike.rotation.z = lean;

            // Dynamic tracking chase camera
            cam.position.x = bike.position.x + 10.0;
            cam.position.y = 8.5;
            cam.position.z = bike.position.z + 14.0;
            cam.lookAt(bike.position.x, 3.2, bike.position.z);

            // Reset rocks
            rockMeshes.forEach(r => {
              r.mesh.position.set(r.origX, r.origY, r.origZ);
            });
            dustMat.opacity = 0;
            uav.position.set(25, 45, 35);
            break;
          }

          case 'landslide': {
            const prog = Math.min(1, Math.max(0, sceneProgress));

            // Fast bike comes into the danger zone and gets caught
            if (prog < 0.4) {
              bike.visible = true;
              bike.position.set(4.5, 2.7, 5.0);
              bike.rotation.set(0, -Math.PI / 2, 0);
            } else {
              // Struck & toppled under rockfall
              bike.rotation.z = Math.PI / 2.2;
              bike.position.y = 2.4;
            }

            // Realistic Landslide Rockfall Cascade
            rockMeshes.forEach((r, idx) => {
              const rockDelay = (idx / rockMeshes.length) * 0.35;
              const rockProg = Math.min(1, Math.max(0, (prog - rockDelay) / 0.65));

              // Arc down the mountain slope
              r.mesh.position.y = r.origY + (r.targetY - r.origY) * rockProg;
              r.mesh.position.x = THREE.MathUtils.lerp(r.origX, r.targetX, rockProg);
              r.mesh.position.z = THREE.MathUtils.lerp(r.origZ, r.targetZ, rockProg);

              r.mesh.rotation.x += r.rotSpeed.x;
              r.mesh.rotation.y += r.rotSpeed.y;
              r.mesh.rotation.z += r.rotSpeed.z;
            });

            // Dust storm swells
            if (prog > 0.2) {
              dustMat.opacity = Math.sin(prog * Math.PI) * 0.75;
            }

            // Bike and rider completely buried underneath rubble after prog > 0.52
            if (prog > 0.52) {
              bike.visible = false;
            }

            // CAMERA MOTION: TRANSITION TO TOP VIEW (AERIAL NADIR) AFTER LANDSLIDE
            // When prog > 0.55, camera climbs directly overhead looking down
            if (prog < 0.55) {
              // Ground impact view
              cam.position.x = 9.0 + Math.sin(prog * 2) * 2;
              cam.position.y = 7.0 + prog * 4;
              cam.position.z = 15.0 - prog * 3;
              cam.lookAt(4.5, 3.0, 5.0);
            } else {
              // TOP VIEW: 90-degree overhead nadir view showing traveler is completely buried!
              const topProg = (prog - 0.55) / 0.45;
              cam.position.x = THREE.MathUtils.lerp(11.0, 4.5, topProg);
              cam.position.y = THREE.MathUtils.lerp(11.0, 36.0, topProg); // High altitude overhead
              cam.position.z = THREE.MathUtils.lerp(12.0, 5.0, topProg);
              cam.lookAt(4.5, 2.5, 5.0); // Looking straight down at debris
            }
            break;
          }

          case 'transition':
          case 'uav_arrival': {
            rockMeshes.forEach(r => {
              r.mesh.position.set(r.targetX, r.targetY, r.targetZ);
            });
            bike.visible = false;
            dustMat.opacity = 0.1;

            const arrivalProg = Math.min(1, sceneProgress);
            uav.visible = true;

            const targetUavX = 4.5;
            const targetUavY = 11.5;
            const targetUavZ = 7.5;

            uav.position.x = THREE.MathUtils.lerp(28, targetUavX, arrivalProg);
            uav.position.y = THREE.MathUtils.lerp(38, targetUavY, arrivalProg);
            uav.position.z = THREE.MathUtils.lerp(35, targetUavZ, arrivalProg);

            uav.rotation.x = THREE.MathUtils.lerp(0.35, 0.05, arrivalProg);
            uav.rotation.y = -Math.PI / 2 + Math.sin(elapsed) * 0.04;
            uav.rotation.z = Math.sin(elapsed * 1.8) * 0.02;

            cam.position.set(12, 14, 22);
            cam.lookAt(uav.position.x, uav.position.y - 2, uav.position.z);
            break;
          }

          case 'rgb_sensor':
          case 'thermal_sensor':
          case 'edge_processing':
          case 'location_map':
          case 'lora_comm':
          case 'rescue_verified': {
            uav.position.set(4.5, 11.2 + Math.sin(elapsed * 1.5) * 0.2, 5.5);
            uav.rotation.set(0.04, -Math.PI / 2, 0);

            // Aerial observation camera
            cam.position.x = 4.5 + Math.sin(elapsed * 0.1) * 3;
            cam.position.y = 15.0;
            cam.position.z = 16.0;
            cam.lookAt(4.5, 2.5, 5.0);

            rockMeshes.forEach(r => {
              r.mesh.position.set(r.targetX, r.targetY, r.targetZ);
            });
            bike.visible = false;
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
              <span>ALT: 42m AGL</span>
              <span>GPS: 34°10'42.1"N, 77°35'18.4"E</span>
            </div>
          </div>

          {/* Central Crosshair & Detection Box */}
          <div className="relative flex-1 flex items-center justify-center">
            <div className="w-16 h-16 border border-white/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
            </div>

            {/* Survivor Thermal Detection Box in GREEN */}
            {(currentScene === 'thermal_sensor' || currentScene === 'edge_processing' || visionMode === 'thermal') && (
              <div className="absolute top-[48%] left-[46%] -translate-x-1/2 -translate-y-1/2 border-2 border-[#10B981] bg-[#10B981]/15 rounded-xl p-3 shadow-[0_0_24px_rgba(16,185,129,0.6)] animate-thermal pointer-events-auto">
                <div className="flex items-center justify-between gap-3 text-xs font-mono text-[#10B981] font-bold">
                  <span className="bg-[#10B981] text-black px-1.5 py-0.5 rounded text-[10px]">
                    SURVIVOR DETECTED
                  </span>
                  <span>97.8% CONF</span>
                </div>
                <div className="text-[11px] font-mono text-white/90 mt-1">
                  CORE TEMP: <span className="text-[#10B981] font-bold">36.8°C</span> (DELTA +14.2°C)
                </div>
                <div className="text-[10px] font-mono text-white/60">
                  DEPTH: ~0.8m UNDER ROCK DEBRIS
                </div>
              </div>
            )}
          </div>

          {/* Bottom Sensor Footer */}
          <div className="flex items-center justify-between text-xs font-mono text-white/80 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <div>MODE: {currentScene === 'thermal_sensor' ? 'IRONBOW THERMAL' : 'VISIBLE SPECTRUM'}</div>
            <div>SILENTRESQ ONBOARD SENSING SYSTEM</div>
          </div>
        </div>
      )}
    </div>
  );
};
