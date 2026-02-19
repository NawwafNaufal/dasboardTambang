import { useState, useEffect, useRef } from "react";
import GaugeComponent from "react-gauge-component";

function getLabel(v: number): { text: string; color: string } {
  if (v <= 20) return { text: "Extreme Fear",  color: "#F87171" };
  if (v <= 40) return { text: "Fear",          color: "#FB923C" };
  if (v <= 60) return { text: "Neutral",       color: "#FACC15" };
  if (v <= 80) return { text: "Greed",         color: "#7bc800" };
  return             { text: "Extreme Greed", color: "#2da44e" };
}

function easeOutBack(t: number): number {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

interface Props {
  initialValue?: number;
}

export default function FearGreedGaugePaTwo({ initialValue = 84 }: Props) {
  const [value]                   = useState<number>(initialValue);
  const [displayed, setDisplayed] = useState<number>(0);

  // Deteksi dark mode dari TailAdmin (class "dark" di <html>)
  const [dark, setDark] = useState<boolean>(
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const animRef = useRef<number>(0);
  const fromRef = useRef<number>(0);
  const t0Ref   = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = displayed;
    t0Ref.current   = null;
    const target    = value;
    const tick = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts;
      const t = Math.min((ts - t0Ref.current) / 1200, 1);
      const v = fromRef.current + (target - fromRef.current) * easeOutBack(t);
      setDisplayed(Math.round(Math.min(Math.max(v, 0), 100)));
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [value]);

  const info   = getLabel(displayed);
  const dotClr = info.color;

  // Theme — light/dark
  const cardBg  = dark ? "#1c1c1f" : "#ffffff";
  const cardBdr = dark ? "#2e2e33" : "#e2e8f0";
  const valC    = dark ? "#ffffff" : "#111827";
  const subC    = dark ? "#888888" : "#6b7280";
  const titleC  = dark ? "#aaaaaa" : "#374151";
  const iconC   = dark ? "#777777" : "#9ca3af";
  const shadow  = dark ? "0 8px 32px rgba(0,0,0,.5)" : "0 4px 20px rgba(0,0,0,.08)";

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBdr}`,
      borderRadius: "16px",
      padding: "18px 22px 16px",
      width: "100%",
      boxShadow: shadow,
      transition: "background .3s, border-color .3s, box-shadow .3s",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
      </div>

      {/* CSS: border radius pada setiap ujung segmen arc */}
      <style>{`
        .gauge-component svg path {
          stroke-linecap: round !important;
        }
        .gauge-component svg circle {
          stroke: none !important;
          stroke-width: 0 !important;
        }
        .gauge-component svg g circle:last-child {
          fill: ${dotClr} !important;
        }
      `}</style>

      {/* Gauge */}
      <div style={{ position: "relative" }}>
        <GaugeComponent
          value={value}
          type="semicircle"
          minValue={0}
          maxValue={100}
          arc={{
            colorArray: ["#F87171", "#FB923C", "#FACC15", "#7bc800", "#2da44e"],
            padding: 0.04,
            width: 0.25,
            cornerRadius: 7,
            subArcs: [
              { limit: 20 },
              { limit: 40 },
              { limit: 60 },
              { limit: 80 },
              { limit: 100 },
            ],
          }}
          pointer={{
            type: "blob",
            color: dotClr,
            width: 15,
            animationDuration: 1200,
            animationDelay: 0,
            elastic: true,
          }}
          labels={{
            valueLabel: { hide: true },
            tickLabels: { hideMinMax: true, ticks: [] },
          }}
          style={{
            width: "100%",
            height: "auto",
            background: "transparent",
          }}
        />

        {/* Angka & label di tengah arc */}
        <div style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}>
          <div style={{ color: valC, fontSize: "36px", fontWeight: 700, lineHeight: 1, transition: "color .3s" }}>
            {displayed}
          </div>
          <div style={{ color: subC, fontSize: "12px", marginTop: "4px", transition: "color .3s" }}>
            Drilling
          </div>
        </div>
      </div>
    </div>
  );
}