import { COLOR_MATRIX } from "@/lib/colorBlind";

/** Filtro tritanopia: Brettel 1997 (DaltonLens / libDaltonLens). */
function FilterTritanopiaBrettel1997() {
  return (
    <filter
      id="filter-tritanopia"
      colorInterpolationFilters="linearRGB"
    >
      <feColorMatrix
        in="SourceGraphic"
        result="ProjectionOnPlane1"
        type="matrix"
        values="
          1.01354, 0.14268, -0.15622, 0, 0
          -0.01181, 0.87561, 0.13619, 0, 0
          0.07707, 0.81208, 0.11085, 0, 0
          7.92482, -5.66475, -2.26007, 1, -0.2
        "
      />
      <feComponentTransfer in="ProjectionOnPlane1" result="ProjectionOnPlane1">
        <feFuncA type="discrete" tableValues="0 0 0 0 1" />
      </feComponentTransfer>
      <feColorMatrix
        in="SourceGraphic"
        result="ProjectionOnPlane2"
        type="matrix"
        values="
          0.93337, 0.19999, -0.13336, 0, 0
          0.05809, 0.82565, 0.11626, 0, 0
          -0.37923, 1.13825, 0.24098, 0, 0
          0, 0, 0, 1, 0
        "
      />
      <feBlend
        in="ProjectionOnPlane1"
        in2="ProjectionOnPlane2"
        mode="normal"
      />
    </filter>
  );
}

export function ColorBlindFilters() {
  return (
    <svg aria-hidden className="absolute h-0 w-0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {(Object.keys(COLOR_MATRIX) as (keyof typeof COLOR_MATRIX)[]).map(
          (tipo) => (
            <filter
              id={`filter-${tipo}`}
              key={tipo}
              colorInterpolationFilters="linearRGB"
            >
              <feColorMatrix type="matrix" values={COLOR_MATRIX[tipo]} />
            </filter>
          ),
        )}
        <FilterTritanopiaBrettel1997 />
      </defs>
    </svg>
  );
}
