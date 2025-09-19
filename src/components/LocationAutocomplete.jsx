import { useEffect, useRef } from "react";

export default function LocationAutocomplete({
  onSelect,
  placeholder = "Enter a location",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onChange = () => {
      const p = el.value;
      if (!p || !p.location) return;

      const lat =
        typeof p.location.lat === "function"
          ? p.location.lat()
          : p.location.lat;
      const lng =
        typeof p.location.lng === "function"
          ? p.location.lng()
          : p.location.lng;

      onSelect?.({
        name: p.formattedAddress ?? "", // full address
        venue: p.displayName?.text ?? "", // venue/building name
        lat,
        lng,
        placeId: p.id,
        raw: p, // keep raw in case we need more later
      });
    };

    el.addEventListener("gmpx-placechange", onChange);
    return () => el.removeEventListener("gmpx-placechange", onChange);
  }, [onSelect]);

  return (
    <gmpx-place-picker
      ref={ref}
      placeholder={placeholder}
      included-region-codes="gb"
      style={{ display: "block", width: "100%" }}
    ></gmpx-place-picker>
  );
}
