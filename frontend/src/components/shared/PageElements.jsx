import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ currentPage, homeLabel = 'Home' }) {
  return (
    <div className="flex items-center gap-2 text-sm md:text-base mb-6">
      <span className="text-gray-900 font-medium">{homeLabel}</span>
      <ChevronRight className="w-4 h-4 text-saffron" />
      <span className="text-saffron font-semibold">{currentPage}</span>
    </div>
  );
}

export function AssetImage({ src, alt, className, fallback }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return fallback;
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

export function HeroAsset({ src, alt, fallback, className = '', imageClassName = 'h-full w-full object-cover' }) {
  return (
    <div className={`relative min-h-[260px] overflow-hidden bg-white sm:min-h-[320px] ${className}`}>
      <AssetImage src={src} alt={alt} className={imageClassName} fallback={fallback} />
    </div>
  );
}
