import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return NextResponse.json(await res.json());
}

// import { NextResponse } from 'next/server';

// export async function GET(request, { params }) {
//   const { id } = params;
//   const url = id ? `${process.env.NEXT_PUBLIC_API_URL}/rooms/${id.join('/')}` : `${process.env.NEXT_PUBLIC_API_URL}/rooms`;
//   const res = await fetch(url);
//   return NextResponse.json(await res.json());
// }

// export async function POST(request, { params }) {
//   const { id } = params;
//   const body = await request.json();
//   const url = id ? `${process.env.NEXT_PUBLIC_API_URL}/rooms/${id.join('/')}` : `${process.env.NEXT_PUBLIC_API_URL}/rooms`;
//   const res = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });
//   return NextResponse.json(await res.json());
// }

// export async function DELETE(request, { params }) {
//   const { id } = params;
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id.join('/')}`, { method: 'DELETE' });
//   return NextResponse.json(await res.json());
// }