import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Report } from '../types';
import { Language, translations } from '../lib/i18n';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapViewProps {
  reports: Report[];
  lang: Language;
  onSelectReport?: (report: Report) => void;
}

const getMarkerColor = (category: string) => {
  switch (category) {
    case 'bribery': return '#e11d48'; // Red
    case 'nepotism': return '#8b5cf6'; // Violet
    case 'extortion': return '#f59e0b'; // Amber
    case 'fraud': return '#3b82f6'; // Blue
    default: return '#10b981'; // Green
  }
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

export default function MapView({ reports, lang, onSelectReport }: MapViewProps) {
  const t = translations[lang];
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn(err)
    );
  }, []);
  
  return (
    <div className="h-[600px] rounded-3xl overflow-hidden border border-zinc-200 shadow-xl relative">
      <MapContainer center={[23.8103, 90.4125]} zoom={7} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {userPos && (
          <>
            <Circle center={userPos} radius={500} pathOptions={{ color: '#e11d48', fillColor: '#e11d48' }} />
            <Marker position={userPos} icon={L.divIcon({
              className: 'user-pos-icon',
              html: `<div class="relative flex h-4 w-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-brand-red border-2 border-white"></span>
              </div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })}>
              <Popup>You are here</Popup>
            </Marker>
          </>
        )}

        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.latitude, report.longitude]}
            icon={createCustomIcon(getMarkerColor(report.category))}
          >
            <Popup>
              <div className="p-2 min-w-[150px] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">
                    {t.categories[report.category as keyof typeof t.categories] || report.category}
                  </span>
                </div>
                <p className="text-xs font-medium text-zinc-700 line-clamp-2">{report.description}</p>
                <button 
                  onClick={() => onSelectReport?.(report)}
                  className="w-full py-1.5 bg-brand-black text-white text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-brand-red transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-zinc-200 shadow-lg space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Categories</p>
        {Object.entries(t.categories).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <div style={{ backgroundColor: getMarkerColor(key) }} className="w-2 h-2 rounded-full" />
            <span className="text-[10px] font-bold text-zinc-600">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
