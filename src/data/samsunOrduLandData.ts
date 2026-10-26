// High-precision GeoJSON feature collection for Samsun - Ordu Black Sea coast land polygon

export type Position = [number, number]; // [longitude, latitude]
export type LinearRing = Position[];
export type PolygonCoordinates = LinearRing[];

export type LandGeometry =
  | { type: 'Polygon'; coordinates: PolygonCoordinates }
  | { type: 'MultiPolygon'; coordinates: PolygonCoordinates[] };

export interface LandFeatureCollection {
  type: 'FeatureCollection';
  name: string;
  features: Array<{
    type: 'Feature';
    properties?: Record<string, unknown>;
    geometry: LandGeometry | null;
  }>;
}

export const SAMSUN_ORDU_LAND_GEOJSON: LandFeatureCollection = {
  type: 'FeatureCollection',
  name: 'samsun_ordu_land',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Samsun-Ordu Karadeniz Kara Poligonu',
        fidelity: 'High-Precision Coastline'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [36.0500, 41.4850],
            [36.1121, 41.4725],
            [36.1285, 41.4695],
            [36.1511, 41.4462],
            [36.1789, 41.4200],
            [36.2048, 41.4065],
            [36.2311, 41.3701],
            [36.2533, 41.3520],
            [36.2618, 41.3444],
            [36.2754, 41.3250],
            [36.3150, 41.3180],
            [36.3370, 41.3050],
            [36.3450, 41.2950],
            [36.3520, 41.2830],
            [36.3633, 41.2780],
            [36.3956, 41.2562],
            [36.4325, 41.2460],
            [36.4760, 41.2449],
            [36.5179, 41.2626],
            [36.5708, 41.2979],
            [36.6087, 41.3649],
            [36.6544, 41.3869],
            [36.6603, 41.3798],
            [36.6710, 41.3660],
            [36.7581, 41.3663],
            [36.8367, 41.3508],
            [36.9849, 41.2945],
            [37.0279, 41.1982],
            [37.0775, 41.1710],
            [37.1355, 41.1470],
            [37.2650, 41.1450],
            [37.2872, 41.1278],
            [37.2917, 41.1445],
            [37.3195, 41.1385],
            [37.3225, 41.1235],
            [37.3779, 41.1125],
            [37.4365, 41.0777],
            [37.4965, 41.0290],
            [37.5050, 41.0430],
            [37.5865, 41.0425],
            [37.6401, 41.1015],
            [37.6797, 41.1292],
            [37.7512, 41.1261],
            [37.7862, 41.1158],
            [37.7725, 41.0660],
            [37.8262, 41.0342],
            [37.8760, 40.9955],
            [37.8835, 41.0005],
            [37.9339, 40.9847],
            [37.9817, 40.9780],
            [38.0055, 40.9750],
            [38.0880, 40.9670],
            [38.1613, 40.9521],
            [38.2000, 40.9417],
            [38.2000, 40.8500],
            [36.0500, 40.8500],
            [36.0500, 41.4850]
          ]
        ]
      }
    }
  ]
};
