'use client';

import { useState } from 'react';
import ReactStars from 'react-stars';
import { X } from 'lucide-react';

export default function ReviewModal({ room, onClose, onSave }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ roomId: room.id, rating, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Đánh Giá {room.title}</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rating</label>
            <ReactStars count={5} value={rating} onChange={setRating} size={24} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Bình luận</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Gửi</button>
        </form>
      </div>
    </div>
  );
}