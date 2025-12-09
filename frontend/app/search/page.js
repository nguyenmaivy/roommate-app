'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, CheckCircle, LayoutGrid, X } from 'lucide-react';
import RoomCard from '@/components/RoomCard';
import RoomMap from '@/components/RoomMap';
import ReviewModal from '@/components/ReviewModal';
import { AMENITIES, USER_ROLES } from '@/mockData';
import ChatModal from "@/components/ChatModal"
import { useUser } from '../Store/UserContext';

const VIETMAP_rereverse_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_reverse_API_KEY;

export default function SearchPage() {
  const [rooms, setRooms] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { user } = useUser();
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    amenities: [],
    showFavorites: false,
    searchCoords: null,
  });
  const [reviewRoom, setReviewRoom] = useState(null);
  const [chatRoom, setChatRoom] = useState(null); // chưa sử dụng
  const isLandlord = user?.role == "LANDLORD";
  const [suggestions, setSuggestions] = useState([]);
  const [searchCoords, setSearchCoords] = useState(null);
  const timeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`);
        const data = (await res.json()).rooms;

        const updatedRooms = data.map(room => ({
          ...room,
          isFavorite: false,
        }));

        setRooms(updatedRooms);
      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
        setRooms([]);
      }
    }

    fetchRooms();
  }, []);


  const toggleFavorite = useCallback(async (roomId) => {
    const isFav = favorites.includes(roomId);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, add: !isFav }),
      });
      setFavorites(prev => isFav ? prev.filter(id => id !== roomId) : [...prev, roomId]);
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, isFavorite: !isFav } : r));
    } catch (error) {
      console.error('Favorite error:', error);
    }
  }, [favorites]);

  const handleSaveReview = useCallback(async (reviewData) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${reviewData.roomId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      setReviewRoom(null);
    } catch (error) {
      console.error('Review error:', error);
    }
  }, []);

  const filteredRooms = useMemo(() => {
    let result = rooms.filter(room => {
      // if (filters.location && !room.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.minPrice && room.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && room.price > Number(filters.maxPrice)) return false;
      if (filters.minArea && room.area < Number(filters.minArea)) return false;
      if (filters.maxArea && room.area > Number(filters.maxArea)) return false;
      if (filters.amenities.length > 0 && !filters.amenities.every(a => room.amenities.includes(a))) return false;
      if (filters.showFavorites && !favorites.includes(room.id)) return false;
      if (isLandlord && room.landlordId !== user?.id) return false;
      return true;
    });
    if (searchCoords) {
      result = result
        .map(room => ({
          ...room,
          distance: calculateDistance(
            searchCoords.lat,
            searchCoords.lng,
            room.location.lat,
            room.location.lng
          )
        }))
        .sort((a, b) => a.distance - b.distance); // gần -> xa
    }
    return result;
  }, [rooms, filters, favorites, isLandlord, user?.id, searchCoords]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(key) ? prev.amenities.filter(a => a !== key) : [...prev.amenities, key],
    }));
  };

  const handleClearFilters = () => {
    setFilters({ location: '', minPrice: '', maxPrice: '', minArea: '', maxArea: '', amenities: [], showFavorites: false });
  };
  const handleVietmapInput = (e) => {
    const text = e.target.value;
    setFilters(prev => ({ ...prev, location: text }));

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      searchVietmap(text);
    }, 500);
  };

  const searchVietmap = async (text) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const url = `https://maps.vietmap.vn/api/autocomplete/v4?apikey=${VIETMAP_rereverse_API_KEY}&text=${encodeURIComponent(text)}&cityId=12`; // TP.HCM

      const res = await fetch(url);
      const data = await res.json();

      setSuggestions(data || []);
      setLoading(false);
    } catch (e) {
      console.error("Vietmap error:", e);
    }
  };

  const handleSelectSuggestion = async (item) => {
    setFilters(prev => ({ ...prev, location: item.display }));
    setSuggestions([]);

    const ref_id = item.ref_id.replace("geocode:", "auto:");
    const url = `https://maps.vietmap.vn/api/place/v4?refid=${ref_id}&apikey=${VIETMAP_rereverse_API_KEY}`;

    const res = await fetch(url);
    const detail = await res.json();

    if (!detail.lat || !detail.lng) return;

    setSearchCoords({ lat: detail.lat, lng: detail.lng });
  };

  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return (
    <div className="lg:flex lg:space-x-8">
      <div className="lg:w-1/4 w-full mb-8 lg:mb-0">
        <div className="bg-white p-6 rounded-xl shadow-lg sticky lg:top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
            <Search className="w-5 h-5 mr-2 text-indigo-500" /> Tìm kiếm & Lọc
          </h2>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vị trí (Tìm theo VietMap)
            </label>

            <input
              type="text"
              value={filters.location}
              onChange={handleVietmapInput}
              placeholder="Nhập địa điểm: Q5, Thủ Đức..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {loading && (
              <div className="absolute right-3 bottom-3 animate-spin w-4 h-4 border-3 border-gray-300 border-t-blue-500 rounded-full"></div>
            )}
            {/* Gợi ý địa điểm */}
            {suggestions.length > 0 && (
              <ul className="absolute w-full bg-white shadow-lg border rounded-lg mt-1 max-h-60 overflow-y-auto z-50">
                {suggestions.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => handleSelectSuggestion(item)}
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng giá (VNĐ)</label>
            <div className="flex space-x-3">
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min" className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max" className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích (m²)</label>
            <div className="flex space-x-3">
              <input type="number" name="minArea" value={filters.minArea} onChange={handleFilterChange} placeholder="Min (m²)" className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              <input type="number" name="maxArea" value={filters.maxArea} onChange={handleFilterChange} placeholder="Max (m²)" className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiện ích</label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map(amenity => {
                console.log('Rendering amenity filter:', filters);
                return (
                  <button
                    key={amenity.key}
                    onClick={() => handleAmenityFilter(amenity.key)}
                    className={`flex items-center justify-center gap-1 p-2 text-xs rounded-lg border transition 
                      ${filters.amenities.includes(amenity.key)
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {amenity.label}

                    {/* Badge số lượng phòng */}
                    {filters.amenities.includes(amenity.key) && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-white/20 text-white font-semibold">
                        {filteredRooms.length}
                      </span>
                    )}
                  </button>

                )
              })}
            </div>
          </div>
          {user?.role === USER_ROLES.STUDENT && (
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.showFavorites}
                  onChange={(e) => setFilters(prev => ({ ...prev, showFavorites: e.target.checked }))}
                  className="rounded text-red-500 focus:ring-red-500 h-4 w-4 mr-2 border-gray-300"
                />
                Chỉ xem phòng **Đã Lưu** ({favorites.length})
              </label>
            </div>
          )}
          <button onClick={handleClearFilters} className="w-full py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium border border-gray-300 flex items-center justify-center">
            <X className="w-4 h-4 mr-1" /> Xóa bộ lọc
          </button>
        </div>
      </div>
      <div className="lg:w-3/4 w-full">
        <RoomMap
          rooms={filteredRooms}
          searchCoords={searchCoords}
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <LayoutGrid className="w-6 h-6 mr-2 text-indigo-500" />
          {isLandlord ? 'Phòng trọ đã đăng' : 'Danh sách phòng trọ'} ({filteredRooms.length})
        </h2>
        <div className="space-y-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <div key={room.id}>
                <RoomCard
                  room={room}
                  currentUserId={user?.id}
                  userRole={user?.role}
                  toggleFavorite={toggleFavorite}
                  onEdit={() => console.log('Edit:', room.id)}
                  onDelete={() => console.log('Delete:', room.id)}
                  onChat={() => {
                    const chatRoomId = `${room.id}_${user?.id}`;   // ✅ tạo roomId unique
                    setChatRoom({
                      roomId: chatRoomId,
                      landlordId: room.landlordId,
                      studentId: user?.id,
                      roomTitle: room.title,
                    });
                  }}
                />
                <button
                  onClick={() => setReviewRoom(room)}
                  className="mt-2 text-sm text-indigo-600 hover:underline"
                >
                  Viết đánh giá
                </button>
              </div>
            ))
          ) : (
            <div className="text-center p-12 bg-white rounded-xl shadow-lg">
              <p className="text-xl text-gray-500 font-medium">Không tìm thấy phòng trọ nào phù hợp.</p>
              <p className="text-gray-400 mt-2">Hãy thử điều chỉnh lại bộ lọc của bạn.</p>
            </div>
          )}
        </div>
      </div>
      {reviewRoom && (
        <ReviewModal
          room={reviewRoom}
          onClose={() => setReviewRoom(null)}
          onSave={handleSaveReview}
        />
      )}
      {chatRoom && <ChatModal room={chatRoom} onClose={() => setChatRoom(null)} />}
    </div>

  );
}