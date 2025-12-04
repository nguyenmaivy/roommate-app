'use client';

import { useEffect, useRef, useState } from 'react';

const VIETMAP_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY;
import '../public/css/vietmap-gl.css';
export default function RoomMap({ rooms }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [vietmapgl, setVietmapgl] = useState(null);
  const isTokenMissing = !VIETMAP_API_KEY;

  // Load Vietmap khi client mount
  useEffect(() => {
    import('@vietmap/vietmap-gl-js')
      .then((module) => {
        const vietmap = module.default || module;
        vietmap.accessToken = VIETMAP_API_KEY;
        setVietmapgl(vietmap);
      })
      .catch((err) => console.error("Load Vietmap lỗi:", err));
  }, []);

  useEffect(() => {
    if (!vietmapgl || !mapContainer.current) return;
    if (isTokenMissing) return;

    if (!map.current) {
      map.current = new vietmapgl.Map({
        container: mapContainer.current, // dùng ref, không dùng string!
        style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${VIETMAP_API_KEY}`,
        center: [106, 10],
        zoom: 3
      });

      map.current.addControl(
        new vietmapgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true
        })
      );
    }

    const markers = [];
    rooms.forEach((room) => {
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

    return () => markers.forEach((m) => m.remove());
  }, [rooms, vietmapgl, isTokenMissing]);

  if (isTokenMissing) {
    return (
      <div className="w-full h-32 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
        Thiếu API key vietmap. Hãy cấu hình NEXT_PUBLIC_VIETMAP_API_KEY.
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-96 rounded-lg shadow mb-8" />;
}
