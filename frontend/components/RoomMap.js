'use client';

import { useEffect, useRef } from 'react';
import vietmapgl from '@vietmap/vietmap-gl-js';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';

const VIETMAP_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY;
vietmapgl.accessToken = VIETMAP_API_KEY;

export default function RoomMap({ rooms }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const isTokenMissing = !VIETMAP_API_KEY || VIETMAP_API_KEY.length === 0;

  useEffect(() => {
    if (isTokenMissing) return;
    if (!map.current) {
      map.current = new vietmapgl.Map({
        container: mapContainer.current,
        style: `https://maps.vietmap.vn/styles/vietmap/style.json?apikey=${VIETMAP_API_KEY}`,
        center: [106.6297, 10.8231],
        zoom: 10,
      });
      map.current.addControl(new vietmapgl.NavigationControl());
    }

    const markers = [];
    rooms.forEach(room => {
      if (!room.locationCoords) return;
      const popup = new vietmapgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${room.title}</h3>
          <p>Giá: ${room.price.toLocaleString('vi-VN')} VND</p>
          <p>${room.location}</p>
        </div>
      `);
      const marker = new vietmapgl.Marker()
        .setLngLat(room.locationCoords)
        .setPopup(popup)
        .addTo(map.current);
      markers.push(marker);
    });

    return () => markers.forEach(marker => marker.remove());
  }, [rooms]);

  if (isTokenMissing) {
    return (
      <div className="w-full h-32 rounded-lg shadow mb-8 flex items-center justify-center bg-gray-50 text-gray-600 text-sm">
        Không thể tải bản đồ vì thiếu Vietmap API key. Hãy cấu hình NEXT_PUBLIC_VIETMAP_API_KEY.
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-96 rounded-lg shadow mb-8" />;
}