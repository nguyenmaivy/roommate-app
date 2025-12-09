// app/admin/dashboard/page.js  (hoặc app/dashboard/page.js)
"use client";
import { AMENITIES, USERS, ROOMS } from "@mockData.js";
import Link from "next/link"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentRooms, setRecentRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  // Lấy dữ liệu dashboard từ API
  useEffect(() => {
    if (!user) return;

    const calcStats = () => {
      const totalUsers = USERS.length;

      const totalRooms = ROOMS.length;

      const todayMessages = 0; // nếu bạn chưa có dữ liệu tin nhắn

      const monthlyRevenue = ROOMS.reduce((sum, r) => sum + (r.price || 0), 0);

      setStats({
        totalUsers,
        totalRooms,
        todayMessages,
        monthlyRevenue,
      });

      // Lấy 5 phòng mới nhất
      const sortedRooms = ROOMS.slice().reverse().slice(0, 5);
      setRecentRooms(sortedRooms);

      setLoading(false);
    };

    calcStats();
  }, [user]);

  const landlordRanking = USERS.map(u => ({
    ...u,
    roomCount: ROOMS.filter(r => r.landlordId === u.id).length
  })).sort((a, b) => b.roomCount - a.roomCount);


  if (loading || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"
          } bg-indigo-700 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-5 border-b border-indigo-600">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl ${!sidebarOpen && "hidden"}`}>
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-indigo-600 p-2 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href || "#"}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${item.active
                ? "bg-indigo-800 shadow-lg"
                : "hover:bg-indigo-600"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className={`${!sidebarOpen && "hidden"}`}>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-600">
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition w-full">
            <LogOut className="w-5 h-5" />
            <span className={`${!sidebarOpen && "hidden"}`}>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Chào mừng trở lại, <span className="text-indigo-600">{user.name}</span>
            </h2>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Tổng người dùng",
    
                icon: Users,
                color: "bg-blue-500",
                trend: "+12%",
              },
              {
                title: "Phòng trọ",
                icon: Home,
                color: "bg-green-500",
                trend: "+8%",
              },
              {
                title: "Tin nhắn hôm nay",
                icon: MessageSquare,
                color: "bg-purple-500",
                trend: "+23%",
              },
              {
                title: "Doanh thu tháng",
                icon: DollarSign,
                color: "bg-yellow-500",
                trend: "+18%",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-green-500 text-sm font-semibold flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Rooms & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Rooms */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Phòng trọ mới đăng
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentRooms.length > 0 ? (
                  recentRooms.map((room) => {
                    const landlord = USERS.find(u => u.id === room.landlordId);

                    const amenityLabels = room.amenities
                      ?.map(key => AMENITIES.find(a => a.key === key)?.label)
                      .filter(Boolean);

                    return (
                      <div
                        key={room.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        {/* Hình đại diện */}
                        <div className="flex items-center space-x-4">
                          <img
                            src={room.imageUrl?.[0] || "/placeholder-room.jpg"}
                            alt={room.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />

                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {room.title}
                            </h4>

                            <p className="text-sm text-gray-600">
                              {room.price.toLocaleString("vi-VN")} VNĐ/tháng • {room.area}m²
                            </p>

                            {/* Chủ trọ */}
                            <p className="text-xs text-gray-500">
                              Chủ trọ: {landlord?.contact_name || "Không rõ"}
                            </p>

                            {/* Tiện ích */}
                            {amenityLabels.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                Tiện ích: {amenityLabels.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Trạng thái (vì dữ liệu của bạn chưa có status → dùng mặc định) */}
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Đã duyệt
                        </span>
                      </div>
                    );
                  })

                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Chưa có phòng trọ nào được đăng gần đây
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Hành động nhanh
              </h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
                  Xem tất cả người dùng
                </button>
                <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                  Duyệt tin mới
                </button>
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                  Xem báo cáo vi phạm
                </button>
                <button className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium">
                  Xuất báo cáo tháng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}