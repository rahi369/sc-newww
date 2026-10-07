import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-right-4 text-white/90 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all focus:outline-none"
          aria-label="Close image lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Display */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 max-h-[80vh] flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="w-auto h-auto max-h-[80vh] max-w-full object-contain"
          />
        </div>

        {/* Caption */}
        <div className="mt-3 text-center">
          <h3 className="text-white text-base font-medium tracking-wide">{title}</h3>
          <p className="text-xs text-white/60 mt-0.5 flex items-center justify-center gap-1">
            <ZoomIn className="w-3.5 h-3.5" /> High-Resolution Fabric Preview
          </p>
        </div>
      </div>
    </div>
  );
};
