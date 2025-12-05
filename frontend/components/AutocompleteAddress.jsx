"use client";
import { useState, useEffect, useRef } from "react";

export default function AutocompleteAddress({ formData, setFormData }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef();

    const VIETMAP_rereverse_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_reverse_API_KEY;

    // ==============================
    // 1. HANDLE INPUT → DEBOUNCE SEARCH
    // ==============================
    const handleInput = (e) => {
        const text = e.target.value;
        setQuery(text);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            searchAddress(text);
        }, 1000);
    };

    // ==============================
    // 2. SEARCH API GỢI Ý
    // ==============================
    const searchAddress = async (text) => {
        if (!text.trim()) {
            setSuggestions([]);
            return;
        }

        setLoading(true);

        try {
            const url =
                `https://maps.vietmap.vn/api/autocomplete/v4` +
                `?apikey=${VIETMAP_rereverse_API_KEY}&text=${encodeURIComponent(text)}&cityId=12`;

            const res = await fetch(url);
            const data = await res.json();

            setSuggestions(data || []);
        } catch (err) {
            console.error("Search error:", err);
        }

        setLoading(false);
    };

    // ==============================
    // 3. USER CHỌN 1 GỢI Ý
    // ==============================
    const handleSelect = async (item) => {
        console.log("Selected item:", item);
        setQuery(item.name);
        setSuggestions([]);

        const ref_id = item.ref_id.replace("geocode:", "auto:");

        // Lấy chi tiết theo ref_id
        const detailUrl =
            `https://maps.vietmap.vn/api/place/v4?refid=${ref_id}&apikey=${VIETMAP_rereverse_API_KEY}`;

        const detailRes = await fetch(detailUrl);
        const detail = await detailRes.json();

        if (!detail.lng || !detail.lat) return;

        // Gửi tọa độ ra ngoài để focus map
        // onSelectLocation({ lng: detail.lng, lat: detail.lat });
        console.log("Detail:", detail);
        // Fill form
        setFormData((prev) => ({
            ...prev,
            locationCoords: [detail.lng, detail.lat],
            address: detail.address || "",
            ward: detail.ward || "",
            district: detail.district || "",
        }));
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium mb-2">Nhập địa chỉ</label>

            <input
                type="text"
                value={query}
                onChange={handleInput}
                placeholder="VD: 50 Nguyễn Huệ, Bến Nghé..."
                className="w-full px-4 py-2 border rounded-lg"
            />

            {/* Loading */}
            {loading && (
                <div className="absolute right-3 top-3 animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
            )}

            {/* Suggestion box */}
            {suggestions.length > 0 && (
                <ul className="absolute w-full bg-white shadow-lg border rounded-lg mt-1 max-h-60 overflow-y-auto z-50">
                    {suggestions.map((item, i) => (
                        <li
                            key={i}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-gray-500">
                                {item.address}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
