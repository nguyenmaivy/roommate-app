import { useEffect, useRef, useState } from "react";
import "../public/css/vietmap-gl.css";

const VIETMAP_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY;

const PickerMap = ({ locationCoords, onSelectLocation }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [vietmapgl, setVietmapgl] = useState(null);

    // Load SDK
    useEffect(() => {
        import("@vietmap/vietmap-gl-js").then((module) => {
            const vm = module.default || module;
            vm.accessToken = VIETMAP_API_KEY;
            setVietmapgl(vm);
        });
    }, []);

    // Khởi tạo bản đồ lần đầu
    useEffect(() => {
        if (!vietmapgl || !mapContainer.current || map.current) return;

        map.current = new vietmapgl.Map({
            container: mapContainer.current,
            style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${VIETMAP_API_KEY}`,
            center: locationCoords || [106.6297, 10.8231],
            zoom: 14
        });
    }, [vietmapgl]);

    // Khi locationCoords thay đổi → cập nhật marker
    useEffect(() => {
        if (!map.current || !vietmapgl || !locationCoords) return;

        const [lng, lat] = locationCoords;

        // Xóa marker cũ
        if (marker.current) {
            marker.current.remove();
        }

        // Tạo marker mới
        marker.current = new vietmapgl.Marker({ color: "red" })
            .setLngLat([lng, lat])
            .addTo(map.current);

        // Fly map đến vị trí mới
        map.current.flyTo({
            center: [lng, lat],
            zoom: 15,
            speed: 1.2
        });
        map.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            if (marker.current) {
                marker.current.remove();
            }

            // Tạo marker mới
            marker.current = new vietmapgl.Marker({ color: "red" })
                .setLngLat([lng, lat])
                .addTo(map.current);
            if (onSelectLocation) {
                onSelectLocation({ lng, lat });
            }
            console.log("Map clicked at:", lng, lat);
            onSelectLocation({ lng, lat });
        });

    }, [locationCoords, vietmapgl]);

    return (
        <div
            ref={mapContainer}
            className="w-full h-1/1 rounded-lg shadow"
        />
    );
};

export default PickerMap;
