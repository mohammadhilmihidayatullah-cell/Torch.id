
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Marker as MarkerType, UserCategory } from '../types';
import { Globe, Users, User, Search, Settings, LocateFixed } from 'lucide-react';

interface MapComponentProps {
  markers: MarkerType[];
  onDrop: (lat: number, lng: number) => void;
  userCategory: UserCategory;
}

const MapComponent: React.FC<MapComponentProps> = ({ markers, onDrop, userCategory }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true
    }).setView([-2.5489, 118.0149], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapRef.current);

    markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      onDrop(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onDrop]);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach(marker => {
      const iconHtml = `
        <div class="flex flex-col items-center group cursor-pointer">
          <div class="bg-black text-white px-2 py-0.5 rounded shadow-lg text-[9px] font-bold mb-1 border border-gray-800 opacity-80 group-hover:opacity-100 transition-all">${marker.userName}</div>
          <div class="relative">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#1D4ED8" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3))">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center pb-2">
              <span class="text-[8px] font-black text-white uppercase">${marker.category[0]}</span>
            </div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [60, 60],
        iconAnchor: [30, 45]
      });

      L.marker([marker.lat, marker.lng], { icon: customIcon }).addTo(markersLayerRef.current!);
    });
  }, [markers]);

  const handleLocate = () => {
    if (mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 13 });
    }
  };

  const handleDropManual = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      onDrop(center.lat, center.lng);
    }
  };

  return (
    <div className="relative h-[60vh] w-full bg-[#f8f9fa] overflow-hidden rounded-b-[40px] shadow-inner border-b border-gray-100">
      <div ref={containerRef} className="h-full w-full z-0" />

      {/* Navigation Overlays */}
      <div className="absolute top-6 left-6 right-6 z-[1000] pointer-events-none flex justify-between">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-4 py-2 border border-gray-50 flex items-center gap-4 pointer-events-auto">
          <img src="https://torch.id/cdn/shop/files/Logo_Torch_Primary_Black_150x.png?v=1614300445" alt="Torch" className="h-6 grayscale brightness-0" />
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <p className="text-xs font-bold text-gray-500 tracking-tight">ADVENTURE MAP</p>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          <button className="bg-white p-3 rounded-2xl shadow-lg border border-gray-50 text-gray-400 hover:text-black transition-all">
            <Search size={20} />
          </button>
          <button 
            onClick={handleLocate}
            className="bg-white p-3 rounded-2xl shadow-lg border border-gray-50 text-[#1D4ED8] hover:text-blue-700 transition-all active:scale-95"
          >
            <LocateFixed size={20} />
          </button>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="absolute bottom-8 left-0 right-0 z-[1000] px-6 flex flex-col items-center gap-4 pointer-events-none">
        <button 
          onClick={handleDropManual}
          className="pulse-button bg-[#1D4ED8] hover:bg-blue-800 text-white font-extrabold py-5 px-12 rounded-full shadow-2xl flex items-center gap-3 transition-all active:scale-95 pointer-events-auto transform hover:-translate-y-1"
        >
          <span className="text-xl">📍</span>
          Drop your Torch
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
