export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Về Phòng Trọ</h3>
            <p className="text-gray-400">Nền tảng tìm kiếm và quản lý phòng trọ hiện đại</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Phòng trọ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Điều khoản
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Chính sách
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Phòng Trọ. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
