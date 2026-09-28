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

// 2.8 seconds per scene as explicitly requested
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
    title: 'Metropolitan High-Rise',
    subtitle: '30-Floor Commercial Tower · Person Working at PC on 12th Floor',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'landslide', // preserved id for backward compatibility
    index: 2,
    title: 'Catastrophic Earthquake',
    subtitle: 'Violent 7.8 Mw Tremor Collapses 30-Floor Commercial Tower',
    durationMs: 8500, // 8.5s: 2s collapse + 4s destruction delay + 2.5s warnings
  },
  {
    id: 'transition',
    index: 3,
    title: 'Long-Range Cruise Dispatch',
    subtitle: 'SilentResQ Traveling at 85 km/h Across Open Sky from Remote Base',
    durationMs: 3600, // 3.6s: show clearly only the drone flying from long distance
  },
  {
    id: 'uav_arrival',
    index: 4,
    title: 'Enters Earthquake Disaster Zone',
    subtitle: 'Transitions from High-Speed Cruise to VTOL Hover Above 30-Floor Rubble',
    durationMs: 3400,
  },
  {
    id: 'rgb_sensor',
    index: 5,
    title: 'RGB Optical Feed',
    subtitle: 'Heavy Dust & Concrete Slabs Obscure Vision · Survivor Not Visible',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'thermal_sensor',
    index: 6,
    title: 'FLIR Thermal Sensing',
    subtitle: 'Human Heat Signature Detected Beneath 12th Floor Concrete Slabs',
    durationMs: SCENE_PACE_MS + 200,
  },
  {
    id: 'edge_processing',
    index: 7,
    title: 'Jetson Nano Edge AI',
    subtitle: 'Local Neural Inference Onboard · Zero Cloud Latency',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'location_map',
    index: 8,
    title: 'Survivor Geolocation',
    subtitle: 'Urban Grid 28°36\'12.4"N, 77°12\'45.8"E Tagged',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'lora_comm',
    index: 9,
    title: 'Offline LoRa Mesh',
    subtitle: 'City Cellular Down · Direct Radio Telemetry to Rescue Command',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'rescue_verified',
    index: 10,
    title: 'Rescue Dispatched',
    subtitle: 'Heavy Urban Search & Rescue (USAR) Ground Units En Route',
    durationMs: SCENE_PACE_MS,
  },
  {
    id: 'why_hybrid',
    index: 11,
    title: 'Why SilentResQ?',
    subtitle: 'Orange Quadplane vs Conventional Multirotor',
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
