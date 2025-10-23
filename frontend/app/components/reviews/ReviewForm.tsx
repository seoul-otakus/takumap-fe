"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ImagePlus } from "lucide-react";
import type { Review } from "../../types";
import StarRating from "./StarRating";

interface ReviewFormProps {
  currentNickname: string;
  editingReview: Review | null;
  onSubmit: (reviewData: {
    nickname: string;
    rating: number;
    content: string;
    images: string[];
  }) => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  currentNickname,
  editingReview,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(editingReview?.rating || 5);
  const [content, setContent] = useState(editingReview?.content || "");
  const [images, setImages] = useState<string[]>(editingReview?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setContent(editingReview.content);
      setImages(editingReview.images);
    }
  }, [editingReview]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];

    for (let i = 0; i < Math.min(files.length, 4 - images.length); i++) {
      const file = files[i];

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}은(는) 5MB를 초과합니다.`);
        continue;
      }

      // base64로 변환
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

    setImages([...images, ...newImages]);

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    onSubmit({
      nickname: currentNickname,
      rating,
      content: content.trim(),
      images,
    });

    // 수정 모드가 아닐 때만 폼 초기화
    if (!editingReview) {
      setContent("");
      setImages([]);
      setRating(5);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {editingReview ? "리뷰 수정" : "리뷰 작성"}
        </h3>
        <span className="text-sm text-gray-600">
          작성자: <span className="font-semibold text-gray-900">{currentNickname}</span>
        </span>
      </div>

      {/* 별점 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          별점
        </label>
        <StarRating
          rating={rating}
          editable
          onChange={setRating}
          size={28}
        />
      </div>

      {/* 리뷰 내용 */}
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          리뷰 내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 장소에 대한 리뷰를 작성해주세요..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {content.length} / 1000
        </p>
      </div>

      {/* 이미지 업로드 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이미지 첨부 (최대 4장)
        </label>

        {/* 이미지 미리보기 */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {images.map((image, index) => (
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

        {/* 이미지 업로드 버튼 */}
        {images.length < 4 && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <ImagePlus size={18} />
              <span className="text-sm font-medium">
                이미지 추가 ({images.length}/4)
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              파일당 최대 5MB, JPG/PNG/GIF 지원
            </p>
          </div>
        )}
      </div>

      {/* 버튼들 */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {editingReview ? "수정 완료" : "리뷰 등록"}
        </button>
        {editingReview && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
