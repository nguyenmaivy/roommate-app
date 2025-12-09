"use client"

import { MessageCircle } from "lucide-react"

export default function FloatingChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 z-40"
      aria-label="Open chat"
      title="Chat with us"
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  )
}
