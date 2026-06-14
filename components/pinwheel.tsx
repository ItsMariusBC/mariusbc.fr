// Four-petal brand mark, bone-colored via `currentColor`.
// Petals sit on the diagonals (diamond orientation) like the reference poster.
export function Pinwheel({ className }: { className?: string }) {
  const petal = 'M50 50 C 38 33, 38 13, 50 3 C 62 13, 62 33, 50 50 Z';
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} fill="currentColor">
      <g transform="rotate(45 50 50)">
        <path d={petal} />
        <path d={petal} transform="rotate(90 50 50)" />
        <path d={petal} transform="rotate(180 50 50)" />
        <path d={petal} transform="rotate(270 50 50)" />
      </g>
    </svg>
  );
}
