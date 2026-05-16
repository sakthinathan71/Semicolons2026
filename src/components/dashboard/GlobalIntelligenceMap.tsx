"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, Shield, Zap, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function GlobalIntelligenceMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useGoogle, setUseGoogle] = useState(!!GOOGLE_MAPS_API_KEY);
  const { theme } = useTheme();

  useEffect(() => {
    if (useGoogle) {
      loadGoogleMaps();
    } else {
      loadLeaflet();
    }

    return () => {
      if (mapInstance.current) {
        // Cleanup logic would go here if needed
      }
    };
  }, [useGoogle, theme]);

  const loadGoogleMaps = () => {
    // Check if google maps is already loaded
    // @ts-ignore
    if (window.google && window.google.maps) {
      initGoogleMap();
      return;
    }

    // Check if the script is already being loaded
    if (document.getElementById("google-maps-script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=visualization`;
    script.async = true;
    
    const timeout = setTimeout(() => {
      console.warn("Google Maps load timeout. Falling back to Leaflet.");
      setUseGoogle(false);
    }, 5000);

    script.onload = () => {
      clearTimeout(timeout);
      initGoogleMap();
    };

    script.onerror = () => {
      clearTimeout(timeout);
      console.error("Google Maps script failed to load.");
      setUseGoogle(false);
    };

    document.head.appendChild(script);
  };

  const initGoogleMap = () => {
    if (!mapRef.current) return;
    // @ts-ignore
    const google = window.google;
    
    try {
      const darkStyle = [
        { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#121212" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
        { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
        { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
        { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
        { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
        { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
      ];

      const lightStyle = [
        { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
      ];

      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: 21.0, lng: 78.9629 }, 
        zoom: 4.8,
        styles: theme === "dark" ? darkStyle : lightStyle,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        mapTypeId: theme === "dark" ? 'hybrid' : 'roadmap'
      });

      const threats = [
        { lat: 19.0760, lng: 72.8777, label: "MUMBAI", trend: "Demand: +18.2%", color: "#ef4444" },
        { lat: 28.6139, lng: 77.2090, label: "DELHI", trend: "Velocity: +12.5%", color: "#C8A059" },
        { lat: 12.9716, lng: 77.5946, label: "BANGALORE", trend: "Inventory: -8.4%", color: "#22c55e" }
      ];

      threats.forEach(t => {
        const marker = new google.maps.Marker({
          position: { lat: t.lat, lng: t.lng },
          map: mapInstance.current,
          title: t.label,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: t.color,
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="background: rgba(18,18,18,0.9); padding: 6px 10px; border: 1px solid ${t.color}; border-radius: 6px; color: white; font-family: inherit; font-size: 10px; pointer-events: none;">
              <div style="font-weight: 900; text-transform: uppercase; color: ${t.color}; font-size: 8px;">${t.label}</div>
              <div style="font-weight: bold; margin-top: 2px;">${t.trend}</div>
            </div>
          `,
          disableAutoPan: true
        });

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
