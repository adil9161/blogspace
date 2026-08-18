import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  showBorder = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const borderClass = showBorder ? 'ring-2 ring-white shadow-sm' : '';

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden select-none ${sizeClasses[size]} ${borderClass} ${className}`}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 text-white font-medium">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};
