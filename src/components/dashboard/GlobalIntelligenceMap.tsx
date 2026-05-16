"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, Shield, Zap, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface MarketThreat {
  lat: number;
  lng: number;
  label: string;
  trend: string;
  color: string;
}

const THREATS: MarketThreat[] = [
  { lat: 19.0760, lng: 72.8777, label: "MUMBAI", trend: "Demand: +18.2%", color: "#ef4444" },
  { lat: 28.6139, lng: 77.2090, label: "DELHI", trend: "Velocity: +12.5%", color: "#C8A059" },
  { lat: 12.9716, lng: 77.5946, label: "BANGALORE", trend: "Inventory: -8.4%", color: "#22c55e" }
];

export default function GlobalIntelligenceMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useGoogle, setUseGoogle] = useState(!!GOOGLE_MAPS_API_KEY);
  const { theme } = useTheme();

  useEffect(() => {
    const init = async () => {
      if (useGoogle) {
        await loadGoogleMaps();
      } else {
        loadLeaflet();
      }
    };
    init();

    return () => {
      // Cleanup markers and info windows
      markersRef.current.forEach(m => m.setMap(null));
      infoWindowsRef.current.forEach(iw => iw.close());
      markersRef.current = [];
      infoWindowsRef.current = [];
      
      if (mapInstance.current && !useGoogle) {
        mapInstance.current.remove();
      }
    };
  }, [useGoogle, theme]);

  const loadGoogleMaps = async () => {
    // @ts-ignore
    if (window.google && window.google.maps) {
      initGoogleMap();
      return;
    }

    if (document.getElementById("google-maps-script")) return;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=visualization`;
    script.async = true;
    
    const promise = new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
    });

    document.head.appendChild(script);
    
    try {
      await promise;
      initGoogleMap();
    } catch (err) {
      console.error("Google Maps script failed to load.");
      setUseGoogle(false);
    }
  };

  const initGoogleMap = () => {
    if (!mapRef.current) return;
    // @ts-ignore
    const google = window.google;
    
    try {
      const styles = theme === "dark" ? [
        { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#121212" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
        { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
      ] : [
        { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
      ];

      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: 21.0, lng: 78.9629 }, 
        zoom: 4.8,
        styles,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeId: theme === "dark" ? 'hybrid' : 'roadmap',
        gestureHandling: 'cooperative'
      });

      THREATS.forEach(t => {
        const marker = new google.maps.Marker({
          position: { lat: t.lat, lng: t.lng },
          map: mapInstance.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: t.color,
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8
          }
        });
        markersRef.current.push(marker);

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="background: ${theme === 'dark' ? 'rgba(18,18,18,0.9)' : 'white'}; padding: 8px 12px; border: 1px solid ${t.color}; border-radius: 12px; color: ${theme === 'dark' ? 'white' : '#0F172A'}; font-family: inherit; font-size: 11px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
              <div style="font-weight: 900; text-transform: uppercase; color: ${t.color}; font-size: 9px; letter-spacing: 0.1em;">${t.label}</div>
              <div style="font-weight: bold; margin-top: 4px;">${t.trend}</div>
            </div>
          `,
          disableAutoPan: true
        });
        infoWindowsRef.current.push(infoWindow);
        infoWindow.open(mapInstance.current, marker);
      });

      setIsLoaded(true);
    } catch (err) {
      console.error("Google Maps initialization error:", err);
      setUseGoogle(false);
    }
  };

  const loadLeaflet = () => {
    // Leaflet fallback implementation
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (!mapRef.current) return;
      // @ts-ignore
      const L = window.L;
      mapInstance.current = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([20.5937, 78.9629], 5);
      const tileUrl = theme === "dark" 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      L.tileLayer(tileUrl).addTo(mapInstance.current);
      setIsLoaded(true);
    };
  };

  return (
    <div className="glass rounded-[40px] border border-white/5 p-8 shadow-2xl relative overflow-hidden h-full min-h-[500px] flex flex-col">
      <div className="relative z-10 flex flex-col h-full flex-1">
        <header className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Globe className="w-4 h-4 text-luxury-gold" />
              <h2 className="text-xl font-medium tracking-tight">Geospatial Sentinel</h2>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              {useGoogle ? "Google Cloud Satellite Feed" : "Vector Telemetry Layer"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-luxury-gold/10 px-3 py-1.5 rounded-full border border-luxury-gold/20">
              <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-luxury-gold uppercase tracking-widest">Active Scan</span>
            </div>
          </div>
        </header>

        <div className="flex-1 relative rounded-3xl border border-white/10 overflow-hidden bg-black/40 group">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
               <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
            </div>
          )}
          <div ref={mapRef} className="absolute inset-0 w-full h-full" />
          
          <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-luxury-gold/10 via-transparent to-transparent h-1/4 animate-scan-line" />
        </div>

        <div className="mt-6 flex items-center justify-between">
           <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                 <Shield className="w-3 h-3 text-luxury-gold" />
                 <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">Vector-Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                 <Zap className="w-3 h-3 text-luxury-gold" />
                 <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">Latency: 42ms</span>
              </div>
           </div>
           {!GOOGLE_MAPS_API_KEY && (
             <button 
               onClick={() => setUseGoogle(true)}
               className="text-[8px] text-luxury-gold/50 hover:text-luxury-gold transition-colors font-black uppercase tracking-widest"
             >
               Switch to Google Maps Key
             </button>
           )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line {
          from { transform: translateY(-100%); }
          to { transform: translateY(400%); }
        }
        .animate-scan-line {
          animation: scan-line 4s linear infinite;
        }
        .leaflet-container { background: transparent !important; }
      `}} />
    </div>
  );
}
