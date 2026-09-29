// 8-bit flame: red outer layer, yellow core, jagged top, rounded base.
// Each character is one 8x8 pixel: R = red, Y = yellow, . = empty.
const FLAME = [
  '....R.....',
  '...RR...R.',
  '...RR..RR.',
  '.R.RYR.RR.',
  '.RRRYRRRR.',
  'RRRYYYRYRR',
  'RRYYYYYYRR',
  'RRYYYYYYRR',
  'RRYYYYYYRR',
  '.RRYYYYRR.',
  '..RRRRRR..',
  '...RRRR...',
];

const COLORS = { R: '#FF3B3B', Y: '#FFD400' };
const CELL = 8;

const PixelFlame = () => (
  <svg
    viewBox={`0 0 ${FLAME[0].length * CELL} ${FLAME.length * CELL}`}
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-20 h-24"
    aria-hidden="true"
  >
    <g stroke="#000" strokeWidth="1">
      {FLAME.flatMap((row, y) =>
        [...row].map((pixel, x) =>
          COLORS[pixel] ? (
            <rect
              key={`${x}-${y}`}
              x={x * CELL}
              y={y * CELL}
              width={CELL}
              height={CELL}
              fill={COLORS[pixel]}
            />
          ) : null
        )
      )}
    </g>
  </svg>
);

export default PixelFlame;
