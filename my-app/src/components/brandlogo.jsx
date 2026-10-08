// Satu komponen logo dipakai di seluruh halaman; inverse untuk latar berlawanan.
export default function BrandLogo({ inverse = false }) {
  return (
    <span
      className={`brand-mark${inverse ? " brand-mark-inverse" : ""}`}
      role="img"
      aria-label="art-ana"
    >
      <span className="brand-tile brand-art" aria-hidden="true">
        art
      </span>
      <span className="brand-tile brand-ana" aria-hidden="true">
        ana
      </span>
    </span>
  );
}
