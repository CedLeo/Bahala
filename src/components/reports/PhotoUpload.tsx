'use client';

import { Camera, X } from 'lucide-react';
import { useRef } from 'react';

interface Props {
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onImageClear: () => void;
}

export default function PhotoUpload({ imagePreview, onImageSelect, onImageClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  return (
    <div>
      {imagePreview ? (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200">
          <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onImageClear}
            className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
          >
            <X className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Camera className="w-5 h-5" />
          <span>Upload flood photo</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
