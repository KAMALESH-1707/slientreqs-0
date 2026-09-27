export type StorySceneId =
  | 'opening'
  | 'journey'
  | 'landslide'
  | 'transition'
  | 'uav_arrival'
  | 'rgb_sensor'
  | 'thermal_sensor'
  | 'edge_processing'
  | 'location_map'
  | 'lora_comm'
  | 'rescue_verified'
  | 'why_hybrid'
  | 'final_hero';

export interface SceneMeta {
  id: StorySceneId;
  index: number;
  title: string;
  subtitle: string;
  durationMs: number;
}

// 2.8 seconds per scene as explicitly requested ("wait to 2 to 3 seconds for each scene")
export const SCENE_PACE_MS = 2800;

export const SCENES: SceneMeta[] = [
  {
    id: 'opening',
    index: 0,
    title: 'SilentResQ',
    subtitle: 'Autonomous Disaster Response UAV',
    durationMs: 0,
  },
  {
    id: 'journey',
    index: 1,
    title: 'The Journey',
    subtitle: 'Remote Himalayan Pass · Traveler on Road',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'landslide',
    index: 2,
    title: 'Sudden Landslide',
    subtitle: 'Debris Flow · No Help · No Internet',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'transition',
    index: 3,
    title: 'There Is Another Way',
    subtitle: 'Deploying SilentResQ Hybrid VTOL',
    durationMs: 2500,
  },
  {
    id: 'uav_arrival',
    index: 4,
    title: 'SilentResQ Arrives',
    subtitle: 'Airframe Enters Search Mode',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'rgb_sensor',
    index: 5,
    title: 'RGB Optical Feed',
    subtitle: 'Debris Obscures Vision · Survivor Unidentifiable',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'thermal_sensor',
    index: 6,
    title: 'FLIR Thermal Sensing',
    subtitle: 'Human Heat Signature Detected in Green',
    durationMs: SCENE_PACE_MS + 200,
  },
  {
    id: 'edge_processing',
    index: 7,
    title: 'Jetson Edge AI',
    subtitle: 'Local Neural Inference Onboard',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'location_map',
    index: 8,
    title: 'Survivor Geolocation',
    subtitle: '34°10\'42.1"N, 77°35\'18.4"E Tagged',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'lora_comm',
    index: 9,
    title: 'Offline LoRa Mesh',
    subtitle: 'Internet Offline · Direct Radio Telemetry',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'rescue_verified',
    index: 10,
    title: 'Rescue Dispatched',
    subtitle: 'Ground Operations En Route',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'why_hybrid',
    index: 11,
    title: 'Why SilentResQ?',
    subtitle: 'Orange Quadplane vs Multirotor',
    durationMs: 0,
  },
  {
    id: 'final_hero',
    index: 12,
    title: 'From Alert to Survivor',
    subtitle: 'Mission Accomplished',
    durationMs: 0,
  },
];
