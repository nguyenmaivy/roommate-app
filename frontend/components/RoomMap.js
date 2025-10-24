'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function RoomMap({ rooms }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [106.6297, 10.8231],
        zoom: 10,
      });
      map.current.addControl(new mapboxgl.NavigationControl());
    }

    const markers = [];
    rooms.forEach(room => {
      if (!room.locationCoords) return;
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${room.title}</h3>
          <p>Giá: ${room.price.toLocaleString('vi-VN')} VND</p>
          <p>${room.location}</p>
        </div>
      `);
      const marker = new mapboxgl.Marker()
        .setLngLat(room.locationCoords)
        .setPopup(popup)
        .addTo(map.current);
      markers.push(marker);
    });

    return () => markers.forEach(marker => marker.remove());
  }, [rooms]);

  return <div ref={mapContainer} className="w-full h-96 rounded-lg shadow mb-8" />;
}