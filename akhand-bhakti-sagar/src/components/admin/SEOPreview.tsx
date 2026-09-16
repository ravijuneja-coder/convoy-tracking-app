'use client';

interface SEOPreviewProps {
  title: string;
  url: string;
  description: string;
}

export default function SEOPreview({ title, url, description }: SEOPreviewProps) {
  const titleLen = title.length;
  const descLen = description.length;

  const titleColor = titleLen > 60 ? 'text-red-500' : titleLen > 50 ? 'text-amber-500' : 'text-green-600';
  const descColor = descLen > 160 ? 'text-red-500' : descLen > 140 ? 'text-amber-500' : 'text-green-600';

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Google Search Preview</h3>
      <div className="border border-gray-200 rounded-lg p-4 bg-white font-sans">
        <div className="text-sm text-gray-500 truncate mb-0.5">
          {url || 'https://akhandbhaktisagar.com/...'}
        </div>
        <div className="text-lg text-blue-700 hover:underline cursor-pointer truncate">
          {title || 'Page Title'}
        </div>
        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
          {description || 'Page description will appear here. Write a compelling description to improve click-through rates.'}
        </div>
      </div>
      <div className="flex gap-6 text-xs">
        <span>
          Title: <span className={titleColor}>{titleLen}/60 chars</span>
        </span>
        <span>
          Description: <span className={descColor}>{descLen}/160 chars</span>
        </span>
      </div>
    </div>
  );
}
