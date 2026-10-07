import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  imageOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  imageOnly = false
}) => {
  const isLight = variant === 'light';

  // Sizing definitions
  const imageSizes = {
    sm: 'h-9 w-9 sm:h-10 sm:w-10',
    md: 'h-11 w-11 sm:h-12 sm:w-12',
    lg: 'h-16 w-16 sm:h-20 sm:w-20',
    xl: 'h-24 w-24 sm:h-28 sm:w-28'
  };

  if (imageOnly) {
    return (
      <img
        src="/logo.jpg"
        alt="SAMIA'S CLOSET"
        className={`rounded-2xl object-cover shadow-md border border-[#E8E2D9] ${imageSizes[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 
        EXACT OFFICIAL LOGO:
        Using the exact uploaded 3D embossed logo image file (coat hanger, teal t-shirt, colorful sprout leaves, Samia's CLOSET)
      */}
      <div className="relative shrink-0 rounded-2xl overflow-hidden shadow-md border-2 border-[#E8E2D9] bg-[#1A1A1A] transition-transform duration-300 group-hover:scale-105">
        <img
          src="/logo.jpg"
          alt="SAMIA'S CLOSET Official Logo"
          className={`${imageSizes[size]} object-cover object-center`}
        />
      </div>

      {/* Brand Identity Wordmark */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span
            className="font-bold tracking-tight text-[#D81B60]"
            style={{
              fontFamily: "'Playfair Display', cursive, serif",
              fontStyle: 'italic',
              fontSize: size === 'sm' ? '1.2rem' : size === 'lg' ? '1.8rem' : '1.45rem'
            }}
          >
            Samia’s
          </span>
          <span
            className="font-extrabold uppercase text-[#008A90] tracking-wider"
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: size === 'sm' ? '0.9rem' : size === 'lg' ? '1.3rem' : '1.1rem'
            }}
          >
            CLOSET
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`text-[9px] tracking-[0.22em] uppercase font-bold mt-1 ${
              isLight ? 'text-[#FDE047]' : 'text-[#78716C]'
            }`}
          >
            Women &amp; Boys/Men Collection
          </span>
        )}
      </div>
    </div>
  );
};
