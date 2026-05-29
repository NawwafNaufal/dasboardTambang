import { useState, useRef, useEffect } from "react";
import { Theme } from "../../constants/ThemeProductivityIndex";

interface UnitSelectProps {
  value: string;
  onChange: (u: string) => void;
  units: string[];
  t: Theme;
}

export function UnitSelectProductivityIndex({ value, onChange, units, t }: UnitSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = units.filter((u) =>
    u.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 999,
          border: `1px solid ${t.btnBorder}`, background: t.btnBg,
          fontSize: 12, fontWeight: 600, color: t.btnColor,
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {value || "Pilih Unit"}
        <svg
          width="9" height="9" fill={t.label} viewBox="0 0 16 16"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}
        >
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: t.pickerBg, borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          border: `1px solid ${t.pickerBorder}`,
          zIndex: 9999, width: 130, overflow: "hidden",
        }}>
          {/* Search */}
          <div style={{ padding: "8px 8px 6px", borderBottom: `1px solid ${t.pickerBorder}` }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari unit..."
              autoFocus
              style={{
                width: "100%", padding: "4px 8px", borderRadius: 7,
                border: `1px solid ${t.btnBorder}`, fontSize: 12, outline: "none",
                background: t.btnBg, color: t.btnColor,
                boxSizing: "border-box", fontFamily: "inherit",
              }}
            />
          </div>

          {/* List */}
          <div style={{ maxHeight: 190, overflowY: "auto", padding: 5 }}>
            {filtered.length === 0 && (
              <div style={{ padding: "8px 10px", fontSize: 12, color: t.pickerText }}>
                Tidak ada unit
              </div>
            )}
            {filtered.map((u) => (
              <div
                key={u}
                onClick={() => { onChange(u); setOpen(false); setSearch(""); }}
                style={{
                  padding: "6px 10px", borderRadius: 7, cursor: "pointer", fontSize: 12,
                  fontWeight: u === value ? 700 : 400,
                  color: u === value ? t.title : t.pickerText,
                  background: u === value ? t.btnBg : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (u !== value) (e.currentTarget as HTMLDivElement).style.background = t.btnBg;
                }}
                onMouseLeave={(e) => {
                  if (u !== value) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                {u}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}