"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Edit2, Trash2, X, Check, ImagePlus } from "lucide-react";
import type { Review } from "../../types";
import StarRating from "./StarRating";

interface ReviewItemProps {
  review: Review;
  currentUserNickname: string;
  onUpdate: (reviewId: string, data: { rating: number; content: string; images: string[] }) => void;
  onDelete: (reviewId: string) => void;
}

export default function ReviewItem({
  review,
  currentUserNickname,
  onUpdate,
  onDelete,
}: ReviewItemProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editContent, setEditContent] = useState(review.content);
  const [editImages, setEditImages] = useState<string[]>(review.images);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnReview = currentUserNickname === review.nickname;
  const formattedDate = new Date(review.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = () => {
    if (confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      onDelete(review.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditRating(review.rating);
    setEditContent(review.content);
    setEditImages(review.images);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditRating(review.rating);
    setEditContent(review.content);
    setEditImages(review.images);
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    onUpdate(review.id, {
      rating: editRating,
      content: editContent.trim(),
      images: editImages,
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];

    for (let i = 0; i < Math.min(files.length, 4 - editImages.length); i++) {
      const file = files[i];

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}은(는) 5MB를 초과합니다.`);
        continue;
      }

      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setEditImages([...editImages, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setEditImages(editImages.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="py-6 border-b border-gray-200 last:border-b-0">
        {/* 상단: 닉네임, 별점, 날짜 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-gray-900">{review.nickname}</span>
              {!isEditing ? (
                <StarRating rating={review.rating} size={16} />
              ) : (
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={editRating}
                    size={20}
                    editable
                    onChange={setEditRating}
                  />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {formattedDate}
              {review.updatedAt && " (수정됨)"}
            </p>
          </div>

          {/* 수정/삭제 버튼 */}
          {isOwnReview && !isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="수정"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="삭제"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}

          {/* 저장/취소 버튼 (편집 모드) */}
          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-secondary text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Check size={16} />
                저장
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                취소
              </button>
            </div>
          )}
        </div>

        {/* 내용 */}
        {!isEditing ? (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
            {review.content}
          </p>
        ) : (
          <div className="mb-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              rows={4}
              maxLength={1000}
              placeholder="리뷰 내용을 입력하세요..."
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {editContent.length} / 1000
            </p>
          </div>
        )}

        {/* 이미지들 */}
        {!isEditing ? (
          review.images && review.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {review.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
                >
                  <Image
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )
        ) : (
          <div>
            {/* 이미지 편집 모드 */}
            {editImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {editImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={`업로드 이미지 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 이미지 추가 버튼 */}
            {editImages.length < 4 && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id={`image-upload-${review.id}`}
                />
                <label
                  htmlFor={`image-upload-${review.id}`}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                >
                  <ImagePlus size={16} />
                  <span>이미지 추가 ({editImages.length}/4)</span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 이미지 확대 모달 */}
      {selectedImageIndex !== null && review.images && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={review.images[selectedImageIndex]}
              alt={`리뷰 이미지 ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* 이미지 네비게이션 */}
          {review.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-4 py-2 rounded-full">
              {review.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
