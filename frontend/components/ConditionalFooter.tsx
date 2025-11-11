// components/ConditionalFooter.tsx
'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer'; // đường dẫn tới component Footer của bạn

export default function ConditionalFooter() {
  const pathname = usePathname() || '';

  // Ẩn footer cho tất cả route bắt đầu bằng /chat
  const hideFooter = pathname.startsWith('/chat');

  // Nếu chỉ muốn ẩn đúng /chat (không ẩn /chat/something), dùng:
  // const hideFooter = pathname === '/chat' || pathname === '/chat/';

  if (hideFooter) return null;
  return <Footer />;
}
