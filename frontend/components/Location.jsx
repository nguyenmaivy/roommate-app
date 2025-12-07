import { useState,useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import PickerMap from "./PickerMap"
import AutocompleteAddress from "./AutocompleteAddress";

const API_GET_DISTRICTS = "https://provinces.open-api.vn/api/v2/p/79?depth=2";
const VIETMAP_rereverse_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_reverse_API_KEY;

const Location = (porps) => {
    const { formData, setFormData, handleChange } = porps;
    const [wards, setWards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetch(API_GET_DISTRICTS)
            .then((response) => response.json())
            .then((data) => {
                setWards(data.wards);
            })
            .catch((error) => {
                console.error("Error fetching districts:", error);
            });
    }, []);

    useEffect(() => {
        const fetchReverse = async () => {
            if (!formData.locationCoords) return;
            const [lng, lat] = formData.locationCoords;

            try {
                const res = await fetch(
                    `https://maps.vietmap.vn/api/reverse/v4?apikey=${VIETMAP_rereverse_API_KEY}&lng=${lng}&lat=${lat}`
                );

                const data = await res.json();
                if (!data?.length) return;

                const result = data[0];

                console.log("Reverse geocode:", result);

                setFormData(prev => ({
                    ...prev,
                    street: result.name || "",
                    ward: result.boundaries?.[0]?.full_name || "",
                    district: result.boundaries?.[1]?.full_name || ""
                }));

            } catch (err) {
                console.error("Reverse geocode lỗi:", err);
            }
        };

        fetchReverse();

    }, [formData.locationCoords]);

    const handleSelectLocation = ({ lng, lat }) => {
        setFormData(prev => ({
            ...prev,
            locationCoords: [lng, lat],
        }));
    };

    if (!wards || wards.length === 0) {
        return (<LoadingSpinner />);
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Khu vực</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value="TP Hồ Chí Minh"
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phường <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ward"
                            value={formData.ward}
                            className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số nhà</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="..."
                            className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            disabled
                        />
                    </div>
                </div>
                <AutocompleteAddress
                    formData={formData}
                    setFormData={setFormData}
                />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Bản đồ</h3>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    <PickerMap
                        onSelectLocation={handleSelectLocation}
                        locationCoords={formData.locationCoords}
                    />
                </div>
            </div>
        </>
    )
}

export default Location;