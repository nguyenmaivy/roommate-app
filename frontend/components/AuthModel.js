"use client"
import { useEffect, useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import { useUser } from "@/app/Store/UserContext"

export default function AuthModal({ isOpen, mode, onClose, onLoginSuccess }) {
  const { user, setUser } = useUser();
  const [isLogin, setIsLogin] = useState(mode == "login")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    phone: "",
  })
  const [errors, setErrors] = useState({})
  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);

  if (!isOpen) return null
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email không được để trống"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống"
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = "Tên đầy đủ không được để trống"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
      }
    }
    if(!isLogin){
      if (!formData.phone) {
        newErrors.phone = "So dien thoai khong duoc de trong"
      } else if (!/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.phone)) {
        newErrors.phone = "So dien thoai khong hop le"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const endpoint = isLogin
      ? `${process.env.NEXT_PUBLIC_API_URL}/login`
      : `${process.env.NEXT_PUBLIC_API_URL}/register`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isLogin
            ? { email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password, name: formData.fullName, phone: formData.phone }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ apiError: data.error || "Có lỗi xảy ra" });
        return;
      }

      onLoginSuccess({
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone,
      });

      setUser({
        id: data.user.email,
        name: data.user.name,
        role: data.user.role,
        phone: data.user.phone
      });
      setFormData({ email: "", password: "", fullName: "", confirmPassword: "" , phone: ""});
      onClose();
    } catch (err) {
      setErrors({ apiError: "Không thể kết nối server" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{isLogin ? "Đăng Nhập" : "Đăng Ký"}</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name - Only for Signup */}
          {errors.apiError && (
            <p className="text-red-500 text-sm text-center">{errors.apiError}</p>
          )}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên đầy đủ</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"Đăng ký ngay
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition pr-10 ${errors.password ? "border-red-500" : "border-gray-300"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password - Only for Signup */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition mt-6"
          >
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </button>

          {/* Toggle Login/Signup */}
          <p className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <button
              type="button"
              onClick={() => {
                // setIsLogin(!isLogin)
                setErrors({})
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Đăng Ký" : "Đăng nhập"}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
