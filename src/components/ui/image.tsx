import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number | string;
  height?: number | string;
  alt: string;
  priority?: boolean;
}

export function Image({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority, 
  ...props 
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  );
}
