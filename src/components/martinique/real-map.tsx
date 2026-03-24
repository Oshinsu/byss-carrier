"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import type { ZoneId } from "@/components/martinique/zone-filter";
import "leaflet/dist/leaflet.css";

/* ── Leaflet components — client-side only ── */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Polygon = dynamic(
  () => import("react-leaflet").then((m) => m.Polygon),
  { ssr: false }
);

/* ── Types ── */
export interface CityData {
  name: string;
  lat: number;
  lng: number;
  population?: number;
  zone: string;
}

export interface RealMapProps {
  activeZone: ZoneId;
  onZoneClick: (zone: ZoneId) => void;
  onCityClick?: (city: string) => void;
  cities?: CityData[];
}

/* ── Default cities with real coordinates ── */
const DEFAULT_CITIES: CityData[] = [
  { name: "Fort-de-France", lat: 14.616, lng: -61.0588, population: 78000, zone: "centre" },
  { name: "Le Lamentin", lat: 14.6091, lng: -60.9559, population: 40000, zone: "centre" },
  { name: "Le Robert", lat: 14.6735, lng: -60.9387, population: 24000, zone: "est" },
  { name: "Schoelcher", lat: 14.6133, lng: -61.09, population: 20000, zone: "centre" },
  { name: "Ducos", lat: 14.5793, lng: -60.9697, population: 18000, zone: "centre" },
  { name: "Saint-Pierre", lat: 14.7496, lng: -61.1764, population: 4000, zone: "nord" },
  { name: "Le Marin", lat: 14.4653, lng: -60.8718, population: 9500, zone: "sud" },
  { name: "Trinite", lat: 14.7375, lng: -60.9634, population: 14000, zone: "est" },
  { name: "Sainte-Anne", lat: 14.4345, lng: -60.8824, population: 5000, zone: "sud" },
  { name: "Les Trois-Ilets", lat: 14.5364, lng: -61.0506, population: 8000, zone: "sud" },
  { name: "Le Francois", lat: 14.6145, lng: -60.9018, population: 20000, zone: "est" },
  { name: "Sainte-Marie", lat: 14.7767, lng: -61.0121, population: 16000, zone: "est" },
  { name: "Le Carbet", lat: 14.7169, lng: -61.1833, population: 3700, zone: "ouest" },
  { name: "Le Diamant", lat: 14.4754, lng: -61.0293, population: 6500, zone: "sud" },
  { name: "Riviere-Pilote", lat: 14.467, lng: -60.896, population: 13000, zone: "sud" },
];

/* ── Zone polygon boundaries (approximate) ── */
const ZONE_POLYGONS: Record<
  string,
  { coords: [number, number][]; color: string; label: string }
> = {
  nord: {
    coords: [
      [14.87, -61.25],
      [14.87, -60.92],
      [14.72, -60.92],
      [14.72, -61.25],
    ],
    color: "#FF2D2D",
    label: "NORD",
  },
  centre: {
    coords: [
      [14.72, -61.22],
      [14.72, -60.92],
      [14.56, -60.92],
      [14.56, -61.22],
    ],
    color: "#00D4FF",
    label: "CENTRE",
  },
  sud: {
    coords: [
      [14.56, -61.12],
      [14.56, -60.82],
      [14.38, -60.82],
      [14.38, -61.12],
    ],
    color: "#22C55E",
    label: "SUD",
  },
  est: {
    coords: [
      [14.82, -60.98],
      [14.82, -60.82],
      [14.56, -60.82],
      [14.56, -60.98],
    ],
    color: "#00B4D8",
    label: "EST",
  },
  ouest: {
    coords: [
      [14.78, -61.25],
      [14.78, -61.12],
      [14.60, -61.12],
      [14.60, -61.25],
    ],
    color: "#8B5CF6",
    label: "OUEST",
  },
};

/* ── Zone label for popup ── */
const ZONE_LABELS: Record<string, string> = {
  nord: "Zone Nord",
  centre: "Zone Centre",
  sud: "Zone Sud",
  est: "Zone Est",
  ouest: "Zone Ouest",
};

