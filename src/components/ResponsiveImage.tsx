import type { ImgHTMLAttributes } from 'react';

const widths = [640, 1024];

type ImageFormat = 'avif' | 'webp';

interface ResponsiveImageProps {
  name: string;
  alt: string;
  className?: string;
  sizes: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>['loading'];
  fetchPriority?: ImgHTMLAttributes<HTMLImageElement>['fetchPriority'];
}

function sourceSet(name: string, format: ImageFormat) {
  return widths.map((width) => `/images/${name}-${width}.${format} ${width}w`).join(', ');
}

export default function ResponsiveImage({
  name,
  alt,
  className,
  sizes,
  loading = 'lazy',
  fetchPriority = 'auto',
}: ResponsiveImageProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={sourceSet(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={sourceSet(name, 'webp')} sizes={sizes} />
      <img
        src={`/images/${name}-1024.webp`}
        alt={alt}
        className={className}
        width={1024}
        height={1024}
        sizes={sizes}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </picture>
  );
}
