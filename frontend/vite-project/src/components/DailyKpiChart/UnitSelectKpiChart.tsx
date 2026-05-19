import { useState, useEffect, useRef } from "react";

interface UnitSelectProps {
  value: string;
  onChange: (v: string) => void;
  units: string[];
}

export function UnitSelect({ value, onChange, units }: UnitSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
      >
        <span>{value || "Pilih Unit"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10" height="10"
          fill="#9ca3af"
          viewBox="0 0 16 16"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid #f3f4f6",
            zIndex: 999,
            width: "160px",
            overflow: "hidden",
          }}
        >
          {/* Search Input */}
          <div
            style={{
              padding: "10px 10px 6px",
              borderBottom: "1px solid #f3f4f6",
              position: "relative",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13" height="13"
              fill="#9ca3af"
              viewBox="0 0 16 16"
              style={{
                position: "absolute",
                left: "18px",
                top: "50%",
                transform: "translateY(-40%)",
              }}
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11" />
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari unit..."
              style={{
                width: "100%",
                padding: "5px 8px 5px 26px",
                borderRadius: "8px",
                border: "1.5px solid #e5e7eb",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Dropdown List */}
          <div style={{ maxHeight: "220px", overflowY: "auto", padding: "6px" }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "12px",
                  fontSize: "12px",
                  color: "#9ca3af",
                }}
              >
                Tidak ditemukan
              </div>
            ) : (
              filtered.map((u) => {
                const isActive = u === value;
                return (
                  <div
                    key={u}
                    onClick={() => { onChange(u); setOpen(false); setSearch(""); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "7px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#111827" : "#374151",
                      background: isActive ? "#f3f4f6" : "transparent",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <span>{u}</span>
                    {isActive && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12" height="12"
                        fill="#111827"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}