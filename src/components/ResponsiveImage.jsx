const widths = [640, 1024];

function sourceSet(name, format) {
  return widths.map((width) => `/images/${name}-${width}.${format} ${width}w`).join(', ');
}

export default function ResponsiveImage({
  name,
  alt,
  className,
  sizes,
  loading = 'lazy',
  fetchPriority = 'auto',
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={sourceSet(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={sourceSet(name, 'webp')} sizes={sizes} />
      <img
        src={`/images/${name}-1024.webp`}
        alt={alt}
        className={className}
        width="1024"
        height="1024"
        sizes={sizes}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </picture>
  );
}
