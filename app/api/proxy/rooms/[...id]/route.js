import { NextResponse } from 'next/server';
import { ROOMS } from '@/mockData';

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const idSegments = params?.id;

  if (Array.isArray(idSegments) && idSegments.length === 1) {
    const id = idSegments[0];
    const room = ROOMS.find(r => r.id === id) || null;
    return NextResponse.json(room);
  }

  let rooms = [...ROOMS];
  if (district) {
    rooms = rooms.filter(r => r.address?.includes(district));
  }
  return NextResponse.json(rooms);
}

export async function POST(request) {
  const body = await request.json();
  // Giả lập tạo mới: trả về id giả và data đã gửi
  return NextResponse.json({ message: 'Mock create ok', id: 'mock-id', data: body });
}