/* ── Create cyan DivIcon (must be done client-side) ── */
function createCityIcon(isCapital: boolean) {
  if (typeof window === "undefined") return undefined;
  const L = require("leaflet");
  const size = isCapital ? 12 : 8;
  const pulse = isCapital
    ? `<span style="position:absolute;inset:-4px;border-radius:50%;border:1px solid #00D4FF;opacity:0.4;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite"></span>`
    : "";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${size}px;height:${size}px">
      ${pulse}
      <div style="width:${size}px;height:${size}px;border-radius:50%;background:#00D4FF;box-shadow:0 0 8px #00D4FF80"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/* ═══════════════════════════════════════════════════════
   REAL MAP COMPONENT
   ═══════════════════════════════════════════════════════ */
export function RealMap({
  activeZone,
  onZoneClick,
  onCityClick,
  cities,
}: RealMapProps) {
  const cityData = cities ?? DEFAULT_CITIES;

  /* Fix Leaflet default icon path issue with bundlers */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const L = require("leaflet");
    delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const filteredCities = activeZone
    ? cityData.filter((c) => c.zone === activeZone)
    : cityData;

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-lg border border-[#00D4FF15]">
      {/* Inject ping animation for capital marker */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        .leaflet-container {
          background: #070E1A !important;
          font-family: var(--font-clash-display), system-ui, sans-serif;
        }
        .leaflet-popup-content-wrapper {
          background: #0D1F3C !important;
          border: 1px solid #00D4FF30 !important;
          border-radius: 8px !important;
          color: #E0E0F0 !important;
          box-shadow: 0 0 20px rgba(0,212,255,0.15) !important;
        }
        .leaflet-popup-tip {
          background: #0D1F3C !important;
          border: 1px solid #00D4FF30 !important;
        }
        .leaflet-popup-content {
          margin: 8px 12px !important;
          font-size: 12px !important;
          line-height: 1.5 !important;
        }
        .leaflet-control-zoom a {
          background: #0D1F3C !important;
          color: #00D4FF !important;
          border-color: #00D4FF30 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #162A4A !important;
        }
        .leaflet-control-attribution {
          background: rgba(7,14,26,0.8) !important;
          color: #ffffff30 !important;
          font-size: 8px !important;
        }
        .leaflet-control-attribution a {
          color: #00D4FF60 !important;
        }
      `}</style>

      <MapContainer
        center={[14.6415, -61.0242]}
        zoom={10}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
        attributionControl={true}
      >
        {/* Dark tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />

        {/* Zone polygons */}
        {Object.entries(ZONE_POLYGONS).map(([zoneId, zone]) => {
          const isActive = activeZone === zoneId;
          return (
            <Polygon
              key={zoneId}
              positions={zone.coords}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: isActive ? 0.2 : 0.05,
                weight: isActive ? 2 : 0.8,
                opacity: isActive ? 0.9 : 0.3,
                dashArray: isActive ? undefined : "4 4",
              }}
              eventHandlers={{
                click: () => onZoneClick(activeZone === zoneId ? null : (zoneId as ZoneId)),
              }}
            />
          );
        })}

        {/* City markers */}
        {filteredCities.map((city) => {
          const isCapital = city.name === "Fort-de-France";
          const icon = createCityIcon(isCapital);
          return (
            <Marker
              key={city.name}
              position={[city.lat, city.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onCityClick?.(city.name),
              }}
            >
              <Popup>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#00D4FF",
                      fontFamily: "var(--font-clash-display), system-ui",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {city.name}
                  </div>
                  {city.population && (
                    <div style={{ fontSize: "11px", color: "#ffffff70", marginTop: "2px" }}>
                      Pop. ~{city.population.toLocaleString("fr-FR")}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "9px",
                      color: ZONE_POLYGONS[city.zone]?.color ?? "#00D4FF",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      marginTop: "4px",
                    }}
                  >
                    {ZONE_LABELS[city.zone] ?? city.zone}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
