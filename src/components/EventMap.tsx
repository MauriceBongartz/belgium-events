"use client";

import { useEffect, useRef } from "react";

interface MapProps {
  latitude: number;
  longitude: number;
  title: string;
}

export default function EventMap({ latitude, longitude, title }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapRef.current || mapInstanceRef.current) return;

    import("mapbox-gl").then((mapboxgl) => {
      const mapbox = mapboxgl.default;
      mapbox.accessToken = token;

      const map = new mapbox.Map({
        container: mapRef.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [longitude, latitude],
        zoom: 13,
      });

      mapInstanceRef.current = map;

      // Custom gold marker
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.cssText = `
        width: 14px; height: 14px;
        background: #d4a820;
        border: 2px solid #0a0a0a;
        box-shadow: 0 0 0 2px #d4a820;
      `;

      new mapbox.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .setPopup(
          new mapbox.Popup({ offset: 20 }).setHTML(
            `<div style="font-family: 'DM Sans', sans-serif; color: #111; font-size: 13px; font-weight: 600;">${title}</div>`
          )
        )
        .addTo(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, title]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return (
      <div className="h-64 border border-belgium-border bg-belgium-card flex items-center justify-center">
        <div className="text-center">
          <p className="text-belgium-muted text-sm">Map unavailable</p>
          <p className="text-xs text-belgium-border mt-1">Add NEXT_PUBLIC_MAPBOX_TOKEN to enable</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="h-64 w-full border border-belgium-border" />
  );
}
