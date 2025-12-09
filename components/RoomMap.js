'use client';

import { useEffect, useRef, useState } from 'react';

const VIETMAP_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY;
import '../public/css/vietmap-gl.css';

export default function RoomMap({ rooms, searchCoords }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [vietmapgl, setVietmapgl] = useState(null);
  const isTokenMissing = !VIETMAP_API_KEY;

  useEffect(() => {
    import('@vietmap/vietmap-gl-js')
      .then((module) => {
        const vietmap = module.default || module;
        vietmap.accessToken = VIETMAP_API_KEY;
        setVietmapgl(vietmap);
      })
      .catch((err) => console.error("Load Vietmap lỗi:", err));
  }, []);

  // INIT MAP ONLY 1 TIME
  useEffect(() => {
    if (!vietmapgl || !mapContainer.current || isTokenMissing) return;

    if (!map.current) {
      map.current = new vietmapgl.Map({
        container: mapContainer.current,
        style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${VIETMAP_API_KEY}`,
        center: searchCoords
          ? [searchCoords.lng, searchCoords.lat]
          : [106.6297, 10.8231],
        zoom: 15,
      });

      // Initial red marker
      window._searchMarker = new vietmapgl.Marker({ color: "#ff0000" })
        .setLngLat(searchCoords
          ? [searchCoords.lng, searchCoords.lat]
          : [106.6297, 10.8231])
        .addTo(map.current);
    }
  }, [vietmapgl, isTokenMissing]);

  // MOVE MAP WHEN searchCoords CHANGE
  useEffect(() => {
    if (!map.current || !vietmapgl || !searchCoords) return;

    map.current.flyTo({
      center: [searchCoords.lng, searchCoords.lat],
      zoom: 11,
      essential: true,
    });

    if (window._searchMarker) {
      window._searchMarker.remove();
    }

    window._searchMarker = new vietmapgl.Marker({ color: "#ff0000" })
      .setLngLat([searchCoords.lng, searchCoords.lat])
      .addTo(map.current);
  }, [searchCoords, vietmapgl]);

  // MARKERS FOR ROOMS
  useEffect(() => {
    if (!map.current || !vietmapgl) return;

    const markers = [];

    rooms.forEach((room) => {
      if (!room.location) return;

      const popup = new vietmapgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${room.title}</h3>
          <p>Giá: ${room.price.toLocaleString('vi-VN')} VND</p>
          <p>${room.address}</p>
          <p>Khoảng cách: ${Number(room.distance).toFixed(2)} KM</p>
        </div>
      `);
      console.log('Room location:', room);
      const marker = new vietmapgl.Marker()
        .setLngLat([room.location.lng, room.location.lat])
        .setPopup(popup)
        .addTo(map.current);

      markers.push(marker);
    });

    return () => markers.forEach(m => m.remove());
  }, [rooms, vietmapgl]);

  if (isTokenMissing) {
    return (
      <div className="w-full h-32 rounded-lg flex items-center justify-center bg-white text-gray-600">
        Thiếu API key vietmap. Hãy cấu hình NEXT_PUBLIC_VIETMAP_API_KEY.
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-96 rounded-lg shadow mb-8" />;
}
