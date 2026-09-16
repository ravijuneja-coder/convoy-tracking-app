'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface MediaUploaderProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
}

export default function MediaUploader({ onUpload, currentUrl, label = 'Upload Image' }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setError('');
    setIsUploading(true);
    setProgress(0);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 100);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      setPreview(data.url);
      onUpload(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setPreview(currentUrl || '');
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-saffron-500 bg-saffron-50' : 'border-gray-300 hover:border-saffron-400 hover:bg-gray-50'}`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />

        {preview ? (
          <div className="space-y-2">
            <img src={preview} alt="Preview" className="mx-auto max-h-40 object-contain rounded" />
            <p className="text-sm text-gray-500">Click or drag to replace</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl text-gray-400">📁</div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-500">Drag & drop or click to browse · Max 10MB</p>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="space-y-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-saffron-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">Uploading... {progress}%</p>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
