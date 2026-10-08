import { Minus, Plus } from "lucide-react";

export default function QuantityControl({
  value,
  max,
  onChange,
  label = "artwork",
}) {
  return (
    <div
      className="quantity-control"
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease quantity for ${label}`}
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <output aria-label={`Quantity for ${label}`}>{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity for ${label}`}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
