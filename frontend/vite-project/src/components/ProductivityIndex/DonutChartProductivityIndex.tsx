import { DonutSlice } from "../../interface/TypesProductivityIndex";
import { Theme } from "../../constants/ThemeProductivityIndex";

interface DonutChartProps {
  slices: DonutSlice[];
  size: number;
  t: Theme;
  totalValue: string;
}

export function DonutChartProductivityIndex({ slices, size, t, totalValue }: DonutChartProps) {
  const padding = 30;
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.38;
  const r = size * 0.22;
  const GAP = 3.5;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const total = slices.reduce((s, x) => s + x.pct, 0);
  const minPct = Math.min(...slices.map((s) => s.pct));

  const paths: {
    d: string;
    color: string;
    pct: number;
    value: number;
    lx: number;
    ly: number;
  }[] = [];

  let start = -90;

  slices.forEach((sl) => {
    const isSmallest = sl.pct === minPct;
    const pop = isSmallest ? 6 : 0;
    const span = (sl.pct / total) * 360 - GAP;
    const end = start + span;
    const mid = start + span / 2;
    const midRad = toRad(mid);
    const ox = pop * Math.cos(midRad);
    const oy = pop * Math.sin(midRad);

    const x1o = cx + ox + R * Math.cos(toRad(start));
    const y1o = cy + oy + R * Math.sin(toRad(start));
    const x2o = cx + ox + R * Math.cos(toRad(end));
    const y2o = cy + oy + R * Math.sin(toRad(end));
    const x1i = cx + ox + r * Math.cos(toRad(end));
    const y1i = cy + oy + r * Math.sin(toRad(end));
    const x2i = cx + ox + r * Math.cos(toRad(start));
    const y2i = cy + oy + r * Math.sin(toRad(start));
    const lg = span > 180 ? 1 : 0;

    const d = `M${x1o} ${y1o} A${R} ${R} 0 ${lg} 1 ${x2o} ${y2o} L${x1i} ${y1i} A${r} ${r} 0 ${lg} 0 ${x2i} ${y2i}Z`;
    const lr = R - 10;
    const lx = cx + ox + lr * Math.cos(midRad);
    const ly = cy + oy + lr * Math.sin(midRad);

    paths.push({ d, color: sl.color, pct: sl.pct, value: sl.value, lx, ly });
    start += span + GAP;
  });

  return (
    <svg
      width={size + padding * 2}
      height={size + padding * 2}
      viewBox={`${-padding} ${-padding} ${size + padding * 2} ${size + padding * 2}`}
      style={{ display: "block", overflow: "hidden" }}
    >
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} />
      ))}

      {/* Center */}
      <text
        x={cx} y={cy - 6} textAnchor="middle"
        fontSize={22} fontWeight={800} fill={t.centerText}
        style={{ fontFamily: "'DM Sans',sans-serif" }}
      >
        {totalValue}
      </text>
      <text
        x={cx} y={cy + 15} textAnchor="middle"
        fontSize={11} fill={t.centerSub}
        style={{ fontFamily: "'DM Sans',sans-serif" }}
      >
        Total
      </text>

      {/* Bubble di dalam arc */}
      {paths.map((p, i) => (
        <g key={`b${i}`}>
          <circle cx={p.lx} cy={p.ly} r={18} fill={t.bubbleBg} stroke={t.bubbleBorder} strokeWidth={1.5} />
          <text
            x={p.lx} y={p.ly + 4} textAnchor="middle"
            fontSize={9} fontWeight={700} fill={t.bubbleText}
            style={{ fontFamily: "'DM Sans',sans-serif" }}
          >
            {p.value}
          </text>
        </g>
      ))}
    </svg>
  );
}