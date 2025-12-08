export function filterRooms(filters, rooms) {
  return rooms.filter((room) => {
    // Lọc giá
    if (filters.budget && room.price > filters.budget) return false

    // Lọc khu vực theo address
    if (
      filters.location &&
      !room.address.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false

    // Lọc loại phòng
    if (
      filters.type &&
      !room.rental_type.toLowerCase().includes(filters.type.toLowerCase())
    )
      return false

    // Lọc diện tích
    if (filters.area && room.area < filters.area) return false

    // Lọc tiện ích
    if (filters.amenities?.length > 0) {
      const hasEnough = filters.amenities.every((item) =>
        room.amenities.includes(item)
      )
      if (!hasEnough) return false
    }

    return true
  })
}